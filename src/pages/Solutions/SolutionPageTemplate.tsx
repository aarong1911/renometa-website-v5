
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
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

interface SolutionPageTemplateProps {
  title: string;
  description?: string;
  subheadline?: string;
  tagline?: string;
  category: string;
  categoryPath: string;
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
  heroImage?: string;
  ctaText?: string;
  relatedServices?: {
    title: string;
    description: string;
    link: string;
  }[];
}

const SolutionPageTemplate: React.FC<SolutionPageTemplateProps> = ({
  title,
  description = '',
  subheadline = '',
  tagline = 'Smart Solutions',
  category,
  categoryPath,
  features = [],
  processSteps = [],
  faqItems = [],
  testimonial = {
    quote: 'The solution provided by RenoMeta transformed our business operations completely. We saw immediate improvements in efficiency and customer satisfaction.',
    author: 'John Smith',
    position: 'Owner',
    company: 'Smith Remodeling'
  },
  heroImage = '/lovable-uploads/7217f6a6-a095-4b8f-b0b1-4e2142a3baee.png',
  ctaText = 'Ready to transform your business with smart solutions?',
  relatedServices = [],
}) => {
  const fullDescription = description || subheadline || 'Transform your business with our innovative solutions tailored for remodeling and home service businesses.';
  
  return (
    <MainLayout>
      <div className="pt-16">
        {/* Hero Section */}
        <ServiceHeroSection 
          title={title}
          description={fullDescription}
          tagline={tagline}
          heroImage={heroImage}
          isSolutionsPage={true} // This is a solutions page
        />
        
        {/* Features Section */}
        {features.length > 0 && (
          <FeaturesSection features={features} title={title} />
        )}
        
        {/* Process Section */}
        {processSteps.length > 0 && (
          <div id="process">
            <ProcessSection processSteps={processSteps} />
          </div>
        )}
        
        {/* Testimonial Section */}
        <TestimonialSection testimonial={testimonial} />
        
        {/* FAQ Section */}
        {faqItems.length > 0 && (
          <FAQSection faqItems={faqItems} />
        )}
        
        {/* Related Services Section */}
        {relatedServices.length > 0 && (
          <RelatedServicesSection relatedServices={relatedServices} title={title} />
        )}
        
        {/* CTA Section */}
        <div id="contact">
          <CTASection ctaText={ctaText} title={title} />
        </div>
      </div>
    </MainLayout>
  );
};

export default SolutionPageTemplate;
