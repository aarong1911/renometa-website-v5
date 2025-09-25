import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function buildUtcRange(start: Date, minutes = 60) {
  const end = new Date(start.getTime() + minutes * 60000);
  const toStr = (d: Date) =>
    d.getUTCFullYear() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    "T" +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    "Z";

  return { startUtc: toStr(start), endUtc: toStr(end) };
}

export default function CalendarAddPage() {
  const [sp] = useSearchParams();
  const name = sp.get("name") ?? "Guest";
  const email = sp.get("email") ?? "";
  const date = sp.get("date")!; // YYYY-MM-DD
  const time = sp.get("time")!; // HH:mm
  const tz = sp.get("tz") ?? "America/New_York";
  const dur = Number(sp.get("dur") ?? 60);
  const phone = sp.get("phone") ?? "";

  const title = `Appointment with RenoMeta`;

  // Build UTC range for Google/Yahoo
  const startLocal = useMemo(() => {
    const [y, m, d] = date.split("-").map(Number);
    const [hh, mm] = time.split(":").map(Number);
    return new Date(Date.UTC(y, m - 1, d, hh, mm));
  }, [date, time]);

  const { startUtc, endUtc } = buildUtcRange(startLocal, dur);
  const details = encodeURIComponent(
    `Call with RenoMeta\nName: ${name}\nEmail: ${email}\nPhone: ${phone}`
  );
  const location = encodeURIComponent(`Phone: ${phone}`);

  const googleHref =
    `https://calendar.google.com/calendar/render?action=TEMPLATE` +
    `&text=${encodeURIComponent(title)}` +
    `&dates=${startUtc}/${endUtc}` +
    `&details=${details}` +
    `&location=${location}`;

  const outlookHref =
    `https://outlook.live.com/calendar/0/deeplink/compose` +
    `?subject=${encodeURIComponent(title)}` +
    `&body=${details}` +
    `&startdt=${date}T${time}` +
    `&enddt=${date}T${time}` +
    `&location=${location}`;

  const yahooHref =
    `https://calendar.yahoo.com/?v=60&view=d&type=20` +
    `&title=${encodeURIComponent(title)}` +
    `&st=${date.replace(/-/g, "")}T${time.replace(":", "")}00Z` +
    `&dur=0100` +
    `&desc=${details}&in_loc=${location}`;

  const icsHref = `/.netlify/functions/ics?name=${encodeURIComponent(
  name
)}&email=${encodeURIComponent(email)}&date=${encodeURIComponent(
  date
)}&time=${encodeURIComponent(time)}&tz=${encodeURIComponent(
  tz
)}&dur=${dur}&phone=${encodeURIComponent(phone)}`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-6">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="https://renometa.com/images/renometa-logo.png"
            alt="RenoMeta Logo"
            className="h-12"
          />
        </div>

        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          Add to Calendar
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          {title} • {date} at {time} ({tz})
        </p>

        <div className="grid grid-cols-2 gap-3">
          <a
            className="inline-block text-center rounded-lg px-4 py-3 font-medium bg-[#4285F4] text-white"
            href={googleHref}
          >
            Google
          </a>
          <a
            className="inline-block text-center rounded-lg px-4 py-3 font-medium bg-[#0078D4] text-white"
            href={outlookHref}
          >
            Outlook
          </a>
          <a
            className="inline-block text-center rounded-lg px-4 py-3 font-medium bg-[#720E9E] text-white"
            href={yahooHref}
          >
            Yahoo
          </a>
          <a
            className="inline-block text-center rounded-lg px-4 py-3 font-medium bg-gray-700 text-white"
            href={icsHref}
          >
            Apple (.ics)
          </a>
        </div>

        <a
          href={`/reschedule?appt_id=${encodeURIComponent(
            sp.get("appt_id") ?? ""
          )}`}
          className="mt-6 inline-block text-sm text-blue-700 underline"
        >
          🔁 Need to reschedule?
        </a>
      </div>
    </div>
  );
}
