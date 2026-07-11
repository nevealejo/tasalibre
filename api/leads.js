const SUPABASE_URL = "https://qhojftormgvcdncaaftx.supabase.co";

// ── Notificación WhatsApp al admin vía CallMeBot ──────────────────────────
// Devuelve un objeto diagnóstico completo para poder ver qué pasó.
async function notifyWhatsApp(msg) {
  const diag = {
    apikey_presente: !!process.env.CALLMEBOT_APIKEY,
    phone_env_presente: !!process.env.CALLMEBOT_PHONE,
    phone_usado: process.env.CALLMEBOT_PHONE || "5491140356742 (fallback)",
    resultado: "no_intentado"
  };
  if (!process.env.CALLMEBOT_APIKEY) {
    diag.resultado = "sin_apikey_configurada";
    console.warn("CALLMEBOT_APIKEY no está configurada en Vercel");
    return diag;
  }
  try {
    const notifyPhone = process.env.CALLMEBOT_PHONE || "5491140356742";
    const waUrl = `https://api.callmebot.com/whatsapp.php?phone=${notifyPhone}&text=${encodeURIComponent(msg)}&apikey=${process.env.CALLMEBOT_APIKEY}`;
    const ctrl = new AbortController();
    setTimeout(() => ctrl.abort(), 10000);
    const waRes = await fetch(waUrl, { signal: ctrl.signal });
    const waText = await waRes.text();
    diag.resultado = `status_${waRes.status}: ${waText.slice(0, 300)}`;
    console.log("CallMeBot response:", diag.resultado);
  } catch (e) {
    diag.resultado = "error: " + e.message;
    console.warn("WhatsApp notify failed:", e.message);
  }
  return diag;
}

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
    // ── ENDPOINT DE DIAGNÓSTICO: /api/leads?test=whatsapp ──
    // Usa exactamente las mismas env vars y código que la notificación real.
    if (req.query?.test === "whatsapp") {
      const diag = await notifyWhatsApp("🔧 Test de notificación TasaLibre — si te llegó esto, el sistema funciona.");
      return res.status(200).json({ test: "whatsapp", ...diag, hora: new Date().toISOString() });
    }
    const r = await fetch(`${SUPABASE_URL}/rest/v1/leads?select=*&order=created_at.desc`, { headers });
    const data = await r.json();
    return res.status(r.status).json(data);
  }

  if (req.method === "POST") {
    const { nombre, whatsapp, tipo, operacion, address, supTotal, ambientes, dormitorios, valorUsd, precioM2, htmlInforme, resultadoJson } = req.body;

    // ── Saneamiento: las columnas numéricas de Supabase rechazan valores como
    // "6+", "4+" o "Monoambiente" (los selects del form los permiten) → error 400.
    // Convertimos todo a números válidos o null, para que el insert NUNCA falle por tipo.
    const toInt = (v) => {
      if (v === null || v === undefined || v === "") return null;
      if (typeof v === "string" && /monoambiente/i.test(v)) return 1;
      const n = parseInt(String(v).replace(/[^\d]/g, ""), 10);
      return Number.isFinite(n) ? n : null;
    };
    const toNum = (v) => {
      const n = Number(v);
      return Number.isFinite(n) ? n : null;
    };

    const r = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
      method: "POST",
      headers: { ...headers, "Prefer": "return=minimal" },
      body: JSON.stringify({
        nombre: (nombre || "Sin nombre").slice(0, 120),
        whatsapp: (whatsapp || "").slice(0, 30),
        tipo: tipo || "",
        operacion: operacion || "",
        direccion: (address || "").slice(0, 300),
        superficie: toInt(supTotal),
        ambientes: toInt(ambientes),
        dormitorios: toInt(dormitorios),
        valor_usd: toNum(valorUsd),
        precio_m2: toNum(precioM2),
        html_informe: htmlInforme || null,
        resultado_json: resultadoJson || null,
        status: "pendiente",
        created_at: new Date().toISOString()
      })
    });

    // Notificación WhatsApp al admin — SIEMPRE se intenta, incluso si falló el guardado,
    // para que ninguna tasación pase desapercibida.
    let supabaseError = "";
    if (!r.ok) {
      try { supabaseError = (await r.text()).slice(0, 200); } catch(e) {}
      console.error("Supabase insert failed:", r.status, supabaseError);
    }
    const msg = (r.ok ? "🏠 Nuevo lead TasaLibre!" : "⚠️ Tasación realizada pero el lead NO se guardó (error " + r.status + (supabaseError ? ": " + supabaseError.slice(0, 120) : "") + ")") +
      `\n${nombre || "Sin nombre"} - ${whatsapp || "sin tel"}\n${tipo} en ${operacion} - ${address || ""}` +
      (supTotal ? `\nSuperficie: ${supTotal} m²` : "") +
      `\nValor: USD ${valorUsd ? Number(valorUsd).toLocaleString("es-AR") : "?"}`;
    const waDiag = await notifyWhatsApp(msg);

    return res.status(r.ok ? 200 : r.status).json({ ok: r.ok, waStatus: waDiag.resultado, waDiag, supabaseError: supabaseError || undefined });
  }

  if (req.method === "PATCH") {
    const { id, status, valorCorregido, motivo } = req.body;

    if (status) {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/leads?id=eq.${id}`, {
        method: "PATCH",
        headers: { ...headers, "Prefer": "return=minimal" },
        body: JSON.stringify({ status })
      });
      if (!valorCorregido) return res.status(r.ok ? 200 : r.status).json({ ok: r.ok });
    }

    // ── BLOQUE 5: loop de calibración — cada corrección manual (valor real
    // de una venta cerrada, o revisión de un asesor) queda logueada para
    // poder medir, con el tiempo, qué tan bien tasa el sistema por zona/tipo.
    // Requiere la tabla tasacion_correcciones (ver tasacion_correcciones.sql).
    if (valorCorregido) {
      const leadRes = await fetch(`${SUPABASE_URL}/rest/v1/leads?id=eq.${id}&select=tipo,direccion,valor_usd`, { headers });
      const leadRows = await leadRes.json();
      const lead = leadRows[0] || {};
      const corrRes = await fetch(`${SUPABASE_URL}/rest/v1/tasacion_correcciones`, {
        method: "POST",
        headers: { ...headers, "Prefer": "return=minimal" },
        body: JSON.stringify({
          lead_id: id,
          tipo: lead.tipo || null,
          zona: lead.direccion || null,
          valor_ia: lead.valor_usd || null,
          valor_corregido: valorCorregido,
          motivo: motivo || null,
          corregido_por: "admin",
        })
      });
      return res.status(corrRes.ok ? 200 : corrRes.status).json({ ok: corrRes.ok });
    }

    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
