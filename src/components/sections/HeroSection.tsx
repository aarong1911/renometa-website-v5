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
      className="hero-section relative min-h-[80vh] pt-[96px] overflow-hidden"
    >
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute top-0 left-0 w-full h-full object-cover z-0 backdrop-brightness-75"
      >
        <source src="/video-hero-section.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20 z-10" />

      {/* Content */}
      <div className="container-custom flex flex-col items-center justify-center text-center py-20 min-h-[80vh] relative z-20">
        <div className="w-full max-w-3xl space-y-10">
          <ScrollReveal>
            <span className="bg-gold/10 text-gold px-3 py-1 rounded-full text-sm font-medium border border-gold/20 mt-16 md:mt-0 inline-block">
              For Remodeling & Home Service Businesses
            </span>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading leading-tight text-blue-dark">
              Digital Solutions That Power Growth
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={400}>
            <p className="text-lg text-gray-700 mb-4">
              Custom digital solutions designed to help remodeling and home service businesses attract more leads, close more deals, and deliver exceptional customer experiences.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={600}>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                className="btn-primary hover:bg-blue-light transition-colors duration-300"
                onClick={() => onScrollToSection('contact')}
              >
                Get a Free Strategy Call
              </Button>
              <Button
                className="btn-outline hover:bg-blue-light hover:text-white hover:border-blue-light transition-colors duration-300"
                onClick={() => onScrollToSection('services')}
              >
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
