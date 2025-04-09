
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import ScrollReveal from './ScrollReveal';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  title: string;
  subtitle?: string;
  items: FAQItem[];
  className?: string;
}

const FAQ = ({ title, subtitle, items, className }: FAQProps) => {
  return (
    <div className={className}>
      <ScrollReveal>
        <h2 className="text-3xl md:text-4xl font-bold font-heading mb-3 text-blue-dark">{title}</h2>
        {subtitle && <p className="text-gray-600 mb-8 max-w-2xl">{subtitle}</p>}
      </ScrollReveal>
      
      <div className="mt-8">
        <Accordion type="single" collapsible className="w-full">
          {items.map((item, index) => (
            <ScrollReveal key={index} delay={index * 100}>
              <AccordionItem value={`item-${index}`} className="mb-4 border rounded-md px-2">
                <AccordionTrigger className="text-lg font-medium py-4 hover:text-teal">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-4 pt-1">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            </ScrollReveal>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default FAQ;
