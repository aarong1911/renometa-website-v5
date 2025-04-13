
import React from 'react';
import MainLayout from './MainLayout';
import ServiceHeroSection from '@/components/sections/ServiceHeroSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import ProcessSection from '@/components/sections/ProcessSection';
import TestimonialSection from '@/components/sections/TestimonialSection';
import FAQSection from '@/components/sections/FAQSection';
import RelatedServicesSection from '@/components/sections/RelatedServicesSection';
import CTASection from '@/components/sections/CTASection';

interface ServiceFeature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface ServicePageTemplateProps {
  title: string;
  description: string;
  tagline: string;
  features: ServiceFeature[];
  processSteps: {
    title: string;
    description: string;
    stepNumber: number;
  }[];
  faqItems: {
    question: string;
    answer: string;
  }[];
  testimonial: {
    quote: string;
    author: string;
    position: string;
    company: string;
  };
  heroImage: string;
  ctaText: string;
  relatedServices: {
    title: string;
    description: string;
    link: string;
  }[];
}

const ServicePageTemplate = ({
  title,
  description,
  tagline,
  features,
  processSteps,
  faqItems,
  testimonial,
  heroImage,
  ctaText,
  relatedServices,
}: ServicePageTemplateProps) => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <ServiceHeroSection 
        title={title}
        description={description}
        tagline={tagline}
        heroImage={heroImage}
      />
      
      {/* Features Section */}
      <FeaturesSection features={features} title={title} />
      
      {/* Process Section */}
      <div id="process">
        <ProcessSection processSteps={processSteps} />
      </div>
      
      {/* Testimonial Section */}
      <TestimonialSection testimonial={testimonial} />
      
      {/* FAQ Section */}
      <FAQSection faqItems={faqItems} />
      
      {/* Related Services Section */}
      <RelatedServicesSection relatedServices={relatedServices} title={title} />
      
      {/* CTA Section */}
      <div id="contact">
        <CTASection ctaText={ctaText} title={title} />
      </div>
    </MainLayout>
  );
};

export default ServicePageTemplate;
