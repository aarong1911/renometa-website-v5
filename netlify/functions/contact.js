// netlify/functions/contact.js

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");

    const payload = {
      name: body.name || "",
      email: body.email || "",
      phone: body.phone || "",
      company: body.company || "",
      message: body.message || "",
      service: body.service || "general",
      consent: Boolean(body.consent),
      source: body.source || "contact-form",
      submittedAt: new Date().toISOString(),
    };

    if (!payload.name || !payload.email || !payload.message) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Missing required fields",
        }),
      };
    }

    if (!payload.phone) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Phone number is required",
        }),
      };
    }

    if (!payload.consent) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "SMS consent is required",
        }),
      };
    }

    console.log("📤 Contact payload received:", payload);

    if (!process.env.MAKE_CONTACT_WEBHOOK_URL) {
      throw new Error("Missing MAKE_CONTACT_WEBHOOK_URL in environment");
    }

    const response = await fetch(process.env.MAKE_CONTACT_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Make webhook failed with status ${response.status}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Contact request forwarded to Make" }),
    };
  } catch (error) {
    console.error("❌ Contact function error:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message || "Contact submission failed",
      }),
    };
  }
};
