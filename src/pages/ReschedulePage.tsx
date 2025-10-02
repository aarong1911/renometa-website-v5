import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

export default function ReschedulePage() {
  const [sp] = useSearchParams();

  const apptId = sp.get("appt_id") ?? "";
  const tz = sp.get("tz") ?? "America/New_York";

  // Current appointment details
  const [originalDate, setOriginalDate] = useState("");
  const [originalTime, setOriginalTime] = useState("");

  // Form state
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Slots
  const [takenSlots, setTakenSlots] = useState<string[]>([]);

  // Generate slots 08:00 → 18:00, 30min increments
  const timeSlots = useMemo(() => {
    const slots: string[] = [];
    for (let h = 8; h < 18; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hh = String(h).padStart(2, "0");
        const mm = String(m).padStart(2, "0");
        slots.push(`${hh}:${mm}`);
      }
    }
    return slots;
  }, []);

  // ✅ Fetch current appointment
  useEffect(() => {
    const fetchOriginal = async () => {
      if (!apptId) return;
      const { data, error } = await supabase
        .from("appointments")
        .select("appointment_date, appointment_time")
        .eq("id", apptId)
        .single();

      if (!error && data) {
        setOriginalDate(data.appointment_date);
        setOriginalTime(data.appointment_time);
        setDate(data.appointment_date);
        setTime(""); // force user to pick new time
      }
    };
    fetchOriginal();
  }, [apptId]);

  // ✅ Fetch taken slots for this date
  useEffect(() => {
    const fetchTaken = async () => {
      if (!date) return;
      const { data, error } = await supabase
        .from("appointments")
        .select("appointment_time,id")
        .eq("appointment_date", date);

      if (!error && data) {
        const filtered = data
          .filter((row) => row.id !== apptId) // exclude current appt
          .map((row) => row.appointment_time);
        setTakenSlots(filtered);
      }
    };
    fetchTaken();
  }, [date, apptId]);

  // ✅ Weekends check
  const isWeekend = (d: string) => {
    const day = new Date(d).getDay();
    return day === 0 || day === 6;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    if (isWeekend(newDate)) {
      alert("❌ Weekends cannot be selected. Please pick a weekday.");
      return;
    }
    setDate(newDate);
    setTime(""); // reset time
  };

  // ✅ Available slots
  const availableSlots = timeSlots.filter((slot) => {
    // Remove other users' taken slots
    if (takenSlots.includes(slot)) return false;
    // Remove original slot on original date
    if (date === originalDate && slot === originalTime) return false;

    // Apply 2h buffer if rescheduling for today
    const today = new Date().toISOString().split("T")[0];
    if (date === today) {
      const now = new Date();
      const [h, m] = slot.split(":").map(Number);
      const slotDate = new Date();
      slotDate.setHours(h, m, 0, 0);
      const minAllowed = new Date(now.getTime() + 2 * 60 * 60 * 1000);
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
    try {
      setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Round hour highlight
  const isRoundHour = (slot: string) => slot.endsWith(":00");

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
          {originalDate && originalTime
            ? `${originalDate} / ${originalTime}`
            : "-"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-1">New date</label>
            <input
              type="date"
              value={date}
              onChange={handleDateChange}
              className="w-full border rounded-lg px-3 py-2"
              min={new Date().toISOString().split("T")[0]} // block past dates
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
              {availableSlots.map((t) => (
                <option
                  key={t}
                  value={t}
                  style={
                    isRoundHour(t)
                      ? { backgroundColor: "rgba(59,130,246,0.1)" }
                      : {}
                  }
                >
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
            disabled={isSubmitting || !date || !time}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300"
          >
            {isSubmitting ? "Updating..." : "Update Appointment"}
          </button>
        </form>
      </div>
    </div>
  );
}
