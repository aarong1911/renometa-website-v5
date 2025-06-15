
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
            quote="RenoMeta built us a beautiful and incredibly user-friendly website! We're so impressed with their professionalism and the outstanding results. Highly recommend them!" 
            author="mark rosenberg" 
            position="Owner" 
            company="IsraelSteel.com" 
            delay={0} 
          />
          
          <TestimonialCard 
            quote="Exceptional Service and Results!
Working with RenoMeta has been a game-changer for our business. Their team is knowledgeable, responsive, and truly understands what it takes to drive growth. From strategy to execution, everything was handled with precision and care. We've seen a noticeable increase in leads and conversions since partnering with them. Highly recommended for anyone serious about scaling their business!" 
            author="Nazar Nesteruk" 
            position="Operations Manager" 
            company="FreshCleaners.org" 
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
