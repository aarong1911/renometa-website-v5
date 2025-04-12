import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import ServiceCard from '@/components/ui/ServiceCard';
import TestimonialCard from '@/components/ui/TestimonialCard';
import CaseStudyCard from '@/components/ui/CaseStudyCard';
import ScrollReveal from '@/components/ui/ScrollReveal';
import CTASection from '@/components/sections/CTASection';
const Index = () => {
  // Logos for brands section
  const brandLogos = [{
    name: 'Brand 1',
    logo: 'https://via.placeholder.com/150x50?text=Brand+1'
  }, {
    name: 'Brand 2',
    logo: 'https://via.placeholder.com/150x50?text=Brand+2'
  }, {
    name: 'Brand 3',
    logo: 'https://via.placeholder.com/150x50?text=Brand+3'
  }, {
    name: 'Brand 4',
    logo: 'https://via.placeholder.com/150x50?text=Brand+4'
  }, {
    name: 'Brand 5',
    logo: 'https://via.placeholder.com/150x50?text=Brand+5'
  }];

  // Services data
  const services = [{
    title: 'Smart Website Development',
    description: 'Custom-built, high-converting websites tailored specifically for remodeling businesses.',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>,
    link: '/services/website-development'
  }, {
    title: 'Advanced SEO',
    description: 'Specialized search engine optimization strategies to dominate local searches in your service area.',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>,
    link: '/services/advanced-seo'
  }, {
    title: 'AI-Powered Agents',
    description: 'Intelligent virtual assistants that qualify leads and book appointments 24/7.',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>,
    link: '/services/ai-agents'
  }, {
    title: 'Intelligent Automation',
    description: 'Streamline your workflows and follow-ups with smart systems that save time and increase conversion.',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>,
    link: '/services/automation'
  }, {
    title: 'Seamless Integration',
    description: 'Connect all your tools and software to create a unified business system with no gaps or data silos.',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16v-4m-4 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H4a2 2 0 00-2 2v6a2 2 0 002 2zm10 0h6m-6-8a2 2 0 11-4 0 2 2 0 014 0zM6 20v-2a2 2 0 012-2h8a2 2 0 012 2v2M6 12h.01M10 12h.01" />
        </svg>,
    link: '/services/integration'
  }, {
    title: 'Performance Optimization',
    description: 'Accelerate your website for lightning-fast speed and improved conversion rates.',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>,
    link: '/services/performance-optimization'
  }];

  // Smooth scroll function
  const scrollToSection = id => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  return <MainLayout>
      {/* Hero Section */}
      <section id="hero" className="hero-section relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-dark to-blue-light opacity-10 z-0"></div>
        <div className="container-custom flex flex-col md:flex-row items-center z-10 relative">
          <div className="w-full md:w-1/2 py-12 md:py-0">
            <ScrollReveal>
              <span className="bg-gold/10 text-gold px-3 py-1 rounded-full text-sm font-medium border border-gold/20">
                For Remodeling & Home Service Businesses
              </span>
            </ScrollReveal>
            
            <ScrollReveal delay={200}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading mt-6 mb-6 leading-tight text-blue-dark">
                Digital Solutions That Power <span className="gradient-text">Growth</span>
              </h1>
            </ScrollReveal>
            
            <ScrollReveal delay={400}>
              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                Custom digital solutions designed to help remodeling and home service businesses attract more leads, close more deals, and deliver exceptional customer experiences.
              </p>
            </ScrollReveal>
            
            <ScrollReveal delay={600}>
              <div className="flex flex-wrap gap-4">
                <Button className="btn-primary hover:bg-blue-light transition-colors duration-300" onClick={() => scrollToSection('contact')}>
                  Get a Free Strategy Call
                </Button>
                <Button className="btn-outline hover:bg-blue-light hover:text-white hover:border-blue-light transition-colors duration-300" onClick={() => scrollToSection('services')}>
                  Explore Services
                </Button>
              </div>
            </ScrollReveal>
          </div>
          
          <div className="w-full md:w-1/2 mt-8 md:mt-0">
            <ScrollReveal direction="left">
              <div className="relative">
                
                
                
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
      
      {/* Trusted By Section */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom text-center">
          <ScrollReveal>
            <h3 className="text-base text-gray-500 uppercase mb-8 tracking-wider">Trusted by home service professionals</h3>
          </ScrollReveal>
          
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {brandLogos.map((brand, index) => <ScrollReveal key={index} delay={index * 100}>
                <img src={brand.logo} alt={brand.name} className="max-h-10 opacity-60 hover:opacity-100 transition-opacity" />
              </ScrollReveal>)}
          </div>
        </div>
      </section>
      
      {/* Services Section */}
      <section id="services" className="section bg-white">
        <div className="container-custom">
          <ScrollReveal>
            <span className="text-gold font-medium">Our Services</span>
            <h2 className="text-3xl md:text-4xl font-bold font-heading mt-2 mb-4 text-blue-dark">
              Digital Solutions for Modern Contractors
            </h2>
            <p className="text-gray-600 mb-12 max-w-2xl">
              Everything you need to transform your remodeling or home services business into a digital powerhouse that attracts, converts, and delights customers.
            </p>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => <ServiceCard key={index} title={service.title} description={service.description} icon={service.icon} link={service.link} delay={index * 100} />)}
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section id="benefits" className="section bg-gradient-to-br from-blue-dark to-blue-light text-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <ScrollReveal>
              <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6">
                Why Remodeling Companies Choose Us
              </h2>
              <p className="text-lg opacity-90 mb-16">
                We understand the unique challenges and opportunities in the remodeling and home services industry.
              </p>
            </ScrollReveal>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ScrollReveal>
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Industry-Specific ROI</h3>
                <p className="opacity-80">
                  Solutions designed to address the specific challenges of remodeling companies, with proven ROI.
                </p>
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={100}>
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Fast Implementation</h3>
                <p className="opacity-80">
                  Get your digital solutions up and running quickly with minimal disruption to your business.
                </p>
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={200}>
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Proven Track Record</h3>
                <p className="opacity-80">
                  We've helped dozens of remodeling businesses transform their digital presence and grow.
                </p>
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={300}>
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Dedicated Support</h3>
                <p className="opacity-80">
                  Our team understands contractors and is available to help whenever you need guidance.
                </p>
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={400}>
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Scalable Solutions</h3>
                <p className="opacity-80">
                  Our platforms grow with your business, from small operations to multi-location companies.
                </p>
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={500}>
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Secure & Reliable</h3>
                <p className="opacity-80">
                  Enterprise-grade security and uptime that you can depend on 24/7/365.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
      
      {/* Case Studies Section */}
      <section id="case-studies" className="section bg-white">
        <div className="container-custom">
          <ScrollReveal>
            <span className="text-gold font-medium">Case Studies</span>
            <h2 className="text-3xl md:text-4xl font-bold font-heading mt-2 mb-4 text-blue-dark">
              Success Stories
            </h2>
            <p className="text-gray-600 mb-12 max-w-2xl">
              See how we've helped remodeling and home service businesses transform their digital presence and achieve remarkable results.
            </p>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <CaseStudyCard title="Elite Remodeling Co." description="How we helped a kitchen remodeler double their qualified leads while cutting ad spend by 30%." image="https://images.unsplash.com/photo-1484154218962-a197022b5858" results={[{
            label: 'Increase in Leads',
            value: '+103%'
          }, {
            label: 'Cost Per Lead',
            value: '-32%'
          }]} link="/case-studies/elite-remodeling" delay={0} />
            
            <CaseStudyCard title="Superior Windows & Doors" description="Transforming a window installation company's website into a lead generation machine." image="https://images.unsplash.com/photo-1503174971373-b1f69850bded" results={[{
            label: 'Conversion Rate',
            value: '+87%'
          }, {
            label: 'Monthly Leads',
            value: '150+'
          }]} link="/case-studies/superior-windows" delay={100} />
            
            <CaseStudyCard title="Precision Plumbing" description="How AI agents helped a plumbing company provide 24/7 service without hiring additional staff." image="https://images.unsplash.com/photo-1581578731548-c64695cc6952" results={[{
            label: 'After-Hours Bookings',
            value: '+215%'
          }, {
            label: 'Customer Satisfaction',
            value: '98%'
          }]} link="/case-studies/precision-plumbing" delay={200} />
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
      
      {/* Testimonials Section */}
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
            <TestimonialCard quote="Our website leads have doubled since working with RenoMeta. Their understanding of the remodeling industry made all the difference." author="Michael Rodriguez" position="Owner" company="Rodriguez Remodeling" delay={0} />
            
            <TestimonialCard quote="The AI agents have transformed our business. We're booking jobs 24/7 and our team can focus on the work instead of answering basic questions." author="Sarah Johnson" position="Operations Manager" company="Johnson Home Services" delay={100} />
            
            <TestimonialCard quote="The SEO work they've done has put us at the top of local searches. We're now the first call for homeowners in our area." author="David Chen" position="Marketing Director" company="Luxe Bathroom Renovations" delay={200} />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section id="cta" className="section bg-gradient-to-br from-gold to-blue-light text-white">
        <div className="container-custom text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-6">
              Ready to Transform Your Digital Presence?
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Schedule a free 30-minute strategy call to discover how we can help your remodeling business thrive online.
            </p>
            <Button size="lg" className="bg-white text-blue-dark hover:bg-blue-light hover:text-white transition-colors duration-300" onClick={() => scrollToSection('contact')}>
              Book Your Free Strategy Call
            </Button>
          </ScrollReveal>
        </div>
      </section>
      
      {/* Latest Blog Posts */}
      <section id="blog" className="section bg-white">
        <div className="container-custom">
          <ScrollReveal>
            <span className="text-gold font-medium">Resources</span>
            <h2 className="text-3xl md:text-4xl font-bold font-heading mt-2 mb-4 text-blue-dark">
              Latest Articles
            </h2>
            <p className="text-gray-600 mb-12 max-w-2xl">
              Insights, tips, and strategies to help your remodeling or home service business grow.
            </p>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item, index) => <ScrollReveal key={index} delay={index * 100}>
                <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-48 overflow-hidden">
                    <img src={`https://picsum.photos/seed/${index}/600/400`} alt="Blog post thumbnail" className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <span>April {5 + index}, 2025</span>
                      <span className="mx-2">•</span>
                      <span>5 min read</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-blue-dark">
                      {index === 0 && "7 Website Must-Haves for Remodeling Companies"}
                      {index === 1 && "How AI is Revolutionizing Customer Service in Home Services"}
                      {index === 2 && "Local SEO: The Ultimate Guide for Contractors"}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {index === 0 && "Discover the essential elements that every remodeling website needs to convert visitors into qualified leads."}
                      {index === 1 && "Learn how artificial intelligence is changing how home service businesses handle customer interactions."}
                      {index === 2 && "A complete guide to dominating local search results and attracting more customers in your service area."}
                    </p>
                    <Link to={`/blog/post-${index + 1}`} className="text-teal font-medium flex items-center group">
                      Read Article
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </ScrollReveal>)}
          </div>
          
          <div className="text-center mt-10">
            <ScrollReveal>
              <Button asChild variant="outline" className="border-blue-dark text-blue-dark hover:bg-blue-light hover:text-white hover:border-blue-light transition-colors duration-300">
                <Link to="/blog">Read More Articles</Link>
              </Button>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Contact Section - Replaced with CTASection */}
      <section id="contact" className="section bg-gray-50">
        <CTASection ctaText="Transform Your Remodeling Business Today" title="Digital Marketing" />
      </section>
    </MainLayout>;
};
export default Index;