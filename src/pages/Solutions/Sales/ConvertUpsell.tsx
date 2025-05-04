
import React from 'react';
import SolutionPageTemplate from '../SolutionPageTemplate';
import { TrendingUp, Target, Users, BarChart } from 'lucide-react';

const ConvertUpsell = () => {
  const features = [
    {
      title: 'Lead Qualification',
      description: 'Easily identify high-value prospects with the greatest potential',
      icon: <Users className="h-6 w-6" />
    },
    {
      title: 'Opportunity Tracking',
      description: 'Monitor sales opportunities from initial contact to close',
      icon: <Target className="h-6 w-6" />
    },
    {
      title: 'Cross-sell Suggestions',
      description: 'Get AI-powered recommendations for additional services',
      icon: <TrendingUp className="h-6 w-6" />
    },
    {
      title: 'Performance Analytics',
      description: 'Track conversion rates and identify successful strategies',
      icon: <BarChart className="h-6 w-6" />
    }
  ];

  const processSteps = [
    {
      title: 'Lead Analysis',
      description: 'Analyze incoming leads to identify the most promising opportunities',
      stepNumber: 1
    },
    {
      title: 'Customer Profiling',
      description: 'Create detailed customer profiles to understand needs and preferences',
      stepNumber: 2
    },
    {
      title: 'Service Matching',
      description: 'Match customers with additional services they\'re most likely to need',
      stepNumber: 3
    },
    {
      title: 'Strategic Follow-up',
      description: 'Implement targeted follow-up strategies to maximize conversions',
      stepNumber: 4
    }
  ];

  const faqItems = [
    {
      question: 'How does the system identify upsell opportunities?',
      answer: 'The system analyzes customer data, purchase history, and service patterns to identify the most relevant additional services to offer each customer.'
    },
    {
      question: 'Can I customize the sales scripts for different services?',
      answer: 'Yes, the platform includes customizable sales scripts that can be tailored to different services and customer segments.'
    },
    {
      question: 'How can I track the success of upselling efforts?',
      answer: 'The comprehensive analytics dashboard shows conversion rates, revenue from upsells, and which services are most successfully offered as add-ons.'
    },
    {
      question: 'Is training provided on effective upselling techniques?',
      answer: 'Yes, we provide comprehensive training resources on consultative selling approaches that feel helpful rather than pushy.'
    }
  ];

  return (
    <SolutionPageTemplate
      title="Convert And Upsell"
      description="Identify opportunities and increase sales through strategic upselling"
      tagline="Sales Solutions"
      category="Sales"
      categoryPath="sales"
      features={features}
      processSteps={processSteps}
      faqItems={faqItems}
      heroImage="/public/images/ChatGPT Image Hero Section.png"
      ctaText="Ready to increase your average transaction value?"
      relatedServices={[
        {
          title: "Sales Pipeline",
          description: "Track leads from beginning to end",
          link: "/solutions/sales/sales-pipeline"
        },
        {
          title: "Get Paid Faster",
          description: "Offer multiple payment options",
          link: "/solutions/sales/get-paid-faster"
        },
        {
          title: "Proposal Kit",
          description: "Win more clients with better proposals",
          link: "/solutions/sales/proposal-kit"
        }
      ]}
    />
  );
};

export default ConvertUpsell;
