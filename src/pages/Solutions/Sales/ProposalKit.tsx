
import React from 'react';
import SolutionPageTemplate from '../SolutionPageTemplate';
import { FileText, CheckSquare, Zap, ArrowRight } from 'lucide-react';

const ProposalKit = () => {
  const features = [
    {
      title: 'Professional Templates',
      description: 'Customizable, professionally designed proposal templates',
      icon: <FileText className="h-6 w-6" />
    },
    {
      title: 'Digital Signatures',
      description: 'Get proposals signed electronically for faster approvals',
      icon: <CheckSquare className="h-6 w-6" />
    },
    {
      title: 'Proposal Analytics',
      description: 'Track when proposals are viewed and which sections get attention',
      icon: <Zap className="h-6 w-6" />
    },
    {
      title: 'Follow-up Automation',
      description: 'Automated follow-up sequences for unsigned proposals',
      icon: <ArrowRight className="h-6 w-6" />
    }
  ];

  const processSteps = [
    {
      title: 'Template Creation',
      description: 'Set up your branded proposal templates with key sections',
      stepNumber: 1
    },
    {
      title: 'Content Library',
      description: 'Build a library of pre-approved content blocks and case studies',
      stepNumber: 2
    },
    {
      title: 'Proposal Generation',
      description: 'Quickly assemble custom proposals for each potential client',
      stepNumber: 3
    },
    {
      title: 'Follow-up Strategy',
      description: 'Implement systematic follow-up to increase signing rates',
      stepNumber: 4
    }
  ];

  const faqItems = [
    {
      question: 'Can I customize the proposal templates?',
      answer: 'Yes, all templates are fully customizable with your branding, images, and content. You can save custom templates for different service types.'
    },
    {
      question: 'Are digital signatures legally binding?',
      answer: 'Yes, the digital signatures collected through our system comply with e-signature laws and are legally binding in most jurisdictions.'
    },
    {
      question: 'Can clients view proposals on mobile devices?',
      answer: 'Absolutely! All proposals are mobile-responsive and look great on any device, making it easy for clients to review and approve from anywhere.'
    },
    {
      question: 'How does the analytics feature work?',
      answer: 'The system tracks when proposals are opened, how long clients spend on each section, and whether they\'ve downloaded any attachments, giving you valuable insight into client engagement.'
    }
  ];

  return (
    <SolutionPageTemplate
      title="Winning Sales Proposal Kit"
      description="Effectively sell your services and win more clients with professional proposals"
      tagline="Sales Solutions"
      category="Sales"
      categoryPath="sales"
      features={features}
      processSteps={processSteps}
      faqItems={faqItems}
      heroImage="/public/images/ChatGPT Image Version 3.png"
      ctaText="Ready to close more sales with better proposals?"
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
          title: "Get Paid Faster",
          description: "Offer multiple payment options",
          link: "/solutions/sales/get-paid-faster"
        }
      ]}
    />
  );
};

export default ProposalKit;
