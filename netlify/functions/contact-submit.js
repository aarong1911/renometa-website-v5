// netlify/functions/contact-submit.js
import fetch from "node-fetch";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const data = JSON.parse(event.body);

    // 1️⃣ Insert into Supabase
    const { error } = await supabase.from("contacts").insert([{
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      service: data.service,
      message: data.message,
    }]);

    if (error) {
      console.error("Supabase insert error:", error);
    }

    // 2️⃣ Send to Make.com Webhook
    await fetch("https://hook.us2.make.com/gcl4gdsg0kcjtpn5rcoyhmdauidrkkgt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error("Function error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: "Submission failed" }) };
  }
}
