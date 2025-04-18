
import React from 'react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { Button } from '@/components/ui/button';

interface CTAHeroSectionProps {
  onScrollToSection: (id: string) => void;
}

const CTAHeroSection = ({ onScrollToSection }: CTAHeroSectionProps) => {
  return (
    <section id="cta" className="section relative">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/lovable-uploads/1ea2d555-f5e6-4ea2-a766-d4fe68d02d39.png')",
          backgroundSize: 'cover',
          filter: 'brightness(0.9)'
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-dark/90 to-blue-light/90 mix-blend-multiply"></div>
      <div className="container-custom text-center relative z-10">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-6 text-white">
            Ready to Transform Your Digital Presence?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Schedule a free 30-minute strategy call to discover how we can help your remodeling business thrive online.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-blue-dark hover:bg-blue-light hover:text-white transition-colors duration-300" 
            onClick={() => onScrollToSection('contact')}
          >
            Book Your Free Strategy Call
          </Button>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default CTAHeroSection;
