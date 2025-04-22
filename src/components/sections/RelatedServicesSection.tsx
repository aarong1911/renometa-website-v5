
import React from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '@/components/ui/ScrollReveal';

interface RelatedService {
  title: string;
  description: string;
  link: string;
}

interface RelatedServicesSectionProps {
  relatedServices: RelatedService[];
  title: string;
}

const RelatedServicesSection = ({ relatedServices, title }: RelatedServicesSectionProps) => {
  return (
    <section className="section bg-gray-50">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <ScrollReveal>
            <span className="text-gold font-medium">Explore More</span>
            <h2 className="text-3xl md:text-4xl font-bold font-heading mt-2 mb-4 text-blue-dark">
              Related Services
            </h2>
            <p className="text-gray-600">
              Discover other services that complement {title.toLowerCase()} and enhance your digital presence.
            </p>
          </ScrollReveal>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedServices.map((service, index) => (
            <ScrollReveal key={index} delay={index * 100}>
              <Link to={service.link} className="block h-full">
                <div className="bg-white p-6 rounded-lg border shadow-sm hover:shadow-md transition-all hover:-translate-y-1 h-full">
                  <h3 className="text-xl font-bold font-heading mb-3 text-blue-dark">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedServicesSection;
