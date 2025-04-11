
import React from 'react';
import TestimonialCard from '@/components/ui/TestimonialCard';

interface TestimonialProps {
  quote: string;
  author: string;
  position: string;
  company: string;
}

interface TestimonialSectionProps {
  testimonial: TestimonialProps;
  className?: string;
}

const TestimonialSection = ({ 
  testimonial,
  className = "bg-gray-50" 
}: TestimonialSectionProps) => {
  return (
    <section className={`section ${className}`}>
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <TestimonialCard
            quote={testimonial.quote}
            author={testimonial.author}
            position={testimonial.position}
            company={testimonial.company}
            className="shadow-md"
          />
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
