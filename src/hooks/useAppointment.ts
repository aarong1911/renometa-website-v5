import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";

export type TimeSlot = {
  value: string;     // "HH:mm"
  formatted: string; // also "HH:mm" for display
};

const SLOT_DURATION_MINUTES = 30;
const WORK_HOURS = { start: 8, end: 18 }; // 8:00 → 18:00
const BUFFER_HOURS = 2;

const normalizeTime = (raw: string): string => {
  if (!raw) return "";
  if (raw.includes("T")) return new Date(raw).toISOString().slice(11, 16);
  if (raw.length >= 5) return raw.slice(0, 5); // HH:mm or HH:mm:ss
  return raw;
};

export const useAppointment = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate all 30-min slots in 24h format
  const timeSlots: TimeSlot[] = useMemo(() => {
    const slots: TimeSlot[] = [];
    for (let hour = WORK_HOURS.start; hour < WORK_HOURS.end; hour++) {
      for (let minute = 0; minute < 60; minute += SLOT_DURATION_MINUTES) {
        const hh = hour.toString().padStart(2, "0");
        const mm = minute.toString().padStart(2, "0");
        const value = `${hh}:${mm}`;
        slots.push({ value, formatted: value }); // ✅ same for display
      }
    }
    return slots;
  }, []);

  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);

  useEffect(() => {
    const fetchTakenSlots = async () => {
      if (!selectedDate) {
        setAvailableSlots(timeSlots);
        return;
      }

      const isoDate = selectedDate.toISOString().split("T")[0];

      const { data, error } = await supabase
        .from("appointments")
        .select("appointment_time")
        .eq("appointment_date", isoDate);

      if (error) {
        console.error("❌ Error fetching taken slots:", error.message);
        setAvailableSlots(timeSlots);
        return;
      }

      const taken = data?.map((row) => normalizeTime(row.appointment_time)) || [];
      const now = new Date();

      const free = timeSlots.filter((slot) => {
        if (taken.includes(slot.value)) return false;

        const [h, m] = slot.value.split(":").map(Number);
        const slotDate = new Date(selectedDate);
        slotDate.setHours(h, m, 0, 0);

        // Today → apply 2h buffer
        if (selectedDate.toDateString() === now.toDateString()) {
          const minAllowed = new Date(now.getTime() + BUFFER_HOURS * 60 * 60 * 1000);
          if (slotDate <= minAllowed) return false;
        }

        return true;
      });

      setAvailableSlots(free);
    };

    fetchTakenSlots();
  }, [selectedDate, timeSlots]);

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
    availableSlots, // ✅ always "HH:mm"
    resetAppointment,
  };
};
