
import React from 'react';
import ScrollReveal from '@/components/ui/ScrollReveal';

interface ProcessStep {
  title: string;
  description: string;
  stepNumber: number;
}

interface ProcessSectionProps {
  processSteps: ProcessStep[];
}

const ProcessSection = ({ processSteps }: ProcessSectionProps) => {
  return (
    <section className="section bg-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <ScrollReveal>
            <span className="text-gold font-medium">Our Process</span>
            <h2 className="text-3xl md:text-4xl font-bold font-heading mt-2 mb-4 text-blue-dark">
              How It Works
            </h2>
            <p className="text-gray-600">
              Our streamlined process ensures an efficient implementation and maximum results.
            </p>
          </ScrollReveal>
        </div>
        
        <div className="relative">
          {/* Process Steps Timeline Line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 transform -translate-x-1/2"></div>
          
          <div className="space-y-12 md:space-y-0">
            {processSteps.map((step, index) => (
              <ScrollReveal key={index} delay={index * 150}>
                <div className={`flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} mb-12`}>
                  <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'} text-center md:text-left`}>
                    <h3 className="text-2xl font-bold font-heading mb-3 text-blue-dark">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                  
                  <div className="relative order-first mb-4 md:order-none md:mb-0 md:my-0 z-10">
                    <div className="w-12 h-12 rounded-full bg-gold text-white font-bold flex items-center justify-center relative z-20">
                      {step.stepNumber}
                    </div>
                  </div>
                  
                  <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pl-12' : 'md:pr-12'}`}>
                    {/* This empty div maintains proper spacing */}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
