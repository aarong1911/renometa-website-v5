import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MegaMenu from './MegaMenu'; // ✅ make sure this path is correct
import { Button } from '@/components/ui/button'; // ✅ ensure Button is correctly imported

interface DesktopNavProps {
  location: { pathname: string };
  scrollToSection: (id: string) => void;
}

const DesktopNav: React.FC<DesktopNavProps> = ({ location, scrollToSection }) => {
  const [solutionsOpen, setSolutionsOpen] = useState(false);

  return (
    <nav className="hidden md:flex items-center justify-center space-x-4 relative">
      <Link to="/" className="text-sm font-medium text-[#3a4150] hover:text-[#d9ab57]">Home</Link>

      {/* ✅ Solutions MegaMenu Trigger */}
      <div
        className="relative"
        onMouseEnter={() => setSolutionsOpen(true)}
        onMouseLeave={() => setSolutionsOpen(false)}
      >
        <button className="text-sm font-medium text-[#3a4150] hover:text-[#d9ab57]">
          Solutions <span className="ml-1">▾</span>
        </button>
        <MegaMenu isOpen={solutionsOpen} onClose={() => setSolutionsOpen(false)} />
      </div>

      <Link to="/blog" className="text-sm font-medium text-[#3a4150] hover:text-[#d9ab57]">Blog</Link>
      <Link to="/about" className="text-sm font-medium text-[#3a4150] hover:text-[#d9ab57]">About</Link>

      <Link
        to={location.pathname === '/' ? '#contact' : '/contact'}
        onClick={location.pathname === '/' ? (e) => {
          e.preventDefault();
          scrollToSection('contact');
        } : undefined}
        className="text-sm font-medium text-[#3a4150] hover:text-[#d9ab57]"
      >
        Contact
      </Link>

      {/* CTA Button */}
      <Button
        asChild
        className="ml-4 bg-[#3a4150] text-white hover:bg-[#3a4150]/90 transition-colors"
      >
        <Link to="/free-trial">Get Started</Link>
      </Button>
    </nav>
  );
};

export default DesktopNav;
