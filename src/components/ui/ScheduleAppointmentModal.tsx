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
// Assuming useAppointment.ts has been updated with forceRefresh
import { useAppointment } from "@/hooks/useAppointment"; 

// --- DATE FIX: Helper function to create a date object in local time ---
/**
 * Takes a YYYY-MM-DD string and creates a new Date object representing 
 * midnight of that day in the user's local timezone. This prevents the
 * common bug where new Date('YYYY-MM-DD') defaults to UTC and rolls back
 * the date in timezones ahead of GMT.
 */
const createLocalDate = (dateString: string): Date => {
  // YYYY-MM-DD -> [YYYY, MM, DD]
  const parts = dateString.split("-").map(Number);
  // Date constructor (year, monthIndex, day) uses LOCAL time
  // Note: month is 0-indexed in JS Date (0=Jan, 11=Dec)
  return new Date(parts[0], parts[1] - 1, parts[2]); 
};
// -----------------------------------------------------------------------


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
    forceRefresh, // Required for the stale availability fix
  } = useAppointment();

  // Current date for initialization and minimum date constraint
  const todayDateString = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    appointment_date: todayDateString, // Defaulted to today
    appointment_time: "",
    timezone: "",
  });

  // ✨ FIX FOR 2-HOUR BUFFER IN MODAL: Synchronize form date with hook state
  React.useEffect(() => {
    // Only set the date if the modal is open, to trigger the availability fetch
    if (open) { 
      // If the form date is set, update the hook's selectedDate
      if (formData.appointment_date) {
        // ✅ FIX APPLIED: Use the local date creation helper
        setSelectedDate(createLocalDate(formData.appointment_date));
      }
    } else {
      // Reset selectedDate when the modal closes
      setSelectedDate(undefined); 
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, formData.appointment_date]); // Dependency on open and date ensures it runs when modal shows or date input changes

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "appointment_date") {
      // When the user changes the date input, this line triggers the useAppointment useEffect
      // ✅ FIX APPLIED: Use the local date creation helper
      setSelectedDate(createLocalDate(value));
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

    // Ensure slot is still available (quick check to prevent double-booking race conditions)
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
      forceRefresh(); // Ensures slot disappears after successful booking
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
      <DialogContent className="fixed z-50 bg-[#1d2531] text-white w-[90%] max-w-[550px] max-h-screen overflow-y-auto rounded-xl shadow-lg px-6 py-16 animate-fade-in-up">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
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
                {/* This ensures we only map over the filtered list */}
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
            className="group bg-[#d9ab57] text-[#1d2939] hover:bg-[#c89b4d] px-8 py-3 text-base font-semibold rounded-md shadow-md mt-12"
          >
            {isSubmitting ? "Scheduling…" : "Schedule Appointment"}
          </Button>

          {/* Consent */}
          <p className="text-xs text-gray-400 mt-4">
            By scheduling, you consent to receive appointment reminders and updates by text from RenoMeta. 
  Standard rates may apply. Reply STOP anytime to unsubscribe. Learn more in our{" "}
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
