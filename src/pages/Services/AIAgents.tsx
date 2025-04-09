
import React from 'react';
import ServicePageTemplate from '@/components/layout/ServicePageTemplate';

const AIAgents = () => {
  const serviceData = {
    title: 'AI-Powered Agents',
    tagline: 'Intelligent Virtual Assistants',
    description: 'Smart, industry-specific virtual assistants that engage with your website visitors 24/7, qualify leads, answer questions, and book appointments without human intervention.',
    heroImage: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1',
    ctaText: 'Ready to Add 24/7 Customer Service?',
    features: [
      {
        title: '24/7 Availability',
        description: 'Never miss a lead again with virtual assistants that engage visitors around the clock, even when your office is closed.',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      },
      {
        title: 'Industry-Specific Training',
        description: 'Our AI agents understand remodeling terminology and common questions, providing accurate information about your services.',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        )
      },
      {
        title: 'Lead Qualification',
        description: 'Automatically screen potential clients, gather project details, and prioritize high-value opportunities for your team.',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      },
      {
        title: 'Appointment Scheduling',
        description: 'Enable visitors to book consultations directly through the chat interface, synced with your calendar system.',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )
      },
      {
        title: 'Seamless Handoff',
        description: 'When human assistance is needed, the AI smoothly transfers conversations to your team with all context preserved.',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        )
      },
      {
        title: 'Analytics & Insights',
        description: 'Gain valuable insights into customer questions, pain points, and behaviors to improve your marketing and services.',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        )
      },
    ],
    processSteps: [
      {
        title: 'Discovery & Planning',
        description: 'We analyze your business needs, customer journey, and common inquiries to create an AI strategy.',
        stepNumber: 1,
      },
      {
        title: 'Knowledge Base Creation',
        description: 'We develop a comprehensive knowledge base about your services, processes, and frequently asked questions.',
        stepNumber: 2,
      },
      {
        title: 'AI Training & Customization',
        description: 'We train the AI model with remodeling industry knowledge and customize it to represent your specific business.',
        stepNumber: 3,
      },
      {
        title: 'Integration & Testing',
        description: 'We integrate the AI agent with your website and test it thoroughly with various scenarios and customer inquiries.',
        stepNumber: 4,
      },
      {
        title: 'Launch & Monitoring',
        description: 'After deployment, we closely monitor performance, making continuous improvements as the AI learns.',
        stepNumber: 5,
      },
    ],
    faqItems: [
      {
        question: 'Will the AI agent sound robotic or unnatural?',
        answer: 'No, our AI agents are designed to provide natural, conversational interactions. They use advanced language processing to understand context, respond appropriately to questions, and maintain a friendly tone that represents your brand. Most visitors won\'t realize they\'re interacting with an AI.',
      },
      {
        question: 'How accurately can the AI answer questions about remodeling?',
        answer: 'Our AI agents are specifically trained on remodeling and home services knowledge, including common project types, materials, processes, and pricing considerations. They can accurately answer most general questions and are programmed to know when to transfer complex inquiries to your human team.',
      },
      {
        question: 'Can the AI integrate with our existing tools and systems?',
        answer: 'Yes, our AI agents can integrate with your CRM, project management software, scheduling tools, and other business systems. This allows for seamless data sharing and automation of processes like appointment booking and lead information transfer.',
      },
      {
        question: 'What happens if the AI can\'t answer a customer\'s question?',
        answer: 'If the AI encounters a question outside its knowledge base or detects that a human would better handle the conversation, it smoothly transfers the conversation to your team. It provides a complete transcript and summary of the discussion so your team has full context when they take over.',
      },
      {
        question: 'How much time will this save my team?',
        answer: 'Most remodeling businesses report saving 15-20 hours per week by implementing our AI agents. The AI handles routine inquiries, pre-qualifies leads, and gathers initial project information, allowing your team to focus on high-value activities like meeting with qualified prospects and managing projects.',
      },
    ],
    testimonial: {
      quote: "The AI agent has been a game-changer for our business. It handles after-hours inquiries and qualification, which has led to a 35% increase in booked consultations. Our sales team loves that they get pre-qualified leads with all the information they need already collected.",
      author: "Thomas Reynolds",
      position: "Operations Director",
      company: "Contemporary Renovations",
    },
    relatedServices: [
      {
        title: "Smart Website Development",
        description: "Create a modern website that works seamlessly with our AI agents to enhance visitor experience.",
        link: "/services/website-development",
      },
      {
        title: "Intelligent Automation",
        description: "Combine AI agents with automation to create a fully streamlined lead nurturing system.",
        link: "/services/automation",
      },
      {
        title: "Seamless Integration",
        description: "Connect your AI agents with your existing business tools for maximum efficiency.",
        link: "/services/integration",
      },
    ]
  };

  return <ServicePageTemplate {...serviceData} />;
};

export default AIAgents;
