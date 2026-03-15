// components/ChatInterface.tsx

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { CustomerAgentFormData } from "@/types/form";
import RequestEstimateForm from "@/components/RequestEstimateForm";
import { useToast } from "@/components/ui/use-toast";

interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "agent";
  timestamp: Date;
  quickReplies?: string[];
  bookAppointment?: boolean;
}

interface ChatInterfaceProps {
  userData: CustomerAgentFormData;
  userRequestId: string;
  onClose: () => void;
}

export function ChatInterface({ userData, userRequestId, onClose }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      content: `<div class="ai-reply"><p>Hi ${userData.name}! 👋 I'm here to help you learn about our services and find the best solution for your project.</p><p>What can I help you with today?</p></div>`,
      role: "agent",
      timestamp: new Date(),
      quickReplies: ["What services do you offer?", "How much does it cost?", "Schedule a consultation"],
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEstimateForm, setShowEstimateForm] = useState(false);
  const [queriesRemaining, setQueriesRemaining] = useState<number | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const chatHistoryRef = useRef<{ role: string; content: string }[]>([]);

  const sendMessage = async (messageText?: string, isQuickReply = false) => {
    const text = messageText || input;
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: text,
      role: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    chatHistoryRef.current = [
      ...chatHistoryRef.current,
      { role: "user", content: text },
    ].slice(-10);

    // ✅ Keyword trigger — show appointment form immediately
    const lowerText = text.toLowerCase();
    if (!isQuickReply && (
      lowerText.includes("estimate") ||
      lowerText.includes("quote") ||
      lowerText.includes("book") ||
      lowerText.includes("appointment") ||
      lowerText.includes("schedule") ||
      lowerText.includes("consultation")
    )) {
      setShowEstimateForm(true);
      const agentMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "<div class='ai-reply'><p>I'd love to set that up for you! Please fill out the form below and our team will reach out to confirm your appointment. 📅</p></div>",
        role: "agent",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, agentMsg]);
      setIsTyping(false);
      return;
    }

    try {
      const response = await axios.post('/.netlify/functions/query-agent', {
        user_request_id: userRequestId,
        question: text,
        chat_history: chatHistoryRef.current,
      });

      const { answer, quickReplies, bookAppointment, queriesRemaining: remaining } = response.data;

      if (remaining !== undefined) {
        setQueriesRemaining(remaining);
        if (remaining <= 2 && remaining > 0) {
          toast({
            title: `${remaining} question${remaining === 1 ? '' : 's'} remaining`,
            description: "You're approaching the daily limit for this website.",
            variant: "destructive",
          });
        }
      }

      chatHistoryRef.current = [
        ...chatHistoryRef.current,
        { role: "agent", content: answer },
      ].slice(-10);

      const agentMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        content: answer,
        role: "agent",
        timestamp: new Date(),
        quickReplies: quickReplies || [],
        bookAppointment: bookAppointment || false,
      };

      setMessages(prev => [...prev, agentMessage]);

      if (bookAppointment) {
        setShowEstimateForm(true);
      }

    } catch (error: any) {
      console.error("AI response error:", error);

      const isRateLimit = error.response?.status === 429;
      const errorMsg = isRateLimit
        ? error.response?.data?.answer || "You've reached the daily question limit for this website."
        : "Sorry, I'm having trouble right now. Please try again in a moment.";

      const errorMessage: ChatMessage = {
        id: (Date.now() + 3).toString(),
        content: `<div class='ai-reply'><p>${errorMsg}</p></div>`,
        role: "agent",
        timestamp: new Date(),
        quickReplies: isRateLimit ? [] : ["Try again"],
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickReply = (reply: string) => {
    const bookingKeywords = ["schedule", "book", "estimate", "consultation", "quote", "appointment"];
    const isBooking = bookingKeywords.some(k => reply.toLowerCase().includes(k));
    if (isBooking) {
      setShowEstimateForm(true);
      const agentMsg: ChatMessage = {
        id: Date.now().toString(),
        content: "<div class='ai-reply'><p>I'd love to set that up! Please fill out the form below and our team will reach out to confirm. 📅</p></div>",
        role: "agent",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, agentMsg]);
      return;
    }
    sendMessage(reply, true);
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
  }, [messages, showEstimateForm]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white dark:bg-gray-900">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <div>
            <h2 className="text-sm font-semibold">{userData.company} Customer Service</h2>
            <p className="text-xs text-gray-500">Online now</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {queriesRemaining !== null && (
            <span className="text-xs text-gray-400">{queriesRemaining} questions left</span>
          )}
          <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4 overflow-y-auto" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="space-y-2">
              <div className={`flex ${message.role === "agent" ? "justify-start" : "justify-end"}`}>
                {message.role === "agent" && (
                  <div className="h-7 w-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold mr-2 mt-1 shrink-0">
                    AI
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                    message.role === "agent"
                      ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-sm"
                      : "bg-blue-600 text-white rounded-tr-sm"
                  }`}
                >
                  {message.role === "agent" ? (
                    <div dangerouslySetInnerHTML={{ __html: message.content }} />
                  ) : (
                    message.content
                  )}
                </div>
              </div>

              {/* Quick Reply Buttons */}
              {message.role === "agent" && message.quickReplies && message.quickReplies.length > 0 && (
                <div className="flex flex-wrap gap-2 ml-9">
                  {message.quickReplies.map((reply, i) => (
                    <button
                      key={i}
                      onClick={() => handleQuickReply(reply)}
                      disabled={isTyping}
                      className="px-3 py-1.5 text-xs border border-blue-300 text-blue-600 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="h-7 w-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold mr-2 shrink-0">
                AI
              </div>
              <div className="flex gap-1 px-4 py-3 rounded-2xl rounded-tl-sm bg-gray-100 dark:bg-gray-800">
                <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}

          {/* Appointment form */}
          {showEstimateForm && (
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border">
              <RequestEstimateForm userRequestId={userRequestId} />
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t bg-white dark:bg-gray-900">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 rounded-full text-sm"
            disabled={isTyping}
          />
          <Button
            size="icon"
            onClick={() => sendMessage()}
            disabled={!input.trim() || isTyping}
            className="rounded-full bg-blue-600 hover:bg-blue-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
