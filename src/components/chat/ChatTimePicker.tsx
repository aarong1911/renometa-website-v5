import React, { useState, useEffect } from 'react';

// --- Helper Functions (Reused from Reschedule and Modal components) ---

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

// --- Mock Data & Logic ---

// Mock function to simulate fetching currently booked times for a specific date
const mockFetchTakenSlots = async (date: string): Promise<string[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 50)); 
    if (date === new Date().toISOString().split('T')[0]) {
        // Mock taken slots for today
        return ['09:30', '11:00', '15:30'];
    }
    return []; // No taken slots on other days
};

// --- Component ---

interface ChatTimePickerProps {
    onTimeSelect: (date: string, time: string) => void;
}

export default function ChatTimePicker({ onTimeSelect }: ChatTimePickerProps) {
    const today = new Date().toISOString().split('T')[0];
    const [date, setDate] = useState(today);
    const [time, setTime] = useState('');
    const [takenSlots, setTakenSlots] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch taken slots whenever the date changes
    useEffect(() => {
        const loadSlots = async () => {
            setIsLoading(true);
            const taken = await mockFetchTakenSlots(date);
            setTakenSlots(taken);
            setIsLoading(false);
            setTime(''); // Reset selected time
        };
        loadSlots();
    }, [date]);

    // Generate full time slot list from 8:00 to 18:00
    const timeSlots = generateTimeSlots(8, 18); 
    
    // Filter out taken slots
    const availableSlots = timeSlots.filter((slot) => !takenSlots.includes(slot));

    const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newTime = e.target.value;
        setTime(newTime);
        if (newTime) {
            onTimeSelect(date, newTime);
        }
    };

    return (
        <div className="p-4 bg-white rounded-xl shadow border border-gray-100 max-w-xs space-y-3">
            <h3 className="text-md font-semibold text-gray-800">Select Date & Time</h3>
            
            {/* Date Picker */}
            <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Date</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={today}
                    className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                />
            </div>

            {/* Time Selector */}
            <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Time</label>
                <select
                    value={time}
                    onChange={handleTimeChange}
                    className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                    required
                    disabled={isLoading || availableSlots.length === 0}
                >
                    <option value="" disabled>
                        {isLoading ? "Loading slots..." : availableSlots.length === 0 ? "No slots available" : "Select Time"}
                    </option>
                    {availableSlots.map((t) => (
                        <option 
                          key={t} 
                          value={t}
                          // ✅ Applying the light blue faded background for round hours
                          style={isRoundHour(t) ? { backgroundColor: 'rgba(59, 130, 246, 0.1)' } : {}}
                        >
                            {t}
                        </option>
                    ))}
                </select>
                {availableSlots.length === 0 && !isLoading && (
                    <p className="text-xs text-red-500 mt-1">No slots available for this date.</p>
                )}
            </div>
        </div>
    );
}
