
import React from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { Button } from '@/components/ui/button';
import CaseStudyCard from '@/components/ui/CaseStudyCard';

const CaseStudiesSection = () => {
  return (
    <section id="case-studies" className="section bg-white">
      <div className="container-custom text-center">
        <ScrollReveal>
          <span className="text-gold font-medium block">Case Studies</span>
          <h2 className="text-3xl md:text-4xl font-bold font-heading mt-2 mb-4 text-blue-dark">
            Success Stories
          </h2>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
            See how we've helped remodeling and home service businesses transform their digital presence and achieve remarkable results.
          </p>
        </ScrollReveal>
              
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <CaseStudyCard 
            title="Elite Remodeling Co." 
            description="How we helped a kitchen remodeler double their qualified leads while cutting ad spend by 30%." 
            image="https://images.unsplash.com/photo-1484154218962-a197022b5858" 
            results={[
              {
                label: 'Increase in Leads',
                value: '+103%'
              }, 
              {
                label: 'Cost Per Lead',
                value: '-32%'
              }
            ]} 
            link="/case-studies/elite-remodeling" 
            delay={0} 
          />
          
          <CaseStudyCard 
            title="Superior Windows & Doors" 
            description="Transforming a window installation company's website into a lead generation machine." 
            image="https://images.unsplash.com/photo-1503174971373-b1f69850bded" 
            results={[
              {
                label: 'Conversion Rate',
                value: '+87%'
              }, 
              {
                label: 'Monthly Leads',
                value: '150+'
              }
            ]} 
            link="/case-studies/superior-windows" 
            delay={100} 
          />
          
          <CaseStudyCard 
            title="Precision Plumbing" 
            description="How AI agents helped a plumbing company provide 24/7 service without hiring additional staff." 
            image="https://images.unsplash.com/photo-1581578731548-c64695cc6952" 
            results={[
              {
                label: 'After-Hours Bookings',
                value: '+215%'
              }, 
              {
                label: 'Customer Satisfaction',
                value: '98%'
              }
            ]} 
            link="/case-studies/precision-plumbing" 
            delay={200} 
          />
        </div>
        
        <div className="text-center mt-10">
          <ScrollReveal>
            <Button asChild variant="outline" className="border-blue-dark text-blue-dark hover:bg-blue-dark hover:text-white hover:-translate-y-1 transition-all duration-300">
              <Link to="/case-studies">View All Case Studies</Link>
            </Button>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default CaseStudiesSection;
