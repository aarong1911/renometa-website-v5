import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

export default function ReschedulePage() {
  const [sp] = useSearchParams();

  const apptId = sp.get("appt_id") ?? "";
  const tz = sp.get("tz") ?? "America/New_York";

  const [date, setDate] = useState(sp.get("date") ?? "");
  const [time, setTime] = useState(sp.get("time") ?? "");
  const [name, setName] = useState(sp.get("name") ?? "Unknown");

  // 🔹 Keep track of taken slots
  const [takenSlots, setTakenSlots] = useState<string[]>([]);

  // Fetch taken slots for this date
  useEffect(() => {
    const fetchTaken = async () => {
      if (!date) return;

      const { data, error } = await supabase
        .from("appointments")
        .select("appointment_time,id")
        .eq("appointment_date", date);

      if (!error && data) {
        // exclude this appointment’s current slot (so user can keep it)
        const filtered = data
          .filter((row) => row.id !== apptId)
          .map((row) => row.appointment_time);
        setTakenSlots(filtered);
      }
    };

    fetchTaken();
  }, [date, apptId]);

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

  // Same slot list as booking
  const timeSlots = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

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
        <p className="text-sm text-gray-500 mb-6">Name: {name}</p>

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
              {timeSlots
                .filter((slot) => !takenSlots.includes(slot)) // 🔹 filter taken slots
                .map((t) => (
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
