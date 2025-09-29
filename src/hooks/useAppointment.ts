import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export type TimeSlot = {
  hour: number;
  minute: number;
  period: "AM" | "PM";
  formatted: string;
};

export const useAppointment = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // All possible slots
  const timeSlots: TimeSlot[] = [];
  for (let hour = 8; hour <= 18; hour++) {
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour;

    timeSlots.push({
      hour,
      minute: 0,
      period,
      formatted: `${displayHour}:00 ${period}`,
    });

    if (hour < 18) {
      timeSlots.push({
        hour,
        minute: 30,
        period,
        formatted: `${displayHour}:30 ${period}`,
      });
    }
  }

  // 🔹 Available slots after filtering Supabase
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);

  useEffect(() => {
    const fetchTakenSlots = async () => {
      if (!selectedDate) {
        setAvailableSlots(timeSlots.map((t) => t.formatted));
        return;
      }

      const isoDate = selectedDate.toISOString().split("T")[0];

      const { data, error } = await supabase
        .from("appointments")
        .select("appointment_time")
        .eq("appointment_date", isoDate);

      if (error) {
        console.error("❌ Error fetching taken slots:", error.message);
        setAvailableSlots(timeSlots.map((t) => t.formatted));
        return;
      }

      const taken = data?.map((row) => row.appointment_time) || [];
      const free = timeSlots
        .map((t) => t.formatted)
        .filter((slot) => !taken.includes(slot));

      setAvailableSlots(free);
    };

    fetchTakenSlots();
  }, [selectedDate]);

  const resetAppointment = () => {
    setSelectedDate(undefined);
    setSelectedTime(undefined);
    setIsSubmitting(false);
  };

  return {
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    isSubmitting,
    setIsSubmitting,
    timeSlots,
    availableSlots, // ✅ now you can use this in your dropdown
    resetAppointment,
  };
};
