
import React from 'react';
import SolutionPageTemplate from '../SolutionPageTemplate';
import { TrendingUp, BarChart, Users, Target } from 'lucide-react';

const SalesPipeline = () => {
  const features = [
    {
      title: 'Visual Pipeline Management',
      description: 'Track leads and deals through every stage of your sales process',
      icon: <TrendingUp className="h-6 w-6" />
    },
    {
      title: 'Performance Analytics',
      description: 'Get insights into conversion rates, deal values, and team performance',
      icon: <BarChart className="h-6 w-6" />
    },
    {
      title: 'Lead Scoring',
      description: 'Prioritize prospects based on likelihood to convert',
      icon: <Target className="h-6 w-6" />
    },
    {
      title: 'Team Collaboration',
      description: 'Enable seamless handoffs and collaboration between team members',
      icon: <Users className="h-6 w-6" />
    }
  ];

  const processSteps = [
    {
      title: 'Pipeline Design',
      description: 'Create a customized sales pipeline that matches your business process',
      stepNumber: 1
    },
    {
      title: 'Data Migration',
      description: 'Import your existing leads and deals into the new system',
      stepNumber: 2
    },
    {
      title: 'Team Training',
      description: 'Ensure your team knows how to effectively use the pipeline',
      stepNumber: 3
    },
    {
      title: 'Optimization',
      description: 'Continuously refine your process based on performance data',
      stepNumber: 4
    }
  ];

  const faqItems = [
    {
      question: 'How will a sales pipeline improve my close rate?',
      answer: 'A well-structured sales pipeline helps ensure no leads fall through the cracks and provides visibility into where deals get stuck, allowing you to address bottlenecks.'
    },
    {
      question: 'Can I customize the pipeline stages?',
      answer: 'Yes, the pipeline stages can be fully customized to match your unique sales process and terminology.'
    },
    {
      question: 'How does the system handle multiple sales teams?',
      answer: 'The platform supports multiple teams with customizable permissions, territories, and reporting structures.'
    },
    {
      question: 'Can I forecast sales with this solution?',
      answer: 'Yes, the sales pipeline includes forecasting tools that use historical data and current pipeline status to project future sales.'
    }
  ];

  return (
    <SolutionPageTemplate
      title="Sales Pipeline"
      description="Track the progress of potential customers through your sales process"
      tagline="Sales Solutions"
      category="Sales"
      categoryPath="sales"
      features={features}
      processSteps={processSteps}
      faqItems={faqItems}
      heroImage="/public/images/ChatGPT Image Hero Section.png"
      ctaText="Ready to streamline your sales process?"
      relatedServices={[
        {
          title: "Convert And Upsell",
          description: "Identify opportunities and increase sales",
          link: "/solutions/sales/convert-upsell"
        },
        {
          title: "Get Paid Faster",
          description: "Offer multiple payment options",
          link: "/solutions/sales/get-paid-faster"
        },
        {
          title: "Winning Sales Proposal Kit",
          description: "Effectively sell your service & win clients",
          link: "/solutions/sales/proposal-kit"
        }
      ]}
    />
  );
};

export default SalesPipeline;
