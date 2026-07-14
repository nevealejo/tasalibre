// ═══════════════════════════════════════════════════════════════════════
// BLOQUE 28e: orquestador del sync mensual de la red Tokko Broker.
//
// IMPORTANTE — por qué este script YA NO le habla a Tokko directamente:
// se confirmó en vivo (corriendo 4 variantes distintas de body, incluida
// una que replica EXACTO lo que ya funciona en producción) que Tokko
// devuelve 405 a CUALQUIER request que salga desde los runners de GitHub
// Actions. Desde Vercel (mismo origen que usa searchTokkoComparables con
// éxito hoy) funciona normal. Conclusión: es un bloqueo por IP/origen, no
// un problema de body ni de redirects.
//
// Por eso este script ya NO hace fetch a tokkobroker.com — en cambio llama
// repetidas veces a un endpoint nuevo en el propio backend de TasaLibre
// (api/tasar.js, rama _syncTokkoChunk) que es quien realmente le habla a
// Tokko (desde Vercel) y escribe en Supabase. Este script solo orquesta el
// loop y respeta el offset que le va devolviendo cada chunk.
//
// Uso:
//   node sync-tokko-network.js --test   → 1 sola llamada de prueba (1 chunk)
//   node sync-tokko-network.js          → loop completo hasta terminar
//
// Variables de entorno requeridas:
//   SYNC_SECRET       (mismo valor que SYNC_SECRET en Vercel)
//   TASAR_ENDPOINT_URL (opcional — default: https://tasalibre.vercel.app/api/tasar)
// ═══════════════════════════════════════════════════════════════════════

const SYNC_SECRET = process.env.SYNC_SECRET;
const ENDPOINT = process.env.TASAR_ENDPOINT_URL || "https://tasalibre.vercel.app/api/tasar";
const esModoTest = process.argv.includes("--test");

if (!SYNC_SECRET) {
  console.error("Falta SYNC_SECRET.");
  process.exit(1);
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// Mismo body que ya se usaba antes — confirmado que el 405 NO era por esto,
// así que se mantiene tal cual (multi-tipo, toda la red de un pase).
const DATA_BODY = {
  current_localization_id: 0,
  current_localization_type: "network",
  operation_types: [1, 2],
  property_types: [1, 2, 3, 7, 13],
  price_from: 0,
  price_to: 999999999,
  currency: "USD",
  filters: [],
  with_tags: [], without_tags: [], with_custom_tags: [],
};

// Pausa entre llamadas al propio endpoint (cada llamada ya procesa muchas
// páginas de Tokko del lado de Vercel durante hasta 240s — ver LIMITE_MS en
// tasar.js — así que esto es solo para no encadenar requests HTTP pegados).
const DELAY_MS_ENTRE_CHUNKS = 1000;

async function llamarChunk(offset) {
  const ctrl = new AbortController();
  // Timeout generoso: cada chunk puede tardar hasta ~240s del lado de
  // Vercel (su propio límite interno), más margen de red.
  const t = setTimeout(() => ctrl.abort(), 280000);
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-sync-secret": SYNC_SECRET },
      body: JSON.stringify({ _syncTokkoChunk: true, _meta: { offset, dataBody: DATA_BODY } }),
      signal: ctrl.signal,
    });
    const text = await res.text();
    let data;
    try { data = JSON.parse(text); }
    catch { throw new Error(`Respuesta no-JSON (status ${res.status}): ${text.slice(0, 300)}`); }
    if (!res.ok) throw new Error(`Chunk falló (status ${res.status}): ${JSON.stringify(data)}`);
    return data;
  } finally {
    clearTimeout(t);
  }
}

async function main() {
  if (esModoTest) {
    console.log(`Modo --test: 1 sola llamada a ${ENDPOINT} (offset=0), sin loop...\n`);
    const r = await llamarChunk(0);
    console.log("Resultado del chunk de prueba:", JSON.stringify(r, null, 2));
    return;
  }

  console.log(`Iniciando sync completo vía ${ENDPOINT}...`);
  let offset = 0;
  let totalFetched = 0;
  let intentosFallidosConsecutivos = 0;

  while (true) {
    let r;
    try {
      r = await llamarChunk(offset);
      intentosFallidosConsecutivos = 0;
    } catch (e) {
      intentosFallidosConsecutivos++;
      console.warn(`Chunk offset=${offset} falló (intento ${intentosFallidosConsecutivos}): ${e.message}`);
      if (intentosFallidosConsecutivos >= 5) {
        console.error(`5 fallos consecutivos en offset=${offset}, abortando.`);
        process.exit(1);
      }
      await sleep(3000 * intentosFallidosConsecutivos);
      continue;
    }

    totalFetched += r.totalFetched || 0;
    console.log(`offset ${offset} → ${r.offset} (+${r.totalFetched}, acumulado ${totalFetched}${r.totalEsperado ? "/" + r.totalEsperado : ""}) done=${r.done}`);
    offset = r.offset;

    if (r.done) {
      console.log(`Sync completo: ${totalFetched} propiedades procesadas.`);
      break;
    }
    await sleep(DELAY_MS_ENTRE_CHUNKS);
  }
}

main();
