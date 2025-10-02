import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Calendar as CalendarIcon, X, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";

// --- Timezone Helper ---
const getTimezoneAbbr = (date: Date, tz: string): string => {
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      timeZoneName: "short",
    });
    const parts = formatter.formatToParts(date);
    return parts.find((p) => p.type === "timeZoneName")?.value || tz;
  } catch {
    return tz;
  }
};

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
const parseDate = (dateString: string): Date =>
  new Date(dateString + "T00:00:00");

// --- Calendar wrapper ---
function Calendar({
  className,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays
      className={`p-2 ${className}`}
      classNames={{
        caption: "flex justify-center pt-1 relative items-center",
        nav: "space-x-1 flex items-center",
        nav_button:
          "h-6 w-6 bg-transparent p-0 opacity-50 hover:opacity-100 border rounded-md",
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse",
        row: "flex w-full mt-1",
        cell: "h-7 w-7 text-center text-xs p-0 relative",
        day: "h-7 w-7 p-0 font-medium hover:bg-gray-100 rounded-md",
        day_selected: "bg-blue-600 text-white hover:bg-blue-700 rounded-md",
        day_today: "border border-blue-500 text-blue-600 font-bold",
        day_disabled:
          "text-gray-400 opacity-50 pointer-events-none line-through",
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-3 w-3" />,
        IconRight: () => <ChevronRight className="h-3 w-3" />,
      }}
      {...props}
    />
  );
}

// --- Main Page ---
export default function ReschedulePage() {
  const [sp] = useSearchParams();

  const apptId = sp.get("appt_id") ?? "";
  const tz = sp.get("tz") ?? "America/New_York";
  const originalDateStr = sp.get("date") ?? "";
  const originalTime = sp.get("time") ?? "";

  // Build date object for display
  const originalDateObj = originalDateStr
    ? parseDate(originalDateStr)
    : new Date();
  const tzAbbr = getTimezoneAbbr(
    new Date(`${originalDateStr}T${originalTime}`),
    tz
  );
  const formattedOriginalDate = originalDateStr
    ? format(originalDateObj, "MM/dd/yyyy")
    : "-";

  // State
  const [selectedDateObj, setSelectedDateObj] = useState<Date | undefined>(
    originalDateStr ? parseDate(originalDateStr) : undefined
  );
  const [time, setTime] = useState("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [takenSlots, setTakenSlots] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Slots
  const timeSlots = useMemo(() => generateTimeSlots(8, 18), []);
  const todayStr = formatDate(new Date());
  const dateStr = selectedDateObj ? formatDate(selectedDateObj) : "";
  const isToday = dateStr === todayStr;
  const isViewingOriginalDate = dateStr === originalDateStr;

  // 2-hour buffer cutoff
  const getTodayCutoff = () => {
    const now = new Date();
    const cutoff = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    let hh = cutoff.getHours();
    let mm = Math.ceil(cutoff.getMinutes() / 30) * 30;
    if (mm === 60) {
      hh++;
      mm = 0;
    }
    return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
  };
  const currentCutoff = isToday ? getTodayCutoff() : "00:00";

  // Fetch taken slots
  useEffect(() => {
    const fetchTaken = async () => {
      if (!dateStr) return;
      const { data, error } = await supabase
        .from("appointments")
        .select("appointment_time,id")
        .eq("appointment_date", dateStr);
      if (error) {
        console.error("Supabase error:", error.message);
        return;
      }
      const filtered =
        data?.filter((row) => row.id !== apptId).map((row) => row.appointment_time) ||
        [];
      setTakenSlots(filtered);
    };
    fetchTaken();
  }, [dateStr, apptId]);

  // Available slots
  const availableSlots = useMemo(() => {
    if (!selectedDateObj) return [];
    return timeSlots
      .filter((s) => !(isViewingOriginalDate && s === originalTime))
      .filter((s) => !takenSlots.includes(s))
      .filter((s) => !isToday || s > currentCutoff);
  }, [timeSlots, isViewingOriginalDate, originalTime, takenSlots, isToday, currentCutoff, selectedDateObj]);

  // Handlers
  const handleDateSelect = useCallback((date: Date | undefined) => {
    setSelectedDateObj(date);
    setIsCalendarOpen(false);
    setTime("");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dateStr || !time) {
      setMessage("❌ Please select a new date and time.");
      return;
    }
    if (dateStr === originalDateStr && time === originalTime) {
      setMessage("❌ Please pick a different slot.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/.netlify/functions/reschedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appt_id: apptId,
          date: dateStr,
          time,
          tz,
          status: "rescheduled",
        }),
      });
      if (!res.ok) throw new Error("Server error");
      setMessage(`✅ Rescheduled to ${format(parseDate(dateStr), "MM/dd/yyyy")} at ${time} ${tzAbbr}`);
    } catch (err: any) {
      setMessage(`❌ Failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Selected date label
  const formattedSelectedDate = selectedDateObj
    ? format(selectedDateObj, "MM/dd/yyyy")
    : "Select New Date";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
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
        <p className="text-sm text-gray-500 mb-6 border-b pb-4">
          Current appt:{" "}
          <strong className="text-gray-900 font-bold">
            {formattedOriginalDate} at {originalTime} {tzAbbr}
          </strong>
        </p>

        {message && (
          <div
            className={`mb-4 text-sm p-3 rounded-lg ${
              message.startsWith("✅")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-1">New Date</label>
            <div className="relative">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCalendarOpen(true)}
                className="w-full justify-between border-gray-300 text-gray-900"
              >
                <span
                  className={selectedDateObj ? "font-medium" : "text-gray-500"}
                >
                  {formattedSelectedDate}
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
                      onSelect={handleDateSelect}
                      defaultMonth={selectedDateObj || new Date()}
                      disabled={(d) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return (
                          d < today ||
                          d.getDay() === 0 ||
                          d.getDay() === 6
                        );
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium mb-1">New Time</label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              disabled={availableSlots.length === 0 || !selectedDateObj}
              className="w-full border rounded-lg px-3 py-2 disabled:bg-gray-100 text-gray-900"
              required
            >
              <option value="">
                {!selectedDateObj
                  ? "Select a date first"
                  : availableSlots.length === 0
                  ? "No slots available"
                  : "Select a new time"}
              </option>
              {availableSlots.map((t) => (
                <option
                  key={t}
                  value={t}
                  className={isRoundHour(t) ? "font-medium" : ""}
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
              value={tzAbbr}
              readOnly
              className="w-full border rounded-lg px-3 py-2 bg-gray-100 text-gray-700"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={
              isSubmitting ||
              !dateStr ||
              !time ||
              (dateStr === originalDateStr && time === originalTime)
            }
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium shadow-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isSubmitting ? "Updating..." : "Update Appointment"}
          </button>
        </form>
      </div>
    </div>
  );
}
