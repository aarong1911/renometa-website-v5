import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { supabase } from "@/lib/supabaseClient";

// Generate slots from 08:00 → 18:00, every 30 min
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

// Light blue background for full hours (:00)
const isRoundHour = (time: string) => time.endsWith(":00");

export default function ReschedulePage() {
  const [sp] = useSearchParams();

  // Original appt details from URL
  const apptId = sp.get("appt_id") ?? "";
  const tz = sp.get("tz") ?? "America/New_York";
  const originalTime = sp.get("time") ?? "";
  const originalDate = sp.get("date") ?? "";

  // State
  const [date, setDate] = useState<Date | null>(
    originalDate ? new Date(originalDate) : null
  );
  const [time, setTime] = useState(originalTime);
  const [takenSlots, setTakenSlots] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Fetch taken slots for selected date (excluding current apptId)
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
      } else {
        setTakenSlots([]);
      }
    };
    fetchTaken();
  }, [date, apptId]);

  const timeSlots = generateTimeSlots(8, 18);

  // Final available slots
  const availableSlots = timeSlots
    .filter((slot) => !takenSlots.includes(slot))
    .filter((slot) => !(originalDate && date?.toISOString().split("T")[0] === originalDate && slot === originalTime));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !time) {
      setMessage({ type: "error", text: "Please select a date and time." });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      // TODO: Replace with real API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setMessage({
        type: "success",
        text: `✅ Appointment rescheduled to ${date.toISOString().split("T")[0]} at ${time}`,
      });
    } catch {
      setMessage({ type: "error", text: "❌ Error updating appointment." });
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
            src="/images/renometa-logo.png"
            alt="RenoMeta Logo"
            className="h-12"
          />
        </div>

        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          Reschedule Appointment
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Current appt:{" "}
          <strong className="text-gray-900">
            {originalDate || "-"} / {originalTime || "-"}
          </strong>{" "}
          ({tz.replace(/_/g, " ")})
        </p>

        {message && (
          <div
            className={`p-3 rounded-lg text-sm mb-4 ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date Picker */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              New date
            </label>
            <DatePicker
              selected={date}
              onChange={(d) => {
                setDate(d);
                setTime(""); // reset time when changing date
              }}
              minDate={new Date()} // No past dates
              filterDate={(d) => d.getDay() !== 0 && d.getDay() !== 6} // No weekends
              dateFormat="yyyy-MM-dd"
              className="w-full border rounded-lg px-3 py-2 text-gray-800 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Time Picker */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              New time
            </label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
              required
              disabled={availableSlots.length === 0}
            >
              <option value="">
                {availableSlots.length === 0
                  ? "No slots available"
                  : "Select a new time"}
              </option>
              {availableSlots.map((t) => (
                <option
                  key={t}
                  value={t}
                  style={isRoundHour(t) ? { backgroundColor: "rgba(59, 130, 246, 0.1)" } : {}}
                >
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Timezone */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Time zone
            </label>
            <input
              type="text"
              value={tz.replace(/_/g, " ")}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || !date || !time}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Updating..." : "Update Appointment"}
          </button>
        </form>
      </div>
    </div>
  );
}
