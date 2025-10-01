import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

// Generate all slots 08:00 → 18:00 in 30-min increments
const generateTimeSlots = (startHour: number, endHour: number): string[] => {
  const slots: string[] = [];
  for (let h = startHour; h < endHour; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hh = String(h).padStart(2, "0");
      const mm = String(m).padStart(2, "0");
      slots.push(`${hh}:${mm}`);
    }
  }
  return slots;
};

// Round-hour helper
const isRoundHour = (time: string) => time.endsWith(":00");

export default function ReschedulePage() {
  const [sp] = useSearchParams();

  // Params from URL
  const apptId = sp.get("appt_id") ?? "";
  const tz = sp.get("tz") ?? "America/New_York";
  const originalDate = sp.get("date") ?? "";
  const originalTime = sp.get("time") ?? "";

  const [date, setDate] = useState(originalDate);
  const [time, setTime] = useState("");
  const [takenSlots, setTakenSlots] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // All slots 08:00 → 18:00
  const timeSlots = generateTimeSlots(8, 18);

  // Fetch taken slots for this date
  useEffect(() => {
    const fetchTaken = async () => {
      if (!date) return;
      const { data, error } = await supabase
        .from("appointments")
        .select("appointment_time,id")
        .eq("appointment_date", date);

      if (!error && data) {
        const filtered = data
          .filter((row) => row.id !== apptId) // exclude this appointment id
          .map((row) => row.appointment_time);
        setTakenSlots(filtered);
      } else {
        setTakenSlots([]);
      }
    };
    fetchTaken();
  }, [date, apptId]);

  // Apply buffer + remove taken slots + remove original slot on same date
  const availableSlots = timeSlots.filter((slot) => {
    if (takenSlots.includes(slot)) return false;
    if (date === originalDate && slot === originalTime) return false;

    // 2h buffer if rescheduling today
    const today = new Date().toISOString().split("T")[0];
    if (date === today) {
      const [h, m] = slot.split(":").map(Number);
      const slotDate = new Date();
      slotDate.setHours(h, m, 0, 0);
      const minAllowed = new Date(new Date().getTime() + 2 * 60 * 60 * 1000);
      if (slotDate <= minAllowed) return false;
    }

    return true;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apptId) {
      alert("❌ Appointment ID missing.");
      return;
    }
    if (!date || !time) {
      alert("❌ Please select date and time.");
      return;
    }

    setIsSubmitting(true);
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
        alert(`✅ Appointment rescheduled to ${date} at ${time}`);
      } else {
        const err = await res.json();
        alert("❌ Error: " + err.error);
      }
    } catch (error) {
      alert("❌ Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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

        {/* ✅ Show current appt */}
        <p className="text-sm text-gray-500 mb-6">
          Current appt:{" "}
          {originalDate && originalTime ? (
            <strong>{originalDate} / {originalTime}</strong>
          ) : (
            "-"
          )}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-1">New date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium mb-1">New time</label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800"
              required
            >
              <option value="">Select a time</option>
              {availableSlots.map((t) => (
                <option
                  key={t}
                  value={t}
                  style={isRoundHour(t) ? { backgroundColor: "rgba(59,130,246,0.1)" } : {}}
                >
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
              className="w-full border rounded-lg px-3 py-2 bg-gray-100 text-gray-600"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || !time}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Updating..." : "Update Appointment"}
          </button>
        </form>
      </div>
    </div>
  );
}
