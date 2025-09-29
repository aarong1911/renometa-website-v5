import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
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
  selectedDate?: Date; // ✅ pass the chosen date from ChatDatePicker
}

const ChatTimePicker = ({ onTimeSelect, onReset, selectedDate }: ChatTimePickerProps) => {
  const [takenSlots, setTakenSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch taken slots whenever the selected date changes
  useEffect(() => {
    const fetchTakenSlots = async () => {
      if (!selectedDate) return;
      setLoading(true);

      const dateString = selectedDate.toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('appointments')
        .select('appointment_time')
        .eq('appointment_date', dateString);

      if (!error && data) {
        setTakenSlots(data.map((row) => row.appointment_time));
      }

      setLoading(false);
    };

    fetchTakenSlots();
  }, [selectedDate]);

  // 🔹 Build all slots (08:00 → 18:30)
  const timeSlots: TimeSlot[] = [];
  for (let hour = 8; hour <= 18; hour++) {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour;

    timeSlots.push({
      hour,
      minute: 0,
      period,
      formatted: `${displayHour}:00 ${period}`,
    });

    if (hour < 18) {
      timeSlots.push({
        hour,
        minute: 30,
        period,
        formatted: `${displayHour}:30 ${period}`,
      });
    }
  }

  return (
    <div className="flex flex-col space-y-3">
      {loading ? (
        <p className="text-center text-gray-500">Loading available slots...</p>
      ) : (
        <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
          {timeSlots
            .filter((slot) => {
              const hh = slot.hour.toString().padStart(2, '0');
              const mm = slot.minute.toString().padStart(2, '0');
              const normalized = `${hh}:${mm}:00`;
              return !takenSlots.includes(normalized); // ✅ hide taken slots
            })
            .map((slot, i) => {
              const hh = slot.hour.toString().padStart(2, '0');
              const mm = slot.minute.toString().padStart(2, '0');
              const normalized = `${hh}:${mm}:00`;

              return (
                <Button
                  key={i}
                  onClick={() => onTimeSelect(normalized)}
                  variant="outline"
                  className="text-blue-dark border-blue-dark hover:bg-blue-dark/10"
                >
                  {slot.formatted}
                </Button>
              );
            })}
        </div>
      )}

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
