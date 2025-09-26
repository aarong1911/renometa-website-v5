import { Button } from '@/components/ui/button';

interface TimeSlot {
  hour: number;
  minute: number;
  period: 'AM' | 'PM';
  formatted: string;
}

interface ChatTimePickerProps {
  onTimeSelect: (time: string) => void;
  onReset: () => void;
}

const ChatTimePicker = ({ onTimeSelect, onReset }: ChatTimePickerProps) => {
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
      <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
        {timeSlots.map((slot, i) => {
          // Normalize into 24-hour HH:mm:ss string
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
