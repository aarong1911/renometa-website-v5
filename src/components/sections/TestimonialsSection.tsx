
import React from 'react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import TestimonialCard from '@/components/ui/TestimonialCard';

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="section bg-gray-50">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <ScrollReveal>
            <span className="text-gold font-medium">Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-bold font-heading mt-2 mb-4 text-blue-dark">
              What Our Clients Say
            </h2>
            <p className="text-gray-600">
              Don't just take our word for it. Hear from remodeling and home service professionals who have transformed their businesses with our solutions.
            </p>
          </ScrollReveal>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TestimonialCard 
            quote="Our website leads have doubled since working with RenoMeta. Their understanding of the remodeling industry made all the difference." 
            author="Michael Rodriguez" 
            position="Owner" 
            company="Rodriguez Remodeling" 
            delay={0} 
          />
          
          <TestimonialCard 
            quote="The AI agents have transformed our business. We're booking jobs 24/7 and our team can focus on the work instead of answering basic questions." 
            author="Sarah Johnson" 
            position="Operations Manager" 
            company="Johnson Home Services" 
            delay={100} 
          />
          
          <TestimonialCard 
            quote="The SEO work they've done has put us at the top of local searches. We're now the first call for homeowners in our area." 
            author="David Chen" 
            position="Marketing Director" 
            company="Luxe Bathroom Renovations" 
            delay={200} 
          />
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
