
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Users, TrendingUp, Briefcase, Megaphone } from 'lucide-react';
import { solutionsMenuData } from '@/components/layout/nav/MegaMenu';

const SolutionsOverview = () => {
  const categoryIcons = {
    'CRM': <Users className="h-8 w-8 text-[#ccab64]" />,
    'Sales': <TrendingUp className="h-8 w-8 text-[#ccab64]" />,
    'Job Management': <Briefcase className="h-8 w-8 text-[#ccab64]" />,
    'Marketing': <Megaphone className="h-8 w-8 text-[#ccab64]" />
  };

  return (
    <MainLayout>
      <div className="container-custom pt-32 pb-16">
        <h1 className="text-4xl font-bold mb-4 text-[#3a4150]">Solutions</h1>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl">
          Comprehensive digital solutions designed specifically for remodeling and home service businesses.
        </p>

        <div className="space-y-16">
          {solutionsMenuData.map((category, index) => (
            <div key={index}>
              <div className="flex items-center space-x-3 mb-6">
                {category.icon}
                <h2 className="text-2xl font-bold text-[#3a4150]">{category.category}</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {category.items.map((item, idx) => (
                  <Link to={item.path} key={idx} className="block">
                    <Card className="h-full border-0 shadow hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
                      <CardContent className="p-6">
                        <h3 className="font-bold text-lg text-[#3a4150] mb-2">{item.title}</h3>
                        <p className="text-gray-600">{item.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default SolutionsOverview;
