import type { Handler, HandlerEvent } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

// ✅ Supabase client with service role key
const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

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

    console.log("🔄 Rescheduling appointment:", { appt_id, date, time, tz });

    // ✅ Update only columns that exist in your table
    const { data, error } = await supabase
      .from("appointments")
      .update({
        appointment_date: date,
        appointment_time: time,
        timezone: tz,
        status: "rescheduled", // overwrite
      })
      .eq("id", appt_id)
      .select("id, status, appointment_date, appointment_time, timezone, updated_at");

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
