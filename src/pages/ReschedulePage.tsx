import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Calendar } from "@/components/ui/calendar";
import { DayPicker } from "react-day-picker";

export default function ReschedulePage() {
  const [sp] = useSearchParams();

  const apptId = sp.get("appt_id") ?? "";
  const tz = sp.get("tz") ?? "America/New_York";
  const originalDate = sp.get("date") ?? "";
  const originalTime = sp.get("time") ?? "";

  const [date, setDate] = useState<Date | undefined>(
    originalDate ? new Date(originalDate) : undefined
  );
  const [time, setTime] = useState(originalTime ?? "");
  const [takenSlots, setTakenSlots] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // fetch taken slots for selected date
  useEffect(() => {
    const fetchTaken = async () => {
      if (!date) return;
      const isoDate = date.toISOString().split("T")[0];

      const { data, error } = await supabase
        .from("appointments")
        .select("appointment_time,id")
        .eq("appointment_date", isoDate);

      if (!error && data) {
        const filtered = data
          .filter((row) => row.id !== apptId) // exclude current appt
          .map((row) => row.appointment_time);
        setTakenSlots(filtered);
      }
    };

    fetchTaken();
  }, [date, apptId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/.netlify/functions/reschedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appt_id: apptId,
          date: date.toISOString().split("T")[0],
          time,
          tz,
          status: "rescheduled",
        }),
      });

      if (res.ok) {
        alert("✅ Appointment rescheduled!");
      } else {
        const err = await res.json();
        alert("❌ Error: " + err.error);
      }
    } catch (err) {
      alert("❌ Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // slot generator with 30min increments
  const timeSlots: string[] = [];
  for (let h = 8; h < 18; h++) {
    for (let m of [0, 30]) {
      timeSlots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }
  }

  const availableSlots = timeSlots.filter(
    (slot) => !takenSlots.includes(slot) && !(slot === originalTime && date?.toISOString().split("T")[0] === originalDate)
  );

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
        <p className="text-sm text-gray-500 mb-6">
          Current appt: {originalDate} / {originalTime}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Calendar */}
          <div>
            <label className="block text-sm font-medium mb-1">New date</label>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={[
                { before: new Date() }, // past dates
                (d) => d.getDay() === 0 || d.getDay() === 6, // weekends
              ]}
              className="rounded-md border"
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
              disabled={!date}
            >
              <option value="">Select a time</option>
              {availableSlots.map((t) => (
                <option key={t} value={t} style={t.endsWith(":00") ? { background: "rgba(59,130,246,0.1)" } : {}}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Time zone */}
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
            disabled={!date || !time || isSubmitting}
            className={`w-full py-2 px-4 rounded-lg font-medium transition duration-150 ${
              !date || !time || isSubmitting
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Updating..." : "Update Appointment"}
          </button>
        </form>
      </div>
    </div>
  );
}
