
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { solutionsMenuData } from './MegaMenu';

interface MobileSolutionsMenuProps {
  onClose: () => void;
}

const MobileSolutionsMenu: React.FC<MobileSolutionsMenuProps> = ({ onClose }) => {
  const [activeSolutionCategory, setActiveSolutionCategory] = useState<string | null>(null);

  const toggleSolutionCategory = (category: string) => {
    setActiveSolutionCategory(activeSolutionCategory === category ? null : category);
  };

  return (
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
  );
};

export default MobileSolutionsMenu;
