
import React, { useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import HeroSection from '@/components/sections/HeroSection';
import LogosCarouselSection from '@/components/sections/LogosCarouselSection';
import ServicesSection from '@/components/sections/ServicesSection';
import BenefitsSection from '@/components/sections/BenefitsSection';
import CaseStudiesSection from '@/components/sections/CaseStudiesSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import CTAHeroSection from '@/components/sections/CTAHeroSection';
import BlogPreviewSection from '@/components/sections/BlogPreviewSection';
import ContactSection from '@/components/sections/ContactSection';

const Index = () => {
  const services = [
    {
      title: 'Smart Website Development',
      description: 'Custom-built, high-converting websites tailored specifically for remodeling businesses.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      link: '/services/website-development'
    },
    {
      title: 'Advanced SEO',
      description: 'Specialized search engine optimization strategies to dominate local searches in your service area.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      link: '/services/advanced-seo'
    },
    {
      title: 'AI-Powered Agents',
      description: 'Intelligent virtual assistants that qualify leads and book appointments 24/7.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      link: '/services/ai-agents'
    },
    {
      title: 'Intelligent Automation',
      description: 'Streamline your workflows and follow-ups with smart systems that save time and increase conversion.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      link: '/services/automation'
    },
    {
      title: 'Seamless Integration',
      description: 'Connect all your tools and software to create a unified business system with no gaps or data silos.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16v-4m-4 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H4a2 2 0 00-2 2v6a2 2 0 002 2zm10 0h6m-6-8a2 2 0 11-4 0 2 2 0 014 0zM6 20v-2a2 2 0 012-2h8a2 2 0 012 2v2M6 12h.01M10 12h.01" />
        </svg>
      ),
      link: '/services/integration'
    },
    {
      title: 'Performance Optimization',
      description: 'Accelerate your website for lightning-fast speed and improved conversion rates.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      link: '/services/performance-optimization'
    }
  ];

  const brandLogos = [
    { name: 'Zapier', logo: 'https://logo.clearbit.com/zapier.com', description: 'Connect your tools and automate workflows' },
    { name: 'React', logo: 'https://logo.clearbit.com/reactjs.org', description: 'Build dynamic, high-performance web interfaces' },
    { name: 'Calendly', logo: 'https://logo.clearbit.com/calendly.com', description: 'Turn visitors into appointments with effortless, self-serve booking' },
    { name: 'Slack', logo: 'https://logo.clearbit.com/slack.com', description: 'Streamline team communication and support workflows' },
    { name: 'Stripe', logo: 'https://logo.clearbit.com/stripe.com', description: 'Accept secure payments with ease' },
    { name: 'Google', logo: 'https://logo.clearbit.com/google.com', description: 'Boost your visibility on search and maps' },
    { name: 'HubSpot', logo: 'https://logo.clearbit.com/hubspot.com', description: 'CRM and marketing automation built for scale' },
    { name: 'GitHub', logo: 'https://logo.clearbit.com/github.com', description: 'Version control and collaboration for modern development' }
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <MainLayout>
      <HeroSection onScrollToSection={scrollToSection} />
      <LogosCarouselSection brandLogos={brandLogos} />
      <ServicesSection services={services} />
      <BenefitsSection />
      <CaseStudiesSection />
      <TestimonialsSection />
      <CTAHeroSection onScrollToSection={scrollToSection} />
      <BlogPreviewSection />
      <ContactSection />
    </MainLayout>
  );
};

export default Index;
