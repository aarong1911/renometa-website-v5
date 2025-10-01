import React, { useState, useEffect } from 'react';
// Assuming useAppointment is available based on previous context, using relative path

// --- Mock Appointment Hook for Immersive Context (Keep this for demonstration) ---
// In a real application, this logic would come from the actual useAppointment hook
const useAppointment = (date: string, tz: string) => {
    /**
     * Helper to generate time slots from start to end hour in 30-minute intervals.
     * Generates 8:00 to 18:00 slots (up to 17:30).
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
    
    // Simulate fetching taken slots (e.g., from an API or Supabase)
    const mockTakenSlots: string[] = date === '2025-10-15' ? ['10:30', '16:00'] : [];

    // Slots are 8:00 to 18:00, excluding taken slots
    const availableSlots = generateTimeSlots(8, 18).filter(slot => !mockTakenSlots.includes(slot));

    return { 
        availableSlots: availableSlots, 
        isFetching: false, 
        error: null,
    };
};

/**
 * Helper function to check if a time slot is a round hour (e.g., "09:00", "14:00").
 * This is used for styling the dropdown options.
 */
const isRoundHour = (timeSlot: string): boolean => {
  return timeSlot.endsWith(":00");
};

// Mock function to replace alert() with console logging for the canvas environment
const showMessage = (type: 'success' | 'error', text: string) => {
    console.log(`[${type.toUpperCase()}] ${text}`);
    // In a real app, this would update a state for a visible message box.
};


export default function ScheduleAppointmentModal() {
    const today = new Date().toISOString().split('T')[0];

    const [isOpen, setIsOpen] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [date, setDate] = useState(today);
    const [time, setTime] = useState('');
    const [timezone, setTimezone] = useState('America/New_York');
    const [consent, setConsent] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Use mock hook (replace with actual hook import/call)
    const { availableSlots, isFetching } = useAppointment(date, timezone);

    // List of common timezones for the user to pick from
    const commonTimezones = [
        "America/New_York",
        "America/Los_Angeles",
        "Europe/London",
        "Europe/Berlin",
        "Asia/Tokyo",
        "Asia/Kolkata",
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!consent) {
            showMessage('error', "You must consent to the terms.");
            return;
        }

        setIsSubmitting(true);

        // Mock API call to submit the appointment
        try {
            // Replace with actual API call (e.g., fetch to your Netlify function)
            await new Promise(resolve => setTimeout(resolve, 1500)); 
            
            showMessage('success', "Appointment scheduled successfully!");
            // Reset form or close modal
            setIsOpen(false); 
        } catch (error) {
            showMessage('error', "Failed to schedule appointment. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Schedule a Consultation</h2>
                <p className="text-sm text-gray-500 mb-6">Fill out the details to book your 30-minute slot.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                            placeholder="John Doe"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                            placeholder="john.doe@example.com"
                        />
                    </div>
                    
                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone (Optional)</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="(555) 123-4567"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Date Picker */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => {
                                    setDate(e.target.value);
                                    setTime(''); // Reset time when date changes
                                }}
                                min={today}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        {/* Time Slot Selector */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                            <select
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                                required
                                disabled={isFetching || availableSlots.length === 0}
                            >
                                <option value="" disabled>
                                    {isFetching ? "Loading slots..." : availableSlots.length === 0 ? "No slots available" : "Select Time"}
                                </option>
                                {availableSlots.map((t) => (
                                    <option 
                                      key={t} 
                                      value={t}
                                      // Apply styling for round hour: light blue background
                                      style={isRoundHour(t) ? { backgroundColor: 'rgba(59, 130, 246, 0.1)' } : {}}
                                    >
                                        {t}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Timezone Selector */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Time Zone</label>
                        <select
                            value={timezone}
                            onChange={(e) => setTimezone(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        >
                            {commonTimezones.map(tz => (
                                <option key={tz} value={tz}>
                                    {tz.replace(/_/g, ' ')}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Consent Checkbox */}
                    <div className="flex items-start">
                        <input
                            id="consent"
                            type="checkbox"
                            checked={consent}
                            onChange={(e) => setConsent(e.target.checked)}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded mt-1"
                        />
                        <label htmlFor="consent" className="ml-3 text-sm text-gray-600">
                            I consent to RenoMeta storing my information and contacting me regarding this appointment.
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting || !time || !consent}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition duration-150 ease-in-out disabled:bg-blue-300 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Scheduling..." : "Book Appointment"}
                    </button>
                    
                    {/* Close Button */}
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="w-full text-sm text-gray-500 py-1 hover:text-gray-700"
                    >
                        Close
                    </button>
                </form>
            </div>
        </div>
    );
}
```eof
