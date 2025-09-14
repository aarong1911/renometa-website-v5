import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
} from '@/components/ui/dialog';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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
    name: '',
    email: '',
    phone: '',
    appointment_date: new Date(), // ✅ matches DB schema
    appointment_time: '',         // ✅ matches DB schema
    timezone: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date) => {
    setFormData((prev) => ({ ...prev, appointment_date: date }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await supabase.from('appointments').insert([
      {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        appointment_date: formData.appointment_date
          ? formData.appointment_date.toISOString().split('T')[0]
          : null,
        appointment_time: formData.appointment_time,
        timezone: formData.timezone,
      },
    ]);

    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }

    // Trigger Make.com Webhook
    await fetch(import.meta.env.VITE_MAKE_WEBHOOK_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        appointment_date: formData.appointment_date?.toDateString(),
        appointment_time: formData.appointment_time,
        timezone: formData.timezone,
        source: 'form',
      }),
    });

    toast({
      title: 'Appointment Scheduled',
      description: `See you on ${formData.appointment_date.toDateString()} at ${formData.appointment_time}`,
    });

    setIsSubmitting(false);
    onOpenChange(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      appointment_date: new Date(),
      appointment_time: '',
      timezone: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-black/50" />
      <DialogContent className="fixed z-50 bg-[#1d2531] text-white w-[90%] max-w-[550px] max-h-screen overflow-y-auto overflow-x-hidden rounded-xl shadow-lg px-6 py-12 animate-fade-in-up">
        <DialogDescription className="sr-only">
          Pick a date and time to book your strategy call.
        </DialogDescription>

        {/* Close Button */}
        <Button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
          variant="ghost"
          size="icon"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Button>

        <form onSubmit={handleSubmit} className="space-y-3 mt-2">
          {/* First Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                Full Name *
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                required
                autoComplete="off"
                className="w-full text-gray-900"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email Address *
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                autoComplete="off"
                className="w-full text-gray-900"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                Phone Number
              </label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(123) 456-7890"
                autoComplete="off"
                className="w-full text-gray-900"
              />
            </div>

            <div className="relative">
              <label htmlFor="appointment_date" className="block text-sm font-medium text-gray-300 mb-1">
                Select Date
              </label>
              <DatePicker
                selected={formData.appointment_date}
                onChange={handleDateChange}
                className="w-full border border-gray-300 rounded-md bg-white text-gray-600 appearance-none h-11 px-3 pr-12 text-sm"
                minDate={new Date()}
                dateFormat="MMMM d, yyyy"
                id="appointment_date"
              />
            </div>
          </div>

          {/* Second Row: Time + Timezone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="appointment_time" className="block text-sm font-medium text-gray-300 mb-1">
                Select Time
              </label>
              <select
                id="appointment_time"
                name="appointment_time"
                value={formData.appointment_time}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md bg-white text-gray-600 appearance-none h-11 px-3 text-sm"
                required
              >
                <option value="">Choose a time</option>
                <option value="09:00">9:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="14:00">2:00 PM</option>
                <option value="15:00">3:00 PM</option>
                <option value="16:00">4:00 PM</option>
              </select>
            </div>

            <div>
              <label htmlFor="timezone" className="block text-sm font-medium text-gray-300 mb-1">
                Time Zone
              </label>
              <select
                id="timezone"
                name="timezone"
                value={formData.timezone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md bg-white text-gray-600 appearance-none h-11 px-3 text-sm"
              >
                <option value="">Choose a time zone</option>
                <option value="America/New_York">Eastern Time (EST)</option>
                <option value="America/Chicago">Central Time (CST)</option>
                <option value="America/Denver">Mountain Time (MST)</option>
                <option value="America/Los_Angeles">Pacific Time (PST)</option>
                <option value="America/Anchorage">Alaska Time (AKST)</option>
                <option value="Pacific/Honolulu">Hawaii-Aleutian Time (HST)</option>
              </select>
            </div>
          </div>

          {/* Submit button */}
          <div className="mb-8">
            <Button
              type="submit"
              className="group bg-[#d9ab57] text-[#1d2939] hover:bg-[#c89b4d] transition-colors rounded-md px-8 py-3 text-base font-semibold flex items-center justify-center shadow-md mt-8 mb-8"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Scheduling...' : 'Schedule Appointment'}
            </Button>
          </div>

          {/* Legal Text */}
          <p className="text-xs text-gray-400 mt-10">
            By submitting, you agree to receive text messages at the provided number from RenoMeta Inc. Message frequency varies, and standard message and data rates may apply. You have the right to OPT-OUT receiving messages at any time. To OPT-OUT, reply "STOP" to any text message you receive from us. Reply HELP for assistance. Also by submitting this form you agree with{' '}
            <a href="/privacy-policy" className="text-blue-400 hover:underline">
              Privacy Policy
            </a>{' '}
            Terms.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
