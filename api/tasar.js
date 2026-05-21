export const config = { maxDuration: 120 };

async function geocodeAddress(address) {
  try {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 4000);
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1&countrycodes=ar`;
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "TasaLibre/1.0", "Accept-Language": "es" }
    });
    const data = await res.json();
    if (!data.length) return null;
    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
  } catch { return null; }
}

async function getNearbyStreets(lat, lon, radius) {
  try {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 6000);
    const query = `[out:json][timeout:5];way(around:${radius},${lat},${lon})["highway"]["name"];out tags;`;
    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      signal: controller.signal,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `data=${encodeURIComponent(query)}`
    });
    const data = await res.json();
    const seen = new Set();
    const streets = [];
    const priority = { residential: 1, secondary: 2, tertiary: 3, primary: 4, unclassified: 5 };
    for (const el of data.elements) {
      const name = el.tags?.name;
      if (name && !seen.has(name)) {
        seen.add(name);
        streets.push({ name, p: priority[el.tags.highway] || 9 });
      }
    }
    return streets.sort((a, b) => a.p - b.p).slice(0, 6).map(s => s.name);
  } catch { return []; }
}

async function getStreetContext(address) {
  try {
    const coords = await geocodeAddress(address);
    if (!coords) return "";
    let streets = await getNearbyStreets(coords.lat, coords.lon, 500);
    if (streets.length < 3) {
      streets = await getNearbyStreets(coords.lat, coords.lon, 1000);
    }
    if (!streets.length) return "";
    return `CALLES CERCANAS (máx 500m): ${streets.join(", ")}. Buscar SOLO en estas calles. `;
  } catch { return ""; }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: { message: 'API key not configured on server' } });

  const body = req.body;
  const isSearch = body?.tools?.[0]?.type === "web_search_20250305";

  // Solo enriquecer búsquedas de comparables, no la tasación final
  if (isSearch && body._address) {
    const address = body._address;
    delete body._address;
    const context = await getStreetContext(address);
    if (context && body.messages?.[0]?.content) {
      body.messages[0].content = context + body.messages[0].content;
    }
  } else {
    delete body._address;
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
