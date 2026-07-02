const SUPABASE_URL = "https://qhojftormgvcdncaaftx.supabase.co";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const key = process.env.SUPABASE_SECRET_KEY;
  if (!key) return res.status(500).json({ error: "No Supabase key" });

  const headers = {
    "Content-Type": "application/json",
    "apikey": key,
    "Authorization": `Bearer ${key}`
  };

  if (req.method === "GET") {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/leads?select=*&order=created_at.desc`, { headers });
    const data = await r.json();
    return res.status(r.status).json(data);
  }

  if (req.method === "POST") {
    const { nombre, whatsapp, tipo, operacion, address, supTotal, ambientes, dormitorios, valorUsd, precioM2, htmlInforme, resultadoJson } = req.body;
    const r = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
      method: "POST",
      headers: { ...headers, "Prefer": "return=minimal" },
      body: JSON.stringify({
        nombre: nombre || "Sin nombre",
        whatsapp: whatsapp || "",
        tipo: tipo || "",
        operacion: operacion || "",
        direccion: address || "",
        superficie: supTotal ? parseInt(supTotal) : null,
        ambientes: ambientes || null,
        dormitorios: dormitorios || null,
        valor_usd: valorUsd || null,
        precio_m2: precioM2 || null,
        html_informe: htmlInforme || null,
        resultado_json: resultadoJson || null,
        status: "pendiente",
        created_at: new Date().toISOString()
      })
    });

    // Notificación WhatsApp al admin (CallMeBot) — con logging real para diagnóstico
    let waStatus = "no_intentado";
    if (r.ok) {
      if (!process.env.CALLMEBOT_APIKEY) {
        waStatus = "sin_apikey_configurada";
        console.warn("CALLMEBOT_APIKEY no está configurada en Vercel");
      } else {
        try {
          const msg = `🏠 Nuevo lead TasaLibre!\n${nombre || "Sin nombre"} - ${whatsapp || "sin tel"}\n${tipo} en ${operacion} - ${address || ""}\nValor: USD ${valorUsd ? Number(valorUsd).toLocaleString("es-AR") : "?"}`;
          const notifyPhone = process.env.CALLMEBOT_PHONE || "5491140356742";
          const waUrl = `https://api.callmebot.com/whatsapp.php?phone=${notifyPhone}&text=${encodeURIComponent(msg)}&apikey=${process.env.CALLMEBOT_APIKEY}`;
          const waRes = await fetch(waUrl);
          const waText = await waRes.text();
          waStatus = `status_${waRes.status}: ${waText.slice(0, 200)}`;
          console.log("CallMeBot response:", waStatus);
        } catch(e) {
          waStatus = "error: " + e.message;
          console.warn("WhatsApp notify failed:", e.message);
        }
      }
    }

    return res.status(r.ok ? 200 : r.status).json({ ok: r.ok, waStatus });
  }

  if (req.method === "PATCH") {
    const { id, status } = req.body;
    const r = await fetch(`${SUPABASE_URL}/rest/v1/leads?id=eq.${id}`, {
      method: "PATCH",
      headers: { ...headers, "Prefer": "return=minimal" },
      body: JSON.stringify({ status })
    });
    return res.status(r.ok ? 200 : r.status).json({ ok: r.ok });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
