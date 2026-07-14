// BLOQUE 30: orquestador del scraper de portales (ZonaProp + ArgenProp).
// Corre desde GitHub Actions y llama repetidas veces al endpoint de Vercel
// (quien realmente pega contra los portales/sitemaps), pasándole el estado
// de la cola/lote entre llamadas hasta terminar. Mismo patrón que
// scripts/sync-tokko-network.js.
//
// Uso:
//   node sync-portal-scraper.js discover   → Fase 1: descubrir URLs (corre
//     hasta vaciar la cola de sitemaps; se puede correr una vez y después
//     solo de tanto en tanto para agarrar publicaciones nuevas)
//   node sync-portal-scraper.js enrich     → Fase 2: enriquecer ~5.000/día
//     (corre en un solo disparo diario, hace tantos chunks como haga falta
//     hasta llegar a la meta o quedarse sin filas 'discovered')
//
// Variables de entorno requeridas:
//   VERCEL_ENDPOINT   → https://tasalibre.vercel.app/api/tasar
//   SYNC_SECRET       → mismo secreto que ya está en Vercel

const ENDPOINT = process.env.VERCEL_ENDPOINT;
const SECRET = process.env.SYNC_SECRET;
const META_DIARIA_ENRIQUECIMIENTO = parseInt(process.env.META_DIARIA || "5000", 10);
const BATCH_SIZE_ENRIQUECIMIENTO = parseInt(process.env.BATCH_SIZE || "500", 10);
const MAX_ITERACIONES = 200; // salvavidas para no loopear infinito ante un bug

async function llamarEndpoint(body) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-sync-secret": SECRET },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); }
  catch { throw new Error(`Respuesta no-JSON (status ${res.status}): ${text.slice(0, 300)}`); }
  if (!res.ok) throw new Error(`Error ${res.status}: ${JSON.stringify(data)}`);
  return data;
}

async function correrDescubrimiento() {
  console.log("=== Fase 1: descubrimiento de URLs (sitemaps ZonaProp + ArgenProp) ===");
  let queue = undefined;
  let totalUpserted = 0;
  let iter = 0;

  while (iter < MAX_ITERACIONES) {
    iter++;
    const body = { _discoverPortalUrls: true, _meta: queue ? { queue } : {} };
    console.log(`-- llamada #${iter} (cola actual: ${queue ? queue.length : "semillas iniciales"}) --`);
    const data = await llamarEndpoint(body);
    totalUpserted += data.totalUpserted || 0;
    queue = data.queue;
    console.log(`   sitemaps procesados=${data.sitemapsProcesados}, urls insertadas este chunk=${data.totalUpserted}, cola restante=${queue?.length ?? 0}, done=${data.done}`);
    if (data.done) break;
  }
  console.log(`=== Descubrimiento terminado. Total URLs insertadas: ${totalUpserted} ===`);
}

async function correrEnriquecimiento() {
  console.log(`=== Fase 2: enriquecimiento (meta diaria: ${META_DIARIA_ENRIQUECIMIENTO}) ===`);
  let totalEnriched = 0, totalOutOfScope = 0, totalFailed = 0, totalProcesadas = 0;
  let iter = 0;

  while (iter < MAX_ITERACIONES && totalProcesadas < META_DIARIA_ENRIQUECIMIENTO) {
    iter++;
    const restante = META_DIARIA_ENRIQUECIMIENTO - totalProcesadas;
    const batchSize = Math.min(BATCH_SIZE_ENRIQUECIMIENTO, restante);
    console.log(`-- chunk #${iter} (batchSize=${batchSize}) --`);
    const data = await llamarEndpoint({ _enrichPortalChunk: true, _meta: { batchSize } });
    totalEnriched += data.totalEnriched || 0;
    totalOutOfScope += data.totalOutOfScope || 0;
    totalFailed += data.totalFailed || 0;
    totalProcesadas += data.procesadas || 0;
    console.log(`   procesadas=${data.procesadas}, enriquecidas=${data.totalEnriched}, fuera_de_alcance=${data.totalOutOfScope}, fallidas=${data.totalFailed}, done=${data.done}`);
    // Si el chunk no encontró más filas 'discovered' para procesar (done y
    // procesadas=0), no tiene sentido seguir insistiendo hoy.
    if (data.done && (data.procesadas || 0) === 0) {
      console.log("   No quedan más URLs 'discovered' por ahora — se corta acá.");
      break;
    }
  }
  console.log(`=== Enriquecimiento terminado. Total procesadas=${totalProcesadas}, enriquecidas=${totalEnriched}, fuera_de_alcance=${totalOutOfScope}, fallidas=${totalFailed} ===`);
}

async function main() {
  if (!ENDPOINT || !SECRET) {
    console.error("Faltan VERCEL_ENDPOINT o SYNC_SECRET en el entorno.");
    process.exit(1);
  }
  const modo = process.argv[2];
  if (modo === "discover") await correrDescubrimiento();
  else if (modo === "enrich") await correrEnriquecimiento();
  else {
    console.error("Uso: node sync-portal-scraper.js discover|enrich");
    process.exit(1);
  }
}

main().catch(e => {
  console.error("Error fatal:", e.message);
  process.exit(1);
});
