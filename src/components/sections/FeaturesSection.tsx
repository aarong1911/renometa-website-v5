
import React from 'react';
import ScrollReveal from '@/components/ui/ScrollReveal';

interface FeatureItem {
  title: string;
  description: string;
  icon?: React.ReactNode; // Make icon optional
}

interface FeaturesSectionProps {
  features: FeatureItem[];
  title: string;
}

const FeaturesSection = ({ features, title }: FeaturesSectionProps) => {
  return (
    <section id="features" className="section bg-gray-50">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <ScrollReveal>
            <span className="text-gold font-medium">Features</span>
            <h2 className="text-3xl md:text-4xl font-bold font-heading mt-2 mb-4 text-blue-dark">
              How We Can Help
            </h2>
            <p className="text-gray-600">
              Our comprehensive {title.toLowerCase()} solutions are designed specifically for remodeling and home service companies.
            </p>
          </ScrollReveal>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <ScrollReveal key={index} delay={index * 100}>
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow h-full">
                {feature.icon && (
                  <div className="mb-4 p-3 rounded-full bg-gradient-to-br from-blue-100 to-gold-light/30 inline-flex">
                    <div className="text-blue-dark">{feature.icon}</div>
                  </div>
                )}
                <h3 className="text-xl font-bold font-heading mb-3 text-blue-dark">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
