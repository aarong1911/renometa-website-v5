
import React from 'react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import ServiceCard from '@/components/ui/ServiceCard';

interface ServiceItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
}

interface ServicesSectionProps {
  services: ServiceItem[];
}

const ServicesSection = ({ services }: ServicesSectionProps) => {
  return (
    <section id="services" className="section bg-white">
      <div className="container-custom text-center">
        <ScrollReveal>
          <span className="text-gold font-medium block">Our Services</span>
          <h2 className="text-3xl md:text-4xl font-bold font-heading mt-2 mb-4 text-blue-dark">
            Digital Solutions for Modern Contractors
          </h2>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
            Everything you need to transform your remodeling or home services business into a digital powerhouse that attracts, converts, and delights customers.
          </p>
        </ScrollReveal>
              
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard 
              key={index} 
              title={service.title} 
              description={service.description} 
              icon={service.icon} 
              link={service.link} 
              delay={index * 100} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
