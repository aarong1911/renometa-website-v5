
import React from 'react';
import SolutionPageTemplate from '../SolutionPageTemplate';
import { CreditCard, Clock, FileText, Shield } from 'lucide-react';

const GetPaidFaster = () => {
  const features = [
    {
      title: 'Multiple Payment Options',
      description: 'Offer credit cards, ACH, financing, and more payment methods',
      icon: <CreditCard className="h-6 w-6" />
    },
    {
      title: 'Automated Invoicing',
      description: 'Send professional invoices automatically at project milestones',
      icon: <FileText className="h-6 w-6" />
    },
    {
      title: 'Scheduled Payments',
      description: 'Set up payment schedules for large projects and retainers',
      icon: <Clock className="h-6 w-6" />
    },
    {
      title: 'Secure Processing',
      description: 'Keep payment information safe with advanced security',
      icon: <Shield className="h-6 w-6" />
    }
  ];

  const processSteps = [
    {
      title: 'Payment Setup',
      description: 'Configure your preferred payment methods and processors',
      stepNumber: 1
    },
    {
      title: 'Invoice Templates',
      description: 'Create branded invoice templates for consistent communication',
      stepNumber: 2
    },
    {
      title: 'Payment Rules',
      description: 'Define payment schedules and automatic reminders',
      stepNumber: 3
    },
    {
      title: 'Reporting Integration',
      description: 'Connect with accounting systems for seamless bookkeeping',
      stepNumber: 4
    }
  ];

  const faqItems = [
    {
      question: 'What payment processors are supported?',
      answer: 'The system integrates with all major payment processors including Stripe, Square, PayPal, and traditional merchant accounts.'
    },
    {
      question: 'Can customers set up recurring payments?',
      answer: 'Yes, customers can securely save payment information and authorize recurring payments for subscription services or payment plans.'
    },
    {
      question: 'How are payment disputes handled?',
      answer: 'The system includes tools to help document all transactions and communications, making it easier to resolve disputes while maintaining customer relationships.'
    },
    {
      question: 'Is this solution PCI compliant?',
      answer: 'Absolutely. All payment processing features adhere to strict PCI DSS requirements to protect both your business and your customers.'
    }
  ];

  return (
    <SolutionPageTemplate
      title="Get Paid Faster"
      description="Offer multiple payment options and streamline your invoicing process"
      tagline="Sales Solutions"
      category="Sales"
      categoryPath="sales"
      features={features}
      processSteps={processSteps}
      faqItems={faqItems}
      heroImage="/public/images/ChatGPT Image Version 2.png"
      ctaText="Ready to improve your cash flow?"
      relatedServices={[
        {
          title: "Sales Pipeline",
          description: "Track leads from beginning to end",
          link: "/solutions/sales/sales-pipeline"
        },
        {
          title: "Convert And Upsell",
          description: "Identify opportunities and increase sales",
          link: "/solutions/sales/convert-upsell"
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

export default GetPaidFaster;
