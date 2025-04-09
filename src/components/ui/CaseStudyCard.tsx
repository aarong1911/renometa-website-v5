
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import ScrollReveal from './ScrollReveal';

interface Result {
  label: string;
  value: string;
}

interface CaseStudyCardProps {
  title: string;
  description: string;
  image: string;
  results: Result[];
  link: string;
  className?: string;
  delay?: number;
}

const CaseStudyCard = ({
  title,
  description,
  image,
  results,
  link,
  className,
  delay = 0,
}: CaseStudyCardProps) => {
  return (
    <ScrollReveal delay={delay}>
      <Card className={cn("overflow-hidden", className)}>
        <div className="relative h-60">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
        <CardHeader>
          <CardTitle className="text-xl font-heading text-blue-dark">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">{description}</p>
          <div className="grid grid-cols-2 gap-4">
            {results.map((result, index) => (
              <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">{result.label}</p>
                <p className="font-heading font-bold text-blue-dark text-lg">{result.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Link to={link}>
            <Button variant="outline" className="border-teal text-teal hover:bg-teal hover:text-white">
              View Case Study
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </ScrollReveal>
  );
};

export default CaseStudyCard;
