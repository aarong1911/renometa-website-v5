
import React from 'react';
import SolutionPageTemplate from '../SolutionPageTemplate';
import { Users, Database, Filter, BarChart } from 'lucide-react';

const OrganizeCustomers = () => {
  const features = [
    {
      title: 'Centralized Customer Database',
      description: 'Store all customer information in one secure, easily accessible location',
      icon: <Database className="h-6 w-6" />
    },
    {
      title: 'Advanced Filtering',
      description: 'Quickly sort and find customers based on various criteria',
      icon: <Filter className="h-6 w-6" />
    },
    {
      title: 'Customer Segmentation',
      description: 'Group customers based on demographics, behavior, or purchase history',
      icon: <Users className="h-6 w-6" />
    },
    {
      title: 'Performance Analytics',
      description: 'Track customer interactions and identify trends for better service',
      icon: <BarChart className="h-6 w-6" />
    }
  ];

  const processSteps = [
    {
      title: 'Centralize Data',
      description: 'Import all customer information into one secure database',
      stepNumber: 1
    },
    {
      title: 'Organize Profiles',
      description: 'Create detailed customer profiles with relevant information',
      stepNumber: 2
    },
    {
      title: 'Implement Segmentation',
      description: 'Group customers based on needs, preferences, and history',
      stepNumber: 3
    },
    {
      title: 'Personalize Service',
      description: 'Use organized data to provide more personalized customer experiences',
      stepNumber: 4
    }
  ];

  const faqItems = [
    {
      question: 'How secure is the customer database?',
      answer: 'Our customer database uses industry-leading encryption and security protocols to ensure your data is always protected.'
    },
    {
      question: 'Can I import data from my existing systems?',
      answer: 'Yes, our solution supports importing data from most common CRM systems and spreadsheet formats.'
    },
    {
      question: 'How can customer organization improve my business?',
      answer: 'Organized customer data allows for better service, targeted marketing, and improved customer retention rates.'
    },
    {
      question: 'Is training provided for the new system?',
      answer: 'Yes, comprehensive training is included to ensure your team can effectively use all features.'
    }
  ];

  return (
    <SolutionPageTemplate
      title="Organize Customers"
      description="Provide personalized and efficient service by organizing your customer data effectively"
      tagline="CRM Solutions"
      category="CRM"
      categoryPath="crm"
      features={features}
      processSteps={processSteps}
      faqItems={faqItems}
      heroImage="/public/images/ChatGPT Image Hero Section.png"
      ctaText="Ready to transform how you manage customer relationships?"
      relatedServices={[
        {
          title: "Online Booking",
          description: "Accept bookings 24/7 from anywhere",
          link: "/solutions/crm/online-booking"
        },
        {
          title: "Customer Portal",
          description: "Give access to service requests",
          link: "/solutions/crm/customer-portal"
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

export default OrganizeCustomers;
