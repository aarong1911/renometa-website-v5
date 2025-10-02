import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Calendar as CalendarIcon, X, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import { createClient } from "@supabase/supabase-js";

// --- Firebase/Supabase/Auth Setup ---
// Global variables provided by the environment
declare const __firebase_config: string | undefined;
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};

// Supabase configuration derived from Firebase config
const SUPABASE_URL = firebaseConfig.projectId ? `https://${firebaseConfig.projectId}.supabase.co` : '';
const SUPABASE_ANON_KEY = firebaseConfig.apiKey || '';

const supabase = SUPABASE_URL && SUPABASE_ANON_KEY 
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : undefined;

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
const formatDate = (dateObj: Date): string => {
    // Ensures the date is formatted as YYYY-MM-DD
    return format(dateObj, 'yyyy-MM-dd');
};
const parseDate = (dateString: string): Date => {
    // Creates a Date object from YYYY-MM-DD string
    const parts = dateString.split('-').map(Number);
    // Note: Month is 0-indexed in Date constructor
    return new Date(parts[0], parts[1] - 1, parts[2]); 
}

// --- Utility Component Definitions (cn and Button) ---

// Re-defining cn (utility for combining tailwind classes)
const cn = (...classes: (string | boolean | undefined | null)[]): string => classes.filter(Boolean).join(' ');

// Re-defining Button component for self-contained React app
const buttonVariants = (props: { variant: 'outline' | 'ghost' | 'default', className?: string }) => {
    let base = "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none";
    
    if (props.variant === 'outline') {
        base += " border border-input bg-white hover:bg-gray-100";
    } else if (props.variant === 'ghost') {
        base += " hover:bg-gray-100";
    } else { // default
        base += " bg-blue-600 text-white hover:bg-blue-700";
    }
    return base + (props.className ? ` ${props.className}` : '');
};

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'outline' | 'ghost' | 'default' }> = ({
    className, variant = 'default', children, ...props
}) => {
    return (
        <button 
            className={cn(buttonVariants({ variant, className: className }), className)} 
            {...props}
        >
            {children}
        </button>
    );
};

// --- Calendar Component (src/components/ui/calendar.tsx) ---
interface CalendarProps extends React.ComponentProps<typeof DayPicker> {
    className?: string;
    classNames?: React.ComponentProps<typeof DayPicker>['classNames'];
    showOutsideDays?: boolean;
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-2", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-2 sm:space-x-2 sm:space-y-0",
        month: "space-y-2",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-xs font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline", className: "h-6 w-6" }),
          "bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-7 font-normal text-[0.7rem]",
        row: "flex w-full mt-1",
        cell: "h-7 w-7 text-center text-xs p-0 relative focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost", className: "h-7 w-7" }),
          "p-0 font-medium aria-selected:opacity-100" // Use font-medium for standard day display
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700", // Selected day style
        day_today: "border border-blue-500 text-blue-500 font-bold bg-blue-50/50 hover:bg-blue-50", // Today's style
        day_outside:
          "text-gray-400 opacity-80", // Outside days style
        day_disabled: "text-gray-400 opacity-60 pointer-events-none line-through", // Disabled style (past dates, weekends)
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        "day-today-custom-highlight": "bg-blue-100 ring-2 ring-blue-500", 
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-3 w-3" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-3 w-3" />,
      }}
      {...props}
    />
  );
}


// --- ChatDatePicker Component ---
interface ChatDatePickerProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  onReset: () => void;
}

// Get the current date for comparisons
const today = new Date();
today.setHours(0, 0, 0, 0);

// Define modifiers for react-day-picker to target today's date
const modifiers = {
    today: today,
};

const ChatDatePicker = ({ selectedDate, onDateSelect, onReset }: ChatDatePickerProps) => {
  return (
    <div className="flex flex-col space-y-3">
      <div className="mx-auto transform scale-90 origin-top">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
          defaultMonth={selectedDate || new Date()} 
          disabled={(date) => {
            const day = date.getDay();
            // Disable past dates and weekends (Sun=0, Sat=6)
            return date < today || day === 0 || day === 6;
          }}
          initialFocus
          className="rounded-xl border bg-white pointer-events-auto shadow-lg"
          modifiers={modifiers}
          modifiersClassNames={{
                today: "day-today-custom-highlight", 
            }}
        />
      </div>
      <Button 
        onClick={onReset} 
        variant="outline" 
        className="w-full text-blue-600 border-blue-600 hover:bg-blue-600/10 transition-colors"
      >
        Clear Selection
      </Button>
    </div>
  );
};


// --- Main Reschedule Component ---
export default function ReschedulePage() {
  const [sp] = useSearchParams();

  // Default values from URL params
  const apptId = sp.get("appt_id") ?? "default-appt-id"; 
  const tz = sp.get("tz") ?? "America/New_York";
  const originalDateStr = sp.get("date") ?? formatDate(new Date()); 
  const originalTime = sp.get("time") ?? "10:00"; 
  const currentApptTimezone = tz.replace(/_/g, ' ');

  // State for the new selection: Date is stored as a Date object internally
  const [selectedDateObj, setSelectedDateObj] = useState<Date | undefined>(parseDate(originalDateStr));
  const [time, setTime] = useState(""); 
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // State for appointment fetching and UI status
  const [takenSlots, setTakenSlots] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  
  const todayStr = useMemo(() => formatDate(new Date()), []);

  // String representation of the currently selected date for API calls
  const dateStr = useMemo(() => selectedDateObj ? formatDate(selectedDateObj) : '', [selectedDateObj]);

  // --- Supabase Data Fetching (Read only) ---
  useEffect(() => {
    const fetchTaken = async () => {
      // Check if supabase object is available before attempting the fetch
      if (!dateStr || typeof supabase === 'undefined') {
          setTakenSlots([]);
          return;
      }
      setMessage(null);
      // Suppress console log if Supabase is not configured to avoid unnecessary clutter
      if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
          console.error("Supabase environment variables are missing. Data fetching disabled.");
          return;
      }

      try {
          const { data, error } = await supabase
            .from("appointments")
            .select("appointment_time,id")
            .eq("appointment_date", dateStr);

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
  }, [dateStr, apptId]); 

  const handleDateSelect = useCallback((date: Date | undefined) => {
    setSelectedDateObj(date);
    setIsCalendarOpen(false); // Close calendar on selection
    // Reset time selection when date changes
    setTime(""); 
  }, []);
  
  const handleDateReset = useCallback(() => {
    setSelectedDateObj(undefined);
    setIsCalendarOpen(false);
    setTime("");
  }, []);

  // All slots from 08:00 → 18:00
  const timeSlots = useMemo(() => generateTimeSlots(8, 18), []);

  const isViewingOriginalDate = dateStr === originalDateStr;
  const isToday = dateStr === todayStr;

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
  const availableSlots = useMemo(() => {
    if (!selectedDateObj) return []; // No date selected, no slots available

    return timeSlots
    .filter((slot) => !(isViewingOriginalDate && slot === originalTime)) 
    .filter((slot) => !takenSlots.includes(slot))
    .filter((slot) => !isToday || slot > currentTimeCutoff)
    .filter(slot => {
        // Simple check to ensure slots are within business hours for clarity
        const [hour] = slot.split(':').map(Number);
        return hour >= 8 && hour < 18;
    });
}, 
    [timeSlots, isViewingOriginalDate, originalTime, takenSlots, isToday, currentTimeCutoff, selectedDateObj]
);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!dateStr || !time) {
        setMessage("❌ Please select a new date and time.");
        return;
    }
    if (dateStr === originalDateStr && time === originalTime) {
        setMessage("❌ Please select a different date or time to reschedule.");
        return;
    }
    
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/reschedule', { 
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              appointmentId: apptId,
              newDate: dateStr,
              newTime: time,
          }),
      });

      const result = await response.json();

      if (!response.ok) {
          throw new Error(result.error || 'Failed to reschedule via Netlify Function.');
      }
      
      // Update successful
      setMessage(`✅ Appointment rescheduled successfully to ${format(parseDate(dateStr), 'MM/dd/yyyy')} at ${time}!`);
      
    } catch (error: any) {
        console.error("Reschedule Error:", error.message);
        setMessage(`❌ Reschedule failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formattedOriginalDate = format(parseDate(originalDateStr), 'MM/dd/yyyy');
  const formattedSelectedDate = selectedDateObj ? format(selectedDateObj, 'MM/dd/yyyy') : 'Select New Date';

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
          
          {/* New Date - Using Calendar/Popover Logic */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">New Date</label>
            <div className="relative">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCalendarOpen(true)}
                    className="w-full justify-between border-gray-300 transition-all duration-150 shadow-sm hover:border-blue-500 focus:ring-2 focus:ring-blue-500 text-gray-900"
                >
                    <span className={selectedDateObj ? "font-medium" : "text-gray-500"}>
                        {formattedSelectedDate}
                    </span>
                    <CalendarIcon className="h-4 w-4 text-gray-400" />
                </Button>

                {isCalendarOpen && (
                    <div 
                        className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center p-4"
                        onClick={() => setIsCalendarOpen(false)}
                    >
                        <div 
                            className="bg-white rounded-xl shadow-2xl p-4 w-full max-w-sm relative"
                            onClick={(e) => e.stopPropagation()} // Keep popover open when clicking inside
                        >
                            <button
                                type="button"
                                onClick={() => setIsCalendarOpen(false)}
                                className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-700 transition"
                            >
                                <X className="h-5 w-5" />
                            </button>
                            <ChatDatePicker
                                selectedDate={selectedDateObj}
                                onDateSelect={handleDateSelect}
                                onReset={handleDateReset}
                            />
                        </div>
                    </div>
                )}
            </div>
            <p className="text-xs text-gray-500 mt-1">Select a weekday (Mon-Fri) that is not in the past.</p>
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">New Time (8:00 - 18:00)</label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              disabled={availableSlots.length === 0 || !selectedDateObj}
              className="w-full border rounded-lg px-3 py-2 disabled:bg-gray-100 disabled:text-gray-500 text-gray-900"
              required
            >
              <option value="">
                {!selectedDateObj ? "Select a date first" : availableSlots.length === 0 ? "No available slots" : "Select a new time"}
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
                 <p className="text-xs text-yellow-600 mt-1">Your current time slot ({originalTime}) is unavailable on this date.</p>
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
            <p className="text-xs text-gray-500 mt-1">This appointment is fixed to the original timezone.</p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || !dateStr || !time || (dateStr === originalDateStr && time === originalTime)}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium shadow-md hover:bg-blue-700 disabled:bg-blue-300 transition duration-150 mt-6"
          >
            {isSubmitting ? "Updating..." : "Update Appointment"}
          </button>
        </form>
      </div>
      </div>
  );
}
