import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import DesktopNav from './nav/DesktopNav';
import MobileNav from './nav/MobileNav';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll shrink behavior
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/', { state: { scrollTo: id } });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 w-full z-50 transition-all duration-300',
        isScrolled ? 'shadow-md py-2 bg-white rounded-xl mx-auto max-w-screen-xl mt-4' : 'py-4 bg-white rounded-xl mx-auto max-w-screen-xl mt-6'
      )}
    >
      <div className="container-custom flex justify-between items-center px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="/lovable-uploads/7217f6a6-a095-4b8f-b0b1-4e2142a3baee.png"
            alt="RenoMeta Logo"
            className="h-10 md:h-12 mr-2"
          />
        </Link>

        {/* Desktop Nav */}
        <DesktopNav location={location} scrollToSection={scrollToSection} />

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Nav */}
      <MobileNav
        isOpen={mobileMenuOpen}
        location={location}
        scrollToSection={scrollToSection}
        onClose={() => setMobileMenuOpen(false)}
      />
    </header>
  );
};

export default Navbar;
