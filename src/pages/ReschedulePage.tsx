import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
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
  const [time, setTime] = useState(originalTime);
  const [takenSlots, setTakenSlots] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate 30-min slots 08:00–18:00
  const generateSlots = () => {
    const slots: string[] = [];
    for (let h = 8; h < 18; h++) {
      for (let m = 0; m < 60; m += 30) {
        slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
      }
    }
    return slots;
  };
  const timeSlots = generateSlots();

  // Fetch taken slots
  useEffect(() => {
    const fetchSlots = async () => {
      if (!date) return;
      const dateStr = date.toISOString().split("T")[0];

      const { data, error } = await supabase
        .from("appointments")
        .select("id, appointment_time")
        .eq("appointment_date", dateStr);

      if (!error && data) {
        const filtered = data
          .filter((row) => row.id !== apptId)
          .map((row) => row.appointment_time.slice(0, 5));
        setTakenSlots(filtered);
      }
    };
    fetchSlots();
  }, [date, apptId]);

  // Filter available slots
  const availableSlots = timeSlots.filter((slot) => {
    if (!date) return false;

    const today = new Date();
    const dateStr = date.toISOString().split("T")[0];

    if (takenSlots.includes(slot)) return false;
    if (dateStr === originalDate && slot === originalTime) return false;

    if (date.toDateString() === today.toDateString()) {
      const [h, m] = slot.split(":").map(Number);
      const slotTime = new Date(today);
      slotTime.setHours(h, m, 0, 0);
      const minAllowed = new Date(today.getTime() + 2 * 60 * 60 * 1000);
      if (slotTime <= minAllowed) return false;
    }

    return true;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time || !apptId) return;

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
      alert("❌ Network error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-6">
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
          {originalDate && originalTime ? `${originalDate} / ${originalTime}` : "-"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date Picker */}
          <div>
            <label className="block text-sm font-medium mb-1">New date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${
                    !date && "text-muted-foreground"
                  }`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "MM/dd/yyyy") : <span>Select a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(day) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return day < today || day.getDay() === 0 || day.getDay() === 6;
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
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
                  style={t.endsWith(":00") ? { backgroundColor: "rgba(59,130,246,0.1)" } : {}}
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
            disabled={!date || !time || isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium"
          >
            {isSubmitting ? "Updating..." : "Update Appointment"}
          </Button>
        </form>
      </div>
    </div>
  );
}
