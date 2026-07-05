<<<<<<< HEAD
// netlify/functions/reschedule.ts
import type { Handler, HandlerEvent } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

=======
import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

// ✅ Initialize Supabase client with service role key
>>>>>>> 367861f (Local changes)
const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

<<<<<<< HEAD
export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  try {
=======
// ✅ Helper functions
function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function addMinutes(hhmm: string, minutes: number): string {
  const [h, m] = hhmm.split(":").map(Number);
  const base = new Date(2000, 0, 1, h, m);
  base.setMinutes(base.getMinutes() + minutes);
  return `${pad(base.getHours())}:${pad(base.getMinutes())}`;
}

function toIso(date: string, time: string): string {
  return `${date}T${time}:00`;
}

// ✅ Main handler
export const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method not allowed" }),
      };
    }

>>>>>>> 367861f (Local changes)
    const body = JSON.parse(event.body || "{}");
    const { appt_id, date, time, tz = "America/New_York" } = body;

    if (!appt_id || !date || !time) {
<<<<<<< HEAD
      return { statusCode: 400, body: JSON.stringify({ error: "Missing required fields" }) };
    }

    // 🔎 Look up appointment
    const { data: existing, error: fetchErr } = await supabase
      .from("appointments")
      .select("id, name, email, phone")
      .eq("id", appt_id)
      .single();

    if (fetchErr || !existing) {
      return { statusCode: 404, body: JSON.stringify({ error: "Appointment not found" }) };
    }

    // ✅ Build payload
    const updatedPayload = {
      appt_id: existing.id,
      name: existing.name,
      email: existing.email,
      phone: existing.phone,
      appointment_date: date,
      appointment_time: time,
      timezone: tz,
      status: "rescheduled",
    };

    console.log("📤 Sending reschedule payload to Make:", updatedPayload);

    // ✅ Send to Make appointment webhook
    if (process.env.MAKE_APPOINTMENT_WEBHOOK_URL) {
      await fetch(process.env.MAKE_APPOINTMENT_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPayload),
      });
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true, sent: updatedPayload }) };
  } catch (err: any) {
    console.error("❌ reschedule error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
=======
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields" }),
      };
    }

    const start_iso = toIso(date, time);
    const end_iso = toIso(date, addMinutes(time, 60)); // default 60 min

    const { error } = await supabase
      .from("appointments")
      .update({
        appointment_date: date,
        appointment_time: time,
        timezone: tz,
        start_at: start_iso,
        end_at: end_iso,
        status: "rescheduled",
        updated_at: new Date().toISOString(),
      })
      .eq("id", appt_id);

    if (error) throw error;

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true }),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
>>>>>>> 367861f (Local changes)
  }
};
