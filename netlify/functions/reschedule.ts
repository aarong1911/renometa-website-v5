import type { Handler, HandlerEvent } from "@netlify/functions";

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
      console.error("❌ Missing fields:", { appt_id, date, time });
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields" }),
      };
    }

    console.log("📤 Forwarding reschedule request:", { appt_id, date, time, tz });

    if (!process.env.MAKE_WEBHOOK_URL) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "MAKE_WEBHOOK_URL not set" }),
      };
    }

    // ✅ Send to Make — let Make handle the Supabase update + emails
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

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, message: "Reschedule request sent to Make" }),
    };
  } catch (err: any) {
    console.error("❌ Exception:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
