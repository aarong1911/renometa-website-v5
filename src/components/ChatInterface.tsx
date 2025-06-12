// components/ChatInterface.tsx

import { useEffect, useRef, useState } from "react";
// import { v4 as uuidv4 } from "uuid"; // REMOVED: No longer generating UUID here
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/types/chat";
import { Send } from "lucide-react";
import { CustomerAgentFormData } from "@/types/form";
import RequestEstimateForm from "@/components/RequestEstimateForm";

interface ChatInterfaceProps {
  userData: CustomerAgentFormData;
  userRequestId: string; // ADDED: Now expecting userRequestId as a prop
  onClose: () => void;
}

export function ChatInterface({ userData, userRequestId, onClose }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      content: `Hi ${userData.name}, I'm your AI customer service agent for ${userData.company}. How can I help you today?`,
      role: "agent",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEstimateForm, setShowEstimateForm] = useState(false);
  // REMOVED: No longer generating requestId locally
  // const [requestId] = useState(() => uuidv4()); 

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    const lowerInput = input.toLowerCase();

    // Estimate fallback - EXPANDED KEYWORDS
    if (
      lowerInput.includes("estimate") ||
      lowerInput.includes("quote") ||
      lowerInput.includes("book") ||
      lowerInput.includes("appointment") || // ADDED
      lowerInput.includes("schedule") ||    // ADDED
      lowerInput.includes("consultation")    // OPTIONAL: Added for more coverage
    ) {
      setShowEstimateForm(true);
      const estimateMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "Sure, I can help you schedule an estimate. Please fill out the form below.",
        role: "agent",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, estimateMessage]);
      setIsTyping(false);
      return; // Crucial: This stops the code from calling the AI backend
    }

    try {
      // FIX: Use userRequestId from props
      const response = await axios.post('http://localhost:8888/.netlify/functions/query-agent', {
        user_request_id: userRequestId, // CHANGED: Now using the prop
        question: input,
        // Optional: Pass chat history for context if your query-agent supports it
        // chat_history: messages.map(msg => ({ role: msg.role, content: msg.content }))
      });

      const answer = response.data?.answer || "I'm not sure how to respond to that.";

      const agentMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        content: answer,
        role: "agent",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, agentMessage]);
    } catch (error: any) {
      console.error("AI response error:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 3).toString(),
        content: "Sorry, I'm having trouble fetching a response right now.",
        role: "agent",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <h2 className="text-lg font-medium">{userData.company} Customer Service</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4 overflow-y-auto" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "agent" ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-[80%] px-4 py-2 ${
                  message.role === "agent" ? "chat-bubble-agent" : "chat-bubble-user"
                }`}
              >
                {/* Use dangerouslySetInnerHTML for agent messages */}
                {message.role === "agent" ? (
                  <div dangerouslySetInnerHTML={{ __html: message.content }} />
                ) : (
                  // User messages are plain text, so render normally
                  message.content
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                <div className="h-2 w-2 rounded-full bg-gray-400 animate-pulse"></div>
                <div className="h-2 w-2 rounded-full bg-gray-400 animate-pulse delay-200"></div>
                <div className="h-2 w-2 rounded-full bg-gray-400 animate-pulse delay-400"></div>
              </div>
            </div>
          )}

          {showEstimateForm && (
            <div className="mt-4">
              {/* FIX: Ensure RequestEstimateForm also receives userRequestId */}
              <RequestEstimateForm userRequestId={userRequestId} /> 
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button size="icon" onClick={sendMessage} disabled={!input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}