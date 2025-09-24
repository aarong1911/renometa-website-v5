import type { Handler, HandlerEvent } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

// ✅ Supabase client with service role key
const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

// Helper functions
function pad(n: number) {
  return String(n).padStart(2, "0");
}
function addMinutes(hhmm: string, minutes: number): string {
  const [h, m] = hhmm.split(":").map(Number);
  const base = new Date(2000, 0, 1, h, m);
  base.setMinutes(base.getMinutes() + minutes);
  return `${pad(base.getHours())}:${pad(base.getMinutes())}`;
}
function toIso(date: string, time: string) {
  return `${date}T${time}:00`;
}

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const { appt_id, date, time, tz = "America/New_York" } = body;

    // ✅ Validate required fields
    if (!appt_id || !date || !time) {
      console.error("❌ Missing fields:", { appt_id, date, time });
      return { statusCode: 400, body: JSON.stringify({ error: "Missing required fields" }) };
    }

    const start_iso = toIso(date, time);
    const end_iso = toIso(date, addMinutes(time, 60));

    console.log("🔄 Rescheduling appointment:", {
      appt_id,
      date,
      time,
      tz,
      start_iso,
      end_iso,
    });

    // ✅ Update row in Supabase
    const { data, error } = await supabase
      .from("appointments")
      .update({
        appointment_date: date,
        appointment_time: time,
        timezone: tz,
        start_at: start_iso,
        end_at: end_iso,
        status: "rescheduled", // force overwrite
      })
      .eq("id", appt_id)
      .select("id, status, appointment_date, appointment_time, updated_at");

    if (error) {
      console.error("❌ Supabase error:", error.message);
      return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }

    console.log("✅ Updated row:", data);

    // ✅ Push update to Make webhook (optional)
    if (process.env.MAKE_WEBHOOK_URL) {
      try {
        await fetch(process.env.MAKE_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            appt_id,
            appointment_date: date,
            appointment_time: time,
            timezone: tz,
            start_at: start_iso,
            end_at: end_iso,
            status: "rescheduled",
          }),
        });
        console.log("📤 Sent to Make webhook");
      } catch (err: any) {
        console.error("❌ Failed to send to Make:", err.message);
      }
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true, updated: data }) };
  } catch (err: any) {
    console.error("❌ Exception:", err.message);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
