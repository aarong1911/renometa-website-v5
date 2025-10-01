import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function ReschedulePage() {
  const [sp] = useSearchParams();

  const apptId = sp.get("appt_id") ?? "";
  const tz = sp.get("tz") ?? "America/New_York";

  const originalDate = sp.get("date") ?? "";
  const originalTime = sp.get("time") ?? "";

  const [date, setDate] = useState<Date | null>(
    originalDate ? new Date(originalDate) : null
  );
  const [time, setTime] = useState("");
  const [takenSlots, setTakenSlots] = useState<string[]>([]);

  // Generate 30-minute slots 08:00–18:00
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

  // Fetch taken slots for this date (exclude this appt’s current slot)
  useEffect(() => {
    const fetchTaken = async () => {
      if (!date) return;
      const dateStr = date.toISOString().split("T")[0];
      const { data, error } = await supabase
        .from("appointments")
        .select("appointment_time,id")
        .eq("appointment_date", dateStr);

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
    if (!date || !time) {
      alert("❌ Pick a valid date and time.");
      return;
    }

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
        alert("✅ Appointment rescheduled successfully!");
      } else {
        const err = await res.json();
        alert("❌ Error: " + err.error);
      }
    } catch (error) {
      alert("❌ Network error. Please try again.");
    }
  };

  // Available slots
  const availableSlots = timeSlots.filter((slot) => {
    if (!date) return false;
    const dateStr = date.toISOString().split("T")[0];

    // exclude taken slots
    if (takenSlots.includes(slot)) return false;

    // exclude original slot if same date
    if (dateStr === originalDate && slot === originalTime) return false;

    // 2-hour buffer for today
    const todayStr = new Date().toISOString().split("T")[0];
    if (dateStr === todayStr) {
      const [h, m] = slot.split(":").map(Number);
      const slotDate = new Date();
      slotDate.setHours(h, m, 0, 0);
      const minAllowed = new Date(Date.now() + 2 * 60 * 60 * 1000);
      if (slotDate <= minAllowed) return false;
    }

    return true;
  });

  // Disable weekends and past dates
  const filterDate = (d: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const day = d.getDay();
    return d >= today && day !== 0 && day !== 6;
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
            {originalDate && originalTime ? `${originalDate} / ${originalTime}` : "-"}
          </strong>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-1">New date</label>
            <DatePicker
              selected={date}
              onChange={(d) => setDate(d)}
              filterDate={filterDate}
              dateFormat="yyyy-MM-dd"
              className="w-full border rounded-lg px-3 py-2"
              placeholderText="Select a date"
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
              disabled={!date || availableSlots.length === 0}
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
            disabled={!date || !time}
          >
            Update Appointment
          </button>
        </form>
      </div>
    </div>
  );
}
