
import React from 'react';
import SolutionPageTemplate from '../SolutionPageTemplate';
import { MessageSquare, Mail, Users, BarChart } from 'lucide-react';

const SmsEmail = () => {
  const features = [
    {
      title: 'Multi-Channel Campaigns',
      description: 'Create coordinated campaigns across SMS and email channels',
      icon: <MessageSquare className="h-6 w-6" />
    },
    {
      title: 'Personalized Messaging',
      description: 'Customize messages based on customer data and behavior',
      icon: <Mail className="h-6 w-6" />
    },
    {
      title: 'Audience Segmentation',
      description: 'Target specific customer groups with relevant messages',
      icon: <Users className="h-6 w-6" />
    },
    {
      title: 'Performance Analytics',
      description: 'Track open rates, clicks, and conversions for all campaigns',
      icon: <BarChart className="h-6 w-6" />
    }
  ];

  const processSteps = [
    {
      title: 'Audience Building',
      description: 'Create targeted segments based on customer attributes',
      stepNumber: 1
    },
    {
      title: 'Message Creation',
      description: 'Design compelling email and SMS content',
      stepNumber: 2
    },
    {
      title: 'Campaign Scheduling',
      description: 'Set up automated sequences with optimal timing',
      stepNumber: 3
    },
    {
      title: 'Results Analysis',
      description: 'Review performance and refine future campaigns',
      stepNumber: 4
    }
  ];

  const faqItems = [
    {
      question: 'Is this system compliant with SMS marketing regulations?',
      answer: 'Yes, our system helps you maintain compliance with TCPA, CAN-SPAM, and other regulations with built-in consent management and opt-out processing.'
    },
    {
      question: 'How personalized can the messages be?',
      answer: 'Messages can be highly personalized with customer names, project details, custom fields, and dynamic content based on their history with your business.'
    },
    {
      question: 'Can I schedule campaigns in advance?',
      answer: 'Absolutely! You can schedule one-time campaigns or set up recurring sequences triggered by dates or customer actions.'
    },
    {
      question: 'What kind of reporting is available?',
      answer: 'The system provides detailed metrics including delivery rates, open rates, click-through rates, conversion tracking, and ROI analysis for each campaign.'
    }
  ];

  return (
    <SolutionPageTemplate
      title="SMS / Email Marketing"
      description="Reach customers directly and instantly with targeted messaging"
      tagline="Marketing Solutions"
      category="Marketing"
      categoryPath="marketing"
      features={features}
      processSteps={processSteps}
      faqItems={faqItems}
      heroImage="/public/images/ChatGPT Image Hero Section.png"
      ctaText="Ready to engage customers with direct messaging?"
      relatedServices={[
        {
          title: "Marketing Automation",
          description: "Streamline your marketing efforts",
          link: "/solutions/marketing/automation"
        },
        {
          title: "Postcard / Voicemail",
          description: "Leave a lasting impression",
          link: "/solutions/marketing/voicemail"
        },
        {
          title: "Review Management",
          description: "Build your online reputation",
          link: "/solutions/marketing/reviews"
        }
      ]}
    />
  );
};

export default SmsEmail;
