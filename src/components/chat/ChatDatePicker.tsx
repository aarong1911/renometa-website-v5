
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';

interface ChatDatePickerProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  onReset: () => void;
}

const ChatDatePicker = ({ selectedDate, onDateSelect, onReset }: ChatDatePickerProps) => {
  return (
    <div className="flex flex-col space-y-3">
      <div className="mx-auto transform scale-65 origin-top">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
          disabled={(date) => {
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            const day = date.getDay();
            return date < now || day === 0 || day === 6;
          }}
          initialFocus
          className="rounded border bg-white pointer-events-auto"
        />
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

export default ChatDatePicker;
