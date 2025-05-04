
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
  isSolutionsPage?: boolean;
}

const ServiceHeroSection = ({ title, description, tagline, heroImage, isSolutionsPage = false }: ServiceHeroSectionProps) => {
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
      {/* Background */}
      <div className="absolute inset-0 z-0 bg-white"></div>
      
      {/* Back button only for solutions pages - adjusted position */}
      {isSolutionsPage && (
        <div className="container-custom relative z-10 pt-16">
          <Link 
            to="/solutions" 
            className="inline-flex items-center text-blue-dark hover:text-gold transition-colors bg-black/5 px-4 py-2 rounded-md"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            <span>Back to Solutions</span>
          </Link>
        </div>
      )}
      
      {/* Hero content - unified layout for all pages */}
      <div className="container-custom flex flex-col items-center justify-center text-center py-20 min-h-screen relative z-20">
        <div className="w-full max-w-3xl space-y-8">
          <ScrollReveal>
            <span className="bg-gold/10 text-gold px-3 py-1 rounded-full text-sm font-medium border border-gold/20 mt-16 md:mt-0 inline-block">
              {tagline}
            </span>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading leading-tight text-blue-dark">
              {title}
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={400}>
            <p className="text-lg text-gray-700 mb-4 max-w-2xl mx-auto">
              {description}
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
    </section>
  );
};

export default ServiceHeroSection;
