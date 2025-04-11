
import React from 'react';
import FAQ from '@/components/ui/FAQ';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqItems: FAQItem[];
  title?: string;
  subtitle?: string;
  className?: string;
}

const FAQSection = ({ 
  faqItems, 
  title = "Frequently Asked Questions",
  subtitle = "Get answers to common questions about our services and how we can help your business.",
  className = "bg-white"
}: FAQSectionProps) => {
  return (
    <section className={`section ${className}`}>
      <div className="container-custom">
        <FAQ
          title={title}
          subtitle={subtitle}
          items={faqItems}
        />
      </div>
    </section>
  );
};

export default FAQSection;
