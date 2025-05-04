
import React from 'react';
import SolutionPageTemplate from '../SolutionPageTemplate';
import { MessageCircle, FileText, Target, Clock } from 'lucide-react';

const Voicemail = () => {
  const features = [
    {
      title: 'Multi-Channel Outreach',
      description: 'Combine postcards and voicemail drops for maximum impact',
      icon: <MessageCircle className="h-6 w-6" />
    },
    {
      title: 'Custom Design Services',
      description: 'Professional postcard design services with your branding',
      icon: <FileText className="h-6 w-6" />
    },
    {
      title: 'Targeted Delivery',
      description: 'Select recipients by location, demographics, or customer status',
      icon: <Target className="h-6 w-6" />
    },
    {
      title: 'Scheduled Campaigns',
      description: 'Plan campaigns in advance for consistent outreach',
      icon: <Clock className="h-6 w-6" />
    }
  ];

  const processSteps = [
    {
      title: 'Campaign Planning',
      description: 'Define your audience and campaign objectives',
      stepNumber: 1
    },
    {
      title: 'Creative Development',
      description: 'Create compelling postcard designs and voicemail scripts',
      stepNumber: 2
    },
    {
      title: 'Campaign Execution',
      description: 'Schedule and launch your coordinated marketing campaign',
      stepNumber: 3
    },
    {
      title: 'Response Tracking',
      description: 'Monitor and analyze campaign performance',
      stepNumber: 4
    }
  ];

  const faqItems = [
    {
      question: 'How does voicemail marketing work?',
      answer: 'Voicemail marketing delivers pre-recorded messages directly to customer voicemail boxes without their phones ringing, ensuring your message is waiting when they check their messages.'
    },
    {
      question: 'What makes postcards effective in a digital world?',
      answer: 'Physical postcards stand out in today\'s digital noise, providing a tangible reminder of your services that often stays in homes longer than digital messages stay in inboxes.'
    },
    {
      question: 'How targeted can the campaigns be?',
      answer: 'Campaigns can be highly targeted based on geographic location, demographics, past customer behavior, or custom criteria specific to your business needs.'
    },
    {
      question: 'How do you measure the effectiveness of these campaigns?',
      answer: 'We track responses through dedicated phone numbers, custom URLs, QR codes, and special offers that allow us to attribute leads and conversions to specific campaigns.'
    }
  ];

  return (
    <SolutionPageTemplate
      title="Postcard / Voicemail Marketing"
      description="Leave a lasting impression on potential customers with tangible marketing"
      tagline="Marketing Solutions"
      category="Marketing"
      categoryPath="marketing"
      features={features}
      processSteps={processSteps}
      faqItems={faqItems}
      heroImage="/public/images/ChatGPT Image Version 2.png"
      ctaText="Ready to stand out with direct marketing approaches?"
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
          title: "Review Management",
          description: "Build your online reputation",
          link: "/solutions/marketing/reviews"
        }
      ]}
    />
  );
};

export default Voicemail;
