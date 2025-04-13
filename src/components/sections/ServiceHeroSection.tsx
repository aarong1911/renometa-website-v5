
import React from 'react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { Button } from '@/components/ui/button';

interface ServiceHeroSectionProps {
  title: string;
  description: string;
  tagline: string;
  heroImage: string;
}

const ServiceHeroSection = ({ title, description, tagline, heroImage }: ServiceHeroSectionProps) => {
  return (
    <section id="hero" className="hero-section relative">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat" 
        style={{ 
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          filter: 'brightness(0.3)'
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-dark to-blue-light opacity-30 z-0"></div>
      <div className="container-custom flex flex-col items-center justify-center text-center py-20 min-h-[60vh] relative z-10">
        <div className="w-full max-w-3xl space-y-8">
          <ScrollReveal>
            <span className="bg-gold/10 text-gold px-3 py-1 rounded-full text-sm font-medium border border-gold/20 mt-16 md:mt-0 inline-block">
              {tagline}
            </span>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading leading-tight text-white">
              {title}
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={400}>
            <p className="text-lg text-gray-100 mb-4 max-w-2xl mx-auto">
              {description}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={600}>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button className="bg-white text-blue-dark hover:bg-blue-light hover:text-white transition-colors duration-300">
                Get Started
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-dark transition-colors duration-300">
                Learn More
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default ServiceHeroSection;
