export const config = { maxDuration: 120 };

// ── Geocodifica la dirección con Nominatim ────────────────────────────────
async function geocodeAddress(address) {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1&countrycodes=ar`;
    const res = await fetch(url, {
      headers: { "User-Agent": "TasaLibre/1.0", "Accept-Language": "es" }
    });
    const data = await res.json();
    if (!data.length) return null;
    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
  } catch { return null; }
}

// ── Obtiene calles cercanas con Overpass ──────────────────────────────────
async function getNearbyStreets(lat, lon, radius) {
  try {
    const query = `[out:json][timeout:20];way(around:${radius},${lat},${lon})["highway"]["name"];out tags;`;
    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `data=${encodeURIComponent(query)}`
    });
    const data = await res.json();
    const seen = new Set();
    const streets = [];
    const priority = { residential: 1, secondary: 2, tertiary: 3, primary: 4, unclassified: 5, service: 6 };
    for (const el of data.elements) {
      const name = el.tags?.name;
      if (name && !seen.has(name)) {
        seen.add(name);
        streets.push({ name, highway: el.tags.highway, priority: priority[el.tags.highway] || 9 });
      }
    }
    return streets.sort((a, b) => a.priority - b.priority).slice(0, 8).map(s => s.name);
  } catch { return []; }
}

// ── Handler principal ─────────────────────────────────────────────────────
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: { message: 'API key not configured on server' } });

  // Si es llamada de búsqueda de comparables, enriquecer con calles cercanas
  const body = req.body;
  const isSearch = body?.tools?.[0]?.type === "web_search_20250305";

  if (isSearch && body._address) {
    const address = body._address;
    delete body._address;

    // Geocodificar
    const coords = await geocodeAddress(address);

    if (coords) {
      // Buscar calles a 500m, si hay menos de 3 ampliar a 1000m
      let streets = await getNearbyStreets(coords.lat, coords.lon, 500);
      if (streets.length < 3) {
        streets = await getNearbyStreets(coords.lat, coords.lon, 1000);
      }

      // Inyectar calles en el mensaje del usuario
      if (streets.length > 0) {
        const streetContext = `CALLES CERCANAS EN 500M: ${streets.join(", ")}. `;
        if (body.messages?.[0]?.content) {
          body.messages[0].content = streetContext + body.messages[0].content;
        }
      }
    }
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });
    const data = await response.text();
    res.status(response.status).setHeader('Content-Type', 'application/json').send(data);
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
}
