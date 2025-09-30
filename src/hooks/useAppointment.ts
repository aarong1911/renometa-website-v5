import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";

export type TimeSlot = {
  value: string;     // "HH:mm"
  formatted: string; // also "HH:mm" for display
};

const SLOT_DURATION_MINUTES = 30;
const WORK_HOURS = { start: 8, end: 18 }; // 8:00 → 18:00
const BUFFER_HOURS = 2; // The required 2-hour buffer

// 🔹 Normalize everything to "HH:mm"
const normalizeTime = (raw: string): string => {
  if (!raw) return "";
  let hhmm = "";

  if (raw.includes("T")) {
    // If it’s an ISO timestamp
    hhmm = new Date(raw).toISOString().slice(11, 16);
  } else if (raw.length >= 5) {
    // "HH:mm" or "HH:mm:ss"
    hhmm = raw.slice(0, 5);
  } else {
    hhmm = raw;
  }

  // Ensure leading zero padding (e.g. "9:00" → "09:00")
  const [h, m] = hhmm.split(":").map((n) => parseInt(n, 10));
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
};

export const useAppointment = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // ✨ NEW: State to force refresh

  // Generate all 30-min slots in 24h format
  const timeSlots: TimeSlot[] = useMemo(() => {
    const slots: TimeSlot[] = [];
    for (let hour = WORK_HOURS.start; hour < WORK_HOURS.end; hour++) {
      for (let minute = 0; minute < 60; minute += SLOT_DURATION_MINUTES) {
        const hh = hour.toString().padStart(2, "0");
        const mm = minute.toString().padStart(2, "0");
        const value = `${hh}:${mm}`;
        slots.push({ value, formatted: value });
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

      // 1. FETCH TAKEN SLOTS
      const { data, error } = await supabase
        .from("appointments")
        .select("appointment_time")
        .eq("appointment_date", isoDate);

      if (error) {
        console.error("❌ Error fetching taken slots:", error.message);
        setAvailableSlots(timeSlots);
        return;
      }

      // Normalize every DB value to strict HH:mm
      const taken: string[] =
        data?.map((row) => normalizeTime(row.appointment_time)) || [];

      const now = new Date();
      const isToday = selectedDate.toDateString() === now.toDateString();

      const free = timeSlots.filter((slot) => {
        // 2. FILTER: Check if slot is already taken (Fixes issue #2)
        if (taken.includes(slot.value)) return false;

        // 3. FILTER: Apply 2-hour buffer for today (Fixes issue #1)
        if (isToday) {
          const [h, m] = slot.value.split(":").map(Number);

          // Create a Date object for the current slot time on the selected date (in client's local TZ)
          const slotDateTime = new Date(selectedDate);
          slotDateTime.setHours(h, m, 0, 0);

          // Calculate the minimum allowed timestamp (Current time + 2 hours in ms)
          const minAllowedTimestamp = now.getTime() + BUFFER_HOURS * 60 * 60 * 1000;

          // If the slot time is less than or equal to the minimum allowed time, filter it out.
          if (slotDateTime.getTime() <= minAllowedTimestamp) {
            return false;
          }
        }

        return true;
      });

      setAvailableSlots(free);
    };

    fetchTakenSlots();
  }, [selectedDate, timeSlots, refreshKey]); // ✨ ADD refreshKey to dependencies

  const resetAppointment = () => {
    setSelectedDate(undefined);
    setSelectedTime(undefined);
    setIsSubmitting(false);
  };
  
  const forceRefresh = () => setRefreshKey((prev) => prev + 1); // ✨ NEW: Function to force the useEffect to run

  return {
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    isSubmitting,
    setIsSubmitting,
    timeSlots,
    availableSlots, 
    resetAppointment,
    forceRefresh, // ✨ Return the new function
  };
};
