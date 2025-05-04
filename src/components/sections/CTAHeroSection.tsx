
import React from 'react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface CTAHeroSectionProps {
  onScrollToSection: (id: string) => void;
}

const CTAHeroSection = ({ onScrollToSection }: CTAHeroSectionProps) => {
  const navigate = useNavigate();
  
  return (
    <section id="cta" className="section bg-gradient-to-br from-blue-dark to-blue-light text-white">
      <div className="container-custom text-center">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-6">
            Ready to Transform Your Digital Presence?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Schedule a free 30-minute strategy call to discover how we can help your remodeling business thrive online.
          </p>
          <div className="flex flex-col items-center justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-dark hover:bg-blue-light hover:text-white transition-colors duration-300 w-40 py-6" 
              onClick={() => navigate('/free-trial')}
            >
              Start Free
            </Button>
            <p className="text-sm opacity-80 mt-2">No credit card required. Cancel anytime.</p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default CTAHeroSection;
