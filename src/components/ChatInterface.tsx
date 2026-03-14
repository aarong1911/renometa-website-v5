// components/ChatInterface.tsx

import { useEffect, useRef, useState } from "react";
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
  userRequestId: string;
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

    // Estimate fallback
    if (
      lowerInput.includes("estimate") ||
      lowerInput.includes("quote") ||
      lowerInput.includes("book") ||
      lowerInput.includes("appointment") ||
      lowerInput.includes("schedule") ||
      lowerInput.includes("consultation")
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
      return;
    }

    try {
      // ✅ FIX: Use relative URL instead of hardcoded localhost
      const response = await axios.post('/.netlify/functions/query-agent', {
        user_request_id: userRequestId,
        question: input,
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
                {message.role === "agent" ? (
                  <div dangerouslySetInnerHTML={{ __html: message.content }} />
                ) : (
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
