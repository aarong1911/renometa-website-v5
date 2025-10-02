import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export default function ReschedulePage() {
  const [sp] = useSearchParams();

  // Params from URL
  const apptId = sp.get("appt_id") ?? "";
  const tz = sp.get("tz") ?? "America/New_York";
  const originalDate = sp.get("date") ?? "";
  const originalTime = sp.get("time") ?? "";

  // State
  const [date, setDate] = useState(originalDate);
  const [time, setTime] = useState("");
  const [takenSlots, setTakenSlots] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Format current appt
  const formattedOriginalDate = originalDate
    ? format(new Date(originalDate), "MM/dd/yyyy")
    : "-";

  // Generate 30-min slots from 8:00 → 18:00
  const generateSlots = () => {
    const slots: string[] = [];
    for (let h = 8; h < 18; h++) {
      for (let m of [0, 30]) {
        slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
      }
    }
    return slots;
  };
  const allSlots = useMemo(() => generateSlots(), []);

  // Fetch taken slots for the selected date
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

  // 2-hour buffer cutoff if rescheduling today
  const today = new Date().toISOString().split("T")[0];
  const now = new Date();
  const cutoff = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  const cutoffStr = `${String(cutoff.getHours()).padStart(2, "0")}:${String(
    Math.ceil(cutoff.getMinutes() / 30) * 30
  ).padStart(2, "0")}`;

  // Available slots
  const availableSlots = allSlots.filter((slot) => {
    // hide taken slots
    if (takenSlots.includes(slot)) return false;

    // hide original slot when rescheduling same day
    if (date === originalDate && slot === originalTime) return false;

    // apply buffer for today
    if (date === today && slot <= cutoffStr) return false;

    return true;
  });

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apptId || !date || !time) return;

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
        alert(`✅ Rescheduled to ${date} at ${time}`);
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
          Current appt:{" "}
          <strong className="text-gray-900">
            {formattedOriginalDate} / {originalTime}
          </strong>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-1">New Date</label>
            <Calendar
              mode="single"
              selected={date ? new Date(date) : undefined}
              onSelect={(d) => setDate(d ? d.toISOString().split("T")[0] : "")}
              disabled={(day) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return (
                  day < today || // past
                  day.getDay() === 0 || // Sunday
                  day.getDay() === 6 // Saturday
                );
              }}
              className="rounded-md border"
            />
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium mb-1">New Time</label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              required
              disabled={availableSlots.length === 0}
            >
              <option value="">
                {availableSlots.length > 0
                  ? "Select a time"
                  : "No slots available"}
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
              value={tz.replace(/_/g, " ")}
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
