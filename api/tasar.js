export const config = { maxDuration: 300 };

const SUPABASE_URL = "https://qhojftormgvcdncaaftx.supabase.co";

// ── Rate limiting: máx 16 llamadas/día por IP (≈4 tasaciones) ─────────────
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
    if (count >= 16) return false; // 4 tasaciones × 4 llamadas

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
    const res = await fetch(url, { signal: ctrl.signal, headers: { "User-Agent": "TasaLibre/1.0", "Accept-Language": "es" } });
    const data = await res.json();
    if (!data.length) return null;
    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
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

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: { message: "API key not configured" } });

  // Rate limiting por IP — máx 16 llamadas/día (≈4 tasaciones)
  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || req.socket?.remoteAddress || "";
  const allowed = await checkRateLimit(ip);
  if (!allowed) {
    return res.status(429).json({ error: { message: "Alcanzaste el límite de tasaciones diarias. Volvé mañana o contactanos por WhatsApp." } });
  }

  const body = { ...req.body };
  const isSearch = body?.tools?.[0]?.type === "web_search_20250305";

  if (isSearch && body._meta) {
    const { address, tipo, operacion, barrio, supTotal, conCochera, esCerrado } = body._meta;
    delete body._meta;

    const [coords, tokkoComps] = await Promise.all([
      address ? geocodeAddress(address) : Promise.resolve(null),
      searchTokkoComparables(tipo, operacion, barrio, supTotal, conCochera, !!esCerrado)
    ]);

    let streetContext = "";
    if (coords) {
      let streets = await getNearbyStreets(coords.lat, coords.lon, 500);
      if (streets.length < 3) streets = await getNearbyStreets(coords.lat, coords.lon, 1000);
      if (streets.length) streetContext = `CALLES CERCANAS (500m): ${streets.join(", ")}. `;
    }

    let tokkoContext = "";
    if (tokkoComps.length > 0) {
      tokkoContext = (esCerrado
        ? `COMPARABLES REALES TOKKO VERIFICADOS DENTRO DEL BARRIO "${barrio}" (priorizar sobre cualquier otra fuente): `
        : `COMPARABLES REALES TOKKO BROKER RED COMPLETA (priorizar sobre cualquier otra fuente): `) +
        tokkoComps.map(c =>
          `${c.direccion} - ${c.barrio} - ${c.m2}m² cubiertos - ${c.moneda} ${c.precio_usd.toLocaleString("es-AR")} - USD ${c.precio_m2}/m²`
        ).join(" | ") + `. Usar estos precios/m² como base del cálculo. `;
    }

    if (body.messages?.[0]?.content) {
      body.messages[0].content = tokkoContext + streetContext + body.messages[0].content;
    }
  } else {
    delete body._meta;
  }

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
