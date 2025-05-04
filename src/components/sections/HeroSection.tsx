
import React from 'react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface HeroSectionProps {
  onScrollToSection: (id: string) => void;
}

const HeroSection = ({
  onScrollToSection
}: HeroSectionProps) => {
  const navigate = useNavigate();
  
  return <section id="hero" className="hero-section relative min-h-screen w-full overflow-hidden">
      {/* Background Video */}
      <video autoPlay muted loop playsInline preload="auto" className="absolute top-0 left-0 w-full h-full object-cover z-0">
        <source src="/video-hero-section.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10" />

      {/* Content */}
      <div className="container-custom flex flex-col items-center justify-center text-center py-20 min-h-screen relative z-20">
        <div className="w-[90%] max-w-3xl space-y-10 mt-16">
          <ScrollReveal>
            <span className="bg-gold/10 text-gold px-3 py-1 rounded-full text-sm font-medium border border-gold/20 mt-16 md:mt-0 inline-block">
              For Remodeling & Home Service Businesses
            </span>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading leading-tight text-blue-dark">Digital tool belt for seamless operations and rapid expansion</h1>
          </ScrollReveal>
          <ScrollReveal delay={400}>
            <p className="text-lg text-gray-700 mb-4">
              Custom digital solutions designed to help remodeling and home service businesses attract more leads, close more deals, and deliver exceptional customer experiences.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={600}>
            <div className="flex flex-col items-center justify-center">
              <Button 
                className="bg-[#3a4150] text-white hover:bg-[#3a4150]/90 transition-colors w-40 py-6"
                onClick={() => navigate('/free-trial')}
              >
                Start Free
              </Button>
              <p className="text-sm text-gray-600 mt-2">No credit card required. Cancel anytime.</p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>;
};

export default HeroSection;
