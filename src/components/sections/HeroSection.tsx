
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ScrollReveal from '@/components/ui/ScrollReveal';

interface HeroSectionProps {
  title: string;
  description: string;
  tagline: string;
  heroImage: string;
}

const HeroSection = ({
  title,
  description,
  tagline,
  heroImage
}: HeroSectionProps) => {
  return (
    <section className="hero-section bg-white">
      <div className="container-custom flex flex-col md:flex-row items-center justify-center">
        <div className="w-full md:w-1/2 py-12 md:py-0 text-center">
          <ScrollReveal>
            <span className="bg-gold/10 text-gold px-3 py-1 rounded-full text-sm font-medium inline-block mx-auto">
              {tagline}
            </span>
          </ScrollReveal>
          
          <ScrollReveal delay={200} className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-5xl font-bold font-heading mt-6 mb-6 leading-tight text-blue-dark mx-auto">
              {title}
            </h1>
          </ScrollReveal>
          
          <ScrollReveal delay={400}>
            <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto">
              {description}
            </p>
          </ScrollReveal>
          
          <ScrollReveal delay={600}>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button className="btn-primary" asChild>
                <Link to="/contact">Schedule a Consultation</Link>
              </Button>
              <Button className="btn-outline" asChild>
                <a href="#features">Learn More</a>
              </Button>
            </div>
          </ScrollReveal>
        </div>
        
        <div className="w-full md:w-1/2 mt-8 md:mt-0 flex justify-center">
          <ScrollReveal direction="left">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-40 h-40 bg-gold rounded-full opacity-10 animate-pulse-soft"></div>
              <div className="absolute -bottom-4 -right-4 w-60 h-60 bg-blue-dark rounded-full opacity-10 animate-pulse-soft" style={{ animationDelay: '1s' }}></div>
              <img 
                src={heroImage}
                alt={title}
                className="w-full h-auto rounded-lg shadow-lg relative z-10"
              />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
