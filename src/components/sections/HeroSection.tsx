import React from 'react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onScrollToSection: (id: string) => void;
}

const HeroSection = ({ onScrollToSection }: HeroSectionProps) => {
  return (
    <section
      id="hero"
      className="hero-section relative bg-cover bg-center bg-no-repeat pt-32"
      style={{
        backgroundImage: 'url("/images/ChatGPT Image Hero Section.png")',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-dark to-blue-light opacity-10 z-0"></div>
      <div className="container-custom flex flex-col items-center justify-center text-center py-20 min-h-[80vh] relative z-10">
        <div className="w-full max-w-3xl space-y-10">
          <ScrollReveal>
            <span className="bg-gold/10 text-gold px-3 py-1 rounded-full text-sm font-medium border border-gold/20 mt-16 md:mt-0 inline-block">
              For Remodeling & Home Service Businesses
            </span>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading leading-tight text-blue-dark">
              Digital Solutions That Power <span className="gradient-text">Growth</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={400}>
            <p className="text-lg text-gray-600 mb-4">
              Custom digital solutions designed to help remodeling and home service businesses attract more leads, close more deals, and deliver exceptional customer experiences.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={600}>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button className="btn-primary hover:bg-blue-light transition-colors duration-300" onClick={() => onScrollToSection('contact')}>
                Get a Free Strategy Call
              </Button>
              <Button className="btn-outline hover:bg-blue-light hover:text-white hover:border-blue-light transition-colors duration-300" onClick={() => onScrollToSection('services')}>
                Explore Services
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
