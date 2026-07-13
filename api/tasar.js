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
    if (count >= 36) return false; // 4 tasaciones × hasta 9 llamadas

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

async function searchTokkoComparables(tipo, operacion, barrio, supTotal, conCochera, esCerrado) {
  try {
    const tokkoKey = process.env.TOKKO_API_KEY;
    if (!tokkoKey) return [];

    const tipoMap = { departamento:2, casa:3, ph:13, local:7, lote:1 };
    const opMap = { venta:1, alquiler:2 };

    // Search data con network type para acceder a toda la red Tokko
    const searchData = {
      current_localization_id: 0,
      current_localization_type: "network",
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

    // Agregar filtro de superficie si existe
    if (supTotal && parseInt(supTotal) > 0) {
      const sup = parseInt(supTotal);
      searchData.filters.push(["roofed_surface", ">=", Math.round(sup * 0.65).toString()]);
      searchData.filters.push(["roofed_surface", "<=", Math.round(sup * 1.35).toString()]);
    }

    const params = new URLSearchParams({
      format: "json",
      key: tokkoKey,
      lang: "es_ar",
      limit: 40,
      offset: 0
    });

    const ctrl = new AbortController();
    setTimeout(() => ctrl.abort(), 8000);

    const url = `https://www.tokkobroker.com/api/v1/property/search/?${params.toString()}`;
    const res = await fetch(url, {
      method: "POST",
      signal: ctrl.signal,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: searchData })
    });

    const data = await res.json();
    const total = data.meta?.total_count || 0;
    console.log(`Tokko returned ${total} total, ${(data.objects||[]).length} objects`);

    // Filtrar por barrio/zona
    // Barrio cerrado: exigir la FRASE COMPLETA del nombre (ej "nuevo quilmes") en ubicación,
    // dirección o TÍTULO de la publicación — nunca palabras sueltas (matchearían toda la localidad).
    const barrioLower = barrio.toLowerCase().trim();
    const kw = barrioLower.split(" ").filter(w => w.length > 3);
    const filtered = (data.objects || []).filter(p => {
      const loc = [
        p.location?.name || "",
        p.location?.full_location || "",
        p.address || "",
        p.publication_title || "",
        p.fake_address || ""
      ].join(" ").toLowerCase();
      return esCerrado ? loc.includes(barrioLower) : kw.some(w => loc.includes(w));
    });

    // Filtrar por cochera si aplica
    const withCochera = filtered.filter(p =>
      !conCochera || p.parking_lot_amount > 0 ||
      (p.tags || []).some(t => t.name?.toLowerCase().includes("cochera"))
    );

    return withCochera.slice(0, 8).map(p => {
      const m2cubierto = p.roofed_surface || p.total_surface || 0;
      const precio = p.price || 0;
      const precioM2 = m2cubierto > 0 ? Math.round(precio / m2cubierto) : 0;
      return {
        direccion: p.address || "-",
        barrio: p.location?.name || barrio,
        m2: m2cubierto,
        m2total: p.total_surface || m2cubierto,
        precio_usd: precio,
        precio_m2: precioM2,
        moneda: p.currency || "USD",
        fuente: "Tokko Broker"
      };
    }).filter(p => p.precio_usd > 0 && p.m2 > 0);

  } catch(e) {
    console.error("Tokko error:", e.message);
    return [];
  }
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

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
    const { address, tipo, operacion, barrio, supTotal, conCochera, esCerrado, loteCentrico } = req.body._meta || {};

    const [coords, tokkoComps] = await Promise.all([
      address ? geocodeAddressConFallback(address) : Promise.resolve(null),
      searchTokkoComparables(tipo, operacion, barrio, supTotal, conCochera, !!esCerrado)
    ]);

    let streetContext = "";
    let streetsNearby = [];
    if (coords) {
      let streets = await getNearbyStreets(coords.lat, coords.lon, 500);
      if (streets.length < 3) streets = await getNearbyStreets(coords.lat, coords.lon, 1000);
      streetsNearby = streets;
      if (streets.length) streetContext = `CALLES CERCANAS (500m): ${streets.join(", ")}. `;

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
        : `COMPARABLES REALES TOKKO BROKER RED COMPLETA (priorizar sobre cualquier otra fuente): `) +
        tokkoComps.map(c =>
          `${c.direccion} - ${c.barrio} - ${c.m2}m² cubiertos - ${c.moneda} ${c.precio_usd.toLocaleString("es-AR")} - USD ${c.precio_m2}/m²`
        ).join(" | ") + `. Usar estos precios/m² como base del cálculo. `;
    }

    // BLOQUE 11: log server-side para poder ver en Vercel -> Logs si el
    // geocode esta funcionando o no en producción, sin depender de devtools.
    console.log(`[_enrichOnly] address="${address}" geocodeOk=${!!coords} preciso=${coords?.preciso ?? "-"} locationType=${coords?.locationType || "-"} streetsNearby=${streetsNearby.length} barrioDetectado=${coords?.barrioDetectado || "-"}`);

    // streetsNearby viaja crudo (array) ademas del texto ya formateado, para que
    // el cliente pueda usar los nombres reales de calles geolocalizadas al armar
    // las queries de busqueda de comparables en zonas abiertas (no barrio cerrado).
    // BLOQUE 12: barrioDetectado sale de Google (address_components) — el
    // barrio/subzona REAL de la direccion, sin depender de lo que haya
    // tipeado el usuario en el formulario.
    return res.status(200).json({
      streetContext, streetsNearby, tokkoContext, tokkoComps, coords: coords || null,
      barrioDetectado: coords?.barrioDetectado || null,
      _debug: { geocodeOk: !!coords, preciso: coords?.preciso ?? null, locationType: coords?.locationType || null, streetsFound: streetsNearby.length },
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
