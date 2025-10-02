import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
// FIX: Explicitly adding the .ts extension to the import path to resolve the "Could not resolve" error.
import { supabase } from '../lib/supabaseClient.ts'; 
import { ChevronDown } from "lucide-react";


// --- Date & Time Helpers ---
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

const generateAvailableDates = (originalDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today
    
    const dates = [];
    // Ensure originalDate is parsed correctly (local time)
    const originalDateObj = new Date(originalDate + 'T00:00:00'); 
    const formattedOriginalDate = formatDate(originalDateObj);

    // Look for 30 days starting tomorrow
    for (let i = 1; i < 31; i++) {
        const currentDate = new Date(today);
        currentDate.setDate(today.getDate() + i);

        const dateString = formatDate(currentDate);

        if (isWeekend(currentDate)) continue;
        
        const dayOptions: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: '2-digit' };
        const label = currentDate.toLocaleDateString('en-US', dayOptions);
        
        dates.push({ label, value: dateString });
    }
    
    // Check if the original date is one of the valid weekdays (and not in the past)
    if (!isWeekend(originalDateObj) && originalDateObj >= today) {
         const originalDateLabelOptions: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: '2-digit' };
         const originalLabel = originalDateObj.toLocaleDateString('en-US', originalDateLabelOptions);
         // Add the original date to the front, marking it as current
         dates.unshift({ label: `Current: ${originalLabel}`, value: formattedOriginalDate });
    } else {
        // If the original date is a weekday in the future, it should already be in the list 
        // We ensure it's not a weekend or in the past relative to 'today'
        const existingIndex = dates.findIndex(d => d.value === formattedOriginalDate);
        if (existingIndex !== -1) {
            const originalEntry = dates.splice(existingIndex, 1)[0];
            originalEntry.label = `Current: ${originalEntry.label}`;
            dates.unshift(originalEntry);
        }
    }
    
    return dates;
}

/**
 * --- Custom Date Selector Component (Dropdown List Style) ---
 * Keeps existing logic for handling available dates.
 */
interface DateSelectProps {
    value: string;
    onChange: (date: string) => void;
    availableDates: { label: string, value: string }[];
}

const DateSelect: React.FC<DateSelectProps> = ({ value, onChange, availableDates }) => {
    
    const [isOpen, setIsOpen] = useState(false);
    // Find the currently selected option to display in the button
    const selectedOption = availableDates.find(o => o.value === value);

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
    };
    
    // Format for display if no option is selected or if the current date is chosen
    const displayValue = selectedOption 
        ? selectedOption.label.replace('Current: ', '')
        : (value ? new Date(value + 'T00:00:00').toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : 'Select New Date');

    return (
        <div className="relative font-inter" onBlur={() => setTimeout(() => setIsOpen(false), 100)}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-left bg-white flex justify-between items-center transition-all duration-150 shadow-sm hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            >
                <span>{displayValue}</span>
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                    {availableDates.map((option) => (
                        <div
                            key={option.value}
                            // Only allow selection if the date is not the current one (marked 'Current:')
                            onClick={() => !option.label.startsWith('Current:') && handleSelect(option.value)}
                            className={`px-3 py-2 text-sm transition-colors ${
                                option.label.startsWith('Current:')
                                    ? 'bg-yellow-50 font-bold text-gray-800 cursor-default' // Highlight current selected, but disable interaction
                                    : option.value === value 
                                    ? 'bg-blue-600 text-white font-medium cursor-pointer' 
                                    : 'hover:bg-gray-100 text-gray-900 cursor-pointer'
                            }`}
                        >
                            {option.label}
                        </div>
                    ))}
                    {availableDates.length === 0 && (
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

  // The original appointment details
  const originalDate = sp.get("date") ?? formatDate(new Date()); 
  const originalTime = sp.get("time") ?? "10:00"; 

  // State for the new selection
  const [date, setDate] = useState(originalDate);
  const [time, setTime] = useState(""); 

  // State for appointment fetching and UI status
  const [takenSlots, setTakenSlots] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  
  const today = useMemo(() => formatDate(new Date()), []);
  // Use a stable list of available dates 
  const availableDates = useMemo(() => generateAvailableDates(originalDate), [originalDate]);

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
          // Client-side fetch is OK for read-only data like availability, using imported supabase client
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
    // Re-run whenever the selected date or appointment ID changes
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
      // which corresponds to netlify/functions/reschedule.ts
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
        
        {/* Current Appointment Details */}
        <p className="text-sm text-gray-500 mb-6 border-b pb-4">
          Current appt:{" "}
          {originalDate && originalTime ? (
            <strong className="text-gray-900 font-bold">
              {formattedOriginalDate} at {originalTime}
            </strong>
          ) : (
             <strong className="text-red-500">Appointment details missing</strong>
          )}
          {" "}
          (Timezone: {tz.replace(/_/g, ' ')})
        </p>

        {message && (
          <div className={`mb-4 text-sm p-3 rounded-lg ${message.startsWith("✅") ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date - Using Custom Select (based on available dates logic) */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">New Date</label>
            <DateSelect
                value={date}
                onChange={handleDateChange}
                availableDates={availableDates}
            />
            <p className="text-xs text-gray-500 mt-1">Available slots are for weekdays (Mon-Fri) in the next 30 days.</p>
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
              value={tz.replace(/_/g, ' ')}
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
