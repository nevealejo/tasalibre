import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://qhojftormgvcdncaaftx.supabase.co",
  process.env.SUPABASE_SECRET_KEY
);

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  // GET - obtener leads
  if (req.method === "GET") {
    try {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return res.status(200).json(data || []);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // POST - guardar nuevo lead con datos de propiedad
  if (req.method === "POST") {
    try {
      const {
        nombre, whatsapp, tipo, operacion, address,
        supTotal, ambientes, dormitorios,
        valorUsd, precioM2
      } = req.body;

      const { error } = await supabase.from("leads").insert([{
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
        status: "pendiente",
        created_at: new Date().toISOString()
      }]);

      if (error) throw error;
      return res.status(200).json({ ok: true });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // PATCH - actualizar estado del lead
  if (req.method === "PATCH") {
    try {
      const { id, status } = req.body;
      const { error } = await supabase
        .from("leads")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
