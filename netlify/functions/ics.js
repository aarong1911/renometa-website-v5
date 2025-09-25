export async function handler(event) {
  try {
    const params = event.queryStringParameters;
    const {
      name = "Guest",
      email = "",
      date,
      time,
      tz = "America/New_York",
      dur = 60,
      phone = "",
    } = params;

    if (!date || !time) {
      return { statusCode: 400, body: "Missing date or time" };
    }

    const [y, m, d] = date.split("-").map(Number);
    const [hh, mm] = time.split(":").map(Number);

    const start = new Date(Date.UTC(y, m - 1, d, hh, mm));
    const end = new Date(start.getTime() + dur * 60000);

    const pad = (n) => String(n).padStart(2, "0");
    const toUtc = (d) =>
      d.getUTCFullYear() +
      pad(d.getUTCMonth() + 1) +
      pad(d.getUTCDate()) +
      "T" +
      pad(d.getUTCHours()) +
      pad(d.getUTCMinutes()) +
      pad(d.getUTCSeconds()) +
      "Z";

    const startUtc = toUtc(start);
    const endUtc = toUtc(end);

    const title = "Appointment with RenoMeta";
    const details = `Call with RenoMeta\nName: ${name}\nEmail: ${email}\nPhone: ${phone}`;

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${title}
DTSTART:${startUtc}
DTEND:${endUtc}
DESCRIPTION:${details}
LOCATION:Phone: ${phone}
END:VEVENT
END:VCALENDAR`;

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="renometa-appointment-${date}.ics"`,
      },
      body: icsContent,
    };
  } catch (err) {
    return { statusCode: 500, body: `Error: ${err.message}` };
  }
}
