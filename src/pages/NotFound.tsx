
import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { useLocation } from 'react-router-dom';
import ScrollReveal from '@/components/ui/ScrollReveal';

const NotFound = () => {
  const location = useLocation();

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50">
        <div className="container-custom text-center py-16">
          <ScrollReveal>
            <h1 className="text-7xl md:text-9xl font-bold text-blue-dark mb-6">404</h1>
          </ScrollReveal>
          
          <ScrollReveal delay={200}>
            <p className="text-2xl md:text-3xl font-heading mb-6 text-gray-600">
              Oops! We can't find that page.
            </p>
          </ScrollReveal>
          
          <ScrollReveal delay={400}>
            <p className="mb-8 text-gray-500 max-w-lg mx-auto">
              The page you're looking for doesn't exist or has been moved. 
              Let's get you back on track.
            </p>
          </ScrollReveal>
          
          <ScrollReveal delay={600}>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button className="btn-primary" asChild>
                <Link to="/">Back to Home</Link>
              </Button>
              <Button className="btn-outline" asChild>
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotFound;
