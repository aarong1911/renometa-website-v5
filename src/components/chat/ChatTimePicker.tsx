import { Button } from "@/components/ui/button";
import { useAppointment } from "@/hooks/useAppointment";

interface ChatTimePickerProps {
  onTimeSelect: (time: string) => void;
  onReset: () => void;
}

const ChatTimePicker = ({ onTimeSelect, onReset }: ChatTimePickerProps) => {
  const { availableSlots } = useAppointment();

  return (
    <div className="flex flex-col space-y-3">
      <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
        {availableSlots.length > 0 ? (
          availableSlots.map((slot) => (
            <Button
              key={slot.value}
              onClick={() => onTimeSelect(slot.value)}
              variant="outline"
              className="text-blue-dark border-blue-dark hover:bg-blue-dark/10"
            >
              {slot.formatted}
            </Button>
          ))
        ) : (
          <p className="text-sm text-gray-500 col-span-2">No available slots</p>
        )}
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
