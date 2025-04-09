
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import ScrollReveal from './ScrollReveal';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  className?: string;
  delay?: number;
}

const ServiceCard = ({
  title,
  description,
  icon,
  link,
  className,
  delay = 0
}: ServiceCardProps) => {
  return (
    <ScrollReveal delay={delay}>
      <Link to={link}>
        <Card className={cn(
          "h-full border transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
          className
        )}>
          <CardHeader>
            <div className="mb-4 p-3 rounded-full bg-gradient-to-br from-blue-100 to-gold-light/30 inline-flex">
              <div className="text-blue-dark">{icon}</div>
            </div>
            <CardTitle className="text-xl font-heading text-blue-dark">{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-gray-600">{description}</CardDescription>
          </CardContent>
          <CardFooter>
            <span className="text-gold font-medium flex items-center group">
              Learn more
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </CardFooter>
        </Card>
      </Link>
    </ScrollReveal>
  );
};

export default ServiceCard;
