import React, { useState, useEffect, useMemo } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";

// Short timezone mapping
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

interface ScheduleAppointmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ScheduleAppointmentModal({
  open,
  onOpenChange,
}: ScheduleAppointmentModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    appointment_date: "",
    appointment_time: "",
    timezone: "America/New_York",
  });

  const [takenSlots, setTakenSlots] = useState<string[]>([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const allSlots = useMemo(() => generateTimeSlots(), []);

  // Fetch taken slots for selected date
  useEffect(() => {
    const fetchSlots = async () => {
      if (!formData.appointment_date) return;

      const { data } = await supabase
        .from("appointments")
        .select("appointment_time");

      if (data) {
        setTakenSlots(data.map((row: any) => row.appointment_time));
      }
    };
    fetchSlots();
  }, [formData.appointment_date]);

  // 2-hour buffer logic
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const cutoffTime = useMemo(() => {
    if (!formData.appointment_date || formData.appointment_date !== todayStr)
      return "00:00";
    const now = new Date();
    now.setMinutes(now.getMinutes() + 120);
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = now.getMinutes() < 30 ? "30" : "00";
    return `${hh}:${mm}`;
  }, [formData.appointment_date, todayStr]);

  const availableSlots = allSlots.filter((slot) => {
    if (!formData.appointment_date) return false;
    if (takenSlots.includes(slot)) return false;
    if (formData.appointment_date === todayStr && slot <= cutoffTime)
      return false;
    return true;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch("/.netlify/functions/book-appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, source: "modal" }),
      });

      alert(
        `✅ Appointment scheduled for ${format(
          new Date(formData.appointment_date),
          "MM/dd/yyyy"
        )} at ${formData.appointment_time} (${tzMap[formData.timezone]})`
      );

      onOpenChange(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        appointment_date: "",
        appointment_time: "",
        timezone: "America/New_York",
      });
    } catch (err: any) {
      alert("❌ Error scheduling appointment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        open ? "" : "hidden"
      }`}
    >
      <div className="bg-[#1d2531] text-white w-[90%] max-w-[550px] rounded-xl shadow-lg px-6 py-12 relative">
        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-6">Book Your Appointment</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name, Email, Phone */}
          <input
            type="text"
            placeholder="Full Name *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full border rounded-lg px-3 py-2 text-gray-900"
          />
          <input
            type="email"
            placeholder="Email *"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
            className="w-full border rounded-lg px-3 py-2 text-gray-900"
          />
          <input
            type="tel"
            placeholder="Phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="w-full border rounded-lg px-3 py-2 text-gray-900"
          />

          {/* Date dropdown */}
          <div>
            <label className="block text-sm font-medium mb-1">Date *</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                className="w-full border rounded-lg px-3 py-2 flex justify-between items-center bg-white text-gray-900"
              >
                {formData.appointment_date
                  ? format(new Date(formData.appointment_date), "MM/dd/yyyy")
                  : "Select a date"}
                <CalendarIcon className="h-4 w-4 text-gray-500" />
              </button>

              {isCalendarOpen && (
                <div className="absolute z-50 mt-2 bg-white border rounded-lg shadow-lg">
                  <Calendar
                    mode="single"
                    selected={
                      formData.appointment_date
                        ? new Date(formData.appointment_date)
                        : undefined
                    }
                    onSelect={(d) => {
                      setFormData({
                        ...formData,
                        appointment_date: d
                          ? format(d, "yyyy-MM-dd")
                          : "",
                      });
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

          {/* Time dropdown */}
          <div>
            <label className="block text-sm font-medium mb-1">Time *</label>
            <select
              value={formData.appointment_time}
              onChange={(e) =>
                setFormData({ ...formData, appointment_time: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2 text-gray-900"
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

          {/* Time zone */}
          <div>
            <label className="block text-sm font-medium mb-1">Time Zone *</label>
            <select
              value={formData.timezone}
              onChange={(e) =>
                setFormData({ ...formData, timezone: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2 text-gray-900"
              required
            >
              <option value="America/New_York">Eastern (EST)</option>
              <option value="America/Chicago">Central (CST)</option>
              <option value="America/Denver">Mountain (MST)</option>
              <option value="America/Los_Angeles">Pacific (PST)</option>
            </select>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isSubmitting ? "Scheduling..." : "Schedule Appointment"}
          </Button>
        </form>
      </div>
    </div>
  );
}
