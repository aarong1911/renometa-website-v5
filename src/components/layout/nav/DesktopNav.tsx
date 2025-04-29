import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MegaMenu from './MegaMenu';
import { Location } from 'react-router-dom';

interface DesktopNavProps {
  location: Location;
  scrollToSection: (id: string) => void;
}

const DesktopNav: React.FC<DesktopNavProps> = ({ location, scrollToSection }) => {
  const [solutionsOpen, setSolutionsOpen] = useState(false);

  return (
    <nav className="hidden md:flex space-x-6 items-center">
      <Link to="/" className="text-sm font-medium text-gray-800 hover:text-gray-900">Home</Link>

      <div
        className="relative"
        onMouseEnter={() => setSolutionsOpen(true)}
        onMouseLeave={() => setSolutionsOpen(false)}
      >
        <button className="text-sm font-medium text-gray-800 hover:text-gray-900">
          Solutions <span className="ml-1">▾</span>
        </button>
        <MegaMenu isOpen={solutionsOpen} onClose={() => setSolutionsOpen(false)} />
      </div>

      <Link to="/blog" className="text-sm font-medium text-gray-800 hover:text-gray-900">Blog</Link>
      <Link to="/about" className="text-sm font-medium text-gray-800 hover:text-gray-900">About</Link>

      <Link
        to={location.pathname === '/' ? '#contact' : '/contact'}
        onClick={location.pathname === '/' ? (e) => {
          e.preventDefault();
          scrollToSection('contact');
        } : undefined}
        className="text-sm font-medium text-gray-800 hover:text-gray-900"
      >
        Contact
      </Link>

      <Link
        to="/get-started"
        className="ml-4 inline-block bg-gray-800 text-white text-sm font-semibold py-2 px-4 rounded-xl hover:bg-gray-700 transition"
      >
        Get Started
      </Link>
    </nav>
  );
};

export default DesktopNav;
