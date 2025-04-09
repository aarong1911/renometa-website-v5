
import React from 'react';
import ServicePageTemplate from '@/components/layout/ServicePageTemplate';

const WebsiteDevelopment = () => {
  const serviceData = {
    title: 'Smart Website Development',
    tagline: 'Website Development',
    description: 'Custom, high-converting websites designed specifically for remodeling and home services businesses. Built to showcase your work, generate leads, and grow your business.',
    heroImage: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
    ctaText: 'Ready to Transform Your Online Presence?',
    features: [
      {
        title: 'Custom Design',
        description: 'Tailored designs that showcase your unique brand and services, creating an immediate connection with potential customers.',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )
      },
      {
        title: 'Mobile Optimization',
        description: 'Responsive designs that look and perform flawlessly on any device, ensuring you never miss a lead.',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        )
      },
      {
        title: 'Lead Generation Focus',
        description: 'Strategic layouts and calls-to-action designed to convert visitors into qualified leads for your business.',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        )
      },
      {
        title: 'Project Portfolio',
        description: 'Beautiful galleries that showcase your best work with before and after images to build trust with potential clients.',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        )
      },
      {
        title: 'SEO Foundation',
        description: 'Built-in search engine optimization to help your business rank higher in local searches.',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        )
      },
      {
        title: 'Easy Content Management',
        description: 'User-friendly systems that allow you to update content, add projects, and make changes without technical knowledge.',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        )
      },
    ],
    processSteps: [
      {
        title: 'Discovery & Planning',
        description: 'We analyze your business goals, target audience, and competitive landscape to create a strategic website plan.',
        stepNumber: 1,
      },
      {
        title: 'Design & Wireframing',
        description: 'Our designers create custom mockups that align with your brand and are optimized for lead generation.',
        stepNumber: 2,
      },
      {
        title: 'Development & Content',
        description: 'We build your website with clean code and integrate compelling content that speaks to your ideal customers.',
        stepNumber: 3,
      },
      {
        title: 'Testing & Launch',
        description: 'Rigorous testing ensures your site works flawlessly across all devices before we launch it to the world.',
        stepNumber: 4,
      },
      {
        title: 'Training & Support',
        description: 'We provide training on managing your website and offer ongoing support to ensure your continued success.',
        stepNumber: 5,
      },
    ],
    faqItems: [
      {
        question: 'How long does it take to build a new website?',
        answer: 'Most remodeling business websites take 4-6 weeks from concept to launch, depending on the complexity and how quickly you can provide feedback and content. We follow a structured process to ensure efficient delivery without sacrificing quality.',
      },
      {
        question: 'Will my website work well on mobile devices?',
        answer: 'Absolutely! All of our websites are built with mobile-first design principles. This approach ensures that your site not only looks great on smartphones and tablets but also loads quickly and provides an optimal user experience across all devices.',
      },
      {
        question: 'Do you provide website hosting and maintenance?',
        answer: 'Yes, we offer comprehensive hosting and maintenance packages that include regular updates, security monitoring, backups, and technical support. This allows you to focus on your remodeling business while we keep your website running smoothly.',
      },
      {
        question: 'Can I update the website myself after it\'s built?',
        answer: 'Yes! We build all of our websites with user-friendly content management systems that make it easy to update text, add photos, create new pages, and more without any technical knowledge. We also provide training to ensure you\'re comfortable making updates.',
      },
      {
        question: 'Will my website help me generate leads?',
        answer: 'Our websites are specifically designed with lead generation in mind. We strategically place contact forms, implement compelling calls-to-action, and create conversion-focused designs that encourage visitors to reach out to your business.',
      },
    ],
    testimonial: {
      quote: "DigitalForge completely transformed our online presence. Our new website has increased our form submissions by 215% and helped us win several large kitchen remodeling projects. The investment has paid for itself many times over.",
      author: "James Wilson",
      position: "Owner",
      company: "Wilson Home Renovations",
    },
    relatedServices: [
      {
        title: "Advanced SEO",
        description: "Get found by more local customers with our specialized search engine optimization for remodeling companies.",
        link: "/services/advanced-seo",
      },
      {
        title: "AI-Powered Agents",
        description: "Add 24/7 customer service to your website with intelligent virtual assistants that qualify leads.",
        link: "/services/ai-agents",
      },
      {
        title: "Seamless Integration",
        description: "Connect your website with your CRM, scheduling, and project management tools for maximum efficiency.",
        link: "/services/integration",
      },
    ]
  };

  return <ServicePageTemplate {...serviceData} />;
};

export default WebsiteDevelopment;
