
import React from 'react';
import SolutionPageTemplate from '../SolutionPageTemplate';
import { Workflow, Clock, Target, BarChart } from 'lucide-react';

const MarketingAutomation = () => {
  const features = [
    {
      title: 'Automated Campaigns',
      description: 'Set up marketing sequences that run without manual intervention',
      icon: <Workflow className="h-6 w-6" />
    },
    {
      title: 'Time Efficiency',
      description: 'Save hours of work with pre-scheduled content and follow-ups',
      icon: <Clock className="h-6 w-6" />
    },
    {
      title: 'Targeted Messaging',
      description: 'Deliver the right message to the right audience at the right time',
      icon: <Target className="h-6 w-6" />
    },
    {
      title: 'Performance Analytics',
      description: 'Track campaign success with comprehensive reporting',
      icon: <BarChart className="h-6 w-6" />
    }
  ];

  const processSteps = [
    {
      title: 'Strategy Development',
      description: 'Create a marketing automation plan aligned with your business goals',
      stepNumber: 1
    },
    {
      title: 'Campaign Setup',
      description: 'Build automated sequences for different customer journeys',
      stepNumber: 2
    },
    {
      title: 'Content Creation',
      description: 'Develop compelling content for each stage of the marketing funnel',
      stepNumber: 3
    },
    {
      title: 'Testing & Optimization',
      description: 'Continuously improve campaigns based on performance data',
      stepNumber: 4
    }
  ];

  const faqItems = [
    {
      question: 'What marketing tasks can be automated?',
      answer: 'Many tasks can be automated including email campaigns, social media posting, follow-up sequences, customer journey workflows, and lead nurturing.'
    },
    {
      question: 'How personalized can automated messages be?',
      answer: 'Very personalized! Our system can use customer data to dynamically insert names, project details, previous interactions, and more into any communication.'
    },
    {
      question: 'Will marketing automation work for my small business?',
      answer: 'Absolutely! Marketing automation is especially valuable for small businesses as it multiplies your marketing efforts without requiring additional staff.'
    },
    {
      question: 'How soon will I see results from marketing automation?',
      answer: 'Initial benefits like time savings are immediate. For marketing performance improvements, most businesses see measurable results within the first 1-3 months.'
    }
  ];

  return (
    <SolutionPageTemplate
      title="Marketing Automation"
      description="Automate repetitive marketing tasks to save time and improve results"
      tagline="Marketing Solutions"
      category="Marketing"
      categoryPath="marketing"
      features={features}
      processSteps={processSteps}
      faqItems={faqItems}
      heroImage="/public/images/ChatGPT Image Hero Section Modified.png"
      ctaText="Ready to make your marketing more effective with less effort?"
      relatedServices={[
        {
          title: "SMS / Email Marketing",
          description: "Reach customers directly and instantly",
          link: "/solutions/marketing/sms-email"
        },
        {
          title: "Postcard / Voicemail Marketing",
          description: "Leave a lasting impression on customers",
          link: "/solutions/marketing/voicemail"
        },
        {
          title: "Review Management",
          description: "Make it easy for customers to leave reviews",
          link: "/solutions/marketing/reviews"
        }
      ]}
    />
  );
};

export default MarketingAutomation;
