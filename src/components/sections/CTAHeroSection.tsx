
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
            <Button className="group bg-[#3a4150] text-white hover:bg-[#3a4150]/90 transition-colors w-48 py-6 flex items-center justify-center">
              <span className="text-lg">Start Free Trial</span>
              <span className="ml-1 text-lg transform transition-transform duration-200 group-hover:translate-x-1">
                ➜
              </span>
            </Button>
            <p className="text-sm opacity-80 mt-2">No credit card required. Cancel anytime.</p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default CTAHeroSection;
