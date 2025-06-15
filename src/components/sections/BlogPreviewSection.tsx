import React from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { Button } from '@/components/ui/button';

const blogPosts = [
  {
    slug: 'website-must-haves',
    title: '7 Website Must-Haves for Remodeling Companies',
    date: 'April 5, 2025',
    readTime: '5 min read',
    description:
      'Discover the essential elements that every remodeling website needs to convert visitors into qualified leads.',
    image: '/images/website-must-haves.png',
  },
  {
    slug: 'ai-revolution',
    title: 'How AI is Revolutionizing Customer Service in Home Services',
    date: 'April 6, 2025',
    readTime: '5 min read',
    description:
      'Learn how artificial intelligence is changing how home service businesses handle customer interactions.',
    image: '/images/ai-revolution.png',
  },
  {
    slug: 'seo-strategies',
    title: 'Local SEO: The Ultimate Guide for Contractors',
    date: 'April 7, 2025',
    readTime: '5 min read',
    description:
      'A complete guide to dominating local search results and attracting more customers in your service area.',
    image: '/images/seo-strategies.png',
  },
];

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {blogPosts.map((post, index) => (
            <ScrollReveal key={post.slug} delay={index * 100}>
              <div className="h-full flex flex-col justify-between rounded-lg overflow-hidden border transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>

                <div className="flex-grow p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <span>{post.date}</span>
                      <span className="mx-2">•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-blue-dark">{post.title}</h3>
                    <p className="text-gray-600 mb-6">{post.description}</p>
                  </div>

                  {/* Button-style CTA */}
                  <div className="text-center mt-auto">
                    <Link to={`/blog/${post.slug}`}>
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
            </ScrollReveal>
          ))}
        </div>

        <div className="text-center mt-10">
          <ScrollReveal>
            <Button
              asChild
              variant="outline"
              className="border-teal text-teal hover:bg-teal hover:text-white transition-all duration-300 rounded-lg font-medium px-6 py-3"
            >
              <Link to="/blog">Read More Articles</Link>
            </Button>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default BlogPreviewSection;
