
import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

const ScrollReveal = ({
  children,
  className,
  threshold = 0.1,
  delay = 0,
  direction = 'up',
}: ScrollRevealProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    const current = ref.current;
    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [threshold]);

  const getDirectionStyle = () => {
    switch (direction) {
      case 'up':
        return 'translate-y-10';
      case 'down':
        return 'translate-y-[-10px]';
      case 'left':
        return 'translate-x-10';
      case 'right':
        return 'translate-x-[-10px]';
      default:
        return '';
    }
  };

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700 ease-out',
        !isVisible && 'opacity-0',
        !isVisible && direction !== 'none' && getDirectionStyle(),
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
