import React from 'react';
import ServicePageTemplate from '@/components/layout/ServicePageTemplate';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Blog = () => {
  return (
    <ServicePageTemplate
      title="Blog"
      tagline="Resources"
      description="Insights, strategies, and expert advice to help your remodeling and home service business grow."
      heroImage="" // optional
      ctaText=""
      features={[]} // required fallback
      processSteps={[]} // required fallback
      faqItems={[]} // required fallback
      testimonial={undefined}
      relatedServices={[]}
      customContent={
        <div className="py-16 px-6">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
              {[...Array(3)].map((_, i) => {
                const blog = [
                  {
                    id: 'website-must-haves',
                    title: '7 Website Must-Haves for Remodeling Companies',
                    date: 'April 5, 2025',
                    readTime: '8 min read',
                    summary:
                      'Discover the essential elements every remodeling website needs to convert visitors into qualified leads.',
                    image:
                      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
                  },
                  {
                    id: 'seo-strategies',
                    title: 'SEO Strategies for Home Service Businesses',
                    date: 'March 28, 2025',
                    readTime: '6 min read',
                    summary:
                      'Learn how to optimize your online presence and attract more local customers with these proven SEO techniques.',
                    image:
                      'https://images.unsplash.com/photo-1571786256017-aee7a0c009b6?auto=format&fit=crop&w=800&q=80',
                  },
                  {
                    id: 'ai-revolution',
                    title: 'How AI is Revolutionizing Customer Service',
                    date: 'March 15, 2025',
                    readTime: '7 min read',
                    summary:
                      'Explore how artificial intelligence is transforming customer interactions and helping businesses provide exceptional service.',
                    image:
                      'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80',
                  },
                ][i];

                return (
                  <div
                    key={blog.id}
                    className="h-full flex flex-col justify-between rounded-lg overflow-hidden border transition-all duration-300 active:scale-[0.98] sm:hover:shadow-lg sm:hover:-translate-y-1"
                  >
                    <div className="h-48 overflow-hidden">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-500 sm:hover:scale-105"
                      />
                    </div>
                    <div className="flex-grow p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <span>{blog.date}</span>
                          <span className="mx-2">•</span>
                          <span>{blog.readTime}</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-blue-dark">{blog.title}</h3>
                        <p className="text-gray-600 mb-6">{blog.summary}</p>
                      </div>
                      <div className="text-center mt-auto">
                        <Link to={`/blog/${blog.id}`}>
                          <Button
                            variant="outline"
                            className="border-teal text-teal hover:bg-teal hover:text-white transition-all duration-300"
                          >
                            Read Article
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      }
    />
  );
};

export default Blog;
