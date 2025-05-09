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
  icon?: React.ReactNode;
}

interface ServicePageTemplateProps {
  title: string;
  description: string;
  tagline: string;
  features?: ServiceFeature[];
  processSteps?: {
    title: string;
    description: string;
    stepNumber: number;
  }[];
  faqItems?: {
    question: string;
    answer: string;
  }[];
  testimonial?: {
    quote: string;
    author: string;
    position: string;
    company: string;
  };
  heroImage: string;
  ctaText: string;
  relatedServices?: {
    title: string;
    description: string;
    link: string;
  }[];
  customContent?: React.ReactNode;
  /** When true, skip rendering the hero section */
  hideHero?: boolean;
}

const ServicePageTemplate = ({
  title,
  description,
  tagline,
  features = [],
  processSteps = [],
  faqItems = [],
  testimonial = {
    quote: '',
    author: '',
    position: '',
    company: ''
  },
  heroImage,
  ctaText,
  relatedServices = [],
  customContent,
  hideHero = false,
}: ServicePageTemplateProps) => {
  return (
    <MainLayout>
      {/* Hero Section (skipped if hideHero is true) */}
      {!hideHero && (
        <ServiceHeroSection
          title={title}
          description={description}
          tagline={tagline}
          heroImage={heroImage}
          isSolutionsPage={false}
        />
      )}

      {/* Render custom content if provided */}
      {customContent}

      {/* Only render these sections if they have content */}
      {features.length > 0 && (
        <FeaturesSection features={features} title={title} />
      )}

      {processSteps.length > 0 && (
        <div id="process">
          <ProcessSection processSteps={processSteps} />
        </div>
      )}

      {testimonial.quote && (
        <TestimonialSection testimonial={testimonial} />
      )}

      {faqItems.length > 0 && (
        <FAQSection faqItems={faqItems} />
      )}

      {relatedServices.length > 0 && (
        <RelatedServicesSection
          relatedServices={relatedServices}
          title={title}
        />
      )}

      {/* CTA Section */}
      <div id="contact">
        <CTASection ctaText={ctaText} title={title} />
      </div>
    </MainLayout>
  );
};

export default ServicePageTemplate;
