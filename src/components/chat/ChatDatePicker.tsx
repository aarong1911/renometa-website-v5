import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { DayPickerProps } from 'react-day-picker'; 

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
      <div className="mx-auto transform scale-65 origin-top">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
          
            // 🛑 CRITICAL VIEW FIX: Always start on the current month
            defaultMonth={new Date()} 

          disabled={(date) => {
            const day = date.getDay();
            // Disable past dates and weekends (Sun=0, Sat=6)
            return date < today || day === 0 || day === 6;
          }}
          initialFocus
          className="rounded border bg-white pointer-events-auto"
          
            // 🛑 TODAY HIGHLIGHTING: Apply custom class for today's date
            modifiers={modifiers}
            modifiersClassNames={{
                today: "day-today-custom-highlight", 
            }}
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
