import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { supabase } from "@/lib/supabaseClient";

// Map long TZ names to short versions
const tzMap: Record<string, string> = {
  "America/New_York": "EST",
  "America/Chicago": "CST",
  "America/Denver": "MST",
  "America/Los_Angeles": "PST",
};

const generateTimeSlots = () => {
  const slots: string[] = [];
  for (let h = 8; h < 18; h++) {
    for (let m of [0, 30]) {
      slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }
  }
  return slots;
};

export default function ReschedulePage() {
  const [sp] = useSearchParams();
  const apptId = sp.get("appt_id") ?? "";
  const tz = sp.get("tz") ?? "America/New_York";

  const [currentAppt, setCurrentAppt] = useState<{ date: string; time: string } | null>(null);
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState("");
  const [takenSlots, setTakenSlots] = useState<string[]>([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const allSlots = useMemo(() => generateTimeSlots(), []);

  // Fetch current appointment
  useEffect(() => {
    const fetchAppt = async () => {
      const { data } = await supabase
        .from("appointments")
        .select("appointment_date, appointment_time")
        .eq("id", apptId)
        .single();

      if (data) {
        setCurrentAppt({ date: data.appointment_date, time: data.appointment_time });
      }
    };
    if (apptId) fetchAppt();
  }, [apptId]);

  // Fetch taken slots for selected date
  useEffect(() => {
    const fetchSlots = async () => {
      if (!date) return;
      const dateStr = format(date, "yyyy-MM-dd");

      const { data } = await supabase
        .from("appointments")
        .select("appointment_time,id")
        .eq("appointment_date", dateStr);

      if (data) {
        const filtered = data
          .filter((row) => row.id !== apptId) // exclude current appt
          .map((row) => row.appointment_time);
        setTakenSlots(filtered);
      }
    };
    fetchSlots();
  }, [date, apptId]);

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const cutoffTime = useMemo(() => {
    if (!date || format(date, "yyyy-MM-dd") !== todayStr) return "00:00";
    const now = new Date();
    now.setMinutes(now.getMinutes() + 120); // +2 hours
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = now.getMinutes() < 30 ? "30" : "00";
    return `${hh}:${mm}`;
  }, [date, todayStr]);

  // Filter available slots
  const availableSlots = allSlots.filter((slot) => {
    if (!date) return false;
    const dateStr = format(date, "yyyy-MM-dd");

    // Remove taken slots
    if (takenSlots.includes(slot)) return false;

    // Remove original appt slot if rescheduling same date
    if (currentAppt && dateStr === currentAppt.date && slot === currentAppt.time) return false;

    // Apply buffer for today
    if (dateStr === todayStr && slot <= cutoffTime) return false;

    return true;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) return;

    await fetch("/.netlify/functions/reschedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        appt_id: apptId,
        date: format(date, "yyyy-MM-dd"),
        time,
        tz,
      }),
    });

    alert("✅ Appointment rescheduled successfully!");
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

        <h1 className="text-xl font-semibold text-gray-900 mb-4">Reschedule Appointment</h1>
        <p className="text-sm text-gray-500 mb-6">
          Current Appt:{" "}
          {currentAppt ? (
            <>
              {format(new Date(currentAppt.date), "MM/dd/yyyy")} at {currentAppt.time} ({tzMap[tz] || tz})
            </>
          ) : (
            "Loading..."
          )}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date Dropdown */}
          <div>
            <label className="block text-sm font-medium mb-1">New date</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                className="w-full border rounded-lg px-3 py-2 flex justify-between items-center"
              >
                {date ? format(date, "MM/dd/yyyy") : "Select a date"}
                <CalendarIcon className="h-4 w-4 text-gray-500" />
              </button>

              {isCalendarOpen && (
                <div className="absolute z-50 mt-2 bg-white border rounded-lg shadow-lg">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => {
                      setDate(d);
                      setIsCalendarOpen(false);
                    }}
                    disabled={(day) =>
                      day < new Date(new Date().setHours(0, 0, 0, 0)) ||
                      day.getDay() === 0 ||
                      day.getDay() === 6
                    }
                    initialFocus
                  />
                </div>
              )}
            </div>
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
              value={tzMap[tz] || tz}
              readOnly
              className="w-full border rounded-lg px-3 py-2 bg-gray-100"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700"
          >
            Update Appointment
          </button>
        </form>
      </div>
    </div>
  );
}
