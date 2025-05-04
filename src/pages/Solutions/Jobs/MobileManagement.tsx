
import React from 'react';
import SolutionPageTemplate from '../SolutionPageTemplate';
import { Smartphone, Clock, FileText, Camera } from 'lucide-react';

const MobileManagement = () => {
  const features = [
    {
      title: 'Mobile Job Access',
      description: 'View job details, customer information, and schedules on the go',
      icon: <Smartphone className="h-6 w-6" />
    },
    {
      title: 'Time Tracking',
      description: 'Clock in and out directly from job sites with GPS verification',
      icon: <Clock className="h-6 w-6" />
    },
    {
      title: 'Job Documentation',
      description: 'Upload photos, notes, and documents from the field',
      icon: <Camera className="h-6 w-6" />
    },
    {
      title: 'Mobile Forms',
      description: 'Complete checklists, inspections, and custom forms from any device',
      icon: <FileText className="h-6 w-6" />
    }
  ];

  const processSteps = [
    {
      title: 'Mobile Setup',
      description: 'Configure the mobile app for your team members',
      stepNumber: 1
    },
    {
      title: 'Form Customization',
      description: 'Create custom mobile forms for different job types',
      stepNumber: 2
    },
    {
      title: 'Field Training',
      description: 'Train your team on efficient mobile workflows',
      stepNumber: 3
    },
    {
      title: 'Data Integration',
      description: 'Connect field data with your office systems',
      stepNumber: 4
    }
  ];

  const faqItems = [
    {
      question: 'Does the mobile app work offline?',
      answer: 'Yes, the mobile app has offline functionality that allows team members to continue working in areas with poor connectivity, syncing data when connection is restored.'
    },
    {
      question: 'Can field workers access customer history on their mobile devices?',
      answer: 'Absolutely! Team members can view complete customer history, past work orders, and notes to provide informed service at every job site.'
    },
    {
      question: 'How secure is the mobile application?',
      answer: 'The mobile app uses enterprise-grade security with encryption, secure authentication, and remote wipe capabilities if a device is lost or stolen.'
    },
    {
      question: 'Can customers sign off on completed work through the mobile app?',
      answer: 'Yes, the app includes functionality for customers to review work, add comments, and provide digital signatures to approve job completion.'
    }
  ];

  return (
    <SolutionPageTemplate
      title="Managing Jobs On The Go"
      description="Stay productive and manage your business from anywhere with mobile job management"
      tagline="Job Management Solutions"
      category="Job Management"
      categoryPath="jobs"
      features={features}
      processSteps={processSteps}
      faqItems={faqItems}
      heroImage="/public/images/ChatGPT Image Version 2.png"
      ctaText="Ready to empower your field teams with mobile technology?"
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
          title: "Workflow Integration",
          description: "Create a seamless workflow",
          link: "/solutions/jobs/workflow-integration"
        }
      ]}
    />
  );
};

export default MobileManagement;
