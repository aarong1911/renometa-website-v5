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
import { useAppointment } from "@/hooks/useAppointment";

// Normalize to HH:mm always
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
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    isSubmitting,
    setIsSubmitting,
    availableSlots,
    resetAppointment,
  } = useAppointment();

  const todayDateString = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    appointment_date: todayDateString,
    appointment_time: "",
    timezone: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "appointment_date") {
      setSelectedDate(new Date(value));
    }
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

    // Ensure slot is still available
    if (
      !availableSlots.find(
        (s) => s.value === normalizeTime(formData.appointment_time)
      )
    ) {
      toast({
        title: "Time Slot Unavailable",
        description: "The selected time was just booked. Please try again.",
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
          appointment_time: normalizeTime(formData.appointment_time), // ✅ normalized
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
      setFormData({
        name: "",
        email: "",
        phone: "",
        appointment_date: todayDateString,
        appointment_time: "",
        timezone: "",
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

        <form onSubmit={handleSubmit} className="space-y-3 mt-2">
          {/* Name / Email / Phone / Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Date *
              </label>
              <input
                type="date"
                name="appointment_date"
                value={formData.appointment_date}
                onChange={handleChange}
                min={todayDateString}
                required
                className="w-full border border-gray-300 rounded-md bg-white text-gray-600 h-11 px-3 text-sm"
              />
            </div>
          </div>

          {/* Time + Timezone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                    {slot.value} {/* 24h format */}
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
