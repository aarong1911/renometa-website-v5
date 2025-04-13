
import React from 'react';
import ServicePageTemplate from '@/components/layout/ServicePageTemplate';
import { Building2, Medal, Rocket, Zap, Target, LineChart } from 'lucide-react';

const About = () => {
  const aboutData = {
    title: 'About RenoMeta',
    tagline: 'Our Story',
    description: 'Built for Builders. Powered by Automation. RenoMeta isn\'t your average marketing agency - we\'re the digital backbone for remodeling, HVAC, and home service companies ready to scale.',
    heroImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    ctaText: 'Ready to Build Your Digital Empire?',
    features: [
      {
        title: 'Smart Websites',
        description: 'High-performance websites that impress and convert visitors into qualified leads for your business.',
        icon: <Building2 className="h-7 w-7" />
      },
      {
        title: 'Lead Generation',
        description: 'Complete lead generation systems that work while you sleep, keeping your pipeline full of quality prospects.',
        icon: <Target className="h-7 w-7" />
      },
      {
        title: 'AI-Powered Agents',
        description: 'Intelligent virtual assistants that handle inquiries, bookings, and follow-ups without missing a beat.',
        icon: <Zap className="h-7 w-7" />
      },
      {
        title: 'CRM & Automation',
        description: 'Seamless systems that eliminate the busywork and keep your business organized and efficient.',
        icon: <Rocket className="h-7 w-7" />
      },
      {
        title: 'SEO Strategy',
        description: 'Dominate local search results with specialized SEO strategies that keep your calendar full of appointments.',
        icon: <LineChart className="h-7 w-7" />
      },
      {
        title: 'Growth Partnership',
        description: 'We don\'t just build websites. We build growth engines tailored for your specific business goals.',
        icon: <Medal className="h-7 w-7" />
      },
    ],
    processSteps: [
      {
        title: 'Discovery',
        description: 'We analyze your business goals, current digital presence, and market position to create a strategic plan.',
        stepNumber: 1,
      },
      {
        title: 'Strategy',
        description: 'Our team develops a customized digital strategy to address your unique challenges and opportunities.',
        stepNumber: 2,
      },
      {
        title: 'Implementation',
        description: 'We build and deploy your digital tools, ensuring everything works together as a unified system.',
        stepNumber: 3,
      },
      {
        title: 'Optimization',
        description: 'Through data analysis and testing, we continuously improve your digital assets for better results.',
        stepNumber: 4,
      },
      {
        title: 'Growth',
        description: 'As your partner, we scale your digital presence alongside your business growth, adapting as needed.',
        stepNumber: 5,
      },
    ],
    faqItems: [
      {
        question: 'What makes RenoMeta different from other agencies?',
        answer: 'We specialize exclusively in the remodeling and home service industries, with deep knowledge of your customer journey and business challenges. Instead of piecemeal solutions, we provide integrated systems that work together to drive real business growth.',
      },
      {
        question: 'How long does it take to see results?',
        answer: 'While initial implementation typically takes 4-6 weeks, many clients see improvements in lead quality and operational efficiency within the first month. SEO results typically begin showing within 90 days, with continued growth over time.',
      },
      {
        question: 'Do you work with businesses of all sizes?',
        answer: 'Yes! Whether you\'re a solo contractor or a growing team with multiple service lines, we scale our solutions to fit your needs. Our systems are designed to grow with you as your business expands.',
      },
      {
        question: 'How involved do we need to be in the process?',
        answer: 'We handle the heavy lifting, but your input is crucial during the initial strategy phase. After implementation, we\'ll provide training for your team and regular check-ins to ensure everything is working optimally.',
      },
      {
        question: 'What kind of return can I expect on my investment?',
        answer: 'Our clients typically see substantial returns through increased lead quality, higher conversion rates, and improved operational efficiency. Many report that our services pay for themselves within the first few months through new customer acquisitions.',
      },
    ],
    testimonial: {
      quote: "RenoMeta transformed how we do business. Their systems eliminated the chaos of sticky notes and missed calls, and our online presence now consistently brings in quality leads. Within three months, we saw a 40% increase in qualified appointments.",
      author: "Michael Harris",
      position: "Owner",
      company: "Harris Home Remodeling",
    },
    relatedServices: [
      {
        title: "Smart Website Development",
        description: "Custom, high-converting websites designed specifically for remodeling and home services businesses.",
        link: "/services/website-development",
      },
      {
        title: "AI-Powered Agents",
        description: "Add 24/7 customer service to your business with intelligent virtual assistants that qualify leads.",
        link: "/services/ai-agents",
      },
      {
        title: "Intelligent Automation",
        description: "Streamline your operations with custom automation solutions that save time and reduce errors.",
        link: "/services/automation",
      },
    ]
  };

  return <ServicePageTemplate {...aboutData} />;
};

export default About;
