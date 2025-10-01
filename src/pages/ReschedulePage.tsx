import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
// NOTE: We are using a mock implementation of supabase for the immersive environment.
// In a real environment, you would use: import { supabase } from "@/lib/supabaseClient"; 
const supabase = {
  from: (table: string) => ({
    select: (columns: string) => ({
      eq: (column: string, value: string) => ({
        single: () => Promise.resolve({ data: null, error: { message: "Mock error" } }),
        then: (callback: (result: any) => void) => {
          setTimeout(() => {
            const data = [
              // Mock data of slots taken by OTHERS on the selected date. 
              { id: 'mock-id-456', appointment_time: '11:30' }, 
              { id: 'mock-id-789', appointment_time: '14:00' } 
            ];
            const error = null;
            callback({ data, error });
          }, 50);
        },
      }),
    }),
  }),
};


// Generate 30-min increments between 08:00 and 18:00
const generateTimeSlots = (startHour: number, endHour: number): string[] => {
  const slots: string[] = [];
  for (let h = startHour; h < endHour; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hh = String(h).padStart(2, "0");
      const mm = String(m).padStart(2, "0");
      slots.push(`${hh}:${mm}`);
    }
  }
  return slots;
};

/**
 * Helper function to check if a time slot is a round hour (e.g., "09:00", "14:00").
 */
const isRoundHour = (timeSlot: string): boolean => {
  return timeSlot.endsWith(":00");
};

/**
 * Helper to check if a date is a weekend (0=Sunday, 6=Saturday).
 */
const isWeekend = (dateString: string): boolean => {
    // Note: Date.getDay() returns 0 for Sunday, 6 for Saturday.
    const day = new Date(dateString).getDay();
    return day === 0 || day === 6; 
};


export default function ReschedulePage() {
  const [sp] = useSearchParams();

  const apptId = sp.get("appt_id") ?? "";
  const tz = sp.get("tz") ?? "America/New_York";

  const originalDate = sp.get("date") ?? "";
  const originalTime = sp.get("time") ?? "";

  const [date, setDate] = useState(originalDate);
  const [time, setTime] = useState(originalTime); 
  const [takenSlots, setTakenSlots] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  // Renamed dateError to weekendError for clarity and removing its visual output
  const [weekendError, setWeekendError] = useState<boolean>(isWeekend(originalDate));


  // Fetch taken slots (excluding this appointment)
  useEffect(() => {
    const fetchTaken = async () => {
      if (!date || weekendError) {
          setTakenSlots([]); // Clear slots if date is invalid (weekend)
          return;
      }

      // Clear general message on date change
      setMessage(null);

      const { data, error } = await supabase
        .from("appointments")
        .select("appointment_time,id")
        .eq("appointment_date", date);

      if (!error && data) {
        const filtered = (data as { id: string, appointment_time: string }[])
          .filter((row) => row.id !== apptId) // exclude current appt's ID (only show others' appts)
          .map((row) => row.appointment_time);
        setTakenSlots(filtered);
      } else if (error) {
        console.error("Error fetching taken slots:", error);
        setTakenSlots([]);
      }
    };
    fetchTaken();
  }, [date, apptId, weekendError]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    
    // Check for weekend (Saturday/Sunday)
    if (isWeekend(newDate)) {
        // Set the state to block submission and show an error when trying to submit
        setWeekendError(true);
        // Display a brief error message that will clear on the next valid change
        setMessage("❌ Weekends cannot be selected. Please choose a weekday.");
        setDate(newDate); 
        setTime(""); 
    } else {
        setWeekendError(false);
        setDate(newDate);
        // Reset time selection when date changes to force new selection
        setTime(""); 
    }
  };


  // All slots from 08:00 → 18:00
  const timeSlots = generateTimeSlots(8, 18);

  const isViewingOriginalDate = date === originalDate;
  
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];
  const isToday = date === today;

  /**
   * Calculate the cutoff time for today's appointments (2-hour buffer)
   */
  const getTodayCutoffTime = () => {
      const now = new Date();
      // Add 2 hours (2 * 60 * 60 * 1000 milliseconds)
      const cutoff = new Date(now.getTime() + 2 * 60 * 60 * 1000);
      
      const hours = cutoff.getHours();
      const minutes = cutoff.getMinutes();
      
      // Round up the minutes to the next 30-minute interval
      let roundedMinutes = Math.ceil(minutes / 30) * 30;
      let roundedHours = hours;

      if (roundedMinutes === 60) {
          roundedMinutes = 0;
          roundedHours = (hours + 1) % 24; // Handle hour overflow
      }

      return `${String(roundedHours).padStart(2, '0')}:${String(roundedMinutes).padStart(2, '0')}`;
  };
  
  const currentTimeCutoff = isToday ? getTodayCutoffTime() : null;

  // Filter available slots
  const availableSlots = timeSlots
    // 1. Hide the original slot ONLY if the user is viewing the original date
    .filter((slot) => !(isViewingOriginalDate && slot === originalTime)) 
    // 2. Hide others' slots
    .filter((slot) => !takenSlots.includes(slot))
    // 3. Apply 2-hour buffer for today's date
    .filter((slot) => !isToday || slot > currentTimeCutoff!); 


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (weekendError) {
        setMessage("❌ Cannot submit: Weekends are not available.");
        return;
    }

    if (!apptId) {
      setMessage("❌ Appointment ID missing.");
      return;
    }
    
    if (!time) {
        setMessage("❌ Please select a new time.");
        return;
    }

    // Check if the appointment is actually being rescheduled
    if (date === originalDate && time === originalTime) {
        setMessage("❌ Please select a different date or time to reschedule.");
        return;
    }
    
    setIsSubmitting(true);
    setMessage(null);

    try {
      // NOTE: Using a mock fetch for demonstration
      await new Promise(resolve => setTimeout(resolve, 1500)); 

      // Mock success response
      setMessage(`✅ Appointment rescheduled successfully to ${date} at ${time}!`);
      
      /* Replace mock with actual fetch
      const res = await fetch("/.netlify/functions/reschedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appt_id: apptId,
          date,
          time,
          tz,
          status: "rescheduled",
        }),
      });

      if (res.ok) {
        setMessage("✅ Appointment rescheduled successfully!");
      } else {
        const err = await res.json();
        setMessage("❌ Error: " + err.error);
      }
      */
    } catch {
      setMessage("❌ Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-6">
        {/* Logo FIX: Updated logo URL */}
        <div className="flex justify-center mb-6">
          <img
            src="https://renometa.com/images/renometa-logo.png"
            alt="RenoMeta Logo"
            className="h-12"
          />
        </div>

        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          Reschedule Appointment
        </h1>
        {/* FIX: Current appt display */}
        <p className="text-sm text-gray-500 mb-6">
          Current appt:{" "}
          <strong className="text-gray-900">
            {originalDate} / {originalTime}
          </strong> ({tz.replace(/_/g, ' ')})
        </p>

        {message && (
          <div className={`mb-4 text-sm p-2 rounded ${message.startsWith("✅") ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-1">New date</label>
            <input
              type="date"
              value={date}
              min={today} // block past dates
              onChange={handleDateChange} // Used for weekend and reset logic
              className={`w-full border rounded-lg px-3 py-2 ${
                weekendError ? 'border-red-500' : 'border-gray-300' // Highlight border if weekend is selected
              }`}
              required
            />
             {weekendError && (
                 // Visual feedback for why time slots are not showing, without being an intrusive error message
                 <p className="text-xs text-red-500 mt-1">Please select a weekday (Monday - Friday).</p>
            )}
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium mb-1">New time</label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              // Disable if no slots or if there is a weekend error
              disabled={availableSlots.length === 0 || weekendError}
              className="w-full border rounded-lg px-3 py-2"
              required
            >
              <option value="">
                {availableSlots.length === 0 ? "No slots available for this date" : "Select a time"}
              </option>
              {availableSlots.map((t) => (
                <option 
                    key={t} 
                    value={t}
                    // Apply light background for round hours
                    style={isRoundHour(t) ? { backgroundColor: 'rgba(59, 130, 246, 0.1)' } : {}}
                >
                  {t}
                </option>
              ))}
            </select>
            {availableSlots.length === 0 && !weekendError && (
                <p className="text-xs text-red-500 mt-1">No available slots.</p>
            )}
          </div>

          {/* Timezone */}
          <div>
            <label className="block text-sm font-medium mb-1">Time zone</label>
            <input
              type="text"
              value={tz.replace(/_/g, ' ')}
              readOnly
              className="w-full border rounded-lg px-3 py-2 bg-gray-100"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            // Disable if submitting, no time selected, no change made, or weekend error
            disabled={isSubmitting || !time || (date === originalDate && time === originalTime) || weekendError}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isSubmitting ? "Updating..." : "Update Appointment"}
          </button>
        </form>
      </div>
      <style>{`
          /* Optional: For the most reliable visual grey-out on browsers that support it, 
             you would need a custom date picker component, as native HTML inputs do not
             expose weekend dates for styling or disabling via CSS/JS without custom UI. */
          /* Keeping this here as a reminder of the limitation */
      `}</style>
    </div>
  );
}
