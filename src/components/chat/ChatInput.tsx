
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChatInputProps {
  userInput: string;
  setUserInput: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
}

const ChatInput = ({ userInput, setUserInput, onSubmit, onReset }: ChatInputProps) => {
  return (
    <div className="flex flex-col space-y-3">
      <form onSubmit={onSubmit} className="flex gap-2">
        <Input 
          type="text" 
          placeholder="Type your question here..."
          className="w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <Button type="submit" className="bg-gold hover:bg-gold-light text-blue-dark">
          Send
        </Button>
      </form>
      <Button onClick={onReset} variant="outline" className="text-blue-dark border-blue-dark hover:bg-blue-dark/10">
        Start Over
      </Button>
    </div>
  );
};

export default ChatInput;
