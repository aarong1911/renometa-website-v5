
import React from 'react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { Button } from '@/components/ui/button';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface ServiceHeroSectionProps {
  title: string;
  description: string;
  tagline: string;
  heroImage: string;
}

const ServiceHeroSection = ({ title, description, tagline, heroImage }: ServiceHeroSectionProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    // If we're already on the page with the section
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Navigate to homepage and then scroll to the section
      navigate('/', { state: { scrollTo: sectionId } });
    }
  };

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
      
      <div className="container-custom relative z-10 pt-8">
        <Link 
          to="/solutions" 
          className="inline-flex items-center text-white hover:text-gold transition-colors bg-black/20 px-4 py-2 rounded-md"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          <span>Back to Solutions</span>
        </Link>
      </div>
      
      <div className="container-custom flex flex-col items-center justify-center text-center py-16 min-h-[60vh] relative z-10">
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
            <div className="flex flex-col items-center justify-center">
              <Button 
                className="bg-white text-blue-dark hover:bg-blue-light hover:text-white transition-colors duration-300 w-40 py-6"
                onClick={() => navigate('/free-trial')}
              >
                Start Free
              </Button>
              <p className="text-sm text-gray-100 mt-2">No credit card required. Cancel anytime.</p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default ServiceHeroSection;
