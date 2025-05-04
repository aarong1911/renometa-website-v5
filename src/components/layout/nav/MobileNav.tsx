
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { NavLink } from './types';
import { solutionsMenuData } from './MegaMenu';
import {
  Sheet,
  SheetContent,
  SheetClose,
} from "@/components/ui/sheet";
import { X } from "lucide-react";

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
          
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {navLinks.map((link, index) => (
              <div key={link.name} className="border-b border-gray-100">
                {link.name === 'Solutions' ? (
                  <>
                    <button
                      className="w-full text-left py-4 flex justify-between items-center"
                      onClick={() => toggleSubmenu(index)}
                    >
                      <span className={location.pathname.startsWith('/solutions') ? 'text-[#d9ab57] text-lg font-medium' : 'text-[#3a4150] text-lg font-medium'}>
                        {link.name}
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={cn("h-5 w-5 transition-transform", activeSubmenu === index ? "rotate-180" : "")}
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
                              className="flex items-center justify-between w-full py-3 px-2"
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
                      className="w-full text-left py-4 flex justify-between items-center"
                      onClick={() => toggleSubmenu(index)}
                    >
                      <span className={location.pathname.startsWith(link.path) ? 'text-[#3a4150] text-lg font-medium' : 'text-[#3a4150] text-lg font-medium'}>
                        {link.name}
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={cn("h-5 w-5 transition-transform", activeSubmenu === index ? "rotate-180" : "")}
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
                        "block py-4 w-full text-left text-lg font-medium",
                        location.pathname === link.path ? "text-[#d9ab57]" : "text-[#3a4150]"
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
                        "block py-4 text-lg font-medium",
                        location.pathname === link.path ? "text-[#d9ab57]" : "text-[#3a4150]"
                      )}
                      onClick={onClose}
                    >
                      {link.name}
                    </Link>
                  )
                )}
              </div>
            ))}
          </div>

          <div className="p-6 mt-auto border-t">
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
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
