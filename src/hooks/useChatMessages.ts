
import { useState } from 'react';

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
      content: 'Welcome to RenoMeta! How can we help you today?'
    }]);
  };

  return {
    messages,
    addMessage,
    addBotMessage,
    addUserMessage,
    resetMessages
  };
};
