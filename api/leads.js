import { randomUUID } from "crypto";

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

    // BLOQUE 18: causa raíz REAL del bug de leads perdidos, confirmada en
    // Vercel Logs del 13/07: "null value in column \"id\" of relation
    // \"leads\" violates not-null constraint" — la columna id de la tabla no
    // tiene un DEFAULT (gen_random_uuid()) configurado en Supabase, así que
    // CUALQUIER insert que no mande id explícito fallaba siempre. El
    // auto-reintento del BLOQUE 15 no alcanzaba a arreglarlo porque reintentaba
    // con id="" (string vacío), que tampoco es un uuid válido. Se genera el
    // id acá mismo, sin depender de que Supabase lo autogenere.
    const payload = {
      id: randomUUID(),
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
    };
    const doInsert = (body) => fetch(`${SUPABASE_URL}/rest/v1/leads`, {
      method: "POST",
      headers: { ...headers, "Prefer": "return=minimal" },
      body: JSON.stringify(body)
    });

    let r = await doInsert(payload);

    // Notificación WhatsApp al admin — SIEMPRE se intenta, incluso si falló el guardado,
    // para que ninguna tasación pase desapercibida.
    let supabaseError = "";
    if (!r.ok) {
      let full = "";
      try { full = await r.text(); } catch(e) {}
      console.error("Supabase insert failed:", r.status, full);
      supabaseError = full.slice(0, 200);

      // BLOQUE 15: auto-reintento — si el error es "columna NOT NULL sin
      // valor" (23502), Postgrest siempre nombra la columna exacta en el
      // mensaje ("null value in column \"X\" violates..."). En vez de perder
      // el lead entero por una columna que no conocíamos, la detectamos y
      // reintentamos UNA vez con un valor por defecto seguro (string vacío).
      // Esto además deja logueado el nombre real de la columna para poder
      // corregir el insert de forma permanente en el próximo ajuste.
      const colMatch = full.match(/column "([^"]+)"/i);
      if (colMatch && !(colMatch[1] in payload)) {
        const col = colMatch[1];
        console.warn(`Reintentando insert de lead: columna "${col}" faltante, probando con "" (string vacío)`);
        const r2 = await doInsert({ ...payload, [col]: "" });
        if (r2.ok) {
          r = r2;
          supabaseError = "";
          console.log(`Insert de lead OK en el reintento agregando "${col}" = ""`);
        } else {
          const full2 = await r2.text().catch(() => "");
          console.error("Reintento de insert también falló:", r2.status, full2);
          supabaseError = full2.slice(0, 200) || supabaseError;
        }
      }
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
