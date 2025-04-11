
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
}

const TestimonialSection = ({ testimonial }: TestimonialSectionProps) => {
  return (
    <section className="section bg-gray-50">
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
