
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
            <div className="mb-4 p-3 rounded-full bg-gradient-to-br from-gold/30 to-gold/10 inline-flex">
              <div className="text-gold">{icon}</div>
            </div>
            <CardTitle className="text-xl font-heading text-blue-dark">{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-gray-600">{description}</CardDescription>
          </CardContent>
        </Card>
      </Link>
    </ScrollReveal>
  );
};

export default ServiceCard;
