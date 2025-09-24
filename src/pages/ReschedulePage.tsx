import { useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function ReschedulePage() {
  const [sp] = useSearchParams();

  // Query params from email link
  const apptId = sp.get("appt_id") ?? "";
  const tz = sp.get("tz") ?? "America/New_York";

  // Prefill values if passed
  const [date, setDate] = useState(sp.get("date") ?? "");
  const [time, setTime] = useState(sp.get("time") ?? "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!apptId) {
      alert("❌ Appointment ID missing.");
      return;
    }

    try {
      const res = await fetch("/.netlify/functions/reschedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appt_id: apptId,
          date,
          time,
          tz,
          status: "rescheduled",
        }),
      });

      if (res.ok) {
        alert("✅ Appointment rescheduled successfully!");
      } else {
        const err = await res.json();
        alert("❌ Error: " + err.error);
      }
    } catch (error) {
      alert("❌ Network error. Please try again.");
    }
  };

  // Build dropdown options (8:00 → 17:00, every 30 min)
  const timeOptions: string[] = [];
  for (let h = 8; h <= 17; h++) {
    for (let m of [0, 30]) {
      if (h === 17 && m > 0) continue; // no 5:30
      const hh = h.toString().padStart(2, "0");
      const mm = m.toString().padStart(2, "0");
      timeOptions.push(`${hh}:${mm}`);
    }
  }

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

        <h1 className="text-xl font-semibold text-gray-900 mb-4">
          Reschedule Appointment
        </h1>
        <p className="text-sm text-gray-500 mb-6">Appointment ID: {apptId}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-1">New date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium mb-1">New time</label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              required
            >
              <option value="">Select a time</option>
              {timeOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Timezone (read-only) */}
          <div>
            <label className="block text-sm font-medium mb-1">Time zone</label>
            <input
              type="text"
              value={tz}
              readOnly
              className="w-full border rounded-lg px-3 py-2 bg-gray-100"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700"
          >
            Update Appointment
          </button>
        </form>
      </div>
    </div>
  );
}
