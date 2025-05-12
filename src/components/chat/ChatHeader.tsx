
import { X } from 'lucide-react';

interface ChatHeaderProps {
  onClose: () => void;
}

const ChatHeader = ({ onClose }: ChatHeaderProps) => {
  return (
    <div className="bg-blue-dark text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
      <div className="flex items-center">
        <img 
          src="/lovable-uploads/7217f6a6-a095-4b8f-b0b1-4e2142a3baee.png" 
          alt="RenoMeta Logo" 
          className="h-8 mr-2"
        />
        
      </div>
      <button onClick={onClose} className="text-white hover:text-gray-200" aria-label="Close chat">
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};

export default ChatHeader;
