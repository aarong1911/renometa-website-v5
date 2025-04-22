
import React from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { Button } from '@/components/ui/button';

const BlogPreviewSection = () => {
  return (
    <section id="blog" className="section bg-white">
      <div className="container-custom text-center">
        <ScrollReveal>
          <span className="text-gold font-medium block">Resources</span>
          <h2 className="text-3xl md:text-4xl font-bold font-heading mt-2 mb-4 text-blue-dark">
            Latest Articles
          </h2>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
            Insights, tips, and strategies to help your remodeling or home service business grow.
          </p>
        </ScrollReveal>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((item, index) => (
            <ScrollReveal key={index} delay={index * 100}>
              <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={`https://picsum.photos/seed/${index}/600/400`} 
                    alt="Blog post thumbnail" 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
                  />
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
                </div>
              </div>
            </ScrollReveal>
          ))}
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
  );
};

export default BlogPreviewSection;
