
import { Button } from '@/components/ui/button';

interface ChatPostConfirmationProps {
  onConfirm: (answer: 'yes' | 'no') => void;
}

const ChatPostConfirmation = ({ onConfirm }: ChatPostConfirmationProps) => {
  return (
    <div className="flex flex-col space-y-3">
      <div className="flex gap-2">
        <Button 
          onClick={() => onConfirm('yes')} 
          className="bg-gold hover:bg-gold-light text-blue-dark flex-1"
        >
          Yes, I have another question
        </Button>
        <Button 
          onClick={() => onConfirm('no')} 
          variant="outline" 
          className="text-blue-dark border-blue-dark hover:bg-blue-dark/10"
        >
          No, that's all
        </Button>
      </div>
    </div>
  );
};

export default ChatPostConfirmation;
