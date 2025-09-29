import React, { useState, useEffect } from "react";
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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface ScheduleAppointmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ScheduleAppointmentModal({
  open,
  onOpenChange,
}: ScheduleAppointmentModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    appointment_date: new Date(),
    appointment_time: "",
    timezone: "",
  });

  const [takenSlots, setTakenSlots] = useState<string[]>([]);

  // ✅ Normalize any Supabase format into "HH:mm"
  const normalizeTime = (raw: string): string => {
    if (!raw) return "";
    if (raw.includes("T")) {
      return new Date(raw).toISOString().slice(11, 16);
    }
    if (raw.length === 8) {
      return raw.slice(0, 5);
    }
    return raw;
  };

  // Fetch taken slots
  useEffect(() => {
    const fetchTaken = async () => {
      if (!formData.appointment_date) return;
      const dateString = formData.appointment_date.toISOString().split("T")[0];

      const { data, error } = await supabase
        .from("appointments")
        .select("appointment_time")
        .eq("appointment_date", dateString);

      if (!error && data) {
        setTakenSlots(data.map((row) => normalizeTime(row.appointment_time)));
      }
    };
    fetchTaken();
  }, [formData.appointment_date]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date) => {
    setFormData((prev) => ({ ...prev, appointment_date: date }));
    setTakenSlots([]);
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
        title: "Missing required fields",
        description: "Please fill in all required fields before submitting.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone?.trim() || null,
      appointment_date: formData.appointment_date
        ? formData.appointment_date.toISOString().split("T")[0]
        : null,
      appointment_time: formData.appointment_time,
      timezone: formData.timezone,
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

      setIsSubmitting(false);
      onOpenChange(false);

      setFormData({
        name: "",
        email: "",
        phone: "",
        appointment_date: new Date(),
        appointment_time: "",
        timezone: "",
      });
    } catch (err: any) {
      console.error("❌ Error submitting appointment:", err);
      toast({
        title: "Error",
        description: "There was a problem scheduling. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const timeSlots = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-black/50" />
      <DialogContent className="fixed z-50 bg-[#1d2531] text-white w-[90%] max-w-[550px] max-h-screen overflow-y-auto rounded-xl shadow-lg px-6 py-12 animate-fade-in-up">
        <DialogDescription className="sr-only">
          Pick a date and time to book your strategy call.
        </DialogDescription>

        <form onSubmit={handleSubmit} className="space-y-3 mt-2">
          {/* Name + Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium">Full Name *</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Email *</label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full text-gray-900"
              />
            </div>
          </div>

          {/* Phone + Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium">Phone</label>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Date *</label>
              <DatePicker
                selected={formData.appointment_date}
                onChange={handleDateChange}
                minDate={new Date()}
                dateFormat="MMMM d, yyyy"
                className="w-full border px-3 py-2 rounded text-gray-600"
              />
            </div>
          </div>

          {/* Time + Timezone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium">Time *</label>
              <select
                name="appointment_time"
                value={formData.appointment_time}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded text-gray-600"
              >
                <option value="">Choose a time</option>
                {timeSlots
                  .filter((slot) => !takenSlots.includes(slot))
                  .map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Time Zone *</label>
              <select
                name="timezone"
                value={formData.timezone}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded text-gray-600"
              >
                <option value="">Choose a time zone</option>
                <option value="America/New_York">Eastern Time (EST)</option>
                <option value="America/Chicago">Central Time (CST)</option>
                <option value="America/Denver">Mountain Time (MST)</option>
                <option value="America/Los_Angeles">Pacific Time (PST)</option>
              </select>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#d9ab57] text-[#1d2939] hover:bg-[#c89b4d] px-8 py-3 rounded-md mt-4"
          >
            {isSubmitting ? "Scheduling..." : "Schedule Appointment"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
