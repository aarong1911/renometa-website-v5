
import React from 'react';
import FAQ from '@/components/ui/FAQ';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqItems: FAQItem[];
}

const FAQSection = ({ faqItems }: FAQSectionProps) => {
  return (
    <section className="section bg-white">
      <div className="container-custom">
        <FAQ
          title="Frequently Asked Questions"
          subtitle="Get answers to common questions about our services and how we can help your business."
          items={faqItems}
        />
      </div>
    </section>
  );
};

export default FAQSection;
