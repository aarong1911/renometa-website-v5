
import React from 'react';
import SolutionPageTemplate from '../SolutionPageTemplate';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';

const SchedulingDispatching = () => {
  const features = [
    {
      title: 'Smart Scheduling',
      description: 'Optimize crew assignments and job scheduling to maximize efficiency',
      icon: <Calendar className="h-6 w-6" />
    },
    {
      title: 'Route Optimization',
      description: 'Reduce travel time with intelligent routing between job sites',
      icon: <MapPin className="h-6 w-6" />
    },
    {
      title: 'Real-time Updates',
      description: 'React quickly to changes with real-time schedule adjustments',
      icon: <Clock className="h-6 w-6" />
    },
    {
      title: 'Team Management',
      description: 'Match the right skills to the right jobs for better results',
      icon: <Users className="h-6 w-6" />
    }
  ];

  const processSteps = [
    {
      title: 'Assessment',
      description: 'Review your current scheduling processes and challenges',
      stepNumber: 1
    },
    {
      title: 'Solution Design',
      description: 'Configure the scheduling system to match your business needs',
      stepNumber: 2
    },
    {
      title: 'Implementation',
      description: 'Deploy the solution and migrate your scheduling data',
      stepNumber: 3
    },
    {
      title: 'Optimization',
      description: 'Continue refining your scheduling process for peak efficiency',
      stepNumber: 4
    }
  ];

  const faqItems = [
    {
      question: 'How does scheduling optimization work?',
      answer: 'Our scheduling system uses algorithms to consider factors like location, skills needed, job duration, and priority to create the most efficient schedule possible.'
    },
    {
      question: 'Can field technicians update job status from mobile devices?',
      answer: 'Yes, technicians can update job status, record time, and add notes from any mobile device, with changes reflected in real-time.'
    },
    {
      question: 'Will this integrate with our existing business software?',
      answer: 'Our solution integrates with most common business management, CRM, and accounting systems used in the home services industry.'
    },
    {
      question: 'How are customers notified about appointments?',
      answer: 'Customers can receive automated notifications via email, SMS, or both, with options for reminders and updates about technician arrival times.'
    }
  ];

  return (
    <SolutionPageTemplate
      title="Scheduling & Dispatching"
      description="Optimize labor usage and minimize downtime with intelligent scheduling"
      tagline="Job Management Solutions"
      category="Job Management"
      categoryPath="jobs"
      features={features}
      processSteps={processSteps}
      faqItems={faqItems}
      heroImage="/public/images/ChatGPT Image Version 2.png"
      ctaText="Ready to optimize your field operations?"
      relatedServices={[
        {
          title: "Job Costing",
          description: "Track the costs and revenues by job",
          link: "/solutions/jobs/job-costing"
        },
        {
          title: "Managing Jobs On The Go",
          description: "Stay productive while on the go",
          link: "/solutions/jobs/mobile-management"
        },
        {
          title: "Workflow Integration",
          description: "Create a seamless and efficient workflow",
          link: "/solutions/jobs/workflow-integration"
        }
      ]}
    />
  );
};

export default SchedulingDispatching;
