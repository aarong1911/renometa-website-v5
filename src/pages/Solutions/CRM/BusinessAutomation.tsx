
import React from 'react';
import SolutionPageTemplate from '../SolutionPageTemplate';
import { Workflow, Clock, FileCheck, TrendingUp } from 'lucide-react';

const BusinessAutomation = () => {
  const features = [
    {
      title: 'Workflow Automation',
      description: 'Streamline repetitive tasks and business processes',
      icon: <Workflow className="h-6 w-6" />
    },
    {
      title: 'Time Savings',
      description: 'Reduce manual work and focus on high-value activities',
      icon: <Clock className="h-6 w-6" />
    },
    {
      title: 'Consistency & Accuracy',
      description: 'Eliminate human error in routine business operations',
      icon: <FileCheck className="h-6 w-6" />
    },
    {
      title: 'Performance Analytics',
      description: 'Track efficiency improvements and business growth',
      icon: <TrendingUp className="h-6 w-6" />
    }
  ];

  const processSteps = [
    {
      title: 'Process Analysis',
      description: 'Identify key processes that can benefit from automation',
      stepNumber: 1
    },
    {
      title: 'Solution Design',
      description: 'Create custom automation workflows for your business',
      stepNumber: 2
    },
    {
      title: 'Implementation',
      description: 'Set up and integrate automated systems with minimal disruption',
      stepNumber: 3
    },
    {
      title: 'Optimization',
      description: 'Monitor performance and refine processes for maximum efficiency',
      stepNumber: 4
    }
  ];

  const faqItems = [
    {
      question: 'What business processes can be automated?',
      answer: 'Many processes can be automated, including appointment scheduling, follow-up emails, invoice generation, payment reminders, customer onboarding, and more.'
    },
    {
      question: 'Will automation replace my employees?',
      answer: 'No, automation is designed to enhance your team\'s capabilities by handling routine tasks, allowing them to focus on more valuable work that requires human touch.'
    },
    {
      question: 'How long does it take to implement business automation?',
      answer: 'Implementation time varies based on complexity, but most solutions can be up and running within 2-4 weeks, with immediate benefits.'
    },
    {
      question: 'Is training provided for automated systems?',
      answer: 'Yes, comprehensive training is included to ensure your team can effectively manage and benefit from the automated systems.'
    }
  ];

  return (
    <SolutionPageTemplate
      title="Business Automation"
      description="Enhance efficiency and reduce costs with smart business automation"
      tagline="CRM Solutions"
      category="CRM"
      categoryPath="crm"
      features={features}
      processSteps={processSteps}
      faqItems={faqItems}
      heroImage="/public/images/ChatGPT Image Version 3.png"
      ctaText="Ready to streamline your business operations?"
      relatedServices={[
        {
          title: "Organize Customers",
          description: "Provide personalized and efficient service",
          link: "/solutions/crm/organize-customers"
        },
        {
          title: "Online Booking",
          description: "Accept bookings 24/7 from anywhere",
          link: "/solutions/crm/online-booking"
        },
        {
          title: "Customer Portal",
          description: "Give access to service requests",
          link: "/solutions/crm/customer-portal"
        }
      ]}
    />
  );
};

export default BusinessAutomation;
