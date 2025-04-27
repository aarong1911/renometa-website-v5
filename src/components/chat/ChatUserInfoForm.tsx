
import { User, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChatUserInfoFormProps {
  currentField: 'name' | 'email' | 'phone';
  userInput: string;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
}

const ChatUserInfoForm = ({
  currentField,
  userInput,
  onInputChange,
  onSubmit,
  onReset
}: ChatUserInfoFormProps) => {
  return (
    <div className="flex flex-col space-y-3">
      <form onSubmit={onSubmit} className="flex gap-2">
        <div className="relative w-full">
          <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">
            {currentField === 'name' && <User className="h-5 w-5" />}
            {currentField === 'email' && <Mail className="h-5 w-5" />}
            {currentField === 'phone' && <Phone className="h-5 w-5" />}
          </div>
          <Input 
            type={currentField === 'email' ? 'email' : 'text'}
            placeholder={
              currentField === 'name' ? 'Your name' : 
              currentField === 'email' ? 'Your email' : 
              'Your phone number'
            }
            className="pl-10 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
            value={userInput}
            onChange={(e) => onInputChange(e.target.value)}
          />
        </div>
        <Button type="submit" className="bg-gold hover:bg-gold-light text-blue-dark">
          Next
        </Button>
      </form>
      <Button 
        onClick={onReset} 
        variant="outline" 
        className="text-blue-dark border-blue-dark hover:bg-blue-dark/10"
      >
        Cancel
      </Button>
    </div>
  );
};

export default ChatUserInfoForm;
