
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

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header
      className={cn(
        'fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center justify-between rounded-xl px-6 py-3 transition-all duration-300',
        isScrolled 
          ? 'w-[95%] md:w-[70%] bg-white/60 backdrop-blur-md shadow-lg' 
          : 'w-[95%] md:w-[90%] bg-white/90 backdrop-blur-sm'
      )}
    >
      <Link to="/" className="flex items-center">
        <img 
          src="/lovable-uploads/7217f6a6-a095-4b8f-b0b1-4e2142a3baee.png" 
          alt="RenoMeta Logo" 
          className="h-10 md:h-12 mr-2"
        />
      </Link>

      <div className="flex-1 flex justify-end">
        {/* Desktop Navigation */}
        <DesktopNav 
          navLinks={navLinks} 
          location={location} 
          scrollToSection={scrollToSection} 
        />

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 z-50 relative"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
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
