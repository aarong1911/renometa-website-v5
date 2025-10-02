import { useState, useEffect, useMemo } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import { supabase } from "@/lib/supabaseClient";

interface ScheduleAppointmentModalProps {
  onClose: () => void;
}

const generateTimeSlots = () => {
  const slots: string[] = [];
  for (let h = 8; h < 18; h++) {
    for (let m of [0, 30]) {
      slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }
  }
  return slots;
};

export default function ScheduleAppointmentModal({ onClose }: ScheduleAppointmentModalProps) {
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState("");
  const [takenSlots, setTakenSlots] = useState<string[]>([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const allSlots = useMemo(() => generateTimeSlots(), []);

  // Fetch taken slots
  useEffect(() => {
    const fetchSlots = async () => {
      if (!date) return;
      const dateStr = format(date, "yyyy-MM-dd");

      const { data } = await supabase
        .from("appointments")
        .select("appointment_time");

      if (data) {
        setTakenSlots(data.map((row) => row.appointment_time));
      }
    };
    fetchSlots();
  }, [date]);

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const cutoffTime = useMemo(() => {
    if (!date || format(date, "yyyy-MM-dd") !== todayStr) return "00:00";
    const now = new Date();
    now.setMinutes(now.getMinutes() + 120);
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = now.getMinutes() < 30 ? "30" : "00";
    return `${hh}:${mm}`;
  }, [date, todayStr]);

  const availableSlots = allSlots.filter((slot) => {
    if (!date) return false;
    const dateStr = format(date, "yyyy-MM-dd");
    if (takenSlots.includes(slot)) return false;
    if (dateStr === todayStr && slot <= cutoffTime) return false;
    return true;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) return;
    alert(`✅ Appointment booked for ${format(date, "MM/dd/yyyy")} at ${time}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-gray-900 text-white rounded-xl shadow-xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Schedule Appointment</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Full Name *</label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full border rounded-lg px-3 py-2 bg-gray-800 text-white placeholder-gray-300"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email *</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border rounded-lg px-3 py-2 bg-gray-800 text-white placeholder-gray-300"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
            <input
              type="tel"
              placeholder="Enter your phone number"
              className="w-full border rounded-lg px-3 py-2 bg-gray-800 text-white placeholder-gray-300"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Date *</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                className="w-full border rounded-lg px-3 py-2 flex justify-between items-center bg-gray-800 text-white placeholder-gray-300"
              >
                {date ? format(date, "MM/dd/yyyy") : "Select a date"}
                <CalendarIcon className="h-4 w-4 text-gray-400" />
              </button>

              {isCalendarOpen && (
                <div className="absolute z-50 mt-2 bg-white border rounded-lg shadow-lg">
                  <DayPicker
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
                    className="p-2"
                    classNames={{
                      months: "flex flex-col space-y-2",
                      month: "space-y-2",
                      caption: "flex justify-center pt-1 relative items-center text-gray-900",
                      caption_label: "text-sm font-medium",
                      nav: "space-x-1 flex items-center",
                      nav_button: "h-6 w-6 bg-transparent text-gray-700 hover:text-black",
                      nav_button_previous: "absolute left-1",
                      nav_button_next: "absolute right-1",
                      table: "w-full border-collapse space-y-1",
                      head_row: "flex text-gray-500",
                      head_cell: "w-9 font-normal text-xs",
                      row: "flex w-full mt-1",
                      cell: "h-9 w-9 text-center text-sm p-0 relative",
                      day: "h-9 w-9 p-0 font-normal text-gray-900 hover:bg-gray-100 rounded-md",
                      day_selected: "bg-blue-600 text-white rounded-md",
                      day_today: "border border-blue-500 text-blue-500 font-bold rounded-md",
                      day_outside: "text-gray-400 opacity-50",
                      day_disabled: "text-gray-400 opacity-50 line-through",
                    }}
                    components={{
                      IconLeft: () => <ChevronLeft className="h-4 w-4" />,
                      IconRight: () => <ChevronRight className="h-4 w-4" />,
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Time *</label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 bg-gray-800 text-white placeholder-gray-300"
              required
            >
              <option value="">Choose a time</option>
              {availableSlots.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-yellow-500 text-gray-900 py-2 px-4 rounded-lg font-semibold hover:bg-yellow-400"
          >
            Schedule Appointment
          </button>
        </form>
      </div>
    </div>
  );
}
