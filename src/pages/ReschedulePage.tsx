import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
// Assuming supabase is correctly imported and initialized elsewhere, as indicated in your code
// import { supabase } from "@/lib/supabaseClient"; 

// --- Mock Supabase Client for Immersive Context (Keep this for demonstration) ---
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
// --- End Mock ---

/**
 * Helper to generate time slots from start to end hour in 30-minute intervals (e.g., 8 to 18 gives 8:00 up to 17:30).
 */
const generateTimeSlots = (startHour: number, endHour: number): string[] => {
  const slots: string[] = [];
  for (let h = startHour; h < endHour; h++) {
    for (let m = 0; m < 60; m += 30) {
      const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      slots.push(time);
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

export default function ReschedulePage() {
  const [sp] = useSearchParams();

  // Get parameters from URL
  const apptId = sp.get("appt_id") ?? "";
  const tz = sp.get("tz") ?? "America/New_York";

  // Use the time and date from the URL (the currently booked details)
  const originalTime = sp.get("time") ?? "";
  const originalDate = sp.get("date") ?? ""; // Store original date

  const [date, setDate] = useState(originalDate);
  const [time, setTime] = useState(originalTime); // The currently selected new time
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // 🔹 Keep track of taken slots (slots taken by others)
  const [takenSlots, setTakenSlots] = useState<string[]>([]);

  // Fetch taken slots for this date
  useEffect(() => {
    const fetchTaken = async () => {
      if (!date) return;

      setMessage(null);

      // Fetch all appointments for the selected date
      const { data, error } = await supabase
        .from("appointments")
        .select("appointment_time,id")
        .eq("appointment_date", date);

      if (!error && data) {
        // Filter out the original appointment's ID (apptId). This ensures 
        // we only list times taken by *other* people.
        const filtered = (data as { id: string, appointment_time: string }[])
          .filter((row) => row.id !== apptId)
          .map((row) => row.appointment_time);
        setTakenSlots(filtered);
      } else if (error) {
        console.error("Error fetching taken slots:", error);
        setTakenSlots([]);
      }
    };

    fetchTaken();
  }, [date, apptId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!apptId) {
      setMessage({ type: 'error', text: "Appointment ID missing." });
      return;
    }

    if (!time) {
      setMessage({ type: 'error', text: "Please select a new time." });
      return;
    }
    
    // Prevent submitting if the user hasn't actually changed anything
    if (date === originalDate && time === originalTime) {
       setMessage({ type: 'error', text: "Please select a different date or time to reschedule." });
       return;
    }
    
    setIsSubmitting(true);
    setMessage(null);

    try {
      // Mock API call for demonstration. Replace with actual API call.
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      
      // Assume success for mock
      setMessage({ type: 'success', text: "✅ Appointment rescheduled successfully to " + date + " at " + time + "!" });

    } catch (error) {
      setMessage({ type: 'error', text: "❌ Network error. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate full time slot list from 8:00 to 18:00
  const timeSlots = generateTimeSlots(8, 18); 
  
  // Check if the user is currently viewing the date of their original appointment
  const isViewingOriginalDate = date === originalDate;

  const availableSlots = timeSlots
    // 1. Filter slots taken by OTHERS on the selected date
    .filter((slot) => !takenSlots.includes(slot))
    // 2. Filter out the user's ORIGINAL booked time ONLY if they are viewing the original date
    // This fulfills the requirement that the original slot is unavailable ONLY on the original date
    .filter((slot) => !(isViewingOriginalDate && slot === originalTime));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-6">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="https://placehold.co/150x40/566e85/ffffff/png?text=RenoMeta"
            alt="RenoMeta Logo"
            className="h-12"
          />
        </div>

        <h1 className="text-xl font-semibold text-gray-900 mb-4">
          Reschedule Appointment
        </h1>
        {/* Corrected UI text to display original date and time */}
        <p className="text-sm text-gray-500 mb-6">
          You are currently booked for <strong className="text-gray-900">{originalTime}</strong> on <strong className="text-gray-900">{originalDate}</strong> ({tz.replace(/_/g, ' ')})
        </p>

        {/* Message Box */}
        {message && (
          <div
            className={`p-3 rounded-lg text-sm mb-4 ${
              message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">New date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => {
                const newDate = e.target.value;
                setDate(newDate);
                // Reset time selection when date changes
                setTime("");
              }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">New time</label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
              required
              disabled={availableSlots.length === 0}
            >
              <option value="">
                {availableSlots.length === 0 ? "No slots available for this date" : "Select a new time"}
              </option>
              {availableSlots.map((t) => (
                <option 
                  key={t} 
                  value={t}
                  // Applying styling for round hour: light blue background
                  style={isRoundHour(t) ? { backgroundColor: 'rgba(59, 130, 246, 0.1)' } : {}}
                >
                  {t}
                </option>
              ))}
            </select>
            {availableSlots.length === 0 && (
                <p className="text-xs text-red-500 mt-1">There are no available slots for the selected date.</p>
            )}
          </div>

          {/* Timezone (read-only) */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Time zone</label>
            <input
              type="text"
              value={tz.replace(/_/g, ' ')} // Display friendly name
              readOnly
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            // Button is disabled if: submitting, no slots, no time selected, OR trying to submit the same date/time
            disabled={isSubmitting || availableSlots.length === 0 || !time || (date === originalDate && time === originalTime)}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition duration-150 ease-in-out disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Updating..." : "Update Appointment"}
          </button>
        </form>
      </div>
    </div>
  );
}
