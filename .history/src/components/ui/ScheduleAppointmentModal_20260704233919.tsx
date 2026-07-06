import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogOverlay,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
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
    timezone: "America/New_York",
    consent: false,
  });

  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      if (formData.appointment_date) {
        setSelectedDate(createLocalDate(formData.appointment_date));
      }
    } else {
      setSelectedDate(undefined);
      setIsCalendarOpen(false);
    }
  }, [open, formData.appointment_date, setSelectedDate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "appointment_time") {
      setSelectedTime(normalizeTime(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

<<<<<<< HEAD
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.appointment_date ||
      !formData.appointment_time ||
      !formData.timezone
    ) {
      toast({
        title: "Missing fields",
        description: "Fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
=======
  // Insert into Supabase
  const { error } = await supabase.from('appointments').insert([
    {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      appointment_date: formData.date.toISOString().split('T')[0], // format YYYY-MM-DD
      appointment_time: formData.time,
      timezone: formData.timezone, // include this if your form includes timezone
    },
  ]);
>>>>>>> 367861f (Local changes)

    if (!formData.consent) {
      toast({
        title: "Consent required",
        description: "Please agree to receive SMS messages before submitting.",
        variant: "destructive",
      });
      return;
    }

<<<<<<< HEAD
    setIsSubmitting(true);
=======
  // Trigger Make.com Webhook
  await fetch(import.meta.env.VITE_MAKE_WEBHOOK_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      appointment_date: formData.date.toDateString(),
      appointment_time: formData.time,
      timezone: formData.timezone,
      source: 'form'
    }),
  });
>>>>>>> 367861f (Local changes)

    try {
      const response = await fetch("/.netlify/functions/book-appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          appointment_time: normalizeTime(formData.appointment_time),
          source: "appointment-form",
        }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

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
        consent: false,
      });
    } catch (err) {
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

        {/* ✅ FIX: Hidden title for screen reader accessibility */}
        <VisuallyHidden>
          <DialogTitle>Schedule an Appointment</DialogTitle>
        </VisuallyHidden>
        <DialogDescription className="sr-only">
          Book your strategy call.
        </DialogDescription>

        <Button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
          variant="ghost"
          size="icon"
          aria-label="Close appointment form"
        >
          ✕
        </Button>

        <form onSubmit={handleSubmit} className="mt-2">
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
                Phone *
              </label>
              <Input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full text-gray-900"
              />
            </div>

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

          <div className="flex items-start space-x-2 mt-4">
            <input
              type="checkbox"
              id="appointment-consent"
              name="consent"
              required
              checked={formData.consent}
              onChange={handleChange}
              className="mt-1 h-4 w-4 shrink-0"
            />
            <label
              htmlFor="appointment-consent"
              className="text-xs text-gray-400 leading-snug"
            >
              By checking this box and submitting this form, you agree to receive
              SMS messages from RenoMeta related to your appointment scheduling,
              reminders, and service updates. Message frequency varies. Message
              &amp; data rates may apply. Reply STOP to unsubscribe or HELP for
              assistance. View our{" "}
              <a
                href="/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                Privacy Policy
              </a>{" "}
              and{" "}
              <a
                href="/terms-of-service"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                Terms of Service
              </a>
              .
            </label>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || availableSlots.length === 0}
            className="group bg-[#d9ab57] text-[#1d2939] hover:bg-[#c89b4d] px-8 py-3 text-base font-semibold rounded-md shadow-md mt-6"
          >
            {isSubmitting ? "Scheduling…" : "Schedule Appointment"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
