import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

export default function ReschedulePage() {
  const [sp] = useSearchParams();

  const apptId = sp.get("appt_id") ?? "";
  const tz = sp.get("tz") ?? "America/New_York";

  const originalDate = sp.get("date") ?? "";
  const originalTime = sp.get("time") ?? "";

  const [date, setDate] = useState(originalDate);
  const [time, setTime] = useState("");
  const [takenSlots, setTakenSlots] = useState<string[]>([]);

  // Generate 30-min slots 08:00–18:00
  const generateTimeSlots = () => {
    const slots: string[] = [];
    for (let h = 8; h < 18; h++) {
      for (let m = 0; m < 60; m += 30) {
        slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
      }
    }
    return slots;
  };
  const timeSlots = generateTimeSlots();

  // Fetch taken slots for this date (exclude this appt’s slot)
  useEffect(() => {
    const fetchTaken = async () => {
      if (!date) return;
      const { data, error } = await supabase
        .from("appointments")
        .select("appointment_time,id")
        .eq("appointment_date", date);

      if (!error && data) {
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

  // Build available slots
  const availableSlots = timeSlots.filter((slot) => {
    // Exclude taken slots
    if (takenSlots.includes(slot)) return false;
    // Exclude original slot if rescheduling on same date
    if (date === originalDate && slot === originalTime) return false;
    // 2-hour buffer for today
    const today = new Date().toISOString().split("T")[0];
    if (date === today) {
      const [h, m] = slot.split(":").map(Number);
      const slotDate = new Date();
      slotDate.setHours(h, m, 0, 0);
      const minAllowed = new Date(Date.now() + 2 * 60 * 60 * 1000);
      if (slotDate <= minAllowed) return false;
    }
    return true;
  });

  // Disable weekends + past dates
  const todayDate = new Date().toISOString().split("T")[0];
  const isWeekend = (d: string) => {
    const day = new Date(d).getDay();
    return day === 0 || day === 6;
  };

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

        {/* Current Appointment */}
        <p className="text-sm text-gray-500 mb-6">
          Current appt:{" "}
          <strong className="text-gray-900">
            {originalDate && originalTime ? `${originalDate} / ${originalTime}` : "-"}
          </strong>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-1">New date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={todayDate}
              className="w-full border rounded-lg px-3 py-2"
              required
              onKeyDown={(e) => e.preventDefault()} // block typing
            />
            {date && isWeekend(date) && (
              <p className="text-xs text-red-500 mt-1">
                Weekends cannot be selected.
              </p>
            )}
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium mb-1">New time</label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              required
              disabled={availableSlots.length === 0 || isWeekend(date)}
            >
              <option value="">Select a time</option>
              {availableSlots.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Timezone */}
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
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300"
            disabled={!date || !time || isWeekend(date)}
          >
            Update Appointment
          </button>
        </form>
      </div>
    </div>
  );
}
