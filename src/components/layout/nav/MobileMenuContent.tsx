
import React, { useState } from 'react';
import { NavLink } from './types';
import { Button } from '@/components/ui/button';
import MobileMenuItem from './MobileMenuItem';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

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
  const navigate = useNavigate();

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
          className="w-full bg-[#3a4150] text-white hover:bg-[#3a4150]/90 transition-colors py-6"
          onClick={() => {
            onClose();
            navigate('/free-trial');
          }}
        >
          <span className="text-lg">Start Free</span>
          <ArrowRight className="h-5 w-5 ml-1" />
        </Button>
        <p className="text-xs text-center text-gray-600 mt-2">No credit card required. Cancel anytime.</p>
      </div>
    </>
  );
};

export default MobileMenuContent;
