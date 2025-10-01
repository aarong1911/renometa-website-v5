import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Calendar } from "@/components/ui/calendar"; // shadcn/ui Calendar
import { cn } from "@/lib/utils"; // utility for classNames

// Generate slots between 08:00 and 18:00 with 30-minute increments
const generateTimeSlots = (startHour: number, endHour: number): string[] => {
  const slots: string[] = [];
  for (let h = startHour; h < endHour; h++) {
    for (let m = 0; m < 60; m += 30) {
      slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }
  }
  return slots;
};

// Round hours helper (for dropdown highlight)
const isRoundHour = (time: string) => time.endsWith(":00");

export default function ReschedulePage() {
  const [sp] = useSearchParams();

  const apptId = sp.get("appt_id") ?? "";
  const tz = sp.get("tz") ?? "America/New_York";
  const originalTime = sp.get("time") ?? "";
  const originalDate = sp.get("date") ?? "";

  const [date, setDate] = useState<Date | undefined>(
    originalDate ? new Date(originalDate) : undefined
  );
  const [time, setTime] = useState(originalTime);
  const [takenSlots, setTakenSlots] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Fetch taken slots for this date (excluding current apptId)
  useEffect(() => {
    const fetchTaken = async () => {
      if (!date) return;

      const dateStr = date.toISOString().split("T")[0];

      const { data, error } = await supabase
        .from("appointments")
        .select("id, appointment_time")
        .eq("appointment_date", dateStr);

      if (error) {
        console.error("❌ Supabase error:", error.message);
        return setTakenSlots([]);
      }

      const filtered = (data ?? [])
        .filter((row) => row.id !== apptId)
        .map((row) => row.appointment_time);

      setTakenSlots(filtered);
    };

    fetchTaken();
  }, [date, apptId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date) {
      setMessage({ type: "error", text: "Please pick a date." });
      return;
    }
    if (!time) {
      setMessage({ type: "error", text: "Please select a new time." });
      return;
    }

    const newDateStr = date.toISOString().split("T")[0];
    if (newDateStr === originalDate && time === originalTime) {
      setMessage({ type: "error", text: "Please choose a different time or date." });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      // TODO: Replace with real update API call
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setMessage({
        type: "success",
        text: `✅ Appointment rescheduled to ${newDateStr} at ${time}`,
      });
    } catch {
      setMessage({ type: "error", text: "❌ Could not update. Try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const allSlots = generateTimeSlots(8, 18);
  const newDateStr = date ? date.toISOString().split("T")[0] : "";
  const isViewingOriginalDate = newDateStr === originalDate;

  const availableSlots = allSlots
    .filter((slot) => !takenSlots.includes(slot))
    .filter((slot) => !(isViewingOriginalDate && slot === originalTime));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-6">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="https://placehold.co/150x40/000000/ffffff/png?text=RenoMeta+Logo"
            alt="RenoMeta Logo"
            className="h-12"
          />
        </div>

        <h1 className="text-xl font-semibold text-gray-900 mb-4">Reschedule Appointment</h1>
        <p className="text-sm text-gray-500 mb-6">
          Current appt:{" "}
          <strong className="text-gray-900">{originalDate}</strong> /{" "}
          <strong className="text-gray-900">{originalTime}</strong> ({tz.replace(/_/g, " ")})
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
          {/* Calendar Date Picker */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">New date</label>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border shadow-sm"
              disabled={(day) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return day < today || day.getDay() === 0 || day.getDay() === 6;
              }}
            />
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">New time</label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              disabled={availableSlots.length === 0 || !date}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 disabled:bg-gray-50 disabled:text-gray-500"
              required
            >
              <option value="">
                {availableSlots.length === 0
                  ? "No slots available"
                  : "Select a time"}
              </option>
              {availableSlots.map((slot) => (
                <option
                  key={slot}
                  value={slot}
                  style={
                    isRoundHour(slot)
                      ? { backgroundColor: "rgba(59, 130, 246, 0.1)" }
                      : {}
                  }
                >
                  {slot}
                </option>
              ))}
            </select>
          </div>

          {/* Timezone */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Time zone</label>
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
            disabled={
              isSubmitting ||
              availableSlots.length === 0 ||
              !time ||
              (newDateStr === originalDate && time === originalTime)
            }
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Updating..." : "Update Appointment"}
          </button>
        </form>
      </div>
    </div>
  );
}
