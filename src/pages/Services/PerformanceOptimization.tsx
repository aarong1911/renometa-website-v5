
import React from 'react';
import ServicePageTemplate from '@/components/layout/ServicePageTemplate';
import { ArrowUpRight, Zap, BarChart2, Layout, Smartphone, Server } from 'lucide-react';

const PerformanceOptimization = () => {
  // FAQ items for this service
  const faqItems = [
    {
      question: "How can performance optimization help my remodeling business?",
      answer: "Performance optimization can dramatically improve your website's speed and responsiveness, reducing bounce rates and increasing conversions. For remodeling businesses, this means potential clients spend more time viewing your work portfolio, contact you more frequently, and have a better overall impression of your business's professionalism."
    },
    {
      question: "How long does it take to see results from performance optimization?",
      answer: "You'll see immediate improvements in website speed and functionality as soon as our optimizations are implemented. Most clients see a 30-50% reduction in page load times within the first week. Long-term benefits, like improved search rankings and increased conversion rates, typically become apparent within 1-3 months."
    },
    {
      question: "What specific performance metrics do you improve?",
      answer: "We focus on improving key metrics that directly impact user experience and search rankings, including: page load time, Time to First Byte (TTFB), First Contentful Paint (FCP), Largest Contentful Paint (LCP), Cumulative Layout Shift (CLS), Time to Interactive (TTI), and mobile responsiveness speed."
    },
    {
      question: "Will performance optimization affect the design of my website?",
      answer: "No, our performance optimization maintains the visual design and functionality of your site while making it faster and more responsive. In some cases, we may recommend minor adjustments to elements that are causing significant performance issues, but these changes are always approved by you first and designed to enhance user experience."
    },
    {
      question: "Do you provide ongoing performance monitoring?",
      answer: "Yes, we offer continuous performance monitoring as part of our service. This includes regular speed tests, user experience analysis, and detailed monthly reports. We proactively address any new performance issues that arise and make continuous improvements to keep your site running at optimal speed."
    }
  ];

  // Features with icons
  const features = [
    {
      title: "Enhanced User Experience",
      description: "Deliver a smooth, responsive experience that keeps potential clients engaged with your portfolio and services.",
      icon: <Layout />
    },
    {
      title: "Improved Search Rankings",
      description: "Speed is a crucial ranking factor. Faster sites rank higher in search results, bringing more organic traffic.",
      icon: <ArrowUpRight />
    },
    {
      title: "Higher Conversion Rates",
      description: "Faster websites convert more visitors into leads and customers, directly impacting your bottom line.",
      icon: <BarChart2 />
    },
    {
      title: "Reduced Bounce Rates",
      description: "Keep visitors on your site longer with quick-loading pages that respond instantly to user interactions.",
      icon: <Zap />
    },
    {
      title: "Mobile Performance",
      description: "Optimize for mobile users who are increasingly searching for remodeling services on smartphones and tablets.",
      icon: <Smartphone />
    },
    {
      title: "Competitive Advantage",
      description: "Stand out from competitors with a lightning-fast website that showcases your professionalism and attention to detail.",
      icon: <Server />
    }
  ];

  // Process steps
  const processSteps = [
    {
      title: "Comprehensive Audit",
      description: "We conduct a thorough analysis of your current website performance, identifying all factors affecting speed and responsiveness.",
      stepNumber: 1
    },
    {
      title: "Custom Optimization Plan",
      description: "Based on the audit findings, we create a tailored optimization strategy specific to your website's architecture and needs.",
      stepNumber: 2
    },
    {
      title: "Technical Implementation",
      description: "Our experts implement advanced optimization techniques, from code minification to server-side improvements.",
      stepNumber: 3
    },
    {
      title: "Media Optimization",
      description: "We optimize all images and videos on your site for faster loading without compromising visual quality.",
      stepNumber: 4
    },
    {
      title: "Testing & Refinement",
      description: "We rigorously test all optimizations across various devices and connections to ensure consistent performance.",
      stepNumber: 5
    },
    {
      title: "Ongoing Monitoring",
      description: "After implementation, we continuously monitor your site's performance and make adjustments as needed to maintain optimal speed.",
      stepNumber: 6
    }
  ];

  // Testimonial example
  const testimonial = {
    quote: "RenoMeta's performance optimization services transformed our website. Page load times decreased by 60%, and our mobile conversion rate doubled within two months of implementation.",
    author: "Jessica Miller",
    position: "Marketing Director",
    company: "Central Coast Renovations"
  };

  // Related services
  const relatedServices = [
    {
      title: "Smart Website Development",
      description: "Build a modern, responsive website that converts visitors into clients.",
      link: "/services/website-development"
    },
    {
      title: "Advanced SEO",
      description: "Boost your visibility and attract more qualified leads through strategic search engine optimization.",
      link: "/services/advanced-seo"
    },
    {
      title: "Seamless Integration",
      description: "Connect your website with the tools you already use to streamline your business operations.",
      link: "/services/integration"
    }
  ];

  return (
    <ServicePageTemplate
      title="Performance Optimization"
      description="Transform your remodeling business's website into a lightning-fast digital storefront that converts more visitors into qualified leads. Our performance optimization services focus on delivering the speed, responsiveness, and seamless user experience that today's consumers expect."
      tagline="Speed Matters"
      features={features}
      processSteps={processSteps}
      faqItems={faqItems}
      testimonial={testimonial}
      heroImage="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
      ctaText="Ready to accelerate your website and boost conversions?"
      relatedServices={relatedServices}
    />
  );
};

export default PerformanceOptimization;
