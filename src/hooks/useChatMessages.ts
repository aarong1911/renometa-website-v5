
import { useState } from 'react';

export type Message = {
  type: 'user' | 'bot';
  content: string;
};

// Website content knowledge base
const websiteContent = {
  services: {
    'website development': 'Our Smart Website Development service creates beautiful, responsive websites optimized for remodeling businesses with lead generation capabilities.',
    'seo': 'Our Advanced SEO service improves your online visibility with local search optimization, content strategy, and performance tracking.',
    'ai agents': 'Our AI-Powered Agents service implements conversational AI for your business to engage customers and qualify leads 24/7.',
    'automation': 'Our Intelligent Automation service streamlines repetitive tasks in your remodeling business workflow for increased efficiency.',
    'integration': 'Our Seamless Integration service connects your business tools and software to create a unified system with real-time data flow.',
    'performance': 'Our Performance Optimization service improves your website speed, user experience, and conversion rates through data-driven improvements.'
  },
  about: 'RenoMeta isn\'t your average marketing agency — we\'re the digital backbone for remodeling, HVAC, and home service companies ready to scale. We combine smart websites, advanced SEO, AI-powered agents, and intelligent automation into one seamless system designed to attract, convert, and retain customers.',
  faq: {
    'pricing': 'Our service pricing varies based on your specific needs. We offer customized packages starting at $1,500. For a detailed quote, please schedule a consultation.',
    'timeline': 'Most projects are completed within 3-6 weeks, depending on scope and complexity. We provide detailed timelines during our initial consultation.',
    'process': 'Our process includes discovery, planning, development, testing, and launch phases. We maintain clear communication throughout each step.',
    'support': 'All our services include ongoing support. We offer maintenance packages to keep your digital assets running smoothly.',
    'portfolio': 'You can view our portfolio and case studies on our website under each service section. We have experience with various remodeling businesses.',
    'contact': 'You can contact us through this chat, by emailing support@renometa.com, or by scheduling a consultation through our booking system.'
  }
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

  const findRelevantContent = (query: string): string => {
    const lowercaseQuery = query.toLowerCase();
    
    // Check for service-related questions
    for (const [service, description] of Object.entries(websiteContent.services)) {
      if (lowercaseQuery.includes(service)) {
        return description;
      }
    }
    
    // Check for FAQ questions
    for (const [topic, answer] of Object.entries(websiteContent.faq)) {
      if (lowercaseQuery.includes(topic)) {
        return answer;
      }
    }
    
    // Check for general about questions
    if (lowercaseQuery.includes('about') || 
        lowercaseQuery.includes('who are you') || 
        lowercaseQuery.includes('what do you do')) {
      return websiteContent.about;
    }
    
    // Default response for unknown queries
    return "I'll help you learn more about our services. Would you like to know about our website development, SEO, AI agents, automation, integration, or performance optimization services? Or would you prefer to schedule a consultation?";
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

