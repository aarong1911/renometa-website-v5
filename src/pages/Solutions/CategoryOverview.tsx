
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Link, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { solutionsMenuData } from '@/components/layout/nav/MegaMenu';
import { ChevronLeft } from 'lucide-react';

const categoryMapping = {
  'crm': 'CRM',
  'sales': 'Sales',
  'jobs': 'Job Management',
  'marketing': 'Marketing'
};

const CategoryOverview = () => {
  const { category } = useParams<{ category: string }>();
  
  // Find the category data
  const categoryData = solutionsMenuData.find(
    item => item.category.toLowerCase() === categoryMapping[category].toLowerCase()
  );

  if (!categoryData) {
    return (
      <MainLayout>
        <div className="container-custom pt-32 pb-16">
          <h1 className="text-4xl font-bold mb-4 text-[#3a4150]">Category Not Found</h1>
          <Link to="/solutions" className="text-blue-600 hover:underline">
            Back to Solutions
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container-custom pt-32 pb-16">
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/solutions">Solutions</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <span className="text-muted-foreground">{categoryData.category}</span>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Link to="/solutions" className="inline-flex items-center text-[#3a4150] hover:text-[#d9ab57] mb-6 transition-colors">
          <ChevronLeft className="h-4 w-4 mr-1" />
          <span>Back to Solutions</span>
        </Link>

        <div className="flex items-center space-x-3 mb-6">
          {categoryData.icon}
          <h1 className="text-4xl font-bold text-[#3a4150]">{categoryData.category}</h1>
        </div>
        
        <p className="text-xl text-gray-600 mb-12 max-w-2xl">
          Explore our {categoryData.category} solutions for remodeling and home service businesses.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryData.items.map((item, idx) => (
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
    </MainLayout>
  );
};

export default CategoryOverview;
