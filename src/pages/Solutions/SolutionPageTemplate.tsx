
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SolutionPageTemplateProps {
  title: string;
  subheadline: string;
  category: string;
  categoryPath: string;
}

const SolutionPageTemplate: React.FC<SolutionPageTemplateProps> = ({
  title,
  subheadline,
  category,
  categoryPath
}) => {
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
              <BreadcrumbLink asChild>
                <Link to={`/solutions/${categoryPath}`}>{category}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <span className="text-muted-foreground">{title}</span>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Link to="/solutions" className="inline-flex items-center text-[#3a4150] hover:text-[#d9ab57] mb-6 transition-colors">
          <ChevronLeft className="h-4 w-4 mr-1" />
          <span>Back to Solutions</span>
        </Link>
        
        <div className="max-w-4xl">
          <h1 className="text-4xl font-bold mb-4 text-[#3a4150]">{title}</h1>
          <p className="text-xl text-gray-600 mb-8">{subheadline}</p>
          
          <div className="prose max-w-none">
            <p>Content coming soon...</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SolutionPageTemplate;
