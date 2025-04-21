
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
    <>
      {/* Original section */}
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
      </section>
      {/* White padding divider with fixed height to create spacing */}
      <div className="w-full bg-white h-32" />
    </>
  );
};

export default CTASection;

