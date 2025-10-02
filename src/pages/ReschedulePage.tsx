import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

export default function ReschedulePage() {
  const [sp] = useSearchParams();
  const apptId = sp.get("appt_id") ?? "";
  const tz = sp.get("tz") ?? "America/New_York";
  const originalDate = sp.get("date") ?? "";
  const originalTime = sp.get("time") ?? "";

  const [date, setDate] = useState<Date | undefined>(
    originalDate ? new Date(originalDate) : undefined
  );
  const [time, setTime] = useState("");
  const [takenSlots, setTakenSlots] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🔹 Generate 30-min slots (08:00 → 18:00)
  const timeSlots = useMemo(() => {
    const slots: string[] = [];
    for (let h = 8; h < 18; h++) {
      for (let m of [0, 30]) {
        slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
      }
    }
    return slots;
  }, []);

  // 🔹 Fetch taken slots for selected date
  useEffect(() => {
    if (!date) return;
    const fetchTaken = async () => {
      const dateStr = format(date, "yyyy-MM-dd");
      const { data, error } = await supabase
        .from("appointments")
        .select("appointment_time,id")
        .eq("appointment_date", dateStr);

      if (!error && data) {
        const filtered = data
          .filter((row) => row.id !== apptId)
          .map((row) => row.appointment_time);
        setTakenSlots(filtered);
      } else {
        setTakenSlots([]);
      }
    };
    fetchTaken();
  }, [date, apptId]);

  // 🔹 Available slots logic
  const availableSlots = useMemo(() => {
    if (!date) return [];
    const dateStr = format(date, "yyyy-MM-dd");

    return timeSlots.filter((slot) => {
      if (takenSlots.includes(slot)) return false;
      if (dateStr === originalDate && slot === originalTime) return false;

      // 2-hour buffer if rescheduling today
      const todayStr = format(new Date(), "yyyy-MM-dd");
      if (dateStr === todayStr) {
        const [hh, mm] = slot.split(":").map(Number);
        const slotDate = new Date();
        slotDate.setHours(hh, mm, 0, 0);

        const minAllowed = new Date(Date.now() + 2 * 60 * 60 * 1000);
        if (slotDate <= minAllowed) return false;
      }
      return true;
    });
  }, [timeSlots, takenSlots, date, originalDate, originalTime]);

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
          date: format(date, "yyyy-MM-dd"),
          time,
          tz,
          status: "rescheduled",
        }),
      });

      if (!res.ok) throw new Error("❌ Failed to reschedule");
      alert("✅ Appointment rescheduled!");
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

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
          Reschedule Appointment
        </h1>
        <p className="text-sm text-gray-500 mb-6 border-b pb-4">
          Current appt:{" "}
          <strong>
            {originalDate || "-"} {originalTime && `at ${originalTime}`}
          </strong>{" "}
          (Timezone: {tz})
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Date */}
          <div>
            <label className="block text-sm font-medium mb-1">New Date</label>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              defaultMonth={date || new Date()}
              captionLayout="dropdown"
              disabled={(d) => d < today || d.getDay() === 0 || d.getDay() === 6}
              className="rounded-md border bg-white w-full"
            />
          </div>

          {/* New Time */}
          <div>
            <label className="block text-sm font-medium mb-1">New Time</label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              disabled={!date || availableSlots.length === 0}
              className="w-full border rounded-lg px-3 py-2"
              required
            >
              <option value="">
                {availableSlots.length > 0
                  ? "Select a new time"
                  : "No slots available"}
              </option>
              {availableSlots.map((t) => (
                <option
                  key={t}
                  value={t}
                  className={t.endsWith(":00") ? "font-medium" : ""}
                >
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Timezone */}
          <div>
            <label className="block text-sm font-medium mb-1">Time Zone</label>
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
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isSubmitting ? "Updating..." : "Update Appointment"}
          </button>
        </form>
      </div>
    </div>
  );
}
