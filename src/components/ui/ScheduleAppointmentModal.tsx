// src/components/ui/ScheduleAppointmentModal.tsx

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useAppointment } from "@/hooks/useAppointment";

// --- Time Zone Safe Date Handling ---
const createLocalDate = (dateString: string): Date => {
  const parts = dateString.split("-").map(Number);
  return new Date(parts[0], parts[1] - 1, parts[2]);
};

const normalizeTime = (raw: string | null | undefined): string => {
  if (!raw) return "";
  return raw.trim().slice(0, 5);
};

interface ScheduleAppointmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ScheduleAppointmentModal({
  open,
  onOpenChange,
}: ScheduleAppointmentModalProps) {
  const { toast } = useToast();
  const {
    setSelectedDate,
    setSelectedTime,
    isSubmitting,
    setIsSubmitting,
    availableSlots,
    resetAppointment,
    forceRefresh,
  } = useAppointment();

  const todayDateString = format(new Date(), "yyyy-MM-dd");

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    appointment_date: todayDateString,
    appointment_time: "",
    timezone: "America/New_York", // default EST
  });

  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      if (formData.appointment_date) {
        setSelectedDate(createLocalDate(formData.appointment_date));
      }
    } else {
      setSelectedDate(undefined);
    }
  }, [open, formData.appointment_date, setSelectedDate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "appointment_time") {
      setSelectedTime(normalizeTime(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.appointment_date ||
      !formData.appointment_time ||
      !formData.timezone
    ) {
      toast({
        title: "Missing fields",
        description: "Fill in all required fields.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      await fetch("/.netlify/functions/book-appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          appointment_time: normalizeTime(formData.appointment_time),
          source: "form",
        }),
      });

      toast({
        title: "Appointment Scheduled",
        description: `See you on ${formData.appointment_date} at ${normalizeTime(
          formData.appointment_time
        )}`,
      });

      onOpenChange(false);
      resetAppointment();
      forceRefresh();
      setFormData({
        name: "",
        email: "",
        phone: "",
        appointment_date: todayDateString,
        appointment_time: "",
        timezone: "America/New_York",
      });
    } catch (err: any) {
      console.error("Error scheduling:", err);
      toast({
        title: "Error",
        description: "Problem scheduling. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-black/50" />
      <DialogContent className="fixed z-50 bg-[#1d2531] text-white w-[90%] max-w-[550px] max-h-screen overflow-y-auto rounded-xl shadow-lg px-6 py-12 animate-fade-in-up">
        <DialogDescription className="sr-only">
          Book your strategy call.
        </DialogDescription>

        {/* Close Button */}
        <Button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
          variant="ghost"
          size="icon"
        >
          ✕
        </Button>

        <form onSubmit={handleSubmit} className="mt-2">
          {/* Name / Email / Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Full Name *
              </label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email *
              </label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Phone
              </label>
              <Input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="w-full text-gray-900"
              />
            </div>

            {/* Date with dropdown calendar */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Date *
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                  className="w-full border rounded-md px-3 py-2 flex justify-between items-center bg-white text-gray-600 h-11 text-sm"
                >
                  {formData.appointment_date
                    ? format(createLocalDate(formData.appointment_date), "MM/dd/yyyy")
                    : "Select a date"}
                  <CalendarIcon className="h-4 w-4 text-gray-800" />
                </button>

                {isCalendarOpen && (
                  <div className="absolute z-50 mt-2 bg-white border rounded-lg shadow-lg text-gray-900">
                    <Calendar
                      mode="single"
                      selected={
                        formData.appointment_date
                          ? createLocalDate(formData.appointment_date)
                          : undefined
                      }
                      onSelect={(d) => {
                        if (d) {
                          const formatted = format(d, "yyyy-MM-dd");
                          setFormData((prev) => ({
                            ...prev,
                            appointment_date: formatted,
                          }));
                          setSelectedDate(d);
                        }
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
          </div>

          {/* Time + Timezone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Time *
              </label>
              <select
                name="appointment_time"
                value={formData.appointment_time}
                onChange={handleChange}
                required
                disabled={availableSlots.length === 0}
                className="w-full border border-gray-300 rounded-md bg-white text-gray-600 h-11 px-3 text-sm"
              >
                <option value="">
                  {availableSlots.length > 0
                    ? "Choose a time"
                    : "No times available"}
                </option>
                {availableSlots.map((slot) => (
                  <option key={slot.value} value={slot.value}>
                    {slot.value}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Time Zone *
              </label>
              <select
                name="timezone"
                value={formData.timezone}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md bg-white text-gray-600 h-11 px-3 text-sm"
              >
                <option value="">Choose a time zone</option>
                <option value="America/New_York">Eastern (EST)</option>
                <option value="America/Chicago">Central (CST)</option>
                <option value="America/Denver">Mountain (MST)</option>
                <option value="America/Los_Angeles">Pacific (PST)</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isSubmitting || availableSlots.length === 0}
            className="group bg-[#d9ab57] text-[#1d2939] hover:bg-[#c89b4d] px-8 py-3 text-base font-semibold rounded-md shadow-md mt-6"
          >
            {isSubmitting ? "Scheduling…" : "Schedule Appointment"}
          </Button>

          {/* Consent */}
          <p className="text-xs text-gray-400 mt-4">
            By submitting, you agree to receive text messages from RenoMeta. Msg
            & data rates may apply. Reply STOP to opt out. View our{" "}
            <a href="/privacy-policy" className="text-blue-400 hover:underline">
              Privacy Policy
            </a>{" "}
            and Terms.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
