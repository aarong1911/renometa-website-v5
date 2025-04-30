
import React from 'react';
import { Link } from 'react-router-dom';
import { Users, TrendingUp, Briefcase, Megaphone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const solutionsMenuData = [
  {
    category: 'CRM',
    icon: <Users className="h-6 w-6 text-[#ccab64]" />,
    items: [
      {
        title: 'Organize Customers',
        description: 'Provide personalized and efficient service',
        path: '/solutions/crm/organize-customers'
      },
      {
        title: 'Online Booking',
        description: 'Accept bookings 24/7 from anywhere',
        path: '/solutions/crm/online-booking'
      },
      {
        title: 'Customer Portal',
        description: 'Give access to service requests',
        path: '/solutions/crm/customer-portal'
      },
      {
        title: 'Business Automation',
        description: 'Enhance efficiency and reduce costs',
        path: '/solutions/crm/business-automation'
      }
    ]
  },
  {
    category: 'Sales',
    icon: <TrendingUp className="h-6 w-6 text-[#ccab64]" />,
    items: [
      {
        title: 'Sales Pipeline',
        description: 'Track the progress of potential customers',
        path: '/solutions/sales/sales-pipeline'
      },
      {
        title: 'Convert And Upsell',
        description: 'Identify opportunities and increase sales',
        path: '/solutions/sales/convert-upsell'
      },
      {
        title: 'Get Paid Faster',
        description: 'Offer multiple payment options',
        path: '/solutions/sales/get-paid-faster'
      },
      {
        title: 'Winning Sales Proposal Kit',
        description: 'Effectively sell your service & win clients',
        path: '/solutions/sales/proposal-kit'
      }
    ]
  },
  {
    category: 'Job Management',
    icon: <Briefcase className="h-6 w-6 text-[#ccab64]" />,
    items: [
      {
        title: 'Scheduling & Dispatching',
        description: 'Optimized labor usage and less downtime',
        path: '/solutions/jobs/scheduling-dispatching'
      },
      {
        title: 'Job Costing',
        description: 'Track the costs and revenues by job',
        path: '/solutions/jobs/job-costing'
      },
      {
        title: 'Managing Jobs On The Go',
        description: 'Stay productive while on the go',
        path: '/solutions/jobs/mobile-management'
      },
      {
        title: 'Workflow Integration',
        description: 'Create a seamless and efficient workflow',
        path: '/solutions/jobs/workflow-integration'
      }
    ]
  },
  {
    category: 'Marketing',
    icon: <Megaphone className="h-6 w-6 text-[#ccab64]" />,
    items: [
      {
        title: 'Marketing Automation',
        description: 'Automate repetitive marketing tasks',
        path: '/solutions/marketing/automation'
      },
      {
        title: 'SMS / Email Marketing',
        description: 'Reach customers directly and instantly',
        path: '/solutions/marketing/sms-email'
      },
      {
        title: 'Postcard / Voicemail Marketing',
        description: 'Leave a lasting impression on customers',
        path: '/solutions/marketing/voicemail'
      },
      {
        title: 'Review Management',
        description: 'Make it easy for customers to leave reviews',
        path: '/solutions/marketing/reviews'
      }
    ]
  }
];

const MegaMenu: React.FC<MegaMenuProps> = ({ isOpen, onClose }) => {
  return (
    <div 
      className={`absolute left-0 top-full mt-4 w-full bg-white shadow-lg rounded-b-lg transition-all duration-200 z-50 ${
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
      }`}
      style={{ width: '100vw', left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw' }}
    >
      <div className="container-custom py-8">
        <h2 className="text-2xl font-bold text-[#3a4150] mb-6">Solutions for your business</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {solutionsMenuData.map((section, index) => (
            <div key={index} className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                {section.icon}
                <h3 className="text-xl font-bold text-[#3a4150]">{section.category}</h3>
              </div>
              
              <div className="space-y-3">
                {section.items.map((item, idx) => (
                  <Link 
                    key={idx} 
                    to={item.path} 
                    onClick={onClose}
                    className="block"
                  >
                    <Card className="border-0 shadow-sm hover:shadow transition-all duration-200 hover:scale-[1.02]">
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-[#3a4150]">{item.title}</h4>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
