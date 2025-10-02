import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Calendar } from "@/components/ui/calendar";

export default function ReschedulePage() {
  const [sp] = useSearchParams();

  const apptId = sp.get("appt_id") ?? "";
  const tz = sp.get("tz") ?? "America/New_York";

  const originalDate = sp.get("date") ?? "";
  const originalTime = sp.get("time") ?? "";

  const [date, setDate] = useState(originalDate);
  const [time, setTime] = useState("");
  const [takenSlots, setTakenSlots] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch taken slots (excluding this appointment)
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

  // Generate slots (08:00–18:00, 30-min increments)
  const generateSlots = () => {
    const slots: string[] = [];
    for (let h = 8; h < 18; h++) {
      for (let m of [0, 30]) {
        slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
      }
    }
    return slots;
  };

  const timeSlots = generateSlots();

  // Filter: remove taken slots & current appt slot (on same date)
  const availableSlots = timeSlots.filter(
    (slot) =>
      !takenSlots.includes(slot) &&
      !(date === originalDate && slot === originalTime)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apptId) return;

    setIsSubmitting(true);
    try {
      await fetch("/.netlify/functions/reschedule", {
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
      alert("✅ Appointment updated");
    } catch {
      alert("❌ Error updating appointment");
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

        {/* Current appointment */}
        <p className="text-sm text-gray-500 mb-6">
          Current appt:{" "}
          {originalDate && originalTime ? `${originalDate} / ${originalTime}` : "-"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Calendar */}
          <div>
            <label className="block text-sm font-medium mb-1">New date</label>
            <Calendar
              mode="single"
              selected={date ? new Date(date) : undefined}
              onSelect={(d) => d && setDate(d.toISOString().split("T")[0])}
              disabled={(d) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const isPast = d < today;
                const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                return isPast || isWeekend;
              }}
              classNames={{
                day: ({ date: d }) =>
                  d.getDay() === 0 || d.getDay() === 6
                    ? "text-gray-400 opacity-50 pointer-events-none"
                    : "",
              }}
              showOutsideDays
            />
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium mb-1">New time</label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">Select a time</option>
              {availableSlots.map((slot) => (
                <option
                  key={slot}
                  value={slot}
                  style={slot.endsWith(":00") ? { backgroundColor: "rgba(59,130,246,0.1)" } : {}}
                >
                  {slot}
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
            disabled={isSubmitting || !date || !time}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Updating..." : "Update Appointment"}
          </button>
        </form>
      </div>
    </div>
  );
}
