import { gunzipSync } from "node:zlib";

export const config = { maxDuration: 300 };

const SUPABASE_URL = "https://qhojftormgvcdncaaftx.supabase.co";

// ── Rate limiting: máx 36 llamadas/día por IP (≈4 tasaciones) ─────────────
// BLOQUE 14: subido de 20 a 36 — cada tasación en mercado abierto ahora hace
// 1 enrichOnly + hasta 2 geocodeBatch (candidatos + comparables de la IA) +
// 5 búsquedas (antes 3, con más variedad de portales/inmobiliarias) + 1
// tasación final = hasta 9 llamadas por tasación (antes 5).
async function checkRateLimit(ip) {
  try {
    const key = process.env.SUPABASE_SECRET_KEY;
    if (!key || !ip) return true; // sin config, no bloquear
    const hoy = new Date().toISOString().slice(0, 10);
    const headers = { "Content-Type": "application/json", "apikey": key, "Authorization": `Bearer ${key}` };

    const r = await fetch(`${SUPABASE_URL}/rest/v1/rate_limits?ip=eq.${encodeURIComponent(ip)}&fecha=eq.${hoy}&select=count`, { headers });
    const rows = await r.json();

    if (!rows.length) {
      await fetch(`${SUPABASE_URL}/rest/v1/rate_limits`, {
        method: "POST",
        headers: { ...headers, "Prefer": "return=minimal" },
        body: JSON.stringify({ ip, fecha: hoy, count: 1 })
      });
      return true;
    }

    const count = rows[0].count || 0;
    // BLOQUE 19b: subido TEMPORALMENTE de 36 a 150 mientras estamos probando
    // en vivo el fix de comparables/Tokko (13/07) — entre las pruebas tuyas y
    // las mías ya habíamos agotado el límite de 36/día, lo que hacía fallar
    // la tasación con "Alcanzaste el límite" y no dejaba ver si el fix real
    // funcionaba. BAJAR ESTO DE NUEVO a 36 (o el valor que prefieras) una vez
    // terminada la etapa de pruebas, para que siga cumpliendo su función de
    // control de costos en producción real.
    if (count >= 150) return false;

    await fetch(`${SUPABASE_URL}/rest/v1/rate_limits?ip=eq.${encodeURIComponent(ip)}&fecha=eq.${hoy}`, {
      method: "PATCH",
      headers: { ...headers, "Prefer": "return=minimal" },
      body: JSON.stringify({ count: count + 1 })
    });
    return true;
  } catch { return true; } // ante error, no bloquear
}

async function geocodeAddress(address) {
  try {
    const ctrl = new AbortController();
    setTimeout(() => ctrl.abort(), 4000);
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1&countrycodes=ar`;
    // BLOQUE 11: Nominatim exige un User-Agent que identifique la app con un
    // contacto real (su política de uso bloquea con 403 a quien no lo tenga,
    // y las IPs compartidas de Vercel/AWS son especialmente propensas a esto
    // porque comparten cupo con miles de otras apps). Antes esto fallaba en
    // silencio (catch -> null) sin dejar rastro: si Nominatim bloqueaba la
    // IP de Vercel, el geocode SIEMPRE devolvía null y todo el filtro
    // geografico de zona quedaba desactivado sin que nadie se enterara.
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { "User-Agent": "TasaLibre/1.0 (contacto: nevealejo@gmail.com)", "Accept-Language": "es" },
    });
    if (!res.ok) {
      console.error(`Nominatim geocode fallo: HTTP ${res.status} para "${address}"`);
      return null;
    }
    const data = await res.json();
    if (!data.length) {
      console.warn(`Nominatim no encontro resultados para "${address}"`);
      return null;
    }
    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
  } catch (e) {
    console.error(`Geocode exception para "${address}": ${e.message}`);
    return null;
  }
}

// BLOQUE 12: geocoding con Google Maps — reemplaza a Nominatim como fuente
// principal. Google no tiene el problema de bloquear IPs de hosting
// compartido (Vercel/AWS) que sí tiene el servicio gratuito de OSM, y de
// paso devuelve el barrio/subzona real de la dirección (address_components),
// así el sistema puede detectar "Quilmes Centro" vs "Quilmes Oeste" solo,
// sin depender de que el usuario lo tipee bien en el formulario.
async function geocodeAddressGoogle(address) {
  try {
    const key = process.env.GOOGLE_MAPS_API_KEY;
    if (!key) return null;
    const ctrl = new AbortController();
    setTimeout(() => ctrl.abort(), 5000);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${key}&region=ar&components=country:AR`;
    const res = await fetch(url, { signal: ctrl.signal });
    const data = await res.json();
    if (data.status !== "OK" || !data.results?.length) {
      if (data.status !== "ZERO_RESULTS") console.error(`Google geocode fallo para "${address}": ${data.status} ${data.error_message || ""}`);
      return null;
    }
    const r = data.results[0];
    const comp = r.address_components || [];
    const barrioComp = comp.find(c => c.types.includes("sublocality") || c.types.includes("neighborhood"));
    return {
      lat: r.geometry.location.lat,
      lon: r.geometry.location.lng,
      barrioDetectado: barrioComp ? barrioComp.long_name : null,
      // ROOFTOP/RANGE_INTERPOLATED = ubicó la altura/numeración real.
      // GEOMETRIC_CENTER/APPROXIMATE = solo ubicó la calle o la zona en
      // general (puede estar a varias cuadras del número real). Para
      // comparar distancias a radio chico esto importa: un "lejos" que
      // pasó el filtro puede deberse a que su geocode fue aproximado, no
      // preciso, y la distancia calculada sale artificialmente baja.
      locationType: r.geometry.location_type || null,
      preciso: r.geometry.location_type === "ROOFTOP" || r.geometry.location_type === "RANGE_INTERPOLATED",
    };
  } catch (e) {
    console.error(`Google geocode exception para "${address}": ${e.message}`);
    return null;
  }
}

// Google primero (mas confiable); si no hay key configurada o falla, cae a
// Nominatim como respaldo — mejor tener algo de geo-contexto que nada.
// Nominatim no informa precisión por altura, así que se marca preciso=false
// para esas resoluciones (mejor tratarlas como aproximadas por defecto).
async function geocodeAddressConFallback(address) {
  const g = await geocodeAddressGoogle(address);
  if (g) return g;
  const n = await geocodeAddress(address);
  return n ? { lat: n.lat, lon: n.lon, barrioDetectado: null, locationType: "NOMINATIM", preciso: false } : null;
}

// Distancia real entre dos coordenadas (fórmula de Haversine, en km) — esto
// es lo que permite un radio de verdad en vez de matching de texto por
// nombre de calle, que es mucho mas fragil.
function distanciaKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// BLOQUE 29c: Tokko cambió el esquema de respuesta de su API — precio,
// moneda y tipo de operación ya NO vienen como campos planos (p.price,
// p.currency, p.operation_type), sino anidados en operations[]. Cada
// propiedad puede tener más de una operación (venta Y alquiler) y cada
// operación puede tener más de un precio (distintas monedas). Se busca la
// operación pedida (venta=1/alquiler=2) y dentro de esa, se prioriza el
// precio en USD; si no hay, se toma el primero disponible.
const opMapInverso = { 1: "venta", 2: "alquiler" };
function extraerOperacionYPrecio(p, operationTypeIdDeseado) {
  const operaciones = Array.isArray(p.operations) ? p.operations : [];
  let op = operaciones.find(o => o.operation_id === operationTypeIdDeseado) || operaciones[0] || null;
  if (!op) return { operationTypeId: null, precio: 0, moneda: "USD" };
  const precios = Array.isArray(op.prices) ? op.prices : [];
  const precioUsd = precios.find(pr => (pr.currency || "").toUpperCase() === "USD");
  const precioElegido = precioUsd || precios[0] || null;
  return {
    operationTypeId: op.operation_id ?? null,
    precio: precioElegido ? (parseFloat(precioElegido.price) || 0) : 0,
    moneda: precioElegido ? (precioElegido.currency || "USD") : "USD",
  };
}

// ── Detección de centralidad: estación de tren a <600m (proxy clave en GBA,
// donde el valor de la tierra se concentra alrededor de las estaciones) ─────
async function getNearbyStation(lat, lon) {
  try {
    const ctrl = new AbortController();
    setTimeout(() => ctrl.abort(), 5000);
    const query = `[out:json][timeout:4];node(around:600,${lat},${lon})["railway"="station"];out tags 3;`;
    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST", signal: ctrl.signal,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `data=${encodeURIComponent(query)}`
    });
    const data = await res.json();
    const st = (data.elements || [])[0];
    return st ? (st.tags?.name || "estación de tren") : null;
  } catch { return null; }
}

async function getNearbyStreets(lat, lon, radius) {
  try {
    const ctrl = new AbortController();
    setTimeout(() => ctrl.abort(), 6000);
    const query = `[out:json][timeout:5];way(around:${radius},${lat},${lon})["highway"]["name"];out tags;`;
    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST", signal: ctrl.signal,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `data=${encodeURIComponent(query)}`
    });
    const data = await res.json();
    const seen = new Set(); const streets = [];
    const p = { residential:1, secondary:2, tertiary:3, primary:4, unclassified:5 };
    for (const el of data.elements || []) {
      const name = el.tags?.name;
      if (name && !seen.has(name)) { seen.add(name); streets.push({ name, p: p[el.tags.highway]||9 }); }
    }
    return streets.sort((a,b)=>a.p-b.p).slice(0,6).map(s=>s.name);
  } catch { return []; }
}

// BLOQUE 25: clasificación de calles vecinas por GEOMETRÍA REAL (no solo
// "cuáles hay cerca", sino "cuáles son paralelas y cuáles perpendiculares a
// la calle de la propiedad"). Idea del usuario: en una grilla regular (sin
// diagonales), las calles paralelas a la propia suelen mantener la MISMA
// numeración de una calle a la otra, y las perpendiculares sirven como
// referencia de cruce/esquina. Esto permite armar búsquedas mucho más
// específicas ("Lavalle 450" en vez de "cerca de Moreno, Quilmes"). El caso
// que rompe el supuesto de numeración son ciudades con diagonales (ej. La
// Plata) — pero como cualquier candidato encontrado igual se verifica
// después por distancia real geocodificada (BLOQUE 12/23/24), una
// estimación de numeración errónea simplemente no encuentra nada útil en esa
// query puntual, no genera riesgo de mostrar un comparable mal ubicado.
function bearingEntrePuntos(lat1, lon1, lat2, lon2) {
  const toRad = d => d * Math.PI / 180;
  const y = Math.sin(toRad(lon2 - lon1)) * Math.cos(toRad(lat2));
  const x = Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) - Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(toRad(lon2 - lon1));
  return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}
// Diferencia angular tratando una calle como una línea sin sentido (0°==180°),
// para que no importe en qué dirección Overpass haya ordenado los nodos.
function diferenciaAngularMod180(a, b) {
  const d = Math.abs(a - b) % 180;
  return d > 90 ? 180 - d : d;
}
async function getStreetsClassified(lat, lon, radius, calleNombre) {
  try {
    const ctrl = new AbortController();
    setTimeout(() => ctrl.abort(), 6000);
    // "out geom" (no solo "out tags") — necesitamos las coordenadas de cada
    // tramo de calle para poder calcular su rumbo/orientación real.
    const query = `[out:json][timeout:5];way(around:${radius},${lat},${lon})["highway"]["name"];out geom;`;
    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST", signal: ctrl.signal,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `data=${encodeURIComponent(query)}`
    });
    const data = await res.json();
    const p = { residential: 1, secondary: 2, tertiary: 3, primary: 4, unclassified: 5 };
    const porNombre = new Map(); // nombre -> { prioridad, bearing }
    for (const el of data.elements || []) {
      const name = el.tags?.name;
      const geom = el.geometry;
      if (!name || !Array.isArray(geom) || geom.length < 2) continue;
      const a = geom[0], b = geom[geom.length - 1];
      if (a == null || b == null || a.lat == null || b.lat == null) continue;
      const bearing = bearingEntrePuntos(a.lat, a.lon, b.lat, b.lon);
      if (!porNombre.has(name)) porNombre.set(name, { prioridad: p[el.tags.highway] || 9, bearing });
    }
    const nombreCalleNorm = (calleNombre || "").toLowerCase().trim();
    let bearingPropio = null;
    if (nombreCalleNorm) {
      for (const [name, info] of porNombre) {
        if (name.toLowerCase().includes(nombreCalleNorm) || nombreCalleNorm.includes(name.toLowerCase())) {
          bearingPropio = info.bearing;
          break;
        }
      }
    }
    const ordenadas = [...porNombre.entries()].sort((a, b) => a[1].prioridad - b[1].prioridad);
    const flat = ordenadas.slice(0, 6).map(([name]) => name);
    const paralelas = [];
    const perpendiculares = [];
    if (bearingPropio != null) {
      for (const [name, info] of ordenadas) {
        if (name.toLowerCase().includes(nombreCalleNorm) || nombreCalleNorm.includes(name.toLowerCase())) continue;
        const diff = diferenciaAngularMod180(info.bearing, bearingPropio);
        if (diff <= 25 && paralelas.length < 3) paralelas.push(name);
        else if (diff >= 65 && perpendiculares.length < 3) perpendiculares.push(name);
      }
    }
    return { flat, paralelas, perpendiculares };
  } catch (e) {
    console.warn("getStreetsClassified falló:", e.message);
    return { flat: [], paralelas: [], perpendiculares: [] };
  }
}

// BLOQUE 26: fetch + parse de la página REAL de cada publicación encontrada
// por la búsqueda web, en vez de confiar en el resumen de texto que arma la
// IA. Confirmado en vivo (13/07-14/07): la MISMA publicación real (Belgrano
// 447, Quilmes) dio dos superficies distintas en dos corridas (403m² una
// vez, 172m² la otra) — la IA parafrasea el resultado de búsqueda, no lo
// transcribe con precisión, así que cualquier número que dependa 100% de ese
// resumen no es confiable. Acá se abre la URL real de la publicación y se
// extrae precio/m²/dirección directo del HTML — el mismo enfoque que ya
// usamos manualmente para verificar Belgrano 447/Cevallos 471/Falucho.
function stripHtmlATexto(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&aacute;/gi, "á").replace(/&eacute;/gi, "é").replace(/&iacute;/gi, "í")
    .replace(/&oacute;/gi, "ó").replace(/&uacute;/gi, "ú").replace(/&ntilde;/gi, "ñ")
    .replace(/&Aacute;/g, "Á").replace(/&Eacute;/g, "É").replace(/&Iacute;/g, "Í")
    .replace(/&Oacute;/g, "Ó").replace(/&Uacute;/g, "Ú").replace(/&Ntilde;/g, "Ñ")
    .replace(/\s+/g, " ")
    .trim();
}
// Extrae dirección (del <title>, que en los portales que vimos sigue el
// patrón "Casa en Venta en [Ciudad] - [Dirección]"), precio (USD/ARS) y
// m² (priorizando "total construido"/"superficie cubierta" sobre cualquier
// otro m² suelto, para no confundir con el terreno) de un HTML crudo.
function extraerAddrPrecioM2DeHtml(html) {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  let direccion = null;
  if (titleMatch) {
    const partes = titleMatch[1].split(" - ").map(s => s.trim()).filter(Boolean);
    if (partes.length > 1) direccion = partes[partes.length - 1];
  }
  const texto = stripHtmlATexto(html);
  const mUsd = texto.match(/USD\s*\$?\s*([\d][\d.,]{2,})/i)
    || texto.match(/US\$\s*([\d][\d.,]{2,})/i)
    || texto.match(/U\$S\s*([\d][\d.,]{2,})/i);
  const mArs = !mUsd && texto.match(/(?:ARS|AR\$)\s*([\d][\d.,]{2,})/i);
  if (!mUsd && !mArs) return null;
  const moneda = mUsd ? "usd" : "ars";
  const precioRaw = parseInt((mUsd ? mUsd[1] : mArs[1]).replace(/[^\d]/g, ""), 10);
  const mM2Etiquetado = texto.match(/(?:total construido|superficie cubierta|cubierta)\s*:?\s*(\d+(?:[.,]\d+)?)\s*m[2²]/i);
  const mM2Cualquiera = texto.match(/(\d+(?:[.,]\d+)?)\s*m[2²]/i);
  const mM2 = mM2Etiquetado || mM2Cualquiera;
  if (!mM2) return null;
  const m2 = parseFloat(mM2[1].replace(",", "."));
  if (!direccion || !Number.isFinite(precioRaw) || !(m2 > 10 && m2 < 2000)) return null;
  return { direccion, precioRaw, moneda, m2 };
}

// BLOQUE 18c: helper de POST que sigue redirects preservando método y body.
// El log de Vercel del 13/07 18:55 mostró "Tokko: respuesta no-JSON (status
// 405): GET" — es decir, nuestro POST llegó como GET al destino final. Esto
// pasa porque fetch() (spec WHATWG, la sigue tal cual Node/undici) convierte
// AUTOMÁTICAMENTE POST a GET al seguir un redirect 301/302/303, descartando
// el body. Si tokkobroker.com redirige la URL de búsqueda (ej. por http/https,
// con/sin barra final, etc.), nuestro POST se convertía en un GET vacío que
// el endpoint final rechaza con 405. Con redirect:"manual" interceptamos el
// redirect nosotros mismos y reintentamos el POST real (con su body) contra
// la URL final, en vez de dejar que el navegador/runtime lo degrade a GET.
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

// BLOQUE 16: root-cause fix del problema "0 comparables" — antes esta función
// pedía a TODA la red Tokko ("network", id 0) los primeros 40 objetos (orden
// no geográfico) y recién ahí filtraba por si el nombre del barrio aparecía
// como texto en location/address/título. Si ninguno de esos 40 al azar caía
// cerca de la dirección buscada (lo más probable en un país entero), el
// resultado era 0 — exactamente lo que pasó con Moreno 450, Quilmes, pese a
// haber muchísimas propiedades reales cerca.
// Fix: ordenar/filtrar los resultados por DISTANCIA REAL usando las
// coordenadas propias de cada propiedad (geo_lat/geo_long — confirmado que
// Tokko las devuelve en cada objeto) contra la propiedad tasada, en vez de
// depender solo del matching de texto por nombre de barrio.
// BLOQUE 17: el primer intento de escopar por location/quicksearch usaba
// current_localization_type:"location" (adivinado, sin confirmar) y causó un
// error real en producción ("Tokko error: Unexpected token 'G'..."). Se sacó
// y se volvió a red completa como medida de seguridad.
// BLOQUE 20: confirmado navegando el panel real de Tokko (app.tokkobroker.com,
// cuenta del cliente) que el valor correcto NO es "location" sino
// **"division"** — verificado en vivo: filtrar por "Quilmes" en el buscador
// de propiedades del panel genera exactamente
// current_localization_id:26578, current_localization_type:"division", y
// ahí sí aparecen las 1.211 propiedades reales de la Red Tokko Broker en
// Quilmes (contra 385.979 de toda la red). Se reincorpora el scoping por
// localidad con el valor correcto, con el mismo resguardo de fallback a red
// completa si por algún motivo no encuentra la localidad o da 0 resultados.
async function searchTokkoComparables(tipo, operacion, barrio, supTotal, conCochera, esCerrado, origenLat, origenLon) {
  try {
    const tokkoKey = process.env.TOKKO_API_KEY;
    if (!tokkoKey) return [];

    const tipoMap = { departamento:2, casa:3, ph:13, local:7, lote:1 };
    const opMap = { venta:1, alquiler:2 };

    // Paso 1: resolver el ID de división (localidad) real de Tokko para
    // escopar la búsqueda ahí en vez de en toda la red. GET simple (no
    // redirige, ya probado que funciona bien) — si falla, seguimos con red
    // completa sin cortar el flujo.
    let localizationId = 0;
    let localizationType = "network";
    try {
      const locCtrl = new AbortController();
      setTimeout(() => locCtrl.abort(), 5000);
      const locUrl = `https://www.tokkobroker.com/api/v1/location/quicksearch/?format=json&lang=es_ar&key=${tokkoKey}&q=${encodeURIComponent(barrio)}`;
      const locRes = await fetch(locUrl, { signal: locCtrl.signal });
      const locRawText = await locRes.text();
      const locData = JSON.parse(locRawText);
      const candidatosLoc = locData.objects || [];
      const match = candidatosLoc.find(l => l.type === "Localidad") || candidatosLoc[0];
      if (match) {
        localizationId = match.id;
        localizationType = "division"; // BLOQUE 20: confirmado en el panel real de Tokko
      }
    } catch (e) {
      console.warn("Tokko location quicksearch falló o devolvió algo no-JSON, sigue con red completa:", e.message);
    }

    const buildSearchData = (locId, locType) => {
      const sd = {
        current_localization_id: locId,
        current_localization_type: locType,
        operation_types: [opMap[operacion]||1],
        property_types: [tipoMap[tipo]||2],
        price_from: 0,
        price_to: 999999999,
        currency: "USD",
        filters: [],
        with_tags: [],
        without_tags: [],
        with_custom_tags: [],
      };
      if (supTotal && parseInt(supTotal) > 0) {
        const sup = parseInt(supTotal);
        sd.filters.push(["roofed_surface", ">=", Math.round(sup * 0.65).toString()]);
        sd.filters.push(["roofed_surface", "<=", Math.round(sup * 1.35).toString()]);
      }
      return sd;
    };

    // BLOQUE 29: Tokko dejó de aceptar POST en /property/search/ (devuelve
    // 405 con body "GET" sin importar el origen — confirmado en vivo el
    // 14/07 probando desde Vercel y GitHub Actions por igual, así que NO era
    // un bloqueo de IP como se pensaba en el BLOQUE 28e). Confirmado también
    // en vivo que ahora espera GET con el JSON de "data" como query param
    // (mismo patrón que ya usa su propio widget web documentado en
    // developers.tokkobroker.com/docs/search). Se cambia doSearch a GET.
    const doSearch = async (sd, etiqueta) => {
      const params = new URLSearchParams({
        format: "json",
        key: tokkoKey,
        lang: "es_ar",
        limit: "40",
        offset: "0",
        data: JSON.stringify(sd),
      });
      const url = `https://www.tokkobroker.com/api/v1/property/search/?${params.toString()}`;
      const ctrl = new AbortController();
      setTimeout(() => ctrl.abort(), 8000);
      const res = await fetch(url, { method: "GET", redirect: "follow", signal: ctrl.signal });
      const rawText = await res.text();
      let data;
      try {
        data = JSON.parse(rawText);
      } catch (parseErr) {
        console.error(`Tokko (${etiqueta}): respuesta no-JSON (status ${res.status}): ${rawText.slice(0, 200)}`);
        return [];
      }
      console.log(`Tokko búsqueda (${etiqueta}): ${(data.objects||[]).length} objetos, total_count=${data.meta?.total_count ?? "?"}`);
      return data.objects || [];
    };

    let objetos = await doSearch(buildSearchData(localizationId, localizationType), `${localizationType}=${localizationId}`);

    // Si el scoping por división trajo pocos resultados (0, o muy pocos —
    // no sabemos con certeza si "division" en esta API vieja incluye a otras
    // inmobiliarias de la red o solo las propias, así que no confiamos ciegos
    // en un solo resultado chico), TAMBIÉN buscamos en la red completa y
    // combinamos ambas listas (sin duplicar por id), para maximizar
    // cobertura real sin perder la precisión del escopado por zona.
    if (objetos.length < 5 && localizationType !== "network") {
      console.warn(`Tokko: solo ${objetos.length} resultados con localización escopada, sumando red completa`);
      const objetosRed = await doSearch(buildSearchData(0, "network"), "network, complemento");
      const idsYaVistos = new Set(objetos.map(p => p.id));
      objetos = objetos.concat(objetosRed.filter(p => !idsYaVistos.has(p.id)));
    }

    // Distancia REAL con las coordenadas propias de cada propiedad.
    const conDistancia = objetos.map(p => {
      const lat = parseFloat(p.geo_lat);
      const lon = parseFloat(p.geo_long);
      const tieneCoords = Number.isFinite(lat) && Number.isFinite(lon) && (lat !== 0 || lon !== 0);
      const dist = (tieneCoords && origenLat != null && origenLon != null)
        ? distanciaKm(origenLat, origenLon, lat, lon)
        : null;
      return { p, dist };
    });

    // Matching de texto — se mantiene como red de contención para propiedades
    // sin geo_lat/geo_long cargado, ya no como filtro principal.
    const barrioLower = barrio.toLowerCase().trim();
    const kw = barrioLower.split(" ").filter(w => w.length > 3);
    const matchTexto = (p) => {
      const loc = [
        p.location?.name || "",
        p.location?.full_location || "",
        p.address || "",
        p.publication_title || "",
        p.fake_address || ""
      ].join(" ").toLowerCase();
      return esCerrado ? loc.includes(barrioLower) : kw.some(w => loc.includes(w));
    };

    // Radio adaptativo por distancia real: 2km estricto, ampliar a 6km si hace
    // falta, y solo como último recurso completar con matching de texto para
    // las propiedades que no traen coordenadas cargadas.
    const RADIO_ESTRICTO_KM = 2, RADIO_AMPLIO_KM = 6;
    let candidatos = conDistancia.filter(x => x.dist != null && x.dist <= RADIO_ESTRICTO_KM);
    if (candidatos.length < 3) {
      candidatos = candidatos.concat(
        conDistancia.filter(x => x.dist != null && x.dist > RADIO_ESTRICTO_KM && x.dist <= RADIO_AMPLIO_KM)
      );
    }
    if (candidatos.length < 3) {
      const yaIncluidos = new Set(candidatos.map(x => x.p.id));
      const porTexto = conDistancia.filter(x => x.dist == null && !yaIncluidos.has(x.p.id) && matchTexto(x.p));
      candidatos = candidatos.concat(porTexto);
    }
    candidatos.sort((a, b) => (a.dist ?? 999) - (b.dist ?? 999));

    // Filtrar por cochera si aplica
    const withCochera = candidatos.filter(({ p }) =>
      !conCochera || p.parking_lot_amount > 0 ||
      (p.tags || []).some(t => t.name?.toLowerCase().includes("cochera"))
    );

    console.log(`Tokko comparables finales: ${withCochera.length} (con distancia real: ${withCochera.filter(x => x.dist != null).length})`);

    const operationTypeIdBuscado = opMap[operacion] || 1;
    return withCochera.slice(0, 8).map(({ p, dist }) => {
      const m2cubierto = parseFloat(p.roofed_surface) || parseFloat(p.total_surface) || 0;
      const m2totalRaw = parseFloat(p.total_surface) || m2cubierto;
      const { precio, moneda } = extraerOperacionYPrecio(p, operationTypeIdBuscado);
      const precioM2 = m2cubierto > 0 ? Math.round(precio / m2cubierto) : 0;
      return {
        direccion: p.address || "-",
        barrio: p.location?.name || barrio,
        m2: m2cubierto,
        m2total: m2totalRaw,
        precio_usd: precio,
        precio_m2: precioM2,
        moneda,
        distanciaKm: dist != null ? Math.round(dist * 100) / 100 : null,
        fuente: "Tokko Broker"
      };
    }).filter(p => p.precio_usd > 0 && p.m2 > 0);

  } catch(e) {
    console.error("Tokko error:", e.message);
    return [];
  }
}

// ═══════════════════════════════════════════════════════════════════════
// BLOQUE 30: scraping de portales públicos (ZonaProp + ArgenProp) para
// alimentar portal_properties — alcance Provincia de Buenos Aires + CABA.
// Reemplaza/complementa a la red Tokko como fuente de comparables, ya que
// la API de Tokko está limitada a ~32 propiedades sin importar el scope
// pedido, y su panel logueado (con las ~386.000 propiedades reales) no es
// scrapeable por restricciones de la plataforma y riesgo de cuenta.
//
// Mismo patrón que _syncTokkoChunk: Vercel es quien realmente pega contra
// los portales, GitHub Actions solo orquesta llamando a estos endpoints
// repetidas veces. Protegido por el mismo SYNC_SECRET.
// ═══════════════════════════════════════════════════════════════════════

function extraerJsonLd(html) {
  const blocks = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  const parsed = [];
  for (const b of blocks) {
    try {
      const obj = JSON.parse(b[1].trim());
      for (const x of Array.isArray(obj) ? obj : [obj]) parsed.push(x);
    } catch { /* bloques mal formados o irrelevantes, se ignoran */ }
  }
  return parsed;
}

function extraerAttr(html, attr) {
  const m = html.match(new RegExp(attr + '="([^"]*)"'));
  return m ? m[1] : null;
}

function parsePrecioTexto(str) {
  if (!str) return null;
  const limpio = String(str).replace(/[.,]/g, "");
  const n = parseInt(limpio, 10);
  return Number.isFinite(n) ? n : null;
}

// Alcance geográfico: Provincia de Buenos Aires + CABA únicamente. ArgenProp
// ya viene pre-filtrado por el sitemap de origen (ficha-capital-federal,
// ficha-gba-*, ficha-resto-baires), así que esto solo aplica de verdad a
// ZonaProp, cuyo sitemap de fichas mezcla todo el país.
function estaEnAlcanceBA(datos) {
  const texto = `${datos.provincia || ""} ${datos.localidad || ""} ${datos.address || ""}`.toLowerCase();
  return texto.includes("buenos aires") || texto.includes("capital federal") ||
         texto.includes("caba") || texto.includes("ciudad autónoma") || texto.includes("ciudad autonoma");
}

// ── ArgenProp: los data-* del HTML ya vienen limpios y completos (venta/
// alquiler, tipo, ubicación completa, precio, moneda, id de aviso) — se
// confirmó en vivo que están presentes en el HTML servido sin JS, ideal
// para fetch() directo desde Vercel. JSON-LD se usa solo como respaldo
// para dirección/m² cuando el layout no trae esos data-*.
function parseArgenPropHtml(html, url) {
  const tipoOperacion = (extraerAttr(html, "data-tipo-operacion") || "").toLowerCase();
  const tipoPropiedad = extraerAttr(html, "data-tipo-propiedad");
  const idAviso = extraerAttr(html, "data-id-aviso");
  const priceRaw = extraerAttr(html, "data-monto-normalizado") || extraerAttr(html, "data-price");

  const ldBlocks = extraerJsonLd(html);
  const propLd = ldBlocks.find(x => x && (x.floorSize || x.address));
  const address = propLd?.address || {};
  const m2 = propLd?.floorSize?.value ? parseFloat(propLd.floorSize.value) : null;
  const ambientes = propLd?.numberOfRooms ? parseInt(propLd.numberOfRooms, 10) : null;
  const dormitoriosAttr = extraerAttr(html, "data-dormitorios");

  // BLOQUE 30e: fallback — se confirmó en vivo que algunos templates de
  // ArgenProp (p.ej. desarrollos "en pozo") NO traen los data-tipo-operacion
  // / data-price aunque el fetch sea 200 OK con el HTML completo. En esos
  // casos sí está siempre presente el bloque visible "titlebar" con el
  // precio y un texto "Venta|Alquiler en Barrio, Localidad".
  let precioFallback = null, monedaFallback = null;
  const precioMatch = html.match(/class="titlebar__price">\s*([\s\S]{0,40}?)<\/p>/);
  if (precioMatch) {
    const bloque = precioMatch[1];
    const monedaMatch = bloque.match(/USD|\$/);
    const numMatch = bloque.match(/([\d][\d.,]{2,})/);
    if (monedaMatch) monedaFallback = monedaMatch[0] === "USD" ? "USD" : "ARS";
    if (numMatch) precioFallback = parsePrecioTexto(numMatch[1]);
  }

  let operacionFallback = null, barrioFallback = null, localidadFallback = null;
  const tituloMatch = html.match(/class="titlebar__title">([^<]*)<\/h2>/);
  if (tituloMatch) {
    const texto = tituloMatch[1].trim(); // ej: "Venta en Villa Urquiza, Capital Federal"
    const m = texto.match(/^(Venta|Alquiler)\s+en\s+([^,]+),?\s*(.*)$/i);
    if (m) {
      operacionFallback = m[1].toLowerCase();
      barrioFallback = m[2].trim() || null;
      localidadFallback = m[3].trim() || null;
    }
  }

  const idUrlMatch = (url || "").match(/--(\d+)(?:\.html)?$/);

  return {
    external_id: idAviso || (idUrlMatch ? idUrlMatch[1] : null),
    operation_type: tipoOperacion.includes("alquiler") ? "alquiler" : tipoOperacion.includes("venta") ? "venta" : operacionFallback,
    property_type: tipoPropiedad ? tipoPropiedad.toLowerCase() : null,
    address: address.streetAddress || null,
    provincia: extraerAttr(html, "data-provincia") || localidadFallback || null,
    partido: extraerAttr(html, "data-partido"),
    localidad: extraerAttr(html, "data-localidad") || address.addressLocality || null,
    barrio: extraerAttr(html, "data-barrio") || barrioFallback || address.addressRegion || null,
    sub_barrio: extraerAttr(html, "data-sub-barrio"),
    price: parsePrecioTexto(priceRaw) ?? precioFallback,
    currency: extraerAttr(html, "data-moneda") || monedaFallback,
    m2_cubierto: m2,
    m2_total: m2,
    ambientes,
    dormitorios: dormitoriosAttr ? parseInt(dormitoriosAttr, 10) : null,
  };
}

// ── ZonaProp: la ficha no tiene data-* limpios ni precio en JSON-LD. Se
// confirmó en vivo: JSON-LD da dirección/m²/ambientes, el precio sale por
// regex sobre el texto visible, y el tipo de operación por el prefijo de
// la URL (probado con múltiples muestras reales: "al..." = alquiler,
// "ve..." = venta — coincide con el propio prefijo de la palabra en
// español, señal confiable).
function parseZonaPropHtml(html, url) {
  const ldBlocks = extraerJsonLd(html);
  const propLd = ldBlocks.find(x => x && (x.floorSize || x.address));
  const address = propLd?.address || {};
  const m2 = propLd?.floorSize?.value ? parseFloat(propLd.floorSize.value) : null;
  const ambientes = propLd?.numberOfRooms ? parseInt(propLd.numberOfRooms, 10) : null;
  const dormitorios = propLd?.numberOfBedrooms ? parseInt(propLd.numberOfBedrooms, 10) : null;

  const textoPlano = html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<[^>]+>/g, " ");
  let price = null, currency = null;
  const usdMatch = textoPlano.match(/USD\s*\$?\s*([\d][\d.,]{2,})/i);
  if (usdMatch) {
    price = parsePrecioTexto(usdMatch[1]);
    currency = "USD";
  } else {
    const arsMatch = textoPlano.match(/\$\s*([\d][\d.,]{4,})/);
    if (arsMatch) { price = parsePrecioTexto(arsMatch[1]); currency = "ARS"; }
  }

  const slugMatch = url.match(/clasificado\/([a-z]{2})/i);
  const prefijo = slugMatch ? slugMatch[1].toLowerCase() : null;
  const operation_type = prefijo === "al" ? "alquiler" : prefijo === "ve" ? "venta" : null;

  return {
    external_id: null,
    operation_type,
    property_type: (propLd?.["@type"] || "").toLowerCase() || null,
    address: address.streetAddress || null,
    provincia: address.addressRegion || null,
    partido: null,
    localidad: address.addressLocality || null,
    barrio: null,
    sub_barrio: null,
    price,
    currency,
    m2_cubierto: m2,
    m2_total: m2,
    ambientes,
    dormitorios,
  };
}

// Baja un sitemap (plano o .gz), lo descomprime si hace falta, y devuelve
// si es un índice (apunta a más sitemaps) o un urlset (URLs de fichas).
async function fetchSitemap(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 15000);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "es-AR,es;q=0.9",
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} en ${url}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const xml = url.endsWith(".gz") ? gunzipSync(buf).toString("utf-8") : buf.toString("utf-8");
    const isIndex = /<sitemapindex/i.test(xml);
    const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1].trim());
    return { isIndex, locs };
  } finally {
    clearTimeout(t);
  }
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // BLOQUE 28e: chunk del sync mensual de la red Tokko (ver scripts/
  // sync-tokko-network.js). Corre ACÁ (en Vercel), no desde GitHub Actions,
  // porque se confirmó en vivo que Tokko devuelve 405 a las 4 variantes de
  // body probadas cuando el request sale desde los runners de GitHub
  // Actions (IPs públicas de datacenter, probablemente bloqueadas por
  // Tokko/su WAF), mientras que desde Vercel (mismo origen que ya usa
  // searchTokkoComparables con éxito en producción) funciona normal. GitHub
  // Actions sigue disparando el cron mensual, pero solo como orquestador:
  // llama a este endpoint repetidas veces (uno por chunk), y quien realmente
  // le habla a Tokko es siempre Vercel. Protegido por SYNC_SECRET para que
  // no cualquiera pueda disparar cargas de trabajo ni escribir en la tabla.
  if (req.body?._syncTokkoChunk) {
    const secretEsperado = process.env.SYNC_SECRET;
    const secretRecibido = req.headers["x-sync-secret"];
    if (!secretEsperado || secretRecibido !== secretEsperado) {
      return res.status(401).json({ error: "No autorizado" });
    }
    const { offset: offsetInicial, dataBody } = req.body._meta || {};
    const supaKey = process.env.SUPABASE_SECRET_KEY;
    if (!supaKey) return res.status(500).json({ error: "Falta SUPABASE_SECRET_KEY en el servidor" });
    const supaHeaders = { "Content-Type": "application/json", "apikey": supaKey, "Authorization": `Bearer ${supaKey}` };

    const mapPropiedadChunk = (p) => {
      const lat = parseFloat(p.geo_lat);
      const lon = parseFloat(p.geo_long);
      const tieneCoords = Number.isFinite(lat) && Number.isFinite(lon) && (lat !== 0 || lon !== 0);
      const tieneCochera = (p.parking_lot_amount > 0) || (p.tags || []).some(t => (t.name || "").toLowerCase().includes("cochera"));
      // BLOQUE 29c: mismo fix de esquema que en searchTokkoComparables —
      // precio/moneda/tipo de operación salen de operations[], no de campos
      // planos. Acá no filtramos por una operación deseada (el sync trae
      // venta Y alquiler juntos), así que se toma la primera operación
      // disponible en la propiedad.
      const { operationTypeId, precio, moneda } = extraerOperacionYPrecio(p, null);
      return {
        tokko_id: p.id,
        operation_type_id: operationTypeId,
        property_type_id: p.type?.id ?? null,
        division_id: p.location?.id ?? null,
        address: p.address || p.fake_address || null,
        location_name: p.location?.name || null,
        location_full: p.location?.full_location || null,
        price: precio || null,
        currency: moneda || null,
        roofed_surface: parseFloat(p.roofed_surface) || null,
        total_surface: parseFloat(p.total_surface) || null,
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
    };

    const PAGE_SIZE_CHUNK = 40;
    // Presupuesto de tiempo conservador: maxDuration del handler es 300s
    // (ver export const config arriba); se corta a los 240s para dejar
    // margen de sobra para la última página + el upsert en curso.
    const LIMITE_MS = 240000;
    const inicioChunk = Date.now();
    let offset = offsetInicial || 0;
    let totalFetched = 0;
    let totalEsperado = null;
    let done = false;

    try {
      while (Date.now() - inicioChunk < LIMITE_MS) {
        // BLOQUE 29: mismo fix que en searchTokkoComparables — Tokko espera
        // GET con "data" como query param, no POST.
        const params = new URLSearchParams({ format: "json", key: process.env.TOKKO_API_KEY, lang: "es_ar", limit: String(PAGE_SIZE_CHUNK), offset: String(offset), data: JSON.stringify(dataBody) });
        const url = `https://www.tokkobroker.com/api/v1/property/search/?${params.toString()}`;
        const res2 = await fetch(url, { method: "GET", redirect: "follow" });
        const rawText = await res2.text();
        let data;
        try { data = JSON.parse(rawText); }
        catch { throw new Error(`Respuesta no-JSON de Tokko (status ${res2.status}): ${rawText.slice(0, 200)}`); }
        const objetos = data.objects || [];
        if (totalEsperado === null && data.meta?.total_count != null) totalEsperado = data.meta.total_count;
        if (objetos.length === 0) { done = true; break; }

        const filas = objetos.map(mapPropiedadChunk);
        const upsertRes = await fetch(`${SUPABASE_URL}/rest/v1/tokko_properties?on_conflict=tokko_id`, {
          method: "POST",
          headers: { ...supaHeaders, "Prefer": "resolution=merge-duplicates,return=minimal" },
          body: JSON.stringify(filas),
        });
        if (!upsertRes.ok) {
          const errText = await upsertRes.text();
          throw new Error(`Supabase upsert falló (status ${upsertRes.status}): ${errText.slice(0, 300)}`);
        }

        totalFetched += objetos.length;
        offset += PAGE_SIZE_CHUNK;
        if (totalEsperado !== null && offset >= totalEsperado) { done = true; break; }
      }
      console.log(`[_syncTokkoChunk] offset final=${offset}, fetched este chunk=${totalFetched}, done=${done}, total=${totalEsperado}`);
      return res.status(200).json({ done, offset, totalFetched, totalEsperado });
    } catch (e) {
      console.error("[_syncTokkoChunk] error:", e.message);
      return res.status(500).json({ error: e.message, offset, totalFetched });
    }
  }

  // BLOQUE 30a: Fase 1 — descubrimiento de URLs de fichas vía sitemaps
  // públicos de ZonaProp/ArgenProp. Recorre una cola de sitemaps en BFS:
  // si un sitemap es un índice, encola sus hijos; si es un urlset, extrae
  // las URLs de fichas y las upsertea en portal_properties con
  // status='discovered' (resolution=ignore-duplicates para no pisar filas
  // que ya fueron enriquecidas en una corrida previa). Devuelve la cola
  // restante para que el orquestador siga llamando hasta vaciarla.
  if (req.body?._discoverPortalUrls) {
    const secretEsperado = process.env.SYNC_SECRET;
    const secretRecibido = req.headers["x-sync-secret"];
    if (!secretEsperado || secretRecibido !== secretEsperado) {
      return res.status(401).json({ error: "No autorizado" });
    }
    const supaKey = process.env.SUPABASE_SECRET_KEY;
    if (!supaKey) return res.status(500).json({ error: "Falta SUPABASE_SECRET_KEY en el servidor" });
    const supaHeaders = { "Content-Type": "application/json", "apikey": supaKey, "Authorization": `Bearer ${supaKey}` };

    const { queue: queueInicial } = req.body._meta || {};
    // Semillas: sitemaps "ficha" (no "listing") de ArgenProp ya recortados
    // a Provincia de Buenos Aires + CABA por región, y el único sitemap de
    // fichas de ZonaProp (nacional, se filtra por región en la Fase 2).
    let queue = Array.isArray(queueInicial) && queueInicial.length ? queueInicial.slice() : [
      { source: "argenprop", url: "https://www.argenprop.com/sitemaps/sitemap-ficha-capital-federal.xml.gz" },
      { source: "argenprop", url: "https://www.argenprop.com/sitemaps/sitemap-ficha-gba-norte.xml.gz" },
      { source: "argenprop", url: "https://www.argenprop.com/sitemaps/sitemap-ficha-gba-sur.xml.gz" },
      { source: "argenprop", url: "https://www.argenprop.com/sitemaps/sitemap-ficha-gba-oeste.xml.gz" },
      { source: "argenprop", url: "https://www.argenprop.com/sitemaps/sitemap-ficha-resto-baires.xml.gz" },
      { source: "zonaprop", url: "https://www.zonaprop.com.ar/sitemap_prop_https_1.xml.gz" },
    ];

    const LIMITE_MS = 240000;
    const inicio = Date.now();
    let totalUpserted = 0;
    let sitemapsProcesados = 0;

    try {
      while (queue.length && Date.now() - inicio < LIMITE_MS) {
        const item = queue.shift();
        let parsed;
        try {
          parsed = await fetchSitemap(item.url);
        } catch (e) {
          console.error(`[_discoverPortalUrls] error en ${item.url}: ${e.message}`);
          continue;
        }
        sitemapsProcesados++;

        if (parsed.isIndex) {
          for (const loc of parsed.locs) queue.push({ source: item.source, url: loc });
          continue;
        }

        const urlsFicha = parsed.locs.filter(u => item.source === "zonaprop" ? u.includes("/propiedades/clasificado/") : true);
        const filas = urlsFicha.map(u => ({ source: item.source, url: u, status: "discovered" }));

        for (let i = 0; i < filas.length; i += 1000) {
          const lote = filas.slice(i, i + 1000);
          const upsertRes = await fetch(`${SUPABASE_URL}/rest/v1/portal_properties?on_conflict=url`, {
            method: "POST",
            headers: { ...supaHeaders, "Prefer": "resolution=ignore-duplicates,return=minimal" },
            body: JSON.stringify(lote),
          });
          if (!upsertRes.ok) {
            const errText = await upsertRes.text();
            throw new Error(`Supabase upsert falló (status ${upsertRes.status}): ${errText.slice(0, 300)}`);
          }
          totalUpserted += lote.length;
        }
      }
      const done = queue.length === 0;
      console.log(`[_discoverPortalUrls] sitemaps procesados=${sitemapsProcesados}, urls insertadas=${totalUpserted}, cola restante=${queue.length}, done=${done}`);
      return res.status(200).json({ done, queue, totalUpserted, sitemapsProcesados });
    } catch (e) {
      console.error("[_discoverPortalUrls] error:", e.message);
      return res.status(500).json({ error: e.message, queue, totalUpserted });
    }
  }

  // BLOQUE 30b: Fase 2 — enriquecimiento paced (~5.000/día, ritmo elegido
  // por el usuario). Toma un lote de filas 'discovered' (las más viejas
  // primero), visita cada ficha con fetch() directo (confirmado en vivo:
  // ambos portales sirven el HTML ya renderizado con todos los datos, sin
  // necesitar ejecutar JS), extrae los campos, y las pasa a 'enriched' o
  // 'out_of_scope' (ZonaProp fuera de Buenos Aires/CABA) o 'failed'. Pausa
  // corta entre fichas para no saturar los portales.
  if (req.body?._enrichPortalChunk) {
    const secretEsperado = process.env.SYNC_SECRET;
    const secretRecibido = req.headers["x-sync-secret"];
    if (!secretEsperado || secretRecibido !== secretEsperado) {
      return res.status(401).json({ error: "No autorizado" });
    }
    const supaKey = process.env.SUPABASE_SECRET_KEY;
    if (!supaKey) return res.status(500).json({ error: "Falta SUPABASE_SECRET_KEY en el servidor" });
    const supaHeaders = { "Content-Type": "application/json", "apikey": supaKey, "Authorization": `Bearer ${supaKey}` };

    const { batchSize } = req.body._meta || {};
    const LOTE = Math.min(batchSize || 500, 1000);
    const LIMITE_MS = 240000;
    // BLOQUE 30g: se confirmó en vivo que el bloqueo suave de ArgenProp NO es
    // aleatorio por request — es un bloqueo sostenido dentro de la misma
    // ejecución (los mismos ~30% de filas fallan incluso reintentando con
    // backoff). Parece un límite de ráfaga por IP/sesión de esa invocación
    // de Vercel. Se sube la pausa entre filas de 250ms a 3s para bajar el
    // ritmo y evitar disparar ese bloqueo en primer lugar.
    const PAUSA_MS = 3000;
    const inicio = Date.now();

    let totalEnriched = 0, totalOutOfScope = 0, totalFailed = 0;
    let procesadas = 0;
    const sampleErrors = []; // BLOQUE 30c: diagnóstico — primeros errores reales, para depurar sin acceso directo a Supabase

    try {
      const listaRes = await fetch(
        `${SUPABASE_URL}/rest/v1/portal_properties?status=eq.discovered&select=id,url,source&order=discovered_at.asc&limit=${LOTE}`,
        { headers: supaHeaders }
      );
      if (!listaRes.ok) throw new Error(`Supabase select falló (status ${listaRes.status})`);
      const filas = await listaRes.json();

      for (const fila of filas) {
        if (Date.now() - inicio > LIMITE_MS) break;
        procesadas++;
        try {
          // BLOQUE 30f: se confirmó en vivo que una fracción de los fetches
          // a ArgenProp devuelven, con HTTP 200, una página de bloqueo suave
          // fija de ~2.6KB (sin JSON-LD, sin data-*, título vacío) en vez de
          // la ficha real (~300KB) — parece un bloqueo intermitente, no
          // permanente por URL. Reintentamos un par de veces con backoff
          // antes de darnos por vencidos con esa fila.
          let html = "";
          for (let intento = 1; intento <= 3; intento++) {
            const ctrl = new AbortController();
            const t = setTimeout(() => ctrl.abort(), 12000);
            let pageRes;
            try {
              pageRes = await fetch(fila.url, {
                signal: ctrl.signal,
                headers: {
                  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
                  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                  "Accept-Language": "es-AR,es;q=0.9",
                },
              });
            } finally { clearTimeout(t); }
            if (!pageRes.ok) throw new Error(`HTTP ${pageRes.status}`);
            html = await pageRes.text();
            const pareceBloqueo = html.length < 5000 && !html.includes("application/ld+json");
            if (!pareceBloqueo || intento === 3) break;
            await new Promise(r => setTimeout(r, 900 * intento));
          }

          const datos = fila.source === "argenprop" ? parseArgenPropHtml(html, fila.url) : parseZonaPropHtml(html, fila.url);
          const enAlcance = fila.source === "argenprop" ? true : estaEnAlcanceBA(datos);

          // BLOQUE 30d: diagnóstico — el fetch puede devolver 200 OK con una
          // página "vacía" (bloqueo suave / interstitial / estructura
          // cambiada) que hace que el parseo no extraiga nada útil. Antes eso
          // se guardaba silenciosamente como 'enriched' con todos los campos
          // en null. Ahora, si no se pudo extraer ni precio ni tipo de
          // operación, lo tratamos como fallo y guardamos pistas de qué
          // devolvió realmente el fetch (para ver en sampleErrors).
          const extraccionVacia = !datos.price && !datos.operation_type;
          if (extraccionVacia) {
            throw new Error(
              `parseo_vacio htmlLen=${html.length} tieneDataAttrs=${html.includes("data-tipo-operacion")} tieneJsonLd=${html.includes("application/ld+json")} title="${(html.match(/<title>([\s\S]{0,80})/) || [])[1] || ""}"`
            );
          }

          const update = enAlcance
            ? { ...datos, status: "enriched", enriched_at: new Date().toISOString(), last_error: null }
            : { status: "out_of_scope", enriched_at: new Date().toISOString() };

          const patchRes = await fetch(`${SUPABASE_URL}/rest/v1/portal_properties?id=eq.${fila.id}`, {
            method: "PATCH",
            headers: { ...supaHeaders, "Prefer": "return=minimal" },
            body: JSON.stringify(update),
          });
          if (!patchRes.ok) throw new Error(`Supabase update falló (status ${patchRes.status})`);

          if (enAlcance) totalEnriched++; else totalOutOfScope++;
        } catch (e) {
          totalFailed++;
          if (sampleErrors.length < 5) sampleErrors.push({ url: fila.url, error: String(e.message).slice(0, 200) });
          await fetch(`${SUPABASE_URL}/rest/v1/portal_properties?id=eq.${fila.id}`, {
            method: "PATCH",
            headers: { ...supaHeaders, "Prefer": "return=minimal" },
            body: JSON.stringify({ status: "failed", last_error: String(e.message).slice(0, 300), retry_count: 1 }),
          }).catch(() => {});
        }
        await new Promise(r => setTimeout(r, PAUSA_MS));
      }

      const done = filas.length < LOTE;
      console.log(`[_enrichPortalChunk] procesadas=${procesadas}, enriquecidas=${totalEnriched}, fuera_de_alcance=${totalOutOfScope}, fallidas=${totalFailed}, done=${done}`);
      if (sampleErrors.length) console.log(`[_enrichPortalChunk] muestra de errores: ${JSON.stringify(sampleErrors)}`);
      return res.status(200).json({ done, procesadas, totalEnriched, totalOutOfScope, totalFailed, sampleErrors });
    } catch (e) {
      console.error("[_enrichPortalChunk] error:", e.message);
      return res.status(500).json({ error: e.message, procesadas, totalEnriched, totalOutOfScope, totalFailed });
    }
  }

  // Rate limiting por IP — máx 16 llamadas/día (≈4 tasaciones)
  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || req.socket?.remoteAddress || "";
  const allowed = await checkRateLimit(ip);
  if (!allowed) {
    return res.status(429).json({ error: { message: "Alcanzaste el límite de tasaciones diarias. Volvé mañana o contactanos por WhatsApp." } });
  }

  // ── BLOQUE 8: rama de solo-enriquecimiento — NO llama a Claude. Antes,
  // geocode+Overpass+estación+Tokko se repetían 3 veces (una por cada
  // búsqueda en paralelo que dispara el cliente) con el mismo resultado.
  // Ahora corren UNA sola vez acá, y el cliente reusa esto para las 3.
  if (req.body?._enrichOnly) {
    const { address, tipo, operacion, barrio, supTotal, conCochera, esCerrado, loteCentrico, calle, numero } = req.body._meta || {};

    // BLOQUE 16: antes esto corría en paralelo (Promise.all), así que Tokko
    // nunca tenía las coordenadas de la propiedad tasada disponibles para
    // calcular distancia real — geocodificamos primero y recién con esas
    // coordenadas buscamos en Tokko, para poder filtrar/ordenar por cercanía real.
    const coords = address ? await geocodeAddressConFallback(address) : null;
    const tokkoComps = await searchTokkoComparables(
      tipo, operacion, barrio, supTotal, conCochera, !!esCerrado,
      coords?.lat ?? null, coords?.lon ?? null
    );

    let streetContext = "";
    let streetsNearby = [];
    let streetsParalelas = [];
    let streetsPerpendiculares = [];
    if (coords) {
      // BLOQUE 25: no barrio cerrado (ahí las calles geolocalizadas no se
      // usan, el filtro es por nombre de barrio) — solo clasificamos
      // paralelas/perpendiculares cuando esCerrado es falso, ya que ahí es
      // donde streetsNearby/paralelas/perpendiculares realmente se usan para
      // armar queries.
      let clasif = await getStreetsClassified(coords.lat, coords.lon, 500, calle);
      if (clasif.flat.length < 3) clasif = await getStreetsClassified(coords.lat, coords.lon, 1000, calle);
      streetsNearby = clasif.flat;
      streetsParalelas = clasif.paralelas;
      streetsPerpendiculares = clasif.perpendiculares;
      if (streetsNearby.length) streetContext = `CALLES CERCANAS (500m): ${streetsNearby.join(", ")}. `;

      // Para lotes: chequear estación de tren cercana (detección automática de zona céntrica).
      // Refuerza la marca del usuario, o la aporta si el usuario no marcó "céntrico".
      if (tipo === "lote" && coords) {
        const station = await getNearbyStation(coords.lat, coords.lon);
        if (station) {
          streetContext += `ZONA CENTRICA DETECTADA: el lote esta a menos de 600m de la estacion ${station} — en GBA el valor de la tierra cerca de estaciones es sensiblemente mayor y suele tener potencial de desarrollo (edificabilidad). Considerar esto en la valuacion. `;
        } else if (loteCentrico) {
          streetContext += `El usuario indico que el lote esta en zona centrica o sobre avenida. `;
        }
      }
    }

    // BLOQUE 7: tokkoComps viaja ESTRUCTURADO directo al cliente (JSON), no
    // solo como texto para que la IA lo relea y lo reformatee. tokkoContext
    // sigue existiendo para dar contexto a la búsqueda, pero el cliente ya
    // no depende de que la IA le devuelva bien estos números — los tiene acá.
    let tokkoContext = "";
    if (tokkoComps.length > 0) {
      tokkoContext = (esCerrado
        ? `COMPARABLES REALES TOKKO VERIFICADOS DENTRO DEL BARRIO "${barrio}" (priorizar sobre cualquier otra fuente): `
        : `COMPARABLES REALES TOKKO BROKER CERCANOS (ordenados por distancia real, priorizar sobre cualquier otra fuente): `) +
        tokkoComps.map(c =>
          `${c.direccion} - ${c.barrio}${c.distanciaKm != null ? ` (a ${c.distanciaKm}km)` : ""} - ${c.m2}m² cubiertos - ${c.moneda} ${c.precio_usd.toLocaleString("es-AR")} - USD ${c.precio_m2}/m²`
        ).join(" | ") + `. Usar estos precios/m² como base del cálculo. `;
    }

    // BLOQUE 11: log server-side para poder ver en Vercel -> Logs si el
    // geocode esta funcionando o no en producción, sin depender de devtools.
    console.log(`[_enrichOnly] address="${address}" geocodeOk=${!!coords} preciso=${coords?.preciso ?? "-"} locationType=${coords?.locationType || "-"} streetsNearby=${streetsNearby.length} paralelas=${JSON.stringify(streetsParalelas)} perpendiculares=${JSON.stringify(streetsPerpendiculares)} barrioDetectado=${coords?.barrioDetectado || "-"}`);

    // streetsNearby viaja crudo (array) ademas del texto ya formateado, para que
    // el cliente pueda usar los nombres reales de calles geolocalizadas al armar
    // las queries de busqueda de comparables en zonas abiertas (no barrio cerrado).
    // BLOQUE 12: barrioDetectado sale de Google (address_components) — el
    // barrio/subzona REAL de la direccion, sin depender de lo que haya
    // tipeado el usuario en el formulario.
    // BLOQUE 25: streetsParalelas/streetsPerpendiculares viajan aparte para
    // que el cliente arme queries de busqueda dirigidas por calle (con la
    // misma numeracion en paralelas, como referencia de cruce en
    // perpendiculares) en vez de depender solo del nombre del barrio.
    return res.status(200).json({
      streetContext, streetsNearby, streetsParalelas, streetsPerpendiculares, tokkoContext, tokkoComps, coords: coords || null,
      barrioDetectado: coords?.barrioDetectado || null,
      _debug: { geocodeOk: !!coords, preciso: coords?.preciso ?? null, locationType: coords?.locationType || null, streetsFound: streetsNearby.length, paralelas: streetsParalelas.length, perpendiculares: streetsPerpendiculares.length },
    });
  }

  // BLOQUE 12: geocodifica en batch direcciones candidatas de comparables y
  // devuelve la distancia REAL (en km) a la propiedad tasada. Reemplaza el
  // matching por texto de nombres de calle (fragil) por una verificacion
  // matematica con coordenadas reales — esto es lo que permite un radio de
  // verdad. No llama a Claude, corre antes/independiente de esa parte.
  if (req.body?._geocodeBatch) {
    const { direcciones, contexto, origenLat, origenLon } = req.body._meta || {};
    const lista = (Array.isArray(direcciones) ? direcciones : []).slice(0, 15); // tope defensivo de costo
    const resultados = await Promise.all(lista.map(async (direccion) => {
      const consulta = contexto ? `${direccion}, ${contexto}` : direccion;
      // Google primero, Nominatim como respaldo si Google falla puntualmente
      // para ESTA dirección (rate limit, ambigüedad, timeout) — antes esto
      // llamaba solo a Google, así que cualquier falla individual dejaba
      // distanciaKm=null y el filtro del cliente terminaba descartando
      // comparables reales que sí estaban en zona.
      const g = await geocodeAddressConFallback(consulta);
      if (!g || origenLat == null || origenLon == null) return { direccion, distanciaKm: null, motivo: "sin_geocode" };
      // Si el geocode no resolvió a nivel de altura/numeración (preciso ===
      // false — vino de Nominatim o Google devolvió GEOMETRIC_CENTER/
      // APPROXIMATE), la distancia calculada puede estar centrada en la
      // calle o la zona en general y no en el número real. Con un radio
      // chico (uso urbano) eso puede dar falsos "cerca" para direcciones
      // que en realidad están a varias cuadras. Se devuelve sin distancia
      // confiable en vez de arriesgar un falso positivo de proximidad.
      if (!g.preciso) return { direccion, distanciaKm: null, motivo: "geocode_impreciso:" + (g.locationType || "?") };
      return { direccion, distanciaKm: Math.round(distanciaKm(origenLat, origenLon, g.lat, g.lon) * 100) / 100 };
    }));
    console.log(`[_geocodeBatch] ${lista.length} direcciones, ${resultados.filter(r=>r.distanciaKm!=null).length} geocodificadas OK y precisas`);
    return res.status(200).json({ resultados });
  }

  // BLOQUE 26: abre las URLs REALES que devolvió la búsqueda web y extrae
  // precio/m²/dirección directo del HTML de cada publicación — no del
  // resumen que arma la IA. Confirmado en vivo que ese resumen no es
  // confiable (la misma publicación real dio dos superficies distintas en
  // dos corridas). Cada resultado se geocodifica y se verifica por distancia
  // real antes de aceptarlo, con el mismo radio amplio (2.5km) que el resto
  // del pipeline (BLOQUE 12/23) — así una publicación que resulte estar
  // lejos simplemente se descarta, no se muestra como "cerca" sin serlo.
  if (req.body?._fetchListings) {
    const { urls, origenLat, origenLon, contexto } = req.body._meta || {};
    const lista = (Array.isArray(urls) ? urls : []).slice(0, 8); // tope defensivo de costo/latencia
    // BLOQUE 26b: diagnóstico — antes esta rama devolvía null silencioso ante
    // cualquier falla (fetch, parseo, geocode o distancia), así que "0
    // verificadas" no decía POR QUÉ. Ahora cada URL devuelve su motivo de
    // descarte explícito para poder ver en consola dónde se corta la cadena.
    const diagnostico = await Promise.all(lista.map(async (url) => {
      if (!url || typeof url !== "string") return { url, ok: false, motivo: "url_invalida" };
      try {
        const ctrl = new AbortController();
        setTimeout(() => ctrl.abort(), 6000);
        let pageRes;
        try {
          pageRes = await fetch(url, {
            signal: ctrl.signal,
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
              "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
              "Accept-Language": "es-AR,es;q=0.9",
            },
          });
        } catch (fetchErr) {
          return { url, ok: false, motivo: "fetch_excepcion:" + fetchErr.message };
        }
        if (!pageRes.ok) return { url, ok: false, motivo: "fetch_status:" + pageRes.status };
        const html = await pageRes.text();
        const extraido = extraerAddrPrecioM2DeHtml(html);
        if (!extraido) return { url, ok: false, motivo: "parseo_fallido", htmlLen: html.length };
        const consulta = contexto ? `${extraido.direccion}, ${contexto}` : extraido.direccion;
        const g = await geocodeAddressConFallback(consulta);
        if (!g) return { url, ok: false, motivo: "geocode_null", direccion: extraido.direccion, consulta };
        if (origenLat == null || origenLon == null) return { url, ok: false, motivo: "sin_origen", direccion: extraido.direccion };
        if (!g.preciso) return { url, ok: false, motivo: "geocode_impreciso:" + (g.motivo || "?"), direccion: extraido.direccion, consulta };
        const dist = distanciaKm(origenLat, origenLon, g.lat, g.lon);
        if (dist > 2.5) return { url, ok: false, motivo: "distancia_excedida:" + dist.toFixed(2) + "km", direccion: extraido.direccion };
        return { url, ok: true, direccion: extraido.direccion, precioRaw: extraido.precioRaw, moneda: extraido.moneda, m2: extraido.m2, distanciaKm: Math.round(dist * 100) / 100 };
      } catch (e) {
        return { url, ok: false, motivo: "excepcion:" + e.message };
      }
    }));
    const validos = diagnostico.filter(d => d.ok);
    console.log(`[_fetchListings] ${lista.length} URLs, ${validos.length} verificadas. Diagnóstico completo: ${JSON.stringify(diagnostico)}`);
    return res.status(200).json({ resultados: validos, diagnostico });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: { message: "API key not configured" } });

  // El enriquecimiento ya se resolvió (arriba, una sola vez) antes de que el
  // cliente dispare las 3 búsquedas — acá solo queda pasar el mensaje ya
  // armado por el cliente directo a Claude, sin repetir geocode/Tokko/Overpass.
  const body = { ...req.body };
  delete body._meta;
  delete body._enrichOnly;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify(body)
    });
    const data = await response.text();
    res.status(response.status).setHeader("Content-Type", "application/json").send(data);
  } catch(error) {
    res.status(500).json({ error: { message: error.message } });
  }
}
