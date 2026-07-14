// ═══════════════════════════════════════════════════════════════════════
// BLOQUE 28: sincronización mensual de TODA la red Tokko Broker (nacional)
// a Supabase (tabla tokko_properties). Pensado para correr desde GitHub
// Actions (no Vercel): con ~386.000 propiedades y limit=40 por página, son
// ~9.650 llamadas — muy por encima del timeout de una función serverless
// de Vercel, pero cómodo para un runner de GH Actions (hasta 6hs).
//
// Uso: node sync-tokko-network.js
// Variables de entorno requeridas: TOKKO_API_KEY, SUPABASE_URL,
// SUPABASE_SERVICE_ROLE_KEY (la service role, NO la anon key — hace
// falta para poder hacer upsert/update sin pasar por RLS).
//
// Requiere: npm install @supabase/supabase-js  (Node 18+ trae fetch nativo)
// ═══════════════════════════════════════════════════════════════════════

const { createClient } = require("@supabase/supabase-js");

const TOKKO_KEY = process.env.TOKKO_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const esModoTest = process.argv.includes("--test");

if (!TOKKO_KEY || (!esModoTest && (!SUPABASE_URL || !SUPABASE_SERVICE_KEY))) {
  console.error(
    esModoTest
      ? "Falta TOKKO_API_KEY (--test no necesita las variables de Supabase)."
      : "Faltan variables de entorno: TOKKO_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY"
  );
  process.exit(1);
}

const supabase = esModoTest ? null : createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Mismo limit que ya se usa en producción en tasar.js (BLOQUE 16/20) — es
// un valor confirmado que la API acepta sin rechazar. Si en el futuro se
// confirma que Tokko permite un limit mayor, subir esto reduce la cantidad
// de llamadas totales.
const PAGE_SIZE = 40;
// Pausa entre páginas para no golpear la API de Tokko a máxima velocidad
// (buena práctica con APIs de terceros sin límite de rate documentado, y
// reduce el riesgo de que un uso "agresivo" mensual llame la atención de
// Tokko sobre esta cuenta). 300ms * ~9650 páginas nacional ≈ 48min extra
// de espera total, aceptable para un job mensual.
const DELAY_MS_ENTRE_PAGINAS = 300;
// Cada cuántas propiedades acumuladas se hace upsert a Supabase (evita
// mandar 386.000 filas en un solo insert, y da durabilidad parcial si el
// proceso se corta a mitad de camino).
const BATCH_UPSERT = 200;

const tipoMapInverso = { 2: "departamento", 3: "casa", 13: "ph", 7: "local", 1: "lote" };

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// BLOQUE 28c: mismo helper que ya existe en producción (tasar-actualizado-
// BLOQUE7-8.js, BLOQUE 18c) — fetch() convierte automáticamente POST a GET
// al seguir un redirect 301/302/303/307/308 (spec WHATWG), y tokkobroker.com
// redirige esta URL de búsqueda. Confirmado en vivo acá (correr --test sin
// esto dio exactamente el mismo error ya documentado en producción:
// "Respuesta no-JSON (status 405): GET"). Con redirect:"manual"
// interceptamos el redirect y reintentamos el POST real (con su body)
// contra la URL final, en vez de dejar que se degrade a GET.
async function postJsonSiguiendoRedirects(url, body, headers, signal, maxSaltos = 3) {
  let currentUrl = url;
  let ultimaRes = null;
  for (let i = 0; i <= maxSaltos; i++) {
    const res = await fetch(currentUrl, { method: "POST", redirect: "manual", signal, headers, body: JSON.stringify(body) });
    ultimaRes = res;
    if ([301, 302, 303, 307, 308].includes(res.status)) {
      const location = res.headers.get("location");
      if (!location) break;
      currentUrl = new URL(location, currentUrl).toString();
      continue;
    }
    return res;
  }
  return ultimaRes;
}

// OJO: price/currency/roofed_surface/total_surface/geo_lat/geo_long/
// address/location/fake_address/publication_title/parking_lot_amount/tags
// son los campos que YA se usan con éxito en producción (ver
// searchTokkoComparables en tasar-actualizado-BLOQUE7-8.js) — están
// confirmados contra la API real. operation_type_id y property_type_id
// NO están confirmados de la misma forma (el código actual solo los usa
// para ARMAR el filtro de búsqueda, nunca los lee de la respuesta), así
// que p.type?.id y p.operation_type de acá abajo son una suposición
// razonable pero no verificada. IMPORTANTE: antes de correr el sync
// nacional completo, correr primero con --test (ver más abajo) y revisar
// en la consola un objeto crudo completo para confirmar/corregir estos dos
// campos — si vienen mal, tipo y operación quedarían null en la tabla (no
// rompe nada, pero esos filtros no funcionarían al consultar comparables).
function mapPropiedad(p) {
  const lat = parseFloat(p.geo_lat);
  const lon = parseFloat(p.geo_long);
  const tieneCoords = Number.isFinite(lat) && Number.isFinite(lon) && (lat !== 0 || lon !== 0);
  const tieneCochera = (p.parking_lot_amount > 0) ||
    (p.tags || []).some(t => (t.name || "").toLowerCase().includes("cochera"));
  return {
    tokko_id: p.id,
    operation_type_id: p.operation_type ?? (p.operations && p.operations[0]?.operation_type) ?? null,
    property_type_id: p.type?.id ?? p.property_type ?? null,
    division_id: p.location?.division_id ?? null,
    address: p.address || p.fake_address || null,
    location_name: p.location?.name || null,
    location_full: p.location?.full_location || null,
    price: p.price || null,
    currency: p.currency || null,
    roofed_surface: p.roofed_surface || null,
    total_surface: p.total_surface || null,
    geo_lat: tieneCoords ? lat : null,
    geo_long: tieneCoords ? lon : null,
    parking_lot_amount: p.parking_lot_amount || 0,
    has_cochera: !!tieneCochera,
    publication_title: p.publication_title || null,
    fake_address: p.fake_address || null,
    raw: p,
    active: true,
    synced_at: new Date().toISOString(),
  };
}

async function fetchPagina(offset) {
  const params = new URLSearchParams({
    format: "json", key: TOKKO_KEY, lang: "es_ar",
    limit: String(PAGE_SIZE), offset: String(offset),
  });
  const url = `https://www.tokkobroker.com/api/v1/property/search/?${params.toString()}`;
  const body = {
    data: {
      // network=0 trae TODA la red, todas las divisiones a la vez.
      current_localization_id: 0,
      current_localization_type: "network",
      // Todos los tipos de operación y propiedad en un solo pase, para no
      // tener que repetir la paginación completa una vez por combinación.
      operation_types: [1, 2],
      property_types: [1, 2, 3, 7, 13],
      price_from: 0,
      price_to: 999999999,
      currency: "USD",
      filters: [],
      with_tags: [], without_tags: [], with_custom_tags: [],
    },
  };

  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 15000);
  try {
    const res = await postJsonSiguiendoRedirects(
      url, body, { "Content-Type": "application/json" }, ctrl.signal
    );
    const rawText = await res.text();
    let data;
    try { data = JSON.parse(rawText); }
    catch { throw new Error(`Respuesta no-JSON (status ${res.status}): ${rawText.slice(0, 200)}`); }
    return { objetos: data.objects || [], total: data.meta?.total_count ?? null };
  } finally {
    clearTimeout(t);
  }
}

async function upsertLote(lote) {
  if (lote.length === 0) return;
  const { error } = await supabase.from("tokko_properties").upsert(lote, { onConflict: "tokko_id" });
  if (error) throw new Error(`Supabase upsert falló: ${error.message}`);
}

// Modo de validación: trae UNA sola página (40 propiedades), la imprime
// cruda (primer objeto completo) y el resultado ya mapeado, sin tocar
// Supabase. Correr esto primero (`node sync-tokko-network.js --test`)
// antes de confiar en el sync nacional completo — sirve para: (a)
// confirmar que TOKKO_API_KEY funciona y trae datos reales, (b) revisar a
// ojo los campos operation_type_id/property_type_id comentados arriba, (c)
// ver cuántas propiedades reporta meta.total_count en total.
async function testUnaPagina() {
  console.log("Modo --test: trayendo una sola página de la red completa, sin escribir en Supabase...\n");
  const pagina = await fetchPagina(0);
  console.log(`meta.total_count reportado por Tokko: ${pagina.total}`);
  console.log(`Propiedades en esta página: ${pagina.objetos.length}\n`);
  if (pagina.objetos.length > 0) {
    console.log("── Primer objeto CRUDO (revisar operation_type/type acá): ──");
    console.log(JSON.stringify(pagina.objetos[0], null, 2));
    console.log("\n── Mismo objeto ya MAPEADO a la fila de tokko_properties: ──");
    console.log(JSON.stringify(mapPropiedad(pagina.objetos[0]), null, 2));
  }
}

async function main() {
  if (process.argv.includes("--test")) {
    await testUnaPagina();
    return;
  }
  const inicio = new Date();
  const { data: runRow, error: runErr } = await supabase
    .from("tokko_sync_runs")
    .insert({ started_at: inicio.toISOString(), status: "running" })
    .select()
    .single();
  if (runErr) { console.error("No se pudo crear el registro de sync_run:", runErr.message); process.exit(1); }

  let offset = 0;
  let totalFetched = 0;
  let totalUpserted = 0;
  let buffer = [];
  let totalEsperado = null;
  let intentosFallidosConsecutivos = 0;

  try {
    while (true) {
      let pagina;
      try {
        pagina = await fetchPagina(offset);
        intentosFallidosConsecutivos = 0;
      } catch (e) {
        intentosFallidosConsecutivos++;
        console.warn(`Página offset=${offset} falló (intento ${intentosFallidosConsecutivos}): ${e.message}`);
        if (intentosFallidosConsecutivos >= 5) {
          throw new Error(`5 fallos consecutivos en offset=${offset}, abortando: ${e.message}`);
        }
        await sleep(2000 * intentosFallidosConsecutivos); // backoff simple
        continue; // reintenta la MISMA página, no avanza el offset
      }

      if (totalEsperado === null && pagina.total !== null) {
        totalEsperado = pagina.total;
        console.log(`Total reportado por Tokko: ${totalEsperado} propiedades en toda la red.`);
      }

      if (pagina.objetos.length === 0) {
        console.log(`Página offset=${offset} vacía — fin de la paginación.`);
        break;
      }

      totalFetched += pagina.objetos.length;
      buffer.push(...pagina.objetos.map(mapPropiedad));

      if (buffer.length >= BATCH_UPSERT) {
        await upsertLote(buffer);
        totalUpserted += buffer.length;
        buffer = [];
      }

      console.log(`offset=${offset} → +${pagina.objetos.length} (acumulado ${totalFetched}${totalEsperado ? "/" + totalEsperado : ""})`);

      offset += PAGE_SIZE;
      if (totalEsperado !== null && offset >= totalEsperado) break;

      await sleep(DELAY_MS_ENTRE_PAGINAS);
    }

    if (buffer.length > 0) {
      await upsertLote(buffer);
      totalUpserted += buffer.length;
    }

    // Cualquier propiedad no vista en ESTA corrida (synced_at viejo) se
    // marca inactiva — probablemente vendida o dada de baja. No se borra
    // (se conserva el historial), solo se excluye de comparables futuros.
    const { data: inactivadas, error: errInactivar } = await supabase
      .from("tokko_properties")
      .update({ active: false })
      .lt("synced_at", inicio.toISOString())
      .eq("active", true)
      .select("id");
    if (errInactivar) console.warn("No se pudo marcar inactivas las propiedades viejas:", errInactivar.message);

    await supabase.from("tokko_sync_runs").update({
      finished_at: new Date().toISOString(),
      status: "completed",
      total_fetched: totalFetched,
      total_upserted: totalUpserted,
      total_marked_inactive: inactivadas?.length || 0,
    }).eq("id", runRow.id);

    console.log(`Sync completo: ${totalFetched} traídas, ${totalUpserted} upserted, ${inactivadas?.length || 0} marcadas inactivas.`);
  } catch (e) {
    console.error("Sync falló:", e.message);
    await supabase.from("tokko_sync_runs").update({
      finished_at: new Date().toISOString(),
      status: "failed",
      total_fetched: totalFetched,
      total_upserted: totalUpserted,
      error_message: e.message,
    }).eq("id", runRow.id);
    process.exit(1);
  }
}

main();
