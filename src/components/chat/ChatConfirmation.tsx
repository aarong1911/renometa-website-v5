
import { Button } from '@/components/ui/button';

interface ChatConfirmationProps {
  isSubmitting: boolean;
  onSubmit: () => void;
  onReset: () => void;
}

const ChatConfirmation = ({ isSubmitting, onSubmit, onReset }: ChatConfirmationProps) => {
  return (
    <div className="flex flex-col space-y-3">
      <div className="flex gap-2">
        <Button 
          onClick={onSubmit} 
          className="bg-gold hover:bg-gold-light text-blue-dark flex-1"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Confirm Appointment'}
        </Button>
        <Button 
          onClick={onReset} 
          variant="outline" 
          className="text-blue-dark border-blue-dark hover:bg-blue-dark/10"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default ChatConfirmation;
