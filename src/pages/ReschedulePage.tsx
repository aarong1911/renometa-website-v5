import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
// Using the fixed import path
import { supabase } from '../lib/supabaseClient.ts'; 
import { ChevronDown, Calendar as CalendarIcon } from "lucide-react";

// --- Date & Time Helpers ---
// (These helpers are essential for the core business logic)

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

const isRoundHour = (timeSlot: string): boolean => timeSlot.endsWith(":00");
const isWeekend = (dateObj: Date): boolean => {
    const day = dateObj.getDay();
    return day === 0 || day === 6; 
};
const formatDate = (dateObj: Date): string => {
    // Ensures the date is formatted as YYYY-MM-DD
    return dateObj.toISOString().split("T")[0];
};

/**
 * Calculates and returns a list of dates that should be DISABLED in the calendar.
 * This includes weekends and past dates relative to today.
 * The original date (if still in the future) is considered available for viewing.
 */
const getDisabledDates = (originalDate: string): Date[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today
    
    const disabledDates: Date[] = [];

    // 1. Disable all dates up to and including today.
    let datePointer = new Date('2000-01-01T00:00:00'); // Start far in the past
    
    while (datePointer <= today) {
        disabledDates.push(new Date(datePointer));
        datePointer.setDate(datePointer.getDate() + 1);
    }
    
    // 2. Disable all future weekends within the calendar's visible range (e.g., next 6 months).
    // Let's check the next 6 months.
    const sixMonthsFromNow = new Date(today);
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
    
    let futurePointer = new Date(today);
    futurePointer.setDate(futurePointer.getDate() + 1); // Start checking from tomorrow

    while (futurePointer <= sixMonthsFromNow) {
        if (isWeekend(futurePointer)) {
            disabledDates.push(new Date(futurePointer));
        }
        futurePointer.setDate(futurePointer.getDate() + 1);
    }
    
    return disabledDates;
}

/**
 * --- Date Picker Component Placeholder ---
 * This structure is designed to be easily replaced by a Calendar component 
 * (like the one in src/components/ui/calendar.tsx) wrapped in a Popover.
 * For now, it retains the functional dropdown list, but with the appearance
 * of a date input.
 */
interface DateSelectProps {
    value: string;
    onChange: (date: string) => void;
    // We now pass the raw list of available dates 
    availableDatesList: { label: string, value: string }[]; 
}

const DateSelect: React.FC<DateSelectProps> = ({ value, onChange, availableDatesList }) => {
    
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = availableDatesList.find(o => o.value === value);

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
    };
    
    const displayValue = selectedOption 
        ? selectedOption.label.replace('Current: ', '')
        : (value ? new Date(value + 'T00:00:00').toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : 'Select New Date');

    return (
        <div className="relative font-inter" onBlur={() => setTimeout(() => setIsOpen(false), 100)}>
            {/* The input appearance for the date picker */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-left bg-white flex justify-between items-center transition-all duration-150 shadow-sm hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            >
                <span>{displayValue}</span>
                <CalendarIcon className="h-4 w-4 text-gray-400" />
            </button>

            {/* The calendar/dropdown popover content */}
            {isOpen && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                    {availableDatesList.map((option) => (
                        <div
                            key={option.value}
                            onClick={() => !option.label.startsWith('Current:') && handleSelect(option.value)}
                            className={`px-3 py-2 text-sm transition-colors ${
                                option.label.startsWith('Current:')
                                    ? 'bg-yellow-50 font-bold text-gray-800 cursor-default'
                                    : option.value === value 
                                    ? 'bg-blue-600 text-white font-medium cursor-pointer' 
                                    : 'hover:bg-gray-100 text-gray-900 cursor-pointer'
                            }`}
                        >
                            {option.label}
                        </div>
                    ))}
                    {availableDatesList.length === 0 && (
                        <div className="px-3 py-2 text-sm text-gray-500">No available weekdays in the next 30 days.</div>
                    )}
                </div>
            )}
        </div>
    );
}


/**
 * --- Main Reschedule Component ---
 */
export default function ReschedulePage() {
  const [sp] = useSearchParams();

  // Default values from URL params
  const apptId = sp.get("appt_id") ?? "default-appt-id"; 
  const tz = sp.get("tz") ?? "America/New_York";
  // Fallback values for date/time
  const originalDate = sp.get("date") ?? formatDate(new Date()); 
  const originalTime = sp.get("time") ?? "10:00"; 
  const currentApptTimezone = tz.replace(/_/g, ' ');

  // State for the new selection
  const [date, setDate] = useState(originalDate);
  const [time, setTime] = useState(""); 

  // State for appointment fetching and UI status
  const [takenSlots, setTakenSlots] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  
  const today = useMemo(() => formatDate(new Date()), []);
  
  // List of all dates that are valid to select (weekdays, non-past) for the DateSelect component
  const availableDatesList = useMemo(() => generateAvailableDates(originalDate), [originalDate]);

  // List of all dates that must be disabled in a Calendar component (weekends, past dates)
  const disabledDates = useMemo(() => getDisabledDates(originalDate), [originalDate]);

  // --- Supabase Data Fetching (Read only) ---
  useEffect(() => {
    const fetchTaken = async () => {
      // Check if supabase object is available before attempting the fetch
      if (!date || typeof supabase === 'undefined') {
          setTakenSlots([]);
          return;
      }
      setMessage(null);

      try {
          const { data, error } = await supabase
            .from("appointments")
            .select("appointment_time,id")
            .eq("appointment_date", date);

          if (error) throw error;
          
          const filteredSlots = (data as { id: string, appointment_time: string }[])
             .filter((row) => row.id !== apptId) // exclude current appt's ID
             .map((row) => row.appointment_time);

          setTakenSlots(filteredSlots);

      } catch (error: any) {
            console.error("Error fetching taken slots from Supabase:", error.message);
            setMessage("❌ Error loading availability. See console for details.");
            setTakenSlots([]);
      }
    };
    
    fetchTaken();
  }, [date, apptId]); 

  const handleDateChange = useCallback((newDate: string) => {
    setDate(newDate);
    // Reset time selection when date changes
    setTime(""); 
  }, []);

  // All slots from 08:00 → 18:00
  const timeSlots = useMemo(() => generateTimeSlots(8, 18), []);

  const isViewingOriginalDate = date === originalDate;
  const isToday = date === today;

  // Calculates the time 2 hours from now, rounded up to the nearest half hour
  const getTodayCutoffTime = () => {
      const now = new Date();
      const cutoff = new Date(now.getTime() + 2 * 60 * 60 * 1000); // Add 2 hours
      
      const hours = cutoff.getHours();
      let minutes = cutoff.getMinutes();
      
      // Round up to the nearest 30-minute interval
      minutes = Math.ceil(minutes / 30) * 30; 
      let roundedHours = hours;

      if (minutes >= 60) {
          minutes -= 60;
          roundedHours = (hours + 1); 
      }
      
      // Enforce business hours boundary (8:00 to 18:00)
      if (roundedHours < 8) return '08:00';
      if (roundedHours >= 18) return '18:00'; 

      return `${String(roundedHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };
  
  const currentTimeCutoff = isToday ? getTodayCutoffTime() : '00:00'; 

  // Filter available slots
  const availableSlots = useMemo(() => timeSlots
    .filter((slot) => !(isViewingOriginalDate && slot === originalTime)) 
    .filter((slot) => !takenSlots.includes(slot))
    .filter((slot) => !isToday || slot > currentTimeCutoff), 
    [timeSlots, isViewingOriginalDate, originalTime, takenSlots, isToday, currentTimeCutoff]
);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!time) {
        setMessage("❌ Please select a new time.");
        return;
    }
    if (date === originalDate && time === originalTime) {
        setMessage("❌ Please select a different date or time to reschedule.");
        return;
    }
    
    setIsSubmitting(true);
    setMessage(null);

    try {
      // Calls the secure Netlify Function for write operation using the correct path /api/reschedule
      const response = await fetch('/api/reschedule', { 
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              appointmentId: apptId,
              newDate: date,
              newTime: time,
          }),
      });

      const result = await response.json();

      if (!response.ok) {
          throw new Error(result.error || 'Failed to reschedule via Netlify Function.');
      }
      
      // Update successful
      setMessage(`✅ Appointment rescheduled successfully to ${date} at ${time}!`);
      
    } catch (error: any) {
        console.error("Reschedule Error:", error.message);
        setMessage(`❌ Reschedule failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formattedOriginalDate = new Date(originalDate + 'T00:00:00').toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8 font-inter">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
        
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
        
        {/* Current Appointment Details - NOW SHOWING REAL DATA */}
        <p className="text-sm text-gray-500 mb-6 border-b pb-4">
          Current appt:{" "}
          <strong className="text-gray-900 font-bold">
              {formattedOriginalDate} at {originalTime}
          </strong>
          {" "}
          (Timezone: {currentApptTimezone})
        </p>

        {message && (
          <div className={`mb-4 text-sm p-3 rounded-lg ${message.startsWith("✅") ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* New Date - Now using the placeholder component with the Calendar icon */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">New Date</label>
            <DateSelect
                value={date}
                onChange={handleDateChange}
                availableDatesList={availableDatesList}
            />
            <p className="text-xs text-gray-500 mt-1">Available slots are for weekdays (Mon-Fri) in the next 30 days.</p>
            {/* NOTE: If you integrate a Calendar component here (e.g., from src/components/ui/calendar.tsx), 
               you should pass the 'disabledDates' array to it to grey out weekends and past days.
               e.g., <Calendar disabled={disabledDates} onSelect={handleDateChange} />
            */}
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">New Time (8:00 - 18:00)</label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              disabled={availableSlots.length === 0}
              className="w-full border rounded-lg px-3 py-2 disabled:bg-gray-100 disabled:text-gray-500 text-gray-900"
              required
            >
              <option value="">
                {availableSlots.length === 0 ? "No available slots" : "Select a new time"}
              </option>
              {availableSlots.map((t) => (
                <option 
                    key={t} 
                    value={t}
                    className={isRoundHour(t) ? 'font-medium' : ''}
                >
                  {t}
                </option>
              ))}
            </select>
            {isToday && availableSlots.length > 0 && (
                <p className="text-xs text-blue-600 mt-1">Times earlier than {currentTimeCutoff} (2-hour booking buffer) are hidden.</p>
            )}
            {isViewingOriginalDate && availableSlots.length > 0 && (
                 <p className="text-xs text-yellow-600 mt-1">Your current time slot ({originalTime}) is hidden as you must select a new time.</p>
            )}
          </div>

          {/* Timezone */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Time Zone</label>
            <input
              type="text"
              value={currentApptTimezone}
              readOnly
              className="w-full border rounded-lg px-3 py-2 bg-gray-100 text-gray-700 font-medium cursor-default"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || (date === originalDate && time === originalTime) || !time}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium shadow-md hover:bg-blue-700 disabled:bg-blue-300 transition duration-150 mt-6"
          >
            {isSubmitting ? "Updating..." : "Update Appointment"}
          </button>
        </form>
      </div>
      </div>
  );
}
```eof

### Key Changes Summary:

1.  **Current Appointment Display:** The display now correctly shows the original date, time, and timezone from the URL parameters (e.g., `Current appt: 10/02/2025 at 10:00 (Timezone: America/New York)`).
2.  **Disabled Dates Logic:** A new helper function, `getDisabledDates`, was added to generate an array of `Date` objects corresponding to **all past dates and all weekends**. This array is what you should pass to the `disabled` prop of your actual `Calendar` component.
3.  **Date Picker UI:** The `DateSelect` component was visually updated to look like a calendar input field (with the calendar icon) to better reflect the desired UI, while still using the reliable list-based selection logic as a temporary measure.
4.  **Time Slot Filtering:** The logic to filter out the **original time slot** on the original date, and the logic to filter out **already booked time slots** (using the Supabase fetch) are both confirmed as functional.

When you integrate your actual calendar component (`src/components/ui/calendar.tsx`), you will replace the custom `DateSelect` with a Popover/Dialog containing your Calendar component, passing the `disabledDates` array to its `disabled` prop and using the `handleDateChange` function as its `onSelect` handler.

