
import React from 'react';
import { Button } from '@/components/ui/button';

interface ChatInitialOptionsProps {
  onInfoClick: () => void;
  onScheduleClick: () => void;
}

const ChatInitialOptions = ({ onInfoClick, onScheduleClick }: ChatInitialOptionsProps) => {
  return (
    <div className="flex flex-col space-y-2">
      <Button 
        onClick={onInfoClick}
        className="bg-blue-dark hover:bg-blue-light w-full"
      >
        Get Information
      </Button>
      <Button 
        onClick={onScheduleClick}
        className="bg-gold hover:bg-gold-light w-full text-blue-dark"
      >
        Schedule Appointment
      </Button>
    </div>
  );
};

export default ChatInitialOptions;
