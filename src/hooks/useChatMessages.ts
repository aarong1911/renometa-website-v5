
import { useState } from 'react';

export type Message = {
  type: 'user' | 'bot';
  content: string;
};

// Comprehensive website content knowledge base
const websiteContent = {
  services: {
    'website development': 'Our Smart Website Development service creates beautiful, responsive websites optimized for remodeling businesses with lead generation capabilities.',
    'seo': 'Our Advanced SEO service improves your online visibility with local search optimization, content strategy, and performance tracking.',
    'ai agents': 'Our AI-Powered Agents service implements conversational AI for your business to engage customers and qualify leads 24/7.',
    'automation': 'Our Intelligent Automation service streamlines repetitive tasks in your remodeling business workflow for increased efficiency.',
    'integration': 'Our Seamless Integration service connects your business tools and software to create a unified system with real-time data flow.',
    'performance': 'Our Performance Optimization service improves your website speed, user experience, and conversion rates through data-driven improvements.'
  },
  solutions: {
    'crm': {
      'overview': 'Our CRM solutions help you organize customers, enable online booking, provide customer portals, and automate repetitive tasks.',
      'organize customers': 'Centralize all customer information in one place for easy access and management across your team.',
      'online booking': 'Allow customers to book appointments online 24/7, synchronized with your team\'s calendar.',
      'customer portal': 'Provide customers with a secure portal to view project updates, documents, and communicate with your team.',
      'business automation': 'Automate repetitive tasks like follow-ups, appointment reminders, and document generation.'
    },
    'sales': {
      'overview': 'Our sales solutions help you manage your sales pipeline, create professional proposals, convert more leads, and get paid faster.',
      'sales pipeline': 'Track all potential deals in one visual pipeline to never miss an opportunity and forecast revenue.',
      'proposal kit': 'Create professional, branded proposals with templates and digital signing capabilities.',
      'convert upsell': 'Use data-driven insights to increase conversion rates and identify upsell opportunities.',
      'get paid faster': 'Streamline payment processes with integrated invoicing and online payment options.'
    },
    'marketing': {
      'overview': 'Our marketing solutions help you automate marketing tasks, gather reviews, reach customers via SMS/email, and use targeted voicemail.',
      'automation': 'Set up automated marketing campaigns that nurture leads over time without manual intervention.',
      'reviews': 'Automatically request and manage customer reviews on key platforms to build your online reputation.',
      'sms email': 'Send targeted SMS and email campaigns to stay in touch with customers and prospects.',
      'voicemail': 'Deliver personalized voicemail messages directly to prospects\' phones without interrupting their day.'
    },
    'jobs': {
      'overview': 'Our job management solutions help you handle scheduling, mobile management, job costing, and workflow integration.',
      'scheduling dispatching': 'Efficiently schedule and dispatch your team using visual calendars and automated notifications.',
      'mobile management': 'Manage jobs from anywhere using mobile apps for time tracking, photos, and customer signatures.',
      'job costing': 'Track labor, materials, and other expenses in real-time to maintain profitability on every job.',
      'workflow integration': 'Connect job management with your accounting, CRM, and other business tools for seamless operations.'
    }
  },
  testimonials: {
    'kitchen remodeling': 'Our website leads have doubled since working with RenoMeta. Their understanding of the remodeling industry made all the difference. - Michael Rodriguez, Owner at Rodriguez Remodeling',
    'windows': 'The AI agents have transformed our business. We\'re booking jobs 24/7 and our team can focus on the work instead of answering basic questions. - Sarah Johnson, Operations Manager at Johnson Home Services',
    'seo results': 'The SEO work they\'ve done has put us at the top of local searches. We\'re now the first call for homeowners in our area. - David Chen, Marketing Director at Luxe Bathroom Renovations',
    'automation': 'The automation systems RenoMeta implemented have transformed our operations. We\'ve reduced administrative work by 70% and our lead conversion rate has improved by 45%. - Michelle Carter, CEO at Carter Home Renovations',
    'integration': 'Before working with RenoMeta, we had separate systems for everything. Now everything talks to each other seamlessly. We\'ve eliminated double-entry, reduced errors by 90%. - Daniel Garcia, Owner at Precision Home Remodeling',
    'performance': 'RenoMeta\'s performance optimization services transformed our website. Page load times decreased by 60%, and our mobile conversion rate doubled within two months of implementation. - Jessica Miller, Marketing Director at Central Coast Renovations'
  },
  caseStudies: {
    'elite remodeling': 'Elite Remodeling Co. doubled their qualified leads while cutting ad spend by 30% through our website development and optimization services.',
    'superior windows': 'Superior Windows & Doors transformed their website into a lead generation machine, achieving an 87% increase in conversion rate.',
    'precision plumbing': 'Precision Plumbing increased after-hours bookings by 215% using our AI agents, while maintaining a 98% customer satisfaction rate.'
  },
  blog: {
    'website tips': '7 Website Must-Haves for Remodeling Companies: Essential elements that every remodeling website needs to convert visitors into qualified leads.',
    'ai revolution': 'How AI is Revolutionizing Customer Service in Home Services: Learn how artificial intelligence is changing how home service businesses handle customer interactions.',
    'local seo': 'Local SEO: The Ultimate Guide for Contractors - A complete guide to dominating local search results and attracting more customers in your service area.'
  },
  about: 'RenoMeta isn\'t your average marketing agency — we\'re the digital backbone for remodeling, HVAC, and home service companies ready to scale. We combine smart websites, advanced SEO, AI-powered agents, and intelligent automation into one seamless system designed to attract, convert, and retain customers.',
  faq: {
    'pricing': 'Our service pricing varies based on your specific needs. We offer customized packages starting at $1,500. For a detailed quote, please schedule a consultation.',
    'timeline': 'Most projects are completed within 3-6 weeks, depending on scope and complexity. We provide detailed timelines during our initial consultation.',
    'process': 'Our process includes discovery, planning, development, testing, and launch phases. We maintain clear communication throughout each step.',
    'support': 'All our services include ongoing support. We offer maintenance packages to keep your digital assets running smoothly.',
    'portfolio': 'You can view our portfolio and case studies on our website under each service section. We have experience with various remodeling businesses.',
    'contact': 'You can contact us through this chat, by emailing support@renometa.com, or by scheduling a consultation through our booking system.'
  },
  serviceFAQs: {
    'website': [
      {
        question: 'How long does it take to build a new website?',
        answer: 'Most remodeling business websites take 4-6 weeks from concept to launch, depending on the complexity and how quickly you can provide feedback and content. We follow a structured process to ensure efficient delivery without sacrificing quality.'
      },
      {
        question: 'Will my website work well on mobile devices?',
        answer: 'Absolutely! All of our websites are built with mobile-first design principles. This approach ensures that your site not only looks great on smartphones and tablets but also loads quickly and provides an optimal user experience across all devices.'
      },
      {
        question: 'Do you provide website hosting and maintenance?',
        answer: 'Yes, we offer comprehensive hosting and maintenance packages that include regular updates, security monitoring, backups, and technical support. This allows you to focus on your remodeling business while we keep your website running smoothly.'
      },
      {
        question: 'Can I update the website myself after it\'s built?',
        answer: 'Yes! We build all of our websites with user-friendly content management systems that make it easy to update text, add photos, create new pages, and more without any technical knowledge. We also provide training to ensure you\'re comfortable making updates.'
      },
      {
        question: 'Will my website help me generate leads?',
        answer: 'Our websites are specifically designed with lead generation in mind. We strategically place contact forms, implement compelling calls-to-action, and create conversion-focused designs that encourage visitors to reach out to your business.'
      }
    ],
    'seo': [
      {
        question: 'How long does it take to see results from SEO?',
        answer: 'SEO is a long-term strategy that typically shows initial improvements within 2-3 months, with more significant results appearing around months 4-6. The timeline depends on your current website status, competition level, and geographical market. We focus on sustainable growth rather than quick, temporary gains.'
      },
      {
        question: 'Will SEO work in my competitive market?',
        answer: 'Yes. While more competitive markets require more intensive strategies, our team has experience helping remodeling companies succeed in even the most competitive locations. We develop custom approaches based on your specific market challenges and opportunities.'
      },
      {
        question: 'How is your SEO different from other agencies?',
        answer: 'Our approach is specialized for remodeling and home service businesses. We understand the unique challenges of your industry, local search dynamics, and what homeowners are looking for. We don\'t use generic tactics but instead build strategies that reflect the specific needs of remodeling companies.'
      },
      {
        question: 'Do you guarantee rankings or results?',
        answer: 'We don\'t guarantee specific rankings because search algorithms constantly evolve and are influenced by many factors. However, we do guarantee a data-driven approach, transparent reporting, and continuous optimization based on performance metrics. Our track record demonstrates consistent improvements for our clients.'
      },
      {
        question: 'What reporting do you provide?',
        answer: 'You\'ll receive detailed monthly reports showing key performance metrics including ranking improvements, traffic growth, lead generation, and return on investment. We also provide access to a real-time dashboard and schedule regular review calls to discuss results and strategy adjustments.'
      }
    ],
    'ai': [
      {
        question: 'Will the AI agent sound robotic or unnatural?',
        answer: 'No, our AI agents are designed to provide natural, conversational interactions. They use advanced language processing to understand context, respond appropriately to questions, and maintain a friendly tone that represents your brand. Most visitors won\'t realize they\'re interacting with an AI.'
      },
      {
        question: 'How accurately can the AI answer questions about remodeling?',
        answer: 'Our AI agents are specifically trained on remodeling and home services knowledge, including common project types, materials, processes, and pricing considerations. They can accurately answer most general questions and are programmed to know when to transfer complex inquiries to your human team.'
      },
      {
        question: 'Can the AI integrate with our existing tools and systems?',
        answer: 'Yes, our AI agents can integrate with your CRM, project management software, scheduling tools, and other business systems. This allows for seamless data sharing and automation of processes like appointment booking and lead information transfer.'
      },
      {
        question: 'What happens if the AI can\'t answer a customer\'s question?',
        answer: 'If the AI encounters a question outside its knowledge base or detects that a human would better handle the conversation, it smoothly transfers the conversation to your team. It provides a complete transcript and summary of the discussion so your team has full context when they take over.'
      },
      {
        question: 'How much time will this save my team?',
        answer: 'Most remodeling businesses report saving 15-20 hours per week by implementing our AI agents. The AI handles routine inquiries, pre-qualifies leads, and gathers initial project information, allowing your team to focus on high-value activities like meeting with qualified prospects and managing projects.'
      }
    ],
    'automation': [
      {
        question: 'Which tasks in my remodeling business can be automated?',
        answer: 'Many aspects of a remodeling business can be automated, including lead follow-up, appointment scheduling, project milestone notifications, review collection, document management, payment reminders, and routine client communications. We analyze your specific workflows to identify the best opportunities for automation in your business.'
      },
      {
        question: 'Will automation make our customer service feel impersonal?',
        answer: 'Not at all. Our automation solutions are designed to enhance the personal touch, not replace it. By automating routine tasks, your team has more time for meaningful client interactions. Plus, our systems use personalization to ensure communications feel tailored to each client\'s specific project and preferences.'
      },
      {
        question: 'How difficult is it for my team to learn and use these automation systems?',
        answer: 'We design our automation solutions with user-friendliness in mind. Most clients find the systems intuitive and easy to use with minimal training. We provide comprehensive onboarding and ongoing support to ensure your team feels comfortable and confident using the tools.'
      },
      {
        question: 'Can automation systems integrate with our existing software?',
        answer: 'Yes, our automation solutions are designed to integrate with popular business tools and software used in the remodeling industry. This includes CRM systems, project management tools, accounting software, and digital marketing platforms. We assess your current tech stack during the consultation phase to ensure compatibility.'
      },
      {
        question: 'How much time and money can automation save my business?',
        answer: 'Remodeling businesses typically save 15-20 hours per week of staff time and reduce operational costs by 20-30% after implementing our automation solutions. Additionally, improved lead nurturing and client communication often lead to increased sales conversion rates and higher customer satisfaction.'
      }
    ],
    'integration': [
      {
        question: 'Can you integrate our custom or legacy systems?',
        answer: 'Yes, we have experience integrating both modern cloud-based applications and older legacy systems. We can develop custom API connections and middleware solutions to bridge different technologies, ensuring your entire tech ecosystem works together seamlessly regardless of age or platform.'
      },
      {
        question: 'Will integrating our systems be disruptive to our daily operations?',
        answer: 'We implement integrations with minimal disruption to your business. Most connections can be built and tested in parallel with your current systems and then switched over during off-hours. We also provide thorough testing and have contingency plans to ensure business continuity throughout the process.'
      },
      {
        question: 'How secure are these system integrations?',
        answer: 'Security is a top priority in all our integration work. We implement industry-standard encryption, secure authentication methods, and proper access controls. All data transfers between systems follow security best practices, and we regularly review security protocols to ensure continued protection.'
      },
      {
        question: 'How much maintenance do these integrations require?',
        answer: 'While integrations are designed to be robust, they do require some maintenance as your business evolves and as integrated platforms update their systems. We offer maintenance plans to monitor, update, and troubleshoot your integrations as needed, ensuring long-term stability and performance.'
      },
      {
        question: 'What types of remodeling business tools can you integrate?',
        answer: 'We can integrate virtually any software used in remodeling businesses, including CRM systems (like Salesforce, HubSpot), project management tools (like Buildertrend, CoConstruct), accounting software (like QuickBooks, Xero), design programs, estimation tools, scheduling systems, and communication platforms. We\'ll assess your specific tool stack during consultation.'
      }
    ],
    'performance': [
      {
        question: 'How can performance optimization help my remodeling business?',
        answer: 'Performance optimization can dramatically improve your website\'s speed and responsiveness, reducing bounce rates and increasing conversions. For remodeling businesses, this means potential clients spend more time viewing your work portfolio, contact you more frequently, and have a better overall impression of your business\'s professionalism.'
      },
      {
        question: 'How long does it take to see results from performance optimization?',
        answer: 'You\'ll see immediate improvements in website speed and functionality as soon as our optimizations are implemented. Most clients see a 30-50% reduction in page load times within the first week. Long-term benefits, like improved search rankings and increased conversion rates, typically become apparent within 1-3 months.'
      },
      {
        question: 'What specific performance metrics do you improve?',
        answer: 'We focus on improving key metrics that directly impact user experience and search rankings, including: page load time, Time to First Byte (TTFB), First Contentful Paint (FCP), Largest Contentful Paint (LCP), Cumulative Layout Shift (CLS), Time to Interactive (TTI), and mobile responsiveness speed.'
      },
      {
        question: 'Will performance optimization affect the design of my website?',
        answer: 'No, our performance optimization maintains the visual design and functionality of your site while making it faster and more responsive. In some cases, we may recommend minor adjustments to elements that are causing significant performance issues, but these changes are always approved by you first and designed to enhance user experience.'
      },
      {
        question: 'Do you provide ongoing performance monitoring?',
        answer: 'Yes, we offer continuous performance monitoring as part of our service. This includes regular speed tests, user experience analysis, and detailed monthly reports. We proactively address any new performance issues that arise and make continuous improvements to keep your site running at optimal speed.'
      }
    ]
  },
  features: {
    'website': [
      {
        title: 'Custom Design',
        description: 'Tailored designs that showcase your unique brand and services, creating an immediate connection with potential customers.'
      },
      {
        title: 'Mobile Optimization',
        description: 'Responsive designs that look and perform flawlessly on any device, ensuring you never miss a lead.'
      },
      {
        title: 'Lead Generation Focus',
        description: 'Strategic layouts and calls-to-action designed to convert visitors into qualified leads for your business.'
      },
      {
        title: 'Project Portfolio',
        description: 'Beautiful galleries that showcase your best work with before and after images to build trust with potential clients.'
      },
      {
        title: 'SEO Foundation',
        description: 'Built-in search engine optimization to help your business rank higher in local searches.'
      },
      {
        title: 'Easy Content Management',
        description: 'User-friendly systems that allow you to update content, add projects, and make changes without technical knowledge.'
      }
    ],
    'seo': [
      {
        title: 'Local SEO Optimization',
        description: 'Targeted strategies to ensure your business appears in the "Map Pack" and local searches for remodeling services in your area.'
      },
      {
        title: 'Service Area Targeting',
        description: 'Geo-specific keyword targeting ensures visibility in all neighborhoods and communities you serve.'
      },
      {
        title: 'Competitor Analysis',
        description: 'In-depth analysis of top-ranking competitors to identify opportunities and develop winning strategies.'
      },
      {
        title: 'Content Strategy',
        description: 'Development of SEO-optimized content that addresses homeowner questions and showcases your expertise.'
      },
      {
        title: 'Technical SEO',
        description: 'Comprehensive technical optimizations to ensure search engines can properly crawl and index your site.'
      },
      {
        title: 'Reputation Management',
        description: 'Strategies to build and leverage positive reviews across Google, social media, and industry platforms.'
      }
    ],
    'ai': [
      {
        title: '24/7 Availability',
        description: 'Never miss a lead again with virtual assistants that engage visitors around the clock, even when your office is closed.'
      },
      {
        title: 'Industry-Specific Training',
        description: 'Our AI agents understand remodeling terminology and common questions, providing accurate information about your services.'
      },
      {
        title: 'Lead Qualification',
        description: 'Automatically screen potential clients, gather project details, and prioritize high-value opportunities for your team.'
      },
      {
        title: 'Appointment Scheduling',
        description: 'Enable visitors to book consultations directly through the chat interface, synced with your calendar system.'
      },
      {
        title: 'Seamless Handoff',
        description: 'When human assistance is needed, the AI smoothly transfers conversations to your team with all context preserved.'
      },
      {
        title: 'Analytics & Insights',
        description: 'Gain valuable insights into customer questions, pain points, and behaviors to improve your marketing and services.'
      }
    ],
    'automation': [
      {
        title: 'Lead Nurturing',
        description: 'Automated follow-up sequences that keep prospects engaged with personalized content based on their interests.'
      },
      {
        title: 'Project Workflows',
        description: 'Streamlined processes for managing projects from estimate to completion with automated task assignments and client updates.'
      },
      {
        title: 'Client Communication',
        description: 'Automated updates and check-ins that keep clients informed and engaged throughout their remodeling project.'
      },
      {
        title: 'Review Collection',
        description: 'Systematic processes that encourage satisfied clients to leave reviews on key platforms at the optimal time.'
      },
      {
        title: 'Document Management',
        description: 'Automated handling of contracts, permits, and other important documents with secure client portals and approval workflows.'
      },
      {
        title: 'Analysis & Reporting',
        description: 'Automated data collection and reporting to provide insights into business performance and opportunities for improvement.'
      }
    ],
    'integration': [
      {
        title: 'Website & CRM Integration',
        description: 'Connect your website forms directly to your CRM, ensuring every lead is captured and properly tracked.'
      },
      {
        title: 'Project Management Sync',
        description: 'Connect your sales pipeline with your project management system for smooth transitions from sale to execution.'
      },
      {
        title: 'Calendar Connection',
        description: 'Sync your scheduling tools with team calendars, ensuring efficient resource allocation and preventing scheduling conflicts.'
      },
      {
        title: 'Financial System Connections',
        description: 'Connect your project tracking tools with accounting software to streamline invoicing, payment processing, and financial reporting.'
      },
      {
        title: 'Document Management',
        description: 'Create a unified document system that connects contracts, drawings, permits, and other files to relevant projects and clients.'
      },
      {
        title: 'Customer Portal Integration',
        description: 'Connect your internal systems with client-facing portals, allowing customers to access project updates, make selections, and view documents.'
      }
    ],
    'performance': [
      {
        title: 'Enhanced User Experience',
        description: 'Deliver a smooth, responsive experience that keeps potential clients engaged with your portfolio and services.'
      },
      {
        title: 'Improved Search Rankings',
        description: 'Speed is a crucial ranking factor. Faster sites rank higher in search results, bringing more organic traffic.'
      },
      {
        title: 'Higher Conversion Rates',
        description: 'Faster websites convert more visitors into leads and customers, directly impacting your bottom line.'
      },
      {
        title: 'Reduced Bounce Rates',
        description: 'Keep visitors on your site longer with quick-loading pages that respond instantly to user interactions.'
      },
      {
        title: 'Mobile Performance',
        description: 'Optimize for mobile users who are increasingly searching for remodeling services on smartphones and tablets.'
      },
      {
        title: 'Competitive Advantage',
        description: 'Stand out from competitors with a lightning-fast website that showcases your professionalism and attention to detail.'
      }
    ]
  },
  process: {
    'website': [
      {
        title: 'Discovery & Planning',
        description: 'We analyze your business goals, target audience, and competitive landscape to create a strategic website plan.',
        stepNumber: 1
      },
      {
        title: 'Design & Wireframing',
        description: 'Our designers create custom mockups that align with your brand and are optimized for lead generation.',
        stepNumber: 2
      },
      {
        title: 'Development & Content',
        description: 'We build your website with clean code and integrate compelling content that speaks to your ideal customers.',
        stepNumber: 3
      },
      {
        title: 'Testing & Launch',
        description: 'Rigorous testing ensures your site works flawlessly across all devices before we launch it to the world.',
        stepNumber: 4
      },
      {
        title: 'Training & Support',
        description: 'We provide training on managing your website and offer ongoing support to ensure your continued success.',
        stepNumber: 5
      }
    ],
    'seo': [
      {
        title: 'Comprehensive Audit',
        description: 'We conduct a thorough analysis of your current online presence, website performance, and market position.',
        stepNumber: 1
      },
      {
        title: 'Strategy Development',
        description: 'Based on the audit findings, we create a customized SEO strategy tailored to your business goals and service area.',
        stepNumber: 2
      },
      {
        title: 'On-Page Optimization',
        description: 'We optimize website structure, content, meta data, and technical elements to improve search visibility.',
        stepNumber: 3
      },
      {
        title: 'Local Presence Building',
        description: 'We enhance your Google Business Profile and establish consistent directory listings across the web.',
        stepNumber: 4
      },
      {
        title: 'Content Creation & Outreach',
        description: 'We develop SEO-optimized content and implement strategies to build quality backlinks to your site.',
        stepNumber: 5
      },
      {
        title: 'Monitoring & Refinement',
        description: 'We continuously track performance, making data-driven adjustments to improve results over time.',
        stepNumber: 6
      }
    ],
    'ai': [
      {
        title: 'Discovery & Planning',
        description: 'We analyze your business needs, customer journey, and common inquiries to create an AI strategy.',
        stepNumber: 1
      },
      {
        title: 'Knowledge Base Creation',
        description: 'We develop a comprehensive knowledge base about your services, processes, and frequently asked questions.',
        stepNumber: 2
      },
      {
        title: 'AI Training & Customization',
        description: 'We train the AI model with remodeling industry knowledge and customize it to represent your specific business.',
        stepNumber: 3
      },
      {
        title: 'Integration & Testing',
        description: 'We integrate the AI agent with your website and test it thoroughly with various scenarios and customer inquiries.',
        stepNumber: 4
      },
      {
        title: 'Launch & Monitoring',
        description: 'After deployment, we closely monitor performance, making continuous improvements as the AI learns.',
        stepNumber: 5
      }
    ],
    'automation': [
      {
        title: 'Process Analysis',
        description: 'We map your current workflows to identify bottlenecks and opportunities for automation.',
        stepNumber: 1
      },
      {
        title: 'Solution Design',
        description: 'We create custom automation solutions tailored to your specific business needs and goals.',
        stepNumber: 2
      },
      {
        title: 'System Configuration',
        description: 'We set up and configure the automation tools and integrate them with your existing systems.',
        stepNumber: 3
      },
      {
        title: 'Testing & Training',
        description: 'We rigorously test all automations and train your team on how to use and maintain the systems.',
        stepNumber: 4
      },
      {
        title: 'Launch & Optimization',
        description: 'After deployment, we monitor performance and make refinements to maximize efficiency and results.',
        stepNumber: 5
      }
    ],
    'integration': [
      {
        title: 'System Audit',
        description: 'We inventory your current tools and identify integration needs and opportunities for improved workflow.',
        stepNumber: 1
      },
      {
        title: 'Integration Planning',
        description: 'We develop a comprehensive plan for connecting your systems in a way that aligns with your business processes.',
        stepNumber: 2
      },
      {
        title: 'Custom API Development',
        description: 'When needed, we build custom connections between systems that don\'t offer native integration capabilities.',
        stepNumber: 3
      },
      {
        title: 'Implementation & Testing',
        description: 'We carefully implement each integration and thoroughly test data flow between systems to ensure accuracy.',
        stepNumber: 4
      },
      {
        title: 'Training & Documentation',
        description: 'We provide comprehensive training for your team and clear documentation of all integrated systems.',
        stepNumber: 5
      }
    ],
    'performance': [
      {
        title: 'Comprehensive Audit',
        description: 'We conduct a thorough analysis of your current website performance, identifying all factors affecting speed and responsiveness.',
        stepNumber: 1
      },
      {
        title: 'Custom Optimization Plan',
        description: 'Based on the audit findings, we create a tailored optimization strategy specific to your website\'s architecture and needs.',
        stepNumber: 2
      },
      {
        title: 'Technical Implementation',
        description: 'Our experts implement advanced optimization techniques, from code minification to server-side improvements.',
        stepNumber: 3
      },
      {
        title: 'Media Optimization',
        description: 'We optimize all images and videos on your site for faster loading without compromising visual quality.',
        stepNumber: 4
      },
      {
        title: 'Testing & Refinement',
        description: 'We rigorously test all optimizations across various devices and connections to ensure consistent performance.',
        stepNumber: 5
      },
      {
        title: 'Ongoing Monitoring',
        description: 'After implementation, we continuously monitor your site\'s performance and make adjustments as needed to maintain optimal speed.',
        stepNumber: 6
      }
    ]
  }
};

export const useChatMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  const addBotMessage = (content: string) => {
    addMessage({ type: 'bot', content });
  };

  const addUserMessage = (content: string) => {
    addMessage({ type: 'user', content });
  };

  const resetMessages = () => {
    setMessages([{
      type: 'bot',
      content: 'Welcome to RenoMeta! We offer services like Website Development, SEO, and AI Agents, as well as solutions for CRM, Sales, Marketing, and Job Management. How can I help your remodeling business grow?'
    }]);
  };

  // Enhanced content finder that searches through the comprehensive knowledge base
  const findRelevantContent = (query: string): string => {
    const lowercaseQuery = query.toLowerCase();
    let responses: string[] = [];
    
    // Function to search and match content
    const searchContent = (obj: any, path: string = '') => {
      if (typeof obj === 'string' && obj.toLowerCase().includes(lowercaseQuery)) {
        responses.push(obj);
        return;
      }
      
      if (typeof obj !== 'object' || obj === null) return;
      
      // For arrays or objects
      for (const [key, value] of Object.entries(obj)) {
        const currentPath = path ? `${path}.${key}` : key;
        
        // Match on the key name itself
        if (key.toLowerCase().includes(lowercaseQuery)) {
          if (typeof value === 'string') {
            responses.push(value);
          } else if (Array.isArray(value) && typeof value[0] === 'object') {
            // For arrays of objects (like FAQs)
            const summaries = value.map(item => 
              Object.values(item).filter(v => typeof v === 'string').join(': ')
            ).join(' | ');
            responses.push(`About ${key}: ${summaries}`);
          }
        }
        
        // Recursively search nested content
        searchContent(value, currentPath);
      }
    };
    
    // Search all website content
    searchContent(websiteContent);
    
    // Special handling for questions that might be FAQs
    if (lowercaseQuery.includes('?') || 
        lowercaseQuery.includes('how') || 
        lowercaseQuery.includes('what') || 
        lowercaseQuery.includes('when') || 
        lowercaseQuery.includes('why') || 
        lowercaseQuery.includes('who') || 
        lowercaseQuery.includes('where') || 
        lowercaseQuery.includes('can')) {
      
      // Search through all FAQ sections to find potential answers
      for (const section in websiteContent.serviceFAQs) {
        const faqs = websiteContent.serviceFAQs[section as keyof typeof websiteContent.serviceFAQs];
        for (const faq of faqs) {
          if (faq.question.toLowerCase().includes(lowercaseQuery) || 
              lowercaseQuery.includes(faq.question.toLowerCase().replace(/[?.,]/g, ''))) {
            responses.push(`Q: ${faq.question}\nA: ${faq.answer}`);
          }
        }
      }
      
      // General FAQs
      for (const [question, answer] of Object.entries(websiteContent.faq)) {
        if (lowercaseQuery.includes(question)) {
          responses.push(answer);
        }
      }
    }
    
    // Check for service-specific queries
    const serviceTerms = ['website', 'seo', 'ai', 'automation', 'integration', 'performance'];
    for (const term of serviceTerms) {
      if (lowercaseQuery.includes(term)) {
        // Add service description if available
        if (websiteContent.services[term as keyof typeof websiteContent.services]) {
          responses.push(websiteContent.services[term as keyof typeof websiteContent.services]);
        }
        
        // Add features if the query seems to be about features
        if (lowercaseQuery.includes('feature') || lowercaseQuery.includes('benefit') || lowercaseQuery.includes('offer')) {
          const features = websiteContent.features[term as keyof typeof websiteContent.features];
          if (features) {
            responses.push(`Key features of our ${term} service: ${features.map(f => f.title + ' - ' + f.description).join(' | ')}`);
          }
        }
        
        // Add process information if the query seems to be about process
        if (lowercaseQuery.includes('process') || lowercaseQuery.includes('steps') || lowercaseQuery.includes('how do you')) {
          const process = websiteContent.process[term as keyof typeof websiteContent.process];
          if (process) {
            responses.push(`Our ${term} process: ${process.map(p => p.stepNumber + '. ' + p.title + ' - ' + p.description).join(' | ')}`);
          }
        }
      }
    }
    
    // Check for solution-specific queries
    const solutionCategories = ['crm', 'sales', 'marketing', 'jobs'];
    for (const category of solutionCategories) {
      if (lowercaseQuery.includes(category)) {
        // Add solution overview
        if (websiteContent.solutions[category as keyof typeof websiteContent.solutions]) {
          const solution = websiteContent.solutions[category as keyof typeof websiteContent.solutions];
          responses.push(solution.overview);
          
          // Add specific solution details if mentioned
          for (const [key, value] of Object.entries(solution)) {
            if (key !== 'overview' && lowercaseQuery.includes(key)) {
              responses.push(`${key}: ${value}`);
            }
          }
        }
      }
    }
    
    // If we have responses, join them with separators for better readability
    if (responses.length > 0) {
      // If we have too many responses, limit and prioritize the most relevant ones
      if (responses.length > 3) {
        // Sort by relevance (simple word match count)
        responses = responses.sort((a, b) => {
          const aMatches = lowercaseQuery.split(' ')
            .filter(word => a.toLowerCase().includes(word)).length;
          const bMatches = lowercaseQuery.split(' ')
            .filter(word => b.toLowerCase().includes(word)).length;
          return bMatches - aMatches;
        }).slice(0, 3); // Take top 3
      }
      
      return responses.join('\n\n');
    }
    
    // Default response for unknown queries
    return "I can help you learn more about our services for remodeling and home service businesses. We offer Website Development, SEO, AI-Powered Agents, Intelligent Automation, Seamless Integration, and Performance Optimization. What specific aspect of our solutions would you like to know about?";
  };

  return {
    messages,
    addMessage,
    addBotMessage,
    addUserMessage,
    resetMessages,
    findRelevantContent
  };
};
