
import React from 'react';
import SolutionPageTemplate from '../SolutionPageTemplate';
import { Users, FileText, CreditCard, MessageCircle } from 'lucide-react';

const CustomerPortal = () => {
  const features = [
    {
      title: 'Service Request Management',
      description: 'Allow customers to submit and track service requests easily',
      icon: <FileText className="h-6 w-6" />
    },
    {
      title: 'Profile Management',
      description: 'Let customers update their information and preferences',
      icon: <Users className="h-6 w-6" />
    },
    {
      title: 'Secure Payment Processing',
      description: 'Enable customers to view and pay invoices online',
      icon: <CreditCard className="h-6 w-6" />
    },
    {
      title: 'Direct Communication',
      description: 'Provide a secure messaging system for customer inquiries',
      icon: <MessageCircle className="h-6 w-6" />
    }
  ];

  const processSteps = [
    {
      title: 'Portal Setup',
      description: 'Customize your customer portal with your branding',
      stepNumber: 1
    },
    {
      title: 'Customer Onboarding',
      description: 'Invite customers to create accounts and set up profiles',
      stepNumber: 2
    },
    {
      title: 'Feature Integration',
      description: 'Connect your services, payment systems, and messaging',
      stepNumber: 3
    },
    {
      title: 'Continuous Support',
      description: 'Provide ongoing assistance and regular portal updates',
      stepNumber: 4
    }
  ];

  const faqItems = [
    {
      question: 'How secure is the customer portal?',
      answer: 'Our customer portal uses industry-standard encryption and authentication to ensure all customer data and communications are secure.'
    },
    {
      question: 'Can customers upload photos or documents?',
      answer: 'Yes, customers can attach photos and documents to their service requests to provide more context for their needs.'
    },
    {
      question: 'Is the portal mobile-friendly?',
      answer: 'Absolutely! The customer portal is fully responsive and works well on smartphones, tablets, and computers.'
    },
    {
      question: 'How are customers notified about updates?',
      answer: 'Customers can choose to receive notifications via email, SMS, or in-app alerts when there are updates to their service requests.'
    }
  ];

  return (
    <SolutionPageTemplate
      title="Customer Portal"
      description="Give customers secure access to service requests, payments, and communications"
      tagline="CRM Solutions"
      category="CRM"
      categoryPath="crm"
      features={features}
      processSteps={processSteps}
      faqItems={faqItems}
      heroImage="/public/images/ChatGPT Image Version 2.png"
      ctaText="Ready to enhance your customer experience with a secure portal?"
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
          title: "Business Automation",
          description: "Enhance efficiency and reduce costs",
          link: "/solutions/crm/business-automation"
        }
      ]}
    />
  );
};

export default CustomerPortal;
