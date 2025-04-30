
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import DesktopNav from './nav/DesktopNav';
import MobileNav from './nav/MobileNav';
import { NavLink } from './nav/types';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Handle navbar background change on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check for scrollTo in the location state (coming from other pages)
  useEffect(() => {
    if (location.state && location.state.scrollTo) {
      const sectionId = location.state.scrollTo;
      const section = document.getElementById(sectionId);
      if (section) {
        setTimeout(() => {
          section.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
      // Clear the state to avoid scrolling again on re-render
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Smooth scroll function
  const scrollToSection = (sectionId: string) => {
    // If on any page, try to find the section first
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    } else {
      // Navigate to homepage and then scroll to the section
      navigate('/', { state: { scrollTo: sectionId } });
      setMobileMenuOpen(false);
    }
  };

  const navLinks: NavLink[] = [
    { name: 'Home', path: '/' },
    { name: 'Solutions', path: '/solutions' },
    { name: 'Blog', path: '/blog' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: location.pathname === '/' ? '#contact' : '/contact', action: location.pathname === '/' ? (e: React.MouseEvent) => scrollToSection('contact') : null },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 w-full z-50 transition-all duration-300',
        isScrolled 
          ? 'bg-white/90 backdrop-blur-sm shadow-md py-2' 
          : 'bg-white/70 backdrop-blur-sm py-4'
      )}
    >
      <div className="max-w-[1200px] mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/7217f6a6-a095-4b8f-b0b1-4e2142a3baee.png" 
            alt="RenoMeta Logo" 
            className="h-10 md:h-12 mr-2"
          />
        </Link>

        {/* Desktop Navigation */}
        <DesktopNav 
          navLinks={navLinks} 
          location={location} 
          scrollToSection={scrollToSection} 
        />

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

      {/* Mobile Navigation */}
      <MobileNav 
        isOpen={mobileMenuOpen}
        navLinks={navLinks}
        location={location}
        scrollToSection={scrollToSection}
        onClose={() => setMobileMenuOpen(false)}
      />
    </header>
  );
};

export default Navbar;
