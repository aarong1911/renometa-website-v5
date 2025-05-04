
import React from 'react';
import SolutionPageTemplate from '../SolutionPageTemplate';
import { Workflow, ArrowRight, Zap, Check } from 'lucide-react';

const WorkflowIntegration = () => {
  const features = [
    {
      title: 'Connected Systems',
      description: 'Integrate your CRM, scheduling, accounting, and field tools',
      icon: <Workflow className="h-6 w-6" />
    },
    {
      title: 'Automated Handoffs',
      description: 'Move jobs smoothly between departments with no manual data entry',
      icon: <ArrowRight className="h-6 w-6" />
    },
    {
      title: 'Trigger-Based Actions',
      description: 'Set up automated actions based on job status changes',
      icon: <Zap className="h-6 w-6" />
    },
    {
      title: 'Process Standardization',
      description: 'Ensure consistent processes across all jobs and team members',
      icon: <Check className="h-6 w-6" />
    }
  ];

  const processSteps = [
    {
      title: 'Workflow Assessment',
      description: 'Analyze your current workflows to identify integration points',
      stepNumber: 1
    },
    {
      title: 'Integration Design',
      description: 'Design connected workflows across your business systems',
      stepNumber: 2
    },
    {
      title: 'System Configuration',
      description: 'Configure integrations and data mapping between platforms',
      stepNumber: 3
    },
    {
      title: 'Training & Optimization',
      description: 'Train teams and continuously improve integrated processes',
      stepNumber: 4
    }
  ];

  const faqItems = [
    {
      question: 'Which software systems can be integrated?',
      answer: 'Our workflow integration supports all major field service, accounting, CRM, and project management software, with custom integration options for specialized systems.'
    },
    {
      question: 'Will I need technical expertise to maintain the integrations?',
      answer: 'No, our integrations are designed to be stable and user-friendly. We provide ongoing support and monitoring to ensure everything continues working smoothly.'
    },
    {
      question: 'How long does it take to implement workflow integration?',
      answer: 'Implementation typically takes 2-4 weeks depending on the complexity of your workflows and the number of systems being integrated.'
    },
    {
      question: 'Can we make changes to the workflow after implementation?',
      answer: 'Absolutely! The system is designed to be flexible, allowing you to adapt workflows as your business evolves or requirements change.'
    }
  ];

  return (
    <SolutionPageTemplate
      title="Workflow Integration"
      description="Create a seamless and efficient workflow across all your business systems"
      tagline="Job Management Solutions"
      category="Job Management"
      categoryPath="jobs"
      features={features}
      processSteps={processSteps}
      faqItems={faqItems}
      heroImage="/public/images/ChatGPT Image Version 3.png"
      ctaText="Ready to eliminate silos and create seamless workflows?"
      relatedServices={[
        {
          title: "Scheduling & Dispatching",
          description: "Efficiently schedule your team",
          link: "/solutions/jobs/scheduling-dispatching"
        },
        {
          title: "Job Costing",
          description: "Track costs and revenues by job",
          link: "/solutions/jobs/job-costing"
        },
        {
          title: "Managing Jobs On The Go",
          description: "Stay productive while on the go",
          link: "/solutions/jobs/mobile-management"
        }
      ]}
    />
  );
};

export default WorkflowIntegration;
