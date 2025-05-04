
import { useState } from 'react';
import { findRelevantContent } from '@/utils/contentSearch';

export type Message = {
  type: 'user' | 'bot';
  content: string;
};

export const useChatMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  const addBotMessage = (content: string) => {
    addMessage({ type: 'bot', content });
  };

  const addUserMessage = (content: string) => {
    addMessage({ type: 'user', content });
  };

  const resetMessages = () => {
    setMessages([{
      type: 'bot',
      content: 'Welcome to RenoMeta! We offer services like Website Development, SEO, and AI Agents, as well as solutions for CRM, Sales, Marketing, and Job Management. How can I help your remodeling business grow?'
    }]);
  };

  return {
    messages,
    addMessage,
    addBotMessage,
    addUserMessage,
    resetMessages,
    findRelevantContent
  };
};
