
import React from 'react';
import SolutionPageTemplate from '../SolutionPageTemplate';
import { DollarSign, BarChart, FileText, Briefcase } from 'lucide-react';

const JobCosting = () => {
  const features = [
    {
      title: 'Material Tracking',
      description: 'Track material costs and usage for each project',
      icon: <DollarSign className="h-6 w-6" />
    },
    {
      title: 'Labor Management',
      description: 'Monitor labor hours and costs across different teams',
      icon: <Briefcase className="h-6 w-6" />
    },
    {
      title: 'Estimate vs. Actual',
      description: 'Compare estimated costs against actual expenses',
      icon: <FileText className="h-6 w-6" />
    },
    {
      title: 'Profit Analysis',
      description: 'Analyze profitability by job, customer, and service type',
      icon: <BarChart className="h-6 w-6" />
    }
  ];

  const processSteps = [
    {
      title: 'Cost Structure Setup',
      description: 'Define your cost categories and allocation methods',
      stepNumber: 1
    },
    {
      title: 'Job Budget Creation',
      description: 'Create detailed budgets for each project phase',
      stepNumber: 2
    },
    {
      title: 'Expense Tracking',
      description: 'Record all expenses and assign them to specific jobs',
      stepNumber: 3
    },
    {
      title: 'Performance Analysis',
      description: 'Review job performance and identify improvement areas',
      stepNumber: 4
    }
  ];

  const faqItems = [
    {
      question: 'Can this system integrate with my accounting software?',
      answer: 'Yes, our job costing solution integrates with popular accounting systems like QuickBooks, Xero, and others to ensure seamless data flow.'
    },
    {
      question: 'How does it handle change orders?',
      answer: 'The system can track approved change orders separately, showing their impact on job profitability and keeping original estimates intact for comparison.'
    },
    {
      question: 'Can field workers log expenses on the go?',
      answer: 'Yes, with our mobile app, team members can log expenses, material usage, and hours worked directly from the job site.'
    },
    {
      question: 'What kind of reports are available?',
      answer: 'The system provides detailed cost reports, variance analysis, profit margin calculations, and trend analysis to help you understand job performance.'
    }
  ];

  return (
    <SolutionPageTemplate
      title="Job Costing"
      description="Track the costs and revenues by job to maximize profitability"
      tagline="Job Management Solutions"
      category="Job Management"
      categoryPath="jobs"
      features={features}
      processSteps={processSteps}
      faqItems={faqItems}
      heroImage="/public/images/ChatGPT Image Hero Section.png"
      ctaText="Ready to gain better insight into your job costs?"
      relatedServices={[
        {
          title: "Scheduling & Dispatching",
          description: "Efficiently schedule your team",
          link: "/solutions/jobs/scheduling-dispatching"
        },
        {
          title: "Managing Jobs On The Go",
          description: "Stay productive while on the go",
          link: "/solutions/jobs/mobile-management"
        },
        {
          title: "Workflow Integration",
          description: "Create a seamless workflow",
          link: "/solutions/jobs/workflow-integration"
        }
      ]}
    />
  );
};

export default JobCosting;
