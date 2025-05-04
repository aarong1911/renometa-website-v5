
import React, { useState } from 'react';
import { NavLink } from './types';
import { Button } from '@/components/ui/button';
import MobileMenuItem from './MobileMenuItem';
import { cn } from '@/lib/utils';

interface MobileMenuContentProps {
  navLinks: NavLink[];
  location: {
    pathname: string;
  };
  scrollToSection: (sectionId: string) => void;
  onClose: () => void;
}

const MobileMenuContent: React.FC<MobileMenuContentProps> = ({ 
  navLinks, 
  location, 
  scrollToSection, 
  onClose 
}) => {
  const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null);

  const toggleSubmenu = (index: number) => {
    setActiveSubmenu(activeSubmenu === index ? null : index);
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {navLinks.map((link, index) => (
          <div 
            key={link.name}
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 75}ms` }}
          >
            <MobileMenuItem
              link={link}
              index={index}
              activeSubmenu={activeSubmenu}
              toggleSubmenu={toggleSubmenu}
              location={location}
              onClose={onClose}
            />
          </div>
        ))}
      </div>

      <div 
        className="p-6 mt-auto border-t animate-fade-in-up"
        style={{ animationDelay: `${navLinks.length * 75}ms` }}
      >
        <Button 
          className="w-full bg-[#3a4150] text-white hover:bg-[#3a4150]/90 transition-colors py-6 text-lg"
          onClick={(e: React.MouseEvent) => {
            onClose();
            if (location.pathname === '/') {
              scrollToSection('contact');
            } else {
              window.location.href = '/#contact';
            }
          }}
        >
          Get Started
        </Button>
      </div>
    </>
  );
};

export default MobileMenuContent;
