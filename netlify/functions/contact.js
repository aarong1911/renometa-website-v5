// netlify/functions/contact.cjs

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");

    console.log("📤 Contact payload received:", body);

    // ✅ Forward the payload to Make contact scenario
    if (process.env.MAKE_CONTACT_WEBHOOK_URL) {
      await fetch(process.env.MAKE_CONTACT_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } else {
      console.error("❌ Missing MAKE_CONTACT_WEBHOOK_URL in environment");
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
