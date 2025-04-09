
import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from './MainLayout';
import { Button } from '@/components/ui/button';
import FAQ from '@/components/ui/FAQ';
import ContactForm from '@/components/ui/ContactForm';
import TestimonialCard from '@/components/ui/TestimonialCard';
import ScrollReveal from '@/components/ui/ScrollReveal';

interface ServiceFeature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface ServicePageTemplateProps {
  title: string;
  description: string;
  tagline: string;
  features: ServiceFeature[];
  processSteps: {
    title: string;
    description: string;
    stepNumber: number;
  }[];
  faqItems: {
    question: string;
    answer: string;
  }[];
  testimonial: {
    quote: string;
    author: string;
    position: string;
    company: string;
  };
  heroImage: string;
  ctaText: string;
  relatedServices: {
    title: string;
    description: string;
    link: string;
  }[];
}

const ServicePageTemplate = ({
  title,
  description,
  tagline,
  features,
  processSteps,
  faqItems,
  testimonial,
  heroImage,
  ctaText,
  relatedServices,
}: ServicePageTemplateProps) => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="hero-section bg-white">
        <div className="container-custom flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 py-12 md:py-0">
            <ScrollReveal>
              <span className="bg-teal/10 text-teal px-3 py-1 rounded-full text-sm font-medium">
                {tagline}
              </span>
            </ScrollReveal>
            
            <ScrollReveal delay={200}>
              <h1 className="text-4xl sm:text-5xl md:text-5xl font-bold font-heading mt-6 mb-6 leading-tight text-blue-dark">
                {title}
              </h1>
            </ScrollReveal>
            
            <ScrollReveal delay={400}>
              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                {description}
              </p>
            </ScrollReveal>
            
            <ScrollReveal delay={600}>
              <div className="flex flex-wrap gap-4">
                <Button className="btn-primary" asChild>
                  <Link to="/contact">Schedule a Consultation</Link>
                </Button>
                <Button className="btn-outline" asChild>
                  <a href="#features">Learn More</a>
                </Button>
              </div>
            </ScrollReveal>
          </div>
          
          <div className="w-full md:w-1/2 mt-8 md:mt-0">
            <ScrollReveal direction="left">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-40 h-40 bg-teal rounded-full opacity-10 animate-pulse-soft"></div>
                <div className="absolute -bottom-4 -right-4 w-60 h-60 bg-blue-dark rounded-full opacity-10 animate-pulse-soft" style={{ animationDelay: '1s' }}></div>
                <img 
                  src={heroImage}
                  alt={title}
                  className="w-full h-auto rounded-lg shadow-lg relative z-10"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="section bg-gray-50">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <ScrollReveal>
              <span className="text-teal font-medium">Features</span>
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
                  <div className="mb-4 p-3 rounded-full bg-gradient-to-br from-blue-100 to-teal-100 inline-flex">
                    <div className="text-blue-dark">{feature.icon}</div>
                  </div>
                  <h3 className="text-xl font-bold font-heading mb-3 text-blue-dark">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
      
      {/* Process Section */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <ScrollReveal>
              <span className="text-teal font-medium">Our Process</span>
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
                    <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 text-right' : 'md:pl-12 text-left'}`}>
                      <h3 className="text-2xl font-bold font-heading mb-3 text-blue-dark">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                    
                    <div className="relative my-6 md:my-0 z-10">
                      <div className="w-12 h-12 rounded-full bg-teal text-white font-bold flex items-center justify-center relative z-20">
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
      
      {/* Testimonial Section */}
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
      
      {/* FAQ Section */}
      <section className="section bg-white">
        <div className="container-custom">
          <FAQ
            title="Frequently Asked Questions"
            subtitle="Get answers to common questions about our services and how we can help your business."
            items={faqItems}
          />
        </div>
      </section>
      
      {/* Related Services Section */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <ScrollReveal>
              <span className="text-teal font-medium">Explore More</span>
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
                    <span className="text-teal font-medium flex items-center group">
                      Learn more
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="section bg-gradient-to-br from-blue-dark to-blue-light text-white">
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
    </MainLayout>
  );
};

export default ServicePageTemplate;
