import React from 'react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface HeroSectionProps {
  onScrollToSection: (id: string) => void;
}

const HeroSection = ({ onScrollToSection }: HeroSectionProps) => {
  const navigate = useNavigate();

  return (
    <section
  id="hero"
  className="relative w-full min-h-[90vh] md:min-h-screen bg-no-repeat bg-cover overflow-hidden"
  style={{
  backgroundImage: `url("/Background-image-sandy4.png")`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}}

>

      {/* Overlay */}
      <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 hidden" />

      {/* Content */}
      <div className="container-custom flex flex-col items-center justify-center text-center py-20 min-h-screen relative z-20">
        <div className="w-[90%] max-w-3xl space-y-10 mt-16">
          <ScrollReveal>
            <span className="bg-white text-gold px-3 py-1 rounded-full text-sm font-medium border border-gold mt-16 md:mt-0 inline-block">
              For Remodeling & Home Service Businesses
            </span>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading leading-tight text-blue-dark">
              Digital tool belt for seamless operations and rapid expansion
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={400}>
            <p className="text-lg text-gray-700 mb-4">
              Custom digital solutions designed to help remodeling and home service businesses attract more leads, close more deals, and deliver exceptional customer experiences.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={600}>
            <div className="flex flex-col items-center justify-center">
              <Button
                onClick={() => navigate('/free-trial')}
                className="group bg-[#3a4150] text-white hover:bg-[#3a4150]/90 transition-colors w-48 py-6 flex items-center justify-center"
              >
                <span className="text-lg">Start Free Trial</span>
                <span className="ml-1 text-lg transform transition-transform duration-200 group-hover:translate-x-1">
                  ➜
                </span>
              </Button>
              <p className="text-sm text-gray-600 mt-2">No credit card required. Cancel anytime.</p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
