
import React from 'react';
import { Link } from 'react-router-dom';
import { NavLink } from './types';
import {
  Sheet,
  SheetContent,
  SheetClose,
} from "@/components/ui/sheet";
import { X } from "lucide-react";
import MobileMenuContent from './MobileMenuContent';

interface MobileNavProps {
  isOpen: boolean;
  navLinks: NavLink[];
  location: {
    pathname: string;
  };
  scrollToSection: (sectionId: string) => void;
  onClose: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ isOpen, navLinks, location, scrollToSection, onClose }) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full p-0 sm:max-w-full border-none">
        <div className="flex flex-col h-full w-full bg-white">
          <div className="px-6 py-4 flex items-center justify-between border-b">
            <Link to="/" className="flex items-center" onClick={onClose}>
              <img 
                src="/lovable-uploads/7217f6a6-a095-4b8f-b0b1-4e2142a3baee.png" 
                alt="RenoMeta Logo" 
                className="h-10"
              />
            </Link>
            <SheetClose className="rounded-full p-2 hover:bg-gray-100">
              <X className="h-6 w-6" />
              <span className="sr-only">Close</span>
            </SheetClose>
          </div>
          
          <MobileMenuContent 
            navLinks={navLinks} 
            location={location} 
            scrollToSection={scrollToSection} 
            onClose={onClose} 
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
