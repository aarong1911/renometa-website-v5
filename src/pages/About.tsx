
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import HeroSection from '@/components/sections/HeroSection';
import CTASection from '@/components/sections/CTASection';
import TestimonialSection from '@/components/sections/TestimonialSection';
import FAQSection from '@/components/sections/FAQSection';
import AboutContentSection from '@/components/sections/AboutContentSection';
import ProcessSection from '@/components/sections/ProcessSection';

const About = () => {
  const pageData = {
    title: 'About RenoMeta',
    tagline: 'Built for Builders. Powered by Automation.',
    description: 'RenoMeta is the digital backbone for remodeling, HVAC, and home service companies ready to scale.',
    heroImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c',
  };

  const testimonial = {
    quote: "Working with RenoMeta has completely transformed our business. Their systems approach to digital marketing has helped us double our leads while cutting our workload in half.",
    author: "Michael Thompson",
    position: "Owner",
    company: "Elite Home Renovations",
  };

  const processSteps = [
    {
      title: "Discovery & Analysis",
      description: "We start by understanding your business goals, target audience, and current digital presence to craft a tailored strategy.",
      stepNumber: 1,
    },
    {
      title: "Strategic Planning",
      description: "Based on our discovery, we develop a comprehensive plan outlining solutions that will drive growth for your specific business needs.",
      stepNumber: 2,
    },
    {
      title: "Implementation",
      description: "Our team executes the plan, building integrated systems that work together to generate and convert leads efficiently.",
      stepNumber: 3,
    },
    {
      title: "Optimization & Growth",
      description: "We continually monitor, test, and refine to ensure your digital systems deliver increasing returns over time.",
      stepNumber: 4,
    },
  ];

  const faqItems = [
    {
      question: "What makes RenoMeta different from other digital agencies?",
      answer: "While most agencies focus on isolated tactics, RenoMeta creates integrated systems that connect your entire customer journey. We specialize exclusively in remodeling and home services businesses, bringing industry-specific expertise to every solution.",
    },
    {
      question: "How long does it take to see results?",
      answer: "Most clients begin seeing measurable improvements within 30-60 days of implementation, with significant growth within 90 days. Our systems approach delivers compounding returns over time.",
    },
    {
      question: "Do you work with businesses of all sizes?",
      answer: "Yes, we work with contractors and home service businesses ranging from solo operations to multi-location companies with dozens of employees. Our solutions scale with your business.",
    },
  ];

  return (
    <MainLayout>
      <HeroSection
        title={pageData.title}
        tagline={pageData.tagline}
        description={pageData.description}
        heroImage={pageData.heroImage}
      />
      
      <AboutContentSection />
      
      <ProcessSection processSteps={processSteps} />
      
      <TestimonialSection testimonial={testimonial} />
      
      <FAQSection faqItems={faqItems} />
      
      <CTASection 
        ctaText="Ready to Build Your Growth Engine?" 
        title="Digital Solutions" 
      />
    </MainLayout>
  );
};

export default About;
