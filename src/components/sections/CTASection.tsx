
import React from 'react';
import ContactForm from '@/components/ui/ContactForm';
import ScrollReveal from '@/components/ui/ScrollReveal';

interface CTASectionProps {
  ctaText: string;
  title: string;
  className?: string;
}

const CTASection = ({ 
  ctaText, 
  title, 
  className = "bg-gradient-to-br from-blue-dark to-blue-light text-white" 
}: CTASectionProps) => {
  return (
    // Make the section full width and add horizontal padding on the section itself instead of "section" class
    <section className={`${className} w-full py-20 px-6 md:px-8 lg:px-12`}>
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="w-full md:w-1/2 mb-8 md:mb-0">
            <ScrollReveal>
              <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6">
                {ctaText}
              </h2>
              <p className="text-xl opacity-90 max-w-lg">
                Schedule a free consultation to discuss how our {title.toLowerCase()} services can help your remodeling business grow.
              </p>
            </ScrollReveal>
          </div>
          
          <div className="w-full md:w-1/2">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold text-blue-dark mb-6">Get in Touch</h3>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>

      {/* White padding at bottom */}
      <div className="w-full mt-12 h-16 bg-white" />
    </section>
  );
};

export default CTASection;

