import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { NavLink } from './types';
import { solutionsMenuData } from './MegaMenu';

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
  const [activeSolutionCategory, setActiveSolutionCategory] = useState<string | null>(null);

  const toggleSubmenu = (index: number) => {
    setActiveSubmenu(activeSubmenu === index ? null : index);
  };

  const toggleSolutionCategory = (category: string) => {
    setActiveSolutionCategory(activeSolutionCategory === category ? null : category);
  };

  // Find the solutions link index
  const solutionsLinkIndex = navLinks.findIndex(link => link.name === 'Solutions');

  return (
    <div
      className={cn(
        'fixed inset-0 bg-white/95 backdrop-blur-sm z-40 md:hidden transition-transform transform pt-20',
        isOpen ? 'translate-x-0' : 'translate-x-full'
      )}
    >
      <div className="container-custom flex flex-col space-y-4 pt-4 overflow-y-auto max-h-[calc(100vh-80px)]">
        {navLinks.map((link, index) => (
          <div key={link.name}>
            {link.name === 'Solutions' ? (
              <>
                <button
                  className="w-full text-left px-3 py-2 border-b border-gray-100 flex justify-between items-center"
                  onClick={() => toggleSubmenu(index)}
                >
                  <span className={location.pathname.startsWith('/solutions') ? 'text-[#d9ab57]' : 'text-[#3a4150]/80'}>
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
                {activeSubmenu === index && (
                  <div className="pl-2 space-y-2 py-2">
                    {solutionsMenuData.map((category, catIdx) => (
                      <div key={catIdx} className="border-b border-gray-100 pb-2">
                        <button
                          className="flex items-center justify-between w-full py-2 px-2"
                          onClick={() => toggleSolutionCategory(category.category)}
                        >
                          <div className="flex items-center space-x-2">
                            {category.icon}
                            <span className="font-medium">{category.category}</span>
                          </div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={cn("h-4 w-4 transition-transform", activeSolutionCategory === category.category ? "rotate-180" : "")}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        
                        <div className={cn(
                          "pl-4 space-y-2 transition-all",
                          activeSolutionCategory === category.category ? "max-h-96 py-2" : "max-h-0 overflow-hidden"
                        )}>
                          {category.items.map((item, itemIdx) => (
                            <Link
                              key={itemIdx}
                              to={item.path}
                              className="block py-2"
                              onClick={onClose}
                            >
                              <div>
                                <p className="font-medium text-[#3a4150]">{item.title}</p>
                                <p className="text-xs text-gray-500">{item.description}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : link.submenu ? (
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
