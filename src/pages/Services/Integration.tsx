
import React from 'react';
import ServicePageTemplate from '@/components/layout/ServicePageTemplate';

const Integration = () => {
  const serviceData = {
    title: 'Seamless Integration',
    tagline: 'Connect Your Business Tools',
    description: 'Unify your business operations by connecting your website, CRM, project management, accounting, and other tools into a cohesive ecosystem that eliminates duplicate data entry and information silos.',
    heroImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
    ctaText: 'Ready to Connect Your Business Systems?',
    features: [
      {
        title: 'Website & CRM Integration',
        description: 'Connect your website forms directly to your CRM, ensuring every lead is captured and properly tracked.',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16v-4m-4 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H4a2 2 0 00-2 2v6a2 2 0 002 2zm10 0h6m-6-8a2 2 0 11-4 0 2 2 0 014 0zM6 20v-2a2 2 0 012-2h8a2 2 0 012 2v2M6 12h.01M10 12h.01" />
          </svg>
        )
      },
      {
        title: 'Project Management Sync',
        description: 'Connect your sales pipeline with your project management system for smooth transitions from sale to execution.',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        )
      },
      {
        title: 'Calendar Connection',
        description: 'Sync your scheduling tools with team calendars, ensuring efficient resource allocation and preventing scheduling conflicts.',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )
      },
      {
        title: 'Financial System Connections',
        description: 'Connect your project tracking tools with accounting software to streamline invoicing, payment processing, and financial reporting.',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      },
      {
        title: 'Document Management',
        description: 'Create a unified document system that connects contracts, drawings, permits, and other files to relevant projects and clients.',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
          </svg>
        )
      },
      {
        title: 'Customer Portal Integration',
        description: 'Connect your internal systems with client-facing portals, allowing customers to access project updates, make selections, and view documents.',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        )
      },
    ],
    processSteps: [
      {
        title: 'System Audit',
        description: 'We inventory your current tools and identify integration needs and opportunities for improved workflow.',
        stepNumber: 1,
      },
      {
        title: 'Integration Planning',
        description: 'We develop a comprehensive plan for connecting your systems in a way that aligns with your business processes.',
        stepNumber: 2,
      },
      {
        title: 'Custom API Development',
        description: 'When needed, we build custom connections between systems that don\'t offer native integration capabilities.',
        stepNumber: 3,
      },
      {
        title: 'Implementation & Testing',
        description: 'We carefully implement each integration and thoroughly test data flow between systems to ensure accuracy.',
        stepNumber: 4,
      },
      {
        title: 'Training & Documentation',
        description: 'We provide comprehensive training for your team and clear documentation of all integrated systems.',
        stepNumber: 5,
      },
    ],
    faqItems: [
      {
        question: 'Can you integrate our custom or legacy systems?',
        answer: 'Yes, we have experience integrating both modern cloud-based applications and older legacy systems. We can develop custom API connections and middleware solutions to bridge different technologies, ensuring your entire tech ecosystem works together seamlessly regardless of age or platform.',
      },
      {
        question: 'Will integrating our systems be disruptive to our daily operations?',
        answer: 'We implement integrations with minimal disruption to your business. Most connections can be built and tested in parallel with your current systems and then switched over during off-hours. We also provide thorough testing and have contingency plans to ensure business continuity throughout the process.',
      },
      {
        question: 'How secure are these system integrations?',
        answer: 'Security is a top priority in all our integration work. We implement industry-standard encryption, secure authentication methods, and proper access controls. All data transfers between systems follow security best practices, and we regularly review security protocols to ensure continued protection.',
      },
      {
        question: 'How much maintenance do these integrations require?',
        answer: 'While integrations are designed to be robust, they do require some maintenance as your business evolves and as integrated platforms update their systems. We offer maintenance plans to monitor, update, and troubleshoot your integrations as needed, ensuring long-term stability and performance.',
      },
      {
        question: 'What types of remodeling business tools can you integrate?',
        answer: 'We can integrate virtually any software used in remodeling businesses, including CRM systems (like Salesforce, HubSpot), project management tools (like Buildertrend, CoConstruct), accounting software (like QuickBooks, Xero), design programs, estimation tools, scheduling systems, and communication platforms. We\'ll assess your specific tool stack during consultation.',
      },
    ],
    testimonial: {
      quote: "Before working with DigitalForge, we had separate systems for everything - leads, projects, scheduling, accounting. Now everything talks to each other seamlessly. We've eliminated double-entry, reduced errors by 90%, and our team has visibility across the entire business. It's been transformational.",
      author: "Daniel Garcia",
      position: "Owner",
      company: "Precision Home Remodeling",
    },
    relatedServices: [
      {
        title: "Smart Website Development",
        description: "Create a modern website designed to integrate with your business systems from day one.",
        link: "/services/website-development",
      },
      {
        title: "AI-Powered Agents",
        description: "Add virtual assistants that integrate with your business systems for enhanced customer service.",
        link: "/services/ai-agents",
      },
      {
        title: "Intelligent Automation",
        description: "Automate processes across your integrated systems for maximum efficiency and consistency.",
        link: "/services/automation",
      },
    ]
  };

  return <ServicePageTemplate {...serviceData} />;
};

export default Integration;
