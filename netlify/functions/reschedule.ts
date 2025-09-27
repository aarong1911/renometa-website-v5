import type { Handler, HandlerEvent } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

// Supabase client with service role key
const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const { appt_id, date, time, tz = "America/New_York" } = body;

    if (!appt_id || !date || !time) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields" }),
      };
    }

    // 1️⃣ Fetch the existing row
    const { data: existing, error: fetchErr } = await supabase
      .from("appointments")
      .select("id, name, email, phone")
      .eq("id", appt_id)
      .single();

    if (fetchErr || !existing) {
      console.error("❌ Appointment not found:", fetchErr?.message);
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Appointment not found" }),
      };
    }

    // 2️⃣ Update Supabase record
    const { error: updateErr } = await supabase
      .from("appointments")
      .update({
        appointment_date: date,
        appointment_time: time,
        timezone: tz,
        status: "rescheduled",
      })
      .eq("id", appt_id);

    if (updateErr) {
      console.error("❌ Failed to update Supabase:", updateErr.message);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed to update appointment" }),
      };
    }

    // 3️⃣ Build payload for Make
    const updatedPayload = {
      id: existing.id,
      name: existing.name,
      email: existing.email,
      phone: existing.phone,
      appointment_date: date,
      appointment_time: time,
      timezone: tz,
      status: "rescheduled",
    };

    console.log("📤 Sending reschedule payload to Make:", updatedPayload);

    // 4️⃣ Send to Make webhook
    if (process.env.MAKE_WEBHOOK_URL) {
      await fetch(process.env.MAKE_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPayload),
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, sent: updatedPayload }),
    };
  } catch (err: any) {
    console.error("❌ Exception:", err.message);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
