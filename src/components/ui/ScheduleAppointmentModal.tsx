import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface TimeSlot {
  hour: number;
  minute: number;
  period: 'AM' | 'PM';
  formatted: string;
}

interface ChatTimePickerProps {
  onTimeSelect: (time: string) => void;
  onReset: () => void;
  selectedDate?: Date;
}

const ChatTimePicker = ({ onTimeSelect, onReset, selectedDate }: ChatTimePickerProps) => {
  const [takenSlots, setTakenSlots] = useState<string[]>([]);

  // Generate all slots
  const timeSlots: TimeSlot[] = [];
  for (let hour = 8; hour <= 18; hour++) {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour;

    timeSlots.push({ hour, minute: 0, period, formatted: `${displayHour}:00 ${period}` });
    if (hour < 18) {
      timeSlots.push({ hour, minute: 30, period, formatted: `${displayHour}:30 ${period}` });
    }
  }

  // ✅ Normalize
  const normalizeTime = (raw: string): string => {
    if (!raw) return '';
    if (raw.includes('T')) return new Date(raw).toISOString().slice(11, 16);
    if (raw.length === 8) return raw.slice(0, 5);
    return raw;
  };

  useEffect(() => {
    const fetchTaken = async () => {
      if (!selectedDate) return;
      const dateString = selectedDate.toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('appointments')
        .select('appointment_time')
        .eq('appointment_date', dateString);

      if (!error && data) {
        setTakenSlots(data.map((row) => normalizeTime(row.appointment_time)));
      }
    };
    fetchTaken();
  }, [selectedDate]);

  return (
    <div className="flex flex-col space-y-3">
      <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
        {timeSlots.map((slot, i) => {
          const hh = slot.hour.toString().padStart(2, '0');
          const mm = slot.minute.toString().padStart(2, '0');
          const normalized = `${hh}:${mm}`;

          if (takenSlots.includes(normalized)) {
            return (
              <Button key={i} disabled variant="outline"
                className="text-gray-400 border-gray-300 cursor-not-allowed">
                {slot.formatted} (Taken)
              </Button>
            );
          }

          return (
            <Button key={i} onClick={() => onTimeSelect(normalized)}
              variant="outline"
              className="text-blue-dark border-blue-dark hover:bg-blue-dark/10">
              {slot.formatted}
            </Button>
          );
        })}
      </div>
      <Button onClick={onReset} variant="outline"
        className="text-blue-dark border-blue-dark hover:bg-blue-dark/10">
        Start Over
      </Button>
    </div>
  );
};

export default ChatTimePicker;
