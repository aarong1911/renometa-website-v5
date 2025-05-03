
import { useNavigate } from 'react-router-dom';

import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { NavLink } from './types';
import MegaMenu from './MegaMenu';

interface DesktopNavProps {
  navLinks: NavLink[];
  location: {
    pathname: string;
  };
  scrollToSection: (sectionId: string) => void;
}

const DesktopNav: React.FC<DesktopNavProps> = ({ navLinks, location, scrollToSection }) => {
  const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const toggleSubmenu = (index: number) => {
    setActiveSubmenu(activeSubmenu === index ? null : index);
  };

  // Close mega menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMegaMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  return (
    <nav className="hidden md:flex items-center space-x-6">
      {navLinks.map((link, index) => (
        <div key={link.name} className="relative group">
          {link.name === "Solutions" ? (
            <div ref={menuRef} className="relative">
              <button
                className={cn(
                  'text-base font-medium transition-colors',
                  showMegaMenu || location.pathname.startsWith('/solutions/') 
                    ? 'text-[#d9ab57]'
                    : 'text-[#3a4150]'
                )}
                onClick={() => setShowMegaMenu(!showMegaMenu)}
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
              <MegaMenu 
                isOpen={showMegaMenu} 
                onClose={() => setShowMegaMenu(false)} 
              />
            </div>
          ) : link.submenu ? (
            <>
              <button
                className={cn(
                  'text-base font-medium transition-colors',

                  location.pathname === link.path || location.pathname.startsWith(`${link.path}/`)
                    ? 'text-[#3a4150]'
                    : 'text-[#3a4150] hover:text-[#d9ab57]'
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
                  'text-base font-medium transition-colors',
                  location.pathname === link.path
                    ? 'text-[#d9ab57]'
                    : 'text-[#3a4150] hover:text-[#d9ab57]'
                )}
              >
                {link.name}
              </button>
            ) : (
              <Link
                to={link.path}
                className={cn(
                  'text-base font-medium transition-colors',
                  location.pathname === link.path
                    ? 'text-[#d9ab57]'
                    : 'text-[#3a4150] hover:text-[#d9ab57]'
                )}
              >
                {link.name}
              </Link>
            )
          )}
        </div>
      ))}
      <Button
        className="bg-[#3a4150] text-white hover:bg-[#3a4150]/90 transition-colors"
        onClick={() => navigate('/free-trial')}
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
          className="block px-4 py-2 text-sm text-[#3a4150] hover:bg-gray-50 hover:text-[#d9ab57]"
          onClick={onItemClick}
        >
          {subItem.name}
        </Link>
      ))}
    </div>
  );
};

export default DesktopNav;
