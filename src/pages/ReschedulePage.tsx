import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Calendar } from "@/components/ui/Calendar";
import { Button } from "@/components/ui/button";

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

  // 🔹 Generate 30-min slots 08:00 → 18:00
  const generateSlots = (): string[] => {
    const slots: string[] = [];
    for (let h = 8; h < 18; h++) {
      for (let m of [0, 30]) {
        slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
      }
    }
    return slots;
  };

  const [allSlots] = useState<string[]>(generateSlots());

  // 🔹 Fetch taken slots for the selected date
  useEffect(() => {
    const fetchTaken = async () => {
      if (!date) return;

      const { data, error } = await supabase
        .from("appointments")
        .select("appointment_time,id")
        .eq("appointment_date", date);

      if (!error && data) {
        const filtered = data
          .filter((row) => row.id !== apptId) // exclude this appt
          .map((row) => row.appointment_time);
        setTakenSlots(filtered);
      } else {
        setTakenSlots([]);
      }
    };

    fetchTaken();
  }, [date, apptId]);

  // 🔹 Filter slots
  const availableSlots = allSlots.filter((slot) => {
    if (takenSlots.includes(slot)) return false;
    // hide the user’s current slot when rescheduling same date
    if (date === originalDate && slot === originalTime) return false;

    // 2-hour buffer if rescheduling today
    const today = new Date().toISOString().split("T")[0];
    if (date === today) {
      const [hh, mm] = slot.split(":").map(Number);
      const slotDate = new Date();
      slotDate.setHours(hh, mm, 0, 0);

      const minAllowed = new Date(Date.now() + 2 * 60 * 60 * 1000);
      if (slotDate <= minAllowed) return false;
    }
    return true;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apptId) return;

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
        alert("✅ Appointment rescheduled successfully!");
      } else {
        const err = await res.json();
        alert("❌ Error: " + err.error);
      }
    } catch {
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
        <p className="text-sm text-gray-500 mb-6">
          Current appt: {originalDate} / {originalTime}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-1">New date</label>
            <Calendar
              mode="single"
              selected={date ? new Date(date) : undefined}
              onSelect={(d) => setDate(d ? d.toISOString().split("T")[0] : "")}
              disabled={(day) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return (
                  day < today || // past dates
                  day.getDay() === 0 || // Sunday
                  day.getDay() === 6 // Saturday
                );
              }}
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
              disabled={availableSlots.length === 0}
            >
              <option value="">
                {availableSlots.length > 0 ? "Select a time" : "No slots available"}
              </option>
              {availableSlots.map((t) => (
                <option
                  key={t}
                  value={t}
                  style={
                    t.endsWith(":00")
                      ? { backgroundColor: "rgba(59,130,246,0.1)" }
                      : {}
                  }
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
              className="w-full border rounded-lg px-3 py-2 bg-gray-100"
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isSubmitting || !time || !date}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isSubmitting ? "Updating..." : "Update Appointment"}
          </Button>
        </form>
      </div>
    </div>
  );
}
