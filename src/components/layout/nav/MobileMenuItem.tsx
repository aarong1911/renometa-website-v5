
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { NavLink } from './types';
import MobileSolutionsMenu from './MobileSolutionsMenu';

interface MobileMenuItemProps {
  link: NavLink;
  index: number;
  activeSubmenu: number | null;
  toggleSubmenu: (index: number) => void;
  location: {
    pathname: string;
  };
  onClose: () => void;
}

const MobileMenuItem: React.FC<MobileMenuItemProps> = ({
  link,
  index,
  activeSubmenu,
  toggleSubmenu,
  location,
  onClose
}) => {
  if (link.name === 'Solutions') {
    return (
      <div className="border-b border-gray-100">
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
        {activeSubmenu === index && <MobileSolutionsMenu onClose={onClose} />}
      </div>
    );
  }
  
  if (link.submenu) {
    return (
      <div className="border-b border-gray-100">
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
      </div>
    );
  }
  
  return (
    <div className="border-b border-gray-100">
      {link.action ? (
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
      )}
    </div>
  );
};

export default MobileMenuItem;
