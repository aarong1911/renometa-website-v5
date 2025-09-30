import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface TimeSlot {
  value: string;     // "HH:mm"
  formatted: string; // "9:00 AM"
}

interface ChatTimePickerProps {
  onTimeSelect: (time: string) => void;
  onReset: () => void;
  selectedDate?: Date;
}

const ChatTimePicker = ({ onTimeSelect, onReset, selectedDate }: ChatTimePickerProps) => {
  const [takenSlots, setTakenSlots] = useState<string[]>([]);

  // Generate half-hour slots
  const timeSlots: TimeSlot[] = [];
  for (let hour = 8; hour <= 18; hour++) {
    for (let minute of [0, 30]) {
      const value = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const displayHour = hour > 12 ? hour - 12 : hour;
      const period = hour >= 12 ? 'PM' : 'AM';
      const formatted = `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
      timeSlots.push({ value, formatted });
    }
  }

  // Fetch taken slots
  useEffect(() => {
    const fetchTaken = async () => {
      if (!selectedDate) return;
      const dateString = selectedDate.toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('appointments')
        .select('appointment_time')
        .eq('appointment_date', dateString);

      if (!error && data) {
        setTakenSlots(data.map((row) => row.appointment_time.slice(0, 5))); // Always HH:mm
      }
    };
    fetchTaken();
  }, [selectedDate]);

  return (
    <div className="flex flex-col space-y-3">
      <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
        {timeSlots.map((slot, i) => {
          if (takenSlots.includes(slot.value)) {
            return (
              <Button
                key={i}
                disabled
                variant="outline"
                className="text-gray-400 border-gray-300 cursor-not-allowed"
              >
                {slot.formatted} (Taken)
              </Button>
            );
          }

          return (
            <Button
              key={i}
              onClick={() => onTimeSelect(slot.value)}
              variant="outline"
              className="text-blue-dark border-blue-dark hover:bg-blue-dark/10"
            >
              {slot.formatted}
            </Button>
          );
        })}
      </div>

      <Button
        onClick={onReset}
        variant="outline"
        className="text-blue-dark border-blue-dark hover:bg-blue-dark/10"
      >
        Start Over
      </Button>
    </div>
  );
};

export default ChatTimePicker;

