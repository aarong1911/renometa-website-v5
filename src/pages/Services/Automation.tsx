
import React from 'react';
import ServicePageTemplate from '@/components/layout/ServicePageTemplate';

const Automation = () => {
  const serviceData = {
    title: 'Intelligent Automation',
    tagline: 'Workflow Automation',
    description: 'Streamline your business operations with intelligent systems that automate repetitive tasks, deliver personalized follow-ups, and ensure no leads or opportunities fall through the cracks.',
    heroImage: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7',
    ctaText: 'Ready to Streamline Your Business?',
    features: [
      {
        title: 'Lead Nurturing',
        description: 'Automated follow-up sequences that keep prospects engaged with personalized content based on their interests.',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        )
      },
      {
        title: 'Project Workflows',
        description: 'Streamlined processes for managing projects from estimate to completion with automated task assignments and client updates.',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        )
      },
      {
        title: 'Client Communication',
        description: 'Automated updates and check-ins that keep clients informed and engaged throughout their remodeling project.',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )
      },
      {
        title: 'Review Collection',
        description: 'Systematic processes that encourage satisfied clients to leave reviews on key platforms at the optimal time.',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        )
      },
      {
        title: 'Document Management',
        description: 'Automated handling of contracts, permits, and other important documents with secure client portals and approval workflows.',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
      },
      {
        title: 'Analysis & Reporting',
        description: 'Automated data collection and reporting to provide insights into business performance and opportunities for improvement.',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        )
      },
    ],
    processSteps: [
      {
        title: 'Process Analysis',
        description: 'We map your current workflows to identify bottlenecks and opportunities for automation.',
        stepNumber: 1,
      },
      {
        title: 'Solution Design',
        description: 'We create custom automation solutions tailored to your specific business needs and goals.',
        stepNumber: 2,
      },
      {
        title: 'System Configuration',
        description: 'We set up and configure the automation tools and integrate them with your existing systems.',
        stepNumber: 3,
      },
      {
        title: 'Testing & Training',
        description: 'We rigorously test all automations and train your team on how to use and maintain the systems.',
        stepNumber: 4,
      },
      {
        title: 'Launch & Optimization',
        description: 'After deployment, we monitor performance and make refinements to maximize efficiency and results.',
        stepNumber: 5,
      },
    ],
    faqItems: [
      {
        question: 'Which tasks in my remodeling business can be automated?',
        answer: 'Many aspects of a remodeling business can be automated, including lead follow-up, appointment scheduling, project milestone notifications, review collection, document management, payment reminders, and routine client communications. We analyze your specific workflows to identify the best opportunities for automation in your business.',
      },
      {
        question: 'Will automation make our customer service feel impersonal?',
        answer: 'Not at all. Our automation solutions are designed to enhance the personal touch, not replace it. By automating routine tasks, your team has more time for meaningful client interactions. Plus, our systems use personalization to ensure communications feel tailored to each client\'s specific project and preferences.',
      },
      {
        question: 'How difficult is it for my team to learn and use these automation systems?',
        answer: 'We design our automation solutions with user-friendliness in mind. Most clients find the systems intuitive and easy to use with minimal training. We provide comprehensive onboarding and ongoing support to ensure your team feels comfortable and confident using the tools.',
      },
      {
        question: 'Can automation systems integrate with our existing software?',
        answer: 'Yes, our automation solutions are designed to integrate with popular business tools and software used in the remodeling industry. This includes CRM systems, project management tools, accounting software, and digital marketing platforms. We assess your current tech stack during the consultation phase to ensure compatibility.',
      },
      {
        question: 'How much time and money can automation save my business?',
        answer: 'Remodeling businesses typically save 15-20 hours per week of staff time and reduce operational costs by 20-30% after implementing our automation solutions. Additionally, improved lead nurturing and client communication often lead to increased sales conversion rates and higher customer satisfaction.',
      },
    ],
    testimonial: {
      quote: "The automation systems DigitalForge implemented have transformed our operations. We've reduced administrative work by 70% and our lead conversion rate has improved by 45%. The best part is that clients comment on how organized and communicative we are throughout their projects.",
      author: "Michelle Carter",
      position: "CEO",
      company: "Carter Home Renovations",
    },
    relatedServices: [
      {
        title: "Smart Website Development",
        description: "Create a website that integrates with your automation systems for seamless lead capture.",
        link: "/services/website-development",
      },
      {
        title: "AI-Powered Agents",
        description: "Add intelligent virtual assistants that work hand-in-hand with your automation systems.",
        link: "/services/ai-agents",
      },
      {
        title: "Seamless Integration",
        description: "Connect all your business tools for maximum efficiency and data consistency.",
        link: "/services/integration",
      },
    ]
  };

  return <ServicePageTemplate {...serviceData} />;
};

export default Automation;
