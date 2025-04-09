
import React from 'react';
import ServicePageTemplate from '@/components/layout/ServicePageTemplate';
import FAQ from '@/components/ui/FAQ';

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

  // Service benefits
  const benefits = [
    {
      title: "Enhanced User Experience",
      description: "Deliver a smooth, responsive experience that keeps potential clients engaged with your portfolio and services."
    },
    {
      title: "Improved Search Rankings",
      description: "Speed is a crucial ranking factor. Faster sites rank higher in search results, bringing more organic traffic."
    },
    {
      title: "Higher Conversion Rates",
      description: "Faster websites convert more visitors into leads and customers, directly impacting your bottom line."
    },
    {
      title: "Reduced Bounce Rates",
      description: "Keep visitors on your site longer with quick-loading pages that respond instantly to user interactions."
    },
    {
      title: "Mobile Performance",
      description: "Optimize for mobile users who are increasingly searching for remodeling services on smartphones and tablets."
    },
    {
      title: "Competitive Advantage",
      description: "Stand out from competitors with a lightning-fast website that showcases your professionalism and attention to detail."
    }
  ];

  // Process steps
  const processSteps = [
    {
      title: "Comprehensive Audit",
      description: "We conduct a thorough analysis of your current website performance, identifying all factors affecting speed and responsiveness."
    },
    {
      title: "Custom Optimization Plan",
      description: "Based on the audit findings, we create a tailored optimization strategy specific to your website's architecture and needs."
    },
    {
      title: "Technical Implementation",
      description: "Our experts implement advanced optimization techniques, from code minification to server-side improvements."
    },
    {
      title: "Media Optimization",
      description: "We optimize all images and videos on your site for faster loading without compromising visual quality."
    },
    {
      title: "Testing & Refinement",
      description: "We rigorously test all optimizations across various devices and connections to ensure consistent performance."
    },
    {
      title: "Ongoing Monitoring",
      description: "After implementation, we continuously monitor your site's performance and make adjustments as needed to maintain optimal speed."
    }
  ];

  return (
    <ServicePageTemplate
      title="Performance Optimization"
      subtitle="Accelerate Your Website for Maximum Impact and Conversions"
      description="Transform your remodeling business's website into a lightning-fast digital storefront that converts more visitors into qualified leads. Our performance optimization services focus on delivering the speed, responsiveness, and seamless user experience that today's consumers expect."
      benefits={benefits}
      processSteps={processSteps}
      image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
    >
      {/* Additional custom content for the service page */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-blue-dark">Performance Metrics We Improve</h2>
              <p className="text-gray-600">
                We focus on the core web vitals and performance metrics that matter most for user experience and search engine rankings:
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-teal/10 p-2 rounded-full mr-4 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-blue-dark">Page Load Speed</h3>
                    <p className="text-gray-600">Dramatically reduce the time it takes for your pages to fully load, keeping potential clients engaged from the first second.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-teal/10 p-2 rounded-full mr-4 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-blue-dark">Core Web Vitals</h3>
                    <p className="text-gray-600">Optimize Google's key user experience metrics (LCP, FID, CLS) that directly impact your search rankings and visibility.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-teal/10 p-2 rounded-full mr-4 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-blue-dark">Mobile Responsiveness</h3>
                    <p className="text-gray-600">Ensure your site loads quickly and functions perfectly across all mobile devices, where more than 60% of remodeling searches now occur.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-teal/10 p-2 rounded-full mr-4 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-blue-dark">Server Response Time</h3>
                    <p className="text-gray-600">Optimize your hosting environment and server configuration to deliver content faster to your visitors.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-blue-dark">Our Optimization Techniques</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-medium text-blue-dark mb-3">Image Optimization</h3>
                  <p className="text-gray-600">We compress and properly format all images without quality loss, significantly reducing page weight and load times.</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-medium text-blue-dark mb-3">Code Minification</h3>
                  <p className="text-gray-600">We streamline CSS, JavaScript, and HTML to eliminate unnecessary characters and reduce file sizes.</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-medium text-blue-dark mb-3">Browser Caching</h3>
                  <p className="text-gray-600">Implement advanced caching strategies so returning visitors experience near-instant page loads.</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-medium text-blue-dark mb-3">CDN Integration</h3>
                  <p className="text-gray-600">Deliver content from servers closest to your visitors, dramatically reducing load times for all geographical regions.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <FAQ 
        title="Performance Optimization FAQ" 
        subtitle="Common questions about our performance optimization services" 
        items={faqItems} 
        className="py-16 bg-gray-50"
      />
    </ServicePageTemplate>
  );
};

export default PerformanceOptimization;
