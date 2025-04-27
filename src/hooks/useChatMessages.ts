
import { useState } from 'react';

export type Message = {
  type: 'user' | 'bot';
  content: string;
};

// Enhanced website content knowledge base
const websiteContent = {
  services: {
    'website development': 'Our Smart Website Development service creates beautiful, responsive websites optimized for remodeling businesses with lead generation capabilities.',
    'seo': 'Our Advanced SEO service improves your online visibility with local search optimization, content strategy, and performance tracking.',
    'ai agents': 'Our AI-Powered Agents service implements conversational AI for your business to engage customers and qualify leads 24/7.',
    'automation': 'Our Intelligent Automation service streamlines repetitive tasks in your remodeling business workflow for increased efficiency.',
    'integration': 'Our Seamless Integration service connects your business tools and software to create a unified system with real-time data flow.',
    'performance': 'Our Performance Optimization service improves your website speed, user experience, and conversion rates through data-driven improvements.'
  },
  testimonials: {
    'kitchen remodeling': 'Our website leads have doubled since working with RenoMeta. Their understanding of the remodeling industry made all the difference. - Michael Rodriguez, Owner at Rodriguez Remodeling',
    'windows': 'The AI agents have transformed our business. We\'re booking jobs 24/7 and our team can focus on the work instead of answering basic questions. - Sarah Johnson, Operations Manager at Johnson Home Services',
    'seo results': 'The SEO work they\'ve done has put us at the top of local searches. We\'re now the first call for homeowners in our area. - David Chen, Marketing Director at Luxe Bathroom Renovations'
  },
  caseStudies: {
    'elite remodeling': 'Elite Remodeling Co. doubled their qualified leads while cutting ad spend by 30% through our website development and optimization services.',
    'superior windows': 'Superior Windows & Doors transformed their website into a lead generation machine, achieving an 87% increase in conversion rate.',
    'precision plumbing': 'Precision Plumbing increased after-hours bookings by 215% using our AI agents, while maintaining a 98% customer satisfaction rate.'
  },
  blog: {
    'website tips': '7 Website Must-Haves for Remodeling Companies: Essential elements that every remodeling website needs to convert visitors into qualified leads.',
    'ai revolution': 'How AI is Revolutionizing Customer Service in Home Services: Learn how artificial intelligence is changing how home service businesses handle customer interactions.',
    'local seo': 'Local SEO: The Ultimate Guide for Contractors - A complete guide to dominating local search results and attracting more customers in your service area.'
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

    // Check for testimonial-related questions
    for (const [topic, testimony] of Object.entries(websiteContent.testimonials)) {
      if (lowercaseQuery.includes(topic) || lowercaseQuery.includes('testimonial') || lowercaseQuery.includes('review')) {
        return testimony;
      }
    }

    // Check for case study related questions
    for (const [company, study] of Object.entries(websiteContent.caseStudies)) {
      if (lowercaseQuery.includes(company) || lowercaseQuery.includes('case study') || lowercaseQuery.includes('success story')) {
        return study;
      }
    }

    // Check for blog related questions
    for (const [topic, article] of Object.entries(websiteContent.blog)) {
      if (lowercaseQuery.includes(topic) || lowercaseQuery.includes('article') || lowercaseQuery.includes('blog')) {
        return article;
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
    return "I can help you learn more about our services, share success stories, or discuss how we can help your business. Would you like to know about our website development, SEO, AI agents, automation, integration, or performance optimization services? Or would you prefer to hear some client testimonials or case studies?";
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
