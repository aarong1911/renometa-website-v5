import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";

export type TimeSlot = {
  value: string;     // "HH:mm"
  formatted: string; // also "HH:mm" for display
};

const SLOT_DURATION_MINUTES = 30;
const WORK_HOURS = { start: 8, end: 18 }; // 8:00 → 18:00
const BUFFER_HOURS = 2; // The required 2-hour buffer

// 🛑 CRITICAL FIX: Helper function to safely get YYYY-MM-DD based on the date's LOCAL time
// This prevents timezone rollbacks that cause the Supabase query to miss the day.
const getLocalDateString = (date: Date): string => {
  const year = date.getFullYear();
  // Month is 0-indexed, so we add 1
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};


export const useAppointment = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); 

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

      // 1. Use the safe local date string for the Supabase query (e.g., "2025-09-30")
      const isoDate = getLocalDateString(selectedDate);

      // 2. FETCH TAKEN SLOTS
      const { data, error } = await supabase
        .from("appointments")
        .select("appointment_time")
        .eq("appointment_date", isoDate); // This ensures we query the correct date

      if (error) {
        console.error("❌ Error fetching taken slots:", error.message);
        setAvailableSlots(timeSlots);
        return;
      }

      // 3. ROBUST TIME COMPARISON: Ensure booked times are exactly "HH:mm"
      const bookedTimesSet: Set<string> = new Set(
        data
          ?.map((row) => row.appointment_time)
          // Trim any whitespace, then slice to "HH:mm" 
          ?.map((timeStr) => timeStr.trim().slice(0, 5)) || []
      );

      const now = new Date();
      const isToday = selectedDate.toDateString() === now.toDateString();

      const free = timeSlots.filter((slot) => {
        // 4. FILTER: Check if slot is already taken
        if (bookedTimesSet.has(slot.value)) {
          return false; // This slot is booked!
        }

        // 5. FILTER: Apply 2-hour buffer for today 
        if (isToday) {
          const [h, m] = slot.value.split(":").map(Number);
          
          // Create a Date object for the current slot time
          const slotDateTime = new Date(selectedDate);
          slotDateTime.setHours(h, m, 0, 0);

          // Calculate the minimum allowed timestamp (Current time + 2 hours in ms)
          const minAllowedTimestamp = now.getTime() + BUFFER_HOURS * 60 * 60 * 1000;

          if (slotDateTime.getTime() <= minAllowedTimestamp) {
            return false;
          }
        }

        return true;
      });

      setAvailableSlots(free);
    };

    fetchTakenSlots();
  }, [selectedDate, timeSlots, refreshKey]); 

  const resetAppointment = () => {
    setSelectedDate(undefined);
    setSelectedTime(undefined);
    setIsSubmitting(false);
  };
  
  const forceRefresh = () => setRefreshKey((prev) => prev + 1); 

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
    forceRefresh, 
  };
};
