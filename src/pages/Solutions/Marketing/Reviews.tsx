
import React from 'react';
import SolutionPageTemplate from '../SolutionPageTemplate';
import { Star, MessageSquare, AlertCircle, BarChart } from 'lucide-react';

const Reviews = () => {
  const features = [
    {
      title: 'Review Generation',
      description: 'Make it easy for satisfied customers to leave positive reviews',
      icon: <Star className="h-6 w-6" />
    },
    {
      title: 'Multi-Platform Management',
      description: 'Monitor and respond to reviews across all major platforms',
      icon: <MessageSquare className="h-6 w-6" />
    },
    {
      title: 'Negative Review Alerts',
      description: 'Get instant notifications of negative reviews for quick response',
      icon: <AlertCircle className="h-6 w-6" />
    },
    {
      title: 'Reputation Analytics',
      description: 'Track review trends and sentiment over time',
      icon: <BarChart className="h-6 w-6" />
    }
  ];

  const processSteps = [
    {
      title: 'Review Collection',
      description: 'Implement automated systems to request reviews after service',
      stepNumber: 1
    },
    {
      title: 'Monitoring Setup',
      description: 'Connect all your review platforms for centralized management',
      stepNumber: 2
    },
    {
      title: 'Response Strategy',
      description: 'Develop templates and protocols for review responses',
      stepNumber: 3
    },
    {
      title: 'Continuous Improvement',
      description: 'Use review insights to enhance your services',
      stepNumber: 4
    }
  ];

  const faqItems = [
    {
      question: 'Which review platforms are supported?',
      answer: 'The system supports all major review platforms including Google Business Profile, Yelp, Facebook, Houzz, HomeAdvisor, Angi, and industry-specific sites.'
    },
    {
      question: 'How does the review request system work?',
      answer: 'After service completion, customers automatically receive a friendly request via email or SMS asking them to share their experience, with direct links to your preferred review platforms.'
    },
    {
      question: 'Is it possible to prevent negative reviews?',
      answer: 'The system includes a feedback request step that can catch negative experiences before they become public reviews, allowing you to address issues privately first.'
    },
    {
      question: 'Can we display reviews on our website?',
      answer: 'Yes, the system includes widgets to showcase your best reviews on your website, automatically updating as new reviews come in.'
    }
  ];

  return (
    <SolutionPageTemplate
      title="Review Management"
      description="Build and manage your online reputation with strategic review management"
      tagline="Marketing Solutions"
      category="Marketing"
      categoryPath="marketing"
      features={features}
      processSteps={processSteps}
      faqItems={faqItems}
      heroImage="/public/images/ChatGPT Image Version 3.png"
      ctaText="Ready to boost your online reputation?"
      relatedServices={[
        {
          title: "Marketing Automation",
          description: "Streamline your marketing efforts",
          link: "/solutions/marketing/automation"
        },
        {
          title: "SMS / Email Marketing",
          description: "Reach customers directly",
          link: "/solutions/marketing/sms-email"
        },
        {
          title: "Postcard / Voicemail",
          description: "Leave a lasting impression",
          link: "/solutions/marketing/voicemail"
        }
      ]}
    />
  );
};

export default Reviews;
