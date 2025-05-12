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
    imageSeed: 1,
  },
  {
    slug: 'ai-revolution',
    title: 'How AI is Revolutionizing Customer Service in Home Services',
    date: 'April 6, 2025',
    readTime: '5 min read',
    description:
      'Learn how artificial intelligence is changing how home service businesses handle customer interactions.',
    imageSeed: 2,
  },
  {
    slug: 'seo-strategies',
    title: 'Local SEO: The Ultimate Guide for Contractors',
    date: 'April 7, 2025',
    readTime: '5 min read',
    description:
      'A complete guide to dominating local search results and attracting more customers in your service area.',
    imageSeed: 3,
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <ScrollReveal key={post.slug} delay={index * 100}>
              <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-48 overflow-hidden">
                  <img
                    src={`https://picsum.photos/seed/${post.imageSeed}/600/400`}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <span>{post.date}</span>
                    <span className="mx-2">•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-blue-dark">{post.title}</h3>
                  <p className="text-gray-600 mb-4">{post.description}</p>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="text-teal font-medium flex items-center group"
                  >
                    Read Article
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
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
              className="border-blue-dark text-blue-dark hover:bg-blue-light hover:text-white hover:border-blue-light transition-colors duration-300"
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
