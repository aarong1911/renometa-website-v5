import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
} from "@/components/ui/dialog";

interface ScheduleAppointmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const APPOINTMENTS_TABLE = "appointments";
const SLOT_DURATION_MINUTES = 30;
const WORK_HOURS = { start: 8, end: 18 }; // 8 AM – 6 PM
const BUFFER_HOURS = 2; // block past slots and enforce 2-hour buffer

export default function ScheduleAppointmentModal({
  open,
  onOpenChange,
}: ScheduleAppointmentModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const todayDateString = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    appointment_date: todayDateString,
    appointment_time: "",
    timezone: "",
  });

  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  // Generate slots between 08:00–18:00 in 30 min steps
  const generateAllSlots = useCallback((): string[] => {
    const slots: string[] = [];
    for (let hour = WORK_HOURS.start; hour < WORK_HOURS.end; hour++) {
      for (let minute = 0; minute < 60; minute += SLOT_DURATION_MINUTES) {
        slots.push(
          `${hour.toString().padStart(2, "0")}:${minute
            .toString()
            .padStart(2, "0")}`
        );
      }
    }
    return slots;
  }, []);

// Filter slots (remove past, buffer, and booked)
const filterSlots = useCallback(
  (slots: string[], booked: string[], selectedDate: string): string[] => {
    const now = new Date();
    const dateObj = new Date(selectedDate);

    return slots.filter((slot) => {
      if (booked.includes(slot)) return false;

      const [h, m] = slot.split(":").map(Number);
      const slotDate = new Date(dateObj);
      slotDate.setHours(h, m, 0, 0);

      // 📅 If today → enforce 2-hour buffer
      if (dateObj.toDateString() === now.toDateString()) {
        const minAllowed = new Date(
          now.getTime() + BUFFER_HOURS * 60 * 60 * 1000
        );
        if (slotDate <= minAllowed) return false;
      }

      // 📅 If future date → allow all (just exclude booked)
      // no extra restriction needed

      return true;
    });
  },
  []
);

  // Fetch slots whenever date changes
  useEffect(() => {
    const fetchSlots = async () => {
      if (!formData.appointment_date) return;
      setIsLoadingSlots(true);

      try {
        const { data, error } = await supabase
          .from(APPOINTMENTS_TABLE)
          .select("appointment_time")
          .eq("appointment_date", formData.appointment_date);

        if (error) throw error;

        const bookedTimes = (data || []).map((row: any) =>
          row.appointment_time.slice(0, 5) // normalize to HH:mm
        );

        const allSlots = generateAllSlots();
        const freeSlots = filterSlots(
          allSlots,
          bookedTimes,
          formData.appointment_date
        );

        setAvailableSlots(freeSlots);
      } catch (err: any) {
        console.error("Error fetching slots:", err);
        toast({
          title: "Error",
          description: "Could not load available slots.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [formData.appointment_date, generateAllSlots, filterSlots, toast]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

    const payload = {
      ...formData,
      phone: formData.phone?.trim() || null,
    };

    try {
      await fetch("/.netlify/functions/book-appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, source: "form" }),
      });

      toast({
        title: "Appointment Scheduled",
        description: `See you on ${payload.appointment_date} at ${payload.appointment_time}`,
      });

      onOpenChange(false);
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
                disabled={isLoadingSlots}
                className="w-full border border-gray-300 rounded-md bg-white text-gray-600 h-11 px-3 text-sm"
              >
                <option value="">
                  {isLoadingSlots ? "Loading slots…" : "Choose a time"}
                </option>
                {availableSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
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
            className="group bg-[#d9ab57] text-[#1d2939] hover:bg-[#c89b4d] px-8 py-3 text-base font-semibold rounded-md shadow-md mt-8 mb-8"
          >
            {isSubmitting ? "Scheduling…" : "Schedule Appointment"}
          </Button>

          {/* Consent */}
          <p className="text-xs text-gray-400 mt-10">
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
