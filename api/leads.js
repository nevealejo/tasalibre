export const config = { maxDuration: 30 };

const SUPABASE_URL = "https://qhojftormgvcdncaaftx.supabase.co";

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const key = process.env.SUPABASE_SECRET_KEY;
  if (!key) return res.status(500).json({ error: 'Supabase key not configured' });

  const headers = {
    'Content-Type': 'application/json',
    'apikey': key,
    'Authorization': `Bearer ${key}`,
    'Prefer': 'return=representation'
  };

  try {
    // GET — fetch all leads
    if (req.method === 'GET') {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/leads?select=*&order=created_at.desc`, { headers });
      const data = await r.json();
      return res.status(200).json(data);
    }

    // POST — save new lead
    if (req.method === 'POST') {
      const body = req.body;
      const r = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          id: body.id,
          fecha: body.fecha,
          nombre: body.nombre,
          whatsapp: body.whatsapp,
          tipo: body.tipo,
          address: body.address,
          operacion: body.operacion,
          sup_total: body.supTotal,
          ambientes: body.ambientes,
          dormitorios: body.dormitorios,
          valor_usd: body.valorUsd,
          precio_m2: body.precioM2,
          status: 'pendiente'
        })
      });
      const data = await r.json();
      return res.status(200).json(data);
    }

    // PATCH — update lead status
    if (req.method === 'PATCH') {
      const { id, status } = req.body;
      const r = await fetch(`${SUPABASE_URL}/rest/v1/leads?id=eq.${id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status })
      });
      const data = await r.json();
      return res.status(200).json(data);
    }

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
