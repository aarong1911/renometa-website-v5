
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavLink {
  name: string;
  path: string;
  action?: (e: React.MouseEvent) => void;
  submenu?: {
    name: string;
    path: string;
  }[];
}

interface DesktopNavProps {
  navLinks: NavLink[];
  location: {
    pathname: string;
  };
  scrollToSection: (sectionId: string) => void;
}

const DesktopNav: React.FC<DesktopNavProps> = ({ navLinks, location, scrollToSection }) => {
  const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null);

  const toggleSubmenu = (index: number) => {
    setActiveSubmenu(activeSubmenu === index ? null : index);
  };

  return (
    <nav className="hidden md:flex items-center space-x-1">
      {navLinks.map((link, index) => (
        <div key={link.name} className="relative group">
          {link.submenu ? (
            <>
              <button
                className={cn(
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  location.pathname === link.path || location.pathname.startsWith(`${link.path}/`)
                    ? 'text-teal'
                    : 'text-gray-700 hover:text-teal'
                )}
                onClick={() => toggleSubmenu(index)}
              >
                {link.name}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 inline-block ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <SubmenuDropdown 
                isActive={activeSubmenu === index} 
                submenuItems={link.submenu} 
                onItemClick={() => setActiveSubmenu(null)}
              />
            </>
          ) : (
            link.action ? (
              <button
                onClick={link.action}
                className={cn(
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  location.pathname === link.path
                    ? 'text-teal'
                    : 'text-gray-700 hover:text-teal'
                )}
              >
                {link.name}
              </button>
            ) : (
              <Link
                to={link.path}
                className={cn(
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  location.pathname === link.path
                    ? 'text-teal'
                    : 'text-gray-700 hover:text-teal'
                )}
              >
                {link.name}
              </Link>
            )
          )}
        </div>
      ))}
      <Button 
        className="ml-4 bg-blue-dark hover:bg-blue-light transition-colors"
        onClick={(e: React.MouseEvent) => {
          if (location.pathname === '/') {
            scrollToSection('contact');
          } else {
            window.location.href = '/#contact';
          }
        }}
      >
        Get Started
      </Button>
    </nav>
  );
};

interface SubmenuDropdownProps {
  isActive: boolean;
  submenuItems: {
    name: string;
    path: string;
  }[];
  onItemClick: () => void;
}

const SubmenuDropdown: React.FC<SubmenuDropdownProps> = ({ isActive, submenuItems, onItemClick }) => {
  return (
    <div className={cn(
      "absolute top-full left-0 bg-white shadow-lg rounded-md py-2 w-64 transition-all transform origin-top",
      isActive ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
    )}>
      {submenuItems.map(subItem => (
        <Link
          key={subItem.name}
          to={subItem.path}
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-teal"
          onClick={onItemClick}
        >
          {subItem.name}
        </Link>
      ))}
    </div>
  );
};

export default DesktopNav;
