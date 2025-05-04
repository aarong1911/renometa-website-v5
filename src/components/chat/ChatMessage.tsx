
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  type: 'user' | 'bot';
  content: string;
}

const ChatMessage = ({ type, content }: ChatMessageProps) => {
  return (
    <div className={cn("flex", type === 'user' ? "justify-end" : "justify-start")}>
      <div 
        className={cn(
          "max-w-[80%] rounded-lg px-4 py-2 text-sm", // added text-sm for smaller font
          type === 'user' 
            ? "bg-gold text-white rounded-br-none" 
            : "bg-gray-100 text-gray-800 rounded-bl-none"
        )}
      >
        {content}
      </div>
    </div>
  );
};

export default ChatMessage;
