
import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import ScrollReveal from '@/components/ui/ScrollReveal';

const Blog = () => {
  const blogs = [
    {
      id: 'website-must-haves',
      title: '7 Website Must-Haves for Remodeling Companies',
      summary: 'Discover the essential elements that every remodeling website needs to convert visitors into qualified leads.',
      image: '/lovable-uploads/7217f6a6-a095-4b8f-b0b1-4e2142a3baee.png',
      date: 'April 5, 2025',
      readTime: '8 min read'
    },
    {
      id: 'seo-strategies',
      title: 'SEO Strategies for Home Service Businesses',
      summary: 'Learn how to optimize your online presence and attract more local customers with these proven SEO techniques.',
      image: '/lovable-uploads/7217f6a6-a095-4b8f-b0b1-4e2142a3baee.png',
      date: 'March 28, 2025',
      readTime: '6 min read'
    },
    {
      id: 'ai-revolution',
      title: 'How AI is Revolutionizing Customer Service',
      summary: 'Explore how artificial intelligence is transforming customer interactions and helping businesses provide exceptional service.',
      image: '/lovable-uploads/7217f6a6-a095-4b8f-b0b1-4e2142a3baee.png',
      date: 'March 15, 2025',
      readTime: '7 min read'
    }
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="bg-blue-dark py-20 px-6">
        <div className="container-custom">
          <ScrollReveal>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Blog</h1>
            <p className="text-lg text-white/80 max-w-2xl">
              Insights, strategies, and expert advice to help your remodeling and home service business grow.
            </p>
          </ScrollReveal>
        </div>
      </div>
      
      {/* Blog Listing */}
      <div className="py-16 px-6">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, index) => (
              <ScrollReveal key={blog.id} delay={index * 100}>
                <Link to={`/blog/${blog.id}`} className="block group">
                  <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                    <div className="aspect-w-16 aspect-h-9 relative">
                      <img 
                        src={blog.image} 
                        alt={blog.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-blue-dark/40 group-hover:bg-blue-dark/30 transition-all duration-300"></div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <span>{blog.date}</span>
                        <span className="mx-2">•</span>
                        <span>{blog.readTime}</span>
                      </div>
                      <h3 className="text-xl font-heading font-semibold text-blue-dark mb-3 group-hover:text-gold transition-colors duration-300">
                        {blog.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {blog.summary}
                      </p>
                      <div className="text-gold font-medium flex items-center group">
                        Read Article
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-5 w-5 ml-1 group-hover:translate-x-2 transition-transform" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-dark/5 py-16 px-6">
        <div className="container-custom text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-blue-dark mb-6">Want to Learn More?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Schedule a consultation with our team to discover how we can help your business grow with our digital services.
            </p>
            <Button 
              className="bg-gold hover:bg-gold-light text-white text-lg px-8 py-6 h-auto rounded-md shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              onClick={() => {
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                  contactSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Schedule a Free Consultation
            </Button>
          </ScrollReveal>
        </div>
      </div>
    </MainLayout>
  );
};

export default Blog;
