
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import ScrollReveal from './ScrollReveal';

interface TestimonialCardProps {
  quote: string;
  author: string;
  position: string;
  company: string;
  image?: string;
  className?: string;
  delay?: number;
}

const TestimonialCard = ({
  quote,
  author,
  position,
  company,
  image,
  className,
  delay = 0,
}: TestimonialCardProps) => {
  return (
    <ScrollReveal delay={delay}>
      <Card className={cn("h-full", className)}>
        <CardContent className="p-6 flex flex-col h-full">
          <div className="mb-4">
            <svg className="h-8 w-8 text-gold opacity-70" fill="currentColor" viewBox="0 0 32 32">
              <path d="M9.352 4C4.456 7.456 1.646 13.756 2.28 20.472H6.512C6.512 20.472 5.32 15.576 11.872 14.42V20.472H9.352C9.352 25.368 10.32 28 14.36 28V24.212C13.064 24.212 13.064 22.916 13.064 22.916V13.064H6.512C6.512 10.544 10.32 10.32 10.32 10.32C10.994 8.136 9.352 4 9.352 4ZM25.48 4C20.584 7.456 17.774 13.756 18.408 20.472H22.64C22.64 20.472 21.448 15.576 28 14.42V20.472H25.48C25.48 25.368 26.448 28 30.488 28V24.212C29.192 24.212 29.192 22.916 29.192 22.916V13.064H22.64C22.64 10.544 26.448 10.32 26.448 10.32C27.122 8.136 25.48 4 25.48 4Z" />
            </svg>
          </div>
          
          <p className="text-gray-600 mb-6 flex-grow">"{quote}"</p>
          
          <div className="flex items-center">
            {image && (
              <div className="mr-4">
                <img
                  src={image}
                  alt={author}
                  className="h-12 w-12 rounded-full object-cover"
                />
              </div>
            )}
            <div>
              <p className="font-medium text-blue-dark">{author}</p>
              <p className="text-sm text-gray-500">
                {position}{position && company ? ', ' : ''}{company}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </ScrollReveal>
  );
};

export default TestimonialCard;
