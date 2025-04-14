
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { NavLink } from './types';

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
  const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null);

  const toggleSubmenu = (index: number) => {
    setActiveSubmenu(activeSubmenu === index ? null : index);
  };

  return (
    <div
      className={cn(
        'fixed inset-0 bg-[#e5e6ea] z-40 md:hidden transition-transform transform pt-20',
        isOpen ? 'translate-x-0' : 'translate-x-full'
      )}
    >
      <div className="container-custom flex flex-col space-y-4 pt-4">
        {navLinks.map((link, index) => (
          <div key={link.name}>
            {link.submenu ? (
              <>
                <button
                  className="w-full text-left px-3 py-2 border-b border-gray-100 flex justify-between items-center"
                  onClick={() => toggleSubmenu(index)}
                >
                  <span className={location.pathname.startsWith(link.path) ? 'text-[#3a4150]' : 'text-[#3a4150]/80'}>
                    {link.name}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={cn("h-4 w-4 transition-transform", activeSubmenu === index ? "rotate-180" : "")}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className={cn(
                  "pl-4 space-y-1 transition-all",
                  activeSubmenu === index ? "max-h-96 py-2" : "max-h-0 overflow-hidden"
                )}>
                  {link.submenu.map(subItem => (
                    <Link
                      key={subItem.name}
                      to={subItem.path}
                      className={cn(
                        "block px-3 py-2",
                        location.pathname === subItem.path ? "text-[#3a4150]" : "text-[#3a4150]/80"
                      )}
                      onClick={onClose}
                    >
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              link.action ? (
                <button
                  className={cn(
                    "block px-3 py-2 border-b border-gray-100 w-full text-left",
                    location.pathname === link.path ? "text-[#3a4150]" : "text-[#3a4150]/80"
                  )}
                  onClick={(e) => {
                    link.action(e);
                    onClose();
                  }}
                >
                  {link.name}
                </button>
              ) : (
                <Link
                  to={link.path}
                  className={cn(
                    "block px-3 py-2 border-b border-gray-100",
                    location.pathname === link.path ? "text-[#3a4150]" : "text-[#3a4150]/80"
                  )}
                  onClick={onClose}
                >
                  {link.name}
                </Link>
              )
            )}
          </div>
        ))}
        <div className="pt-4">
          <Button 
            className="w-full bg-[#3a4150] text-white hover:bg-[#3a4150]/90 transition-colors"
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
      </div>
    </div>
  );
};

export default MobileNav;
