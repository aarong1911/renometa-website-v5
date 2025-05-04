
import React from 'react';
import SolutionPageTemplate from '../SolutionPageTemplate';
import { Calendar, Clock, Monitor, MessageSquare } from 'lucide-react';

const OnlineBooking = () => {
  const features = [
    {
      title: '24/7 Availability',
      description: 'Allow customers to book appointments anytime, even outside business hours',
      icon: <Clock className="h-6 w-6" />
    },
    {
      title: 'Integrated Calendar',
      description: 'Sync with your existing calendar to prevent double bookings',
      icon: <Calendar className="h-6 w-6" />
    },
    {
      title: 'Customizable Booking Page',
      description: 'Match your brand and show only the services you want to offer',
      icon: <Monitor className="h-6 w-6" />
    },
    {
      title: 'Automated Notifications',
      description: 'Reduce no-shows with automatic reminders and confirmations',
      icon: <MessageSquare className="h-6 w-6" />
    }
  ];

  const processSteps = [
    {
      title: 'Set Up Availability',
      description: 'Define your working hours and scheduling preferences',
      stepNumber: 1
    },
    {
      title: 'Customize Booking Page',
      description: 'Add your branding and configure available services',
      stepNumber: 2
    },
    {
      title: 'Integrate Calendar',
      description: 'Connect with your existing calendar systems',
      stepNumber: 3
    },
    {
      title: 'Share With Customers',
      description: 'Add booking links to your website and marketing materials',
      stepNumber: 4
    }
  ];

  const faqItems = [
    {
      question: 'Can customers reschedule or cancel their appointments?',
      answer: 'Yes, customers can easily reschedule or cancel appointments through the booking system, with configurable policies.'
    },
    {
      question: 'How does the system prevent double bookings?',
      answer: 'The online booking system syncs in real-time with your calendar to ensure time slots are only available when you truly are.'
    },
    {
      question: 'Can I set different service durations?',
      answer: 'Yes, you can customize the duration of each service type to accurately reflect your scheduling needs.'
    },
    {
      question: 'Is the booking system mobile-friendly?',
      answer: 'Absolutely! The booking system works seamlessly on all devices, including smartphones and tablets.'
    }
  ];

  return (
    <SolutionPageTemplate
      title="Online Booking"
      description="Accept bookings 24/7 from anywhere with our seamless online booking solution"
      tagline="CRM Solutions"
      category="CRM"
      categoryPath="crm"
      features={features}
      processSteps={processSteps}
      faqItems={faqItems}
      heroImage="/public/images/ChatGPT Image Hero Section Modified.png"
      ctaText="Ready to simplify your booking process?"
      relatedServices={[
        {
          title: "Organize Customers",
          description: "Provide personalized and efficient service",
          link: "/solutions/crm/organize-customers"
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

export default OnlineBooking;
