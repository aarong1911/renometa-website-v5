import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Calendar as CalendarIcon, X, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import { createClient } from "@supabase/supabase-js";

// --- Supabase Setup ---
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- Helpers ---
const generateTimeSlots = (startHour: number, endHour: number): string[] => {
  const slots: string[] = [];
  for (let h = startHour; h < endHour; h++) {
    for (let m of [0, 30]) {
      slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }
  }
  return slots;
};
const isRoundHour = (timeSlot: string): boolean => timeSlot.endsWith(":00");
const formatDate = (dateObj: Date): string => format(dateObj, "yyyy-MM-dd");
const parseDate = (dateString: string): Date => {
  const [y, m, d] = dateString.split("-").map(Number);
  return new Date(y, m - 1, d);
};

// --- Button ---
const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "outline" | "default" }
> = ({ className, variant = "default", children, ...props }) => {
  const base =
    variant === "outline"
      ? "border border-gray-300 bg-white hover:bg-gray-100"
      : "bg-blue-600 text-white hover:bg-blue-700";
  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg text-sm font-medium px-3 py-2 w-full transition-colors disabled:opacity-50 disabled:pointer-events-none ${base} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// --- Calendar ---
function Calendar(props: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays
      className="p-2"
      classNames={{
        months: "flex flex-col space-y-2",
        caption: "flex justify-center pt-1 relative items-center",
        nav: "space-x-1 flex items-center",
        nav_button: "h-6 w-6 border rounded bg-transparent opacity-50 hover:opacity-100",
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-gray-500 rounded-md w-7 font-normal text-[0.7rem]",
        row: "flex w-full mt-1",
        cell: "h-7 w-7 text-center text-xs p-0 relative",
        day: "h-7 w-7 p-0 font-medium hover:bg-gray-200 rounded",
        day_selected: "bg-blue-600 text-white rounded",
        day_today: "border border-blue-500 text-blue-600 font-bold",
        day_outside: "text-gray-400 opacity-60",
        day_disabled: "text-gray-400 opacity-60 pointer-events-none line-through",
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-3 w-3" />,
        IconRight: () => <ChevronRight className="h-3 w-3" />,
      }}
      {...props}
    />
  );
}

// --- Main ---
export default function ReschedulePage() {
  const [sp] = useSearchParams();

  const apptId = sp.get("appt_id") ?? "";
  const tz = sp.get("tz") ?? "America/New_York";
  const originalDateStr = sp.get("date") ?? formatDate(new Date());
  const originalTime = sp.get("time") ?? "10:00";

  const [selectedDateObj, setSelectedDateObj] = useState<Date | undefined>(
    parseDate(originalDateStr)
  );
  const [time, setTime] = useState("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [takenSlots, setTakenSlots] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const todayStr = formatDate(new Date());
  const dateStr = selectedDateObj ? formatDate(selectedDateObj) : "";

  // --- Fetch taken slots from Supabase ---
  useEffect(() => {
    const fetchTaken = async () => {
      if (!dateStr) return;
      const { data, error } = await supabase
        .from("appointments")
        .select("appointment_time,id")
        .eq("appointment_date", dateStr);

      if (error) {
        console.error("Supabase error:", error);
        setTakenSlots([]);
        return;
      }
      const filtered = (data ?? [])
        .filter((row: any) => row.id !== apptId) // exclude current appointment
        .map((row: any) => row.appointment_time);
      setTakenSlots(filtered);
    };
    fetchTaken();
  }, [dateStr, apptId]);

  // --- Slots ---
  const timeSlots = useMemo(() => generateTimeSlots(8, 18), []);
  const getTodayCutoffTime = () => {
    const now = new Date();
    const cutoff = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const h = cutoff.getHours();
    let m = Math.ceil(cutoff.getMinutes() / 30) * 30;
    let hh = h;
    if (m >= 60) {
      m = 0;
      hh++;
    }
    if (hh < 8) return "08:00";
    if (hh >= 18) return "18:00";
    return `${String(hh).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };
  const isToday = dateStr === todayStr;
  const cutoff = isToday ? getTodayCutoffTime() : "00:00";

  const availableSlots = useMemo(() => {
    if (!selectedDateObj) return [];
    return timeSlots
      .filter((slot) => !(dateStr === originalDateStr && slot === originalTime))
      .filter((slot) => !takenSlots.includes(slot))
      .filter((slot) => !isToday || slot > cutoff);
  }, [timeSlots, dateStr, originalDateStr, originalTime, takenSlots, isToday, cutoff, selectedDateObj]);

  // --- Submit ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dateStr || !time) return;
    setIsSubmitting(true);
    try {
      await fetch("/api/reschedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId: apptId, newDate: dateStr, newTime: time, tz }),
      });
      alert("✅ Appointment rescheduled.");
    } catch {
      alert("❌ Failed to reschedule.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8 font-inter">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
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

        {/* Current Appointment */}
        <p className="text-sm text-gray-600 mb-6 border-b pb-4">
          Current appt:{" "}
          <strong className="text-gray-900">
            {format(parseDate(originalDateStr), "MM/dd/yyyy")} at {originalTime}
          </strong>{" "}
          (Timezone: {tz})
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Date */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">New Date</label>
            <div className="relative">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCalendarOpen(true)}
                className="w-full justify-between text-gray-900"
              >
                <span>
                  {selectedDateObj ? format(selectedDateObj, "MM/dd/yyyy") : "Select Date"}
                </span>
                <CalendarIcon className="h-4 w-4 text-gray-400" />
              </Button>

              {isCalendarOpen && (
                <div
                  className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center p-4"
                  onClick={() => setIsCalendarOpen(false)}
                >
                  <div
                    className="bg-white rounded-xl shadow-2xl p-4 w-full max-w-sm relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => setIsCalendarOpen(false)}
                      className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                    <Calendar
                      mode="single"
                      selected={selectedDateObj}
                      onSelect={(d) => {
                        setSelectedDateObj(d);
                        setIsCalendarOpen(false);
                        setTime("");
                      }}
                      defaultMonth={selectedDateObj || new Date()}
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                        date.getDay() === 0 ||
                        date.getDay() === 6
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* New Time */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">New Time</label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              disabled={availableSlots.length === 0 || !selectedDateObj}
              className="w-full border rounded-lg px-3 py-2 text-gray-900 disabled:bg-gray-100"
              required
            >
              <option value="">
                {!selectedDateObj
                  ? "Select a date first"
                  : availableSlots.length === 0
                  ? "No available slots"
                  : "Select a new time"}
              </option>
              {availableSlots.map((t) => (
                <option key={t} value={t} className={isRoundHour(t) ? "font-medium" : ""}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Timezone */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Time Zone</label>
            <input
              type="text"
              value={tz}
              readOnly
              className="w-full border rounded-lg px-3 py-2 bg-gray-100 text-gray-700 font-medium cursor-default"
            />
          </div>

          {/* Submit */}
          <Button type="submit" disabled={isSubmitting || !dateStr || !time} className="mt-6">
            {isSubmitting ? "Updating..." : "Update Appointment"}
          </Button>
        </form>
      </div>
    </div>
  );
}
