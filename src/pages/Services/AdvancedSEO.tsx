
import React from 'react';
import ServicePageTemplate from '@/components/layout/ServicePageTemplate';

const AdvancedSEO = () => {
  const serviceData = {
    title: 'Advanced SEO',
    tagline: 'Search Engine Optimization',
    description: 'Specialized search engine optimization strategies that help remodeling and home service companies dominate local search results and attract qualified leads in their service areas.',
    heroImage: 'https://images.unsplash.com/photo-1477013743164-ffc3a5e556da',
    ctaText: 'Ready to Dominate Local Search?',
    features: [
      {
        title: 'Local SEO Optimization',
        description: 'Targeted strategies to ensure your business appears in the "Map Pack" and local searches for remodeling services in your area.',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )
      },
      {
        title: 'Service Area Targeting',
        description: 'Geo-specific keyword targeting ensures visibility in all neighborhoods and communities you serve.',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        )
      },
      {
        title: 'Competitor Analysis',
        description: 'In-depth analysis of top-ranking competitors to identify opportunities and develop winning strategies.',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        )
      },
      {
        title: 'Content Strategy',
        description: 'Development of SEO-optimized content that addresses homeowner questions and showcases your expertise.',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        )
      },
      {
        title: 'Technical SEO',
        description: 'Comprehensive technical optimizations to ensure search engines can properly crawl and index your site.',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )
      },
      {
        title: 'Reputation Management',
        description: 'Strategies to build and leverage positive reviews across Google, social media, and industry platforms.',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        )
      },
    ],
    processSteps: [
      {
        title: 'Comprehensive Audit',
        description: 'We conduct a thorough analysis of your current online presence, website performance, and market position.',
        stepNumber: 1,
      },
      {
        title: 'Strategy Development',
        description: 'Based on the audit findings, we create a customized SEO strategy tailored to your business goals and service area.',
        stepNumber: 2,
      },
      {
        title: 'On-Page Optimization',
        description: 'We optimize website structure, content, meta data, and technical elements to improve search visibility.',
        stepNumber: 3,
      },
      {
        title: 'Local Presence Building',
        description: 'We enhance your Google Business Profile and establish consistent directory listings across the web.',
        stepNumber: 4,
      },
      {
        title: 'Content Creation & Outreach',
        description: 'We develop SEO-optimized content and implement strategies to build quality backlinks to your site.',
        stepNumber: 5,
      },
      {
        title: 'Monitoring & Refinement',
        description: 'We continuously track performance, making data-driven adjustments to improve results over time.',
        stepNumber: 6,
      },
    ],
    faqItems: [
      {
        question: 'How long does it take to see results from SEO?',
        answer: 'SEO is a long-term strategy that typically shows initial improvements within 2-3 months, with more significant results appearing around months 4-6. The timeline depends on your current website status, competition level, and geographical market. We focus on sustainable growth rather than quick, temporary gains.',
      },
      {
        question: 'Will SEO work in my competitive market?',
        answer: 'Yes. While more competitive markets require more intensive strategies, our team has experience helping remodeling companies succeed in even the most competitive locations. We develop custom approaches based on your specific market challenges and opportunities.',
      },
      {
        question: 'How is your SEO different from other agencies?',
        answer: 'Our approach is specialized for remodeling and home service businesses. We understand the unique challenges of your industry, local search dynamics, and what homeowners are looking for. We don\'t use generic tactics but instead build strategies that reflect the specific needs of remodeling companies.',
      },
      {
        question: 'Do you guarantee rankings or results?',
        answer: 'We don\'t guarantee specific rankings because search algorithms constantly evolve and are influenced by many factors. However, we do guarantee a data-driven approach, transparent reporting, and continuous optimization based on performance metrics. Our track record demonstrates consistent improvements for our clients.',
      },
      {
        question: 'What reporting do you provide?',
        answer: 'You\'ll receive detailed monthly reports showing key performance metrics including ranking improvements, traffic growth, lead generation, and return on investment. We also provide access to a real-time dashboard and schedule regular review calls to discuss results and strategy adjustments.',
      },
    ],
    testimonial: {
      quote: "DigitalForge's SEO strategies have completely transformed our business. We're now ranking #1 for kitchen remodeling in our city, and we're getting quality leads every week without having to rely on expensive pay-per-click advertising.",
      author: "Rebecca Thompson",
      position: "Marketing Director",
      company: "Elite Kitchen & Bath",
    },
    relatedServices: [
      {
        title: "Smart Website Development",
        description: "Create a high-converting website that works hand-in-hand with your SEO strategy.",
        link: "/services/website-development",
      },
      {
        title: "AI-Powered Agents",
        description: "Convert more of your SEO traffic with intelligent chatbots that engage visitors 24/7.",
        link: "/services/ai-agents",
      },
      {
        title: "Intelligent Automation",
        description: "Automate follow-up with leads generated through your improved search presence.",
        link: "/services/automation",
      },
    ]
  };

  return <ServicePageTemplate {...serviceData} />;
};

export default AdvancedSEO;
