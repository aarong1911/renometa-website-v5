import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import DesktopNav from './nav/DesktopNav';
import MobileNav from './nav/MobileNav';
import { navLinks } from './navLinks';
import ContactModal from '@/components/ContactModal';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (location.state?.scrollTo) {
      const section = document.getElementById(location.state.scrollTo);
      if (section) {
        setTimeout(() => section.scrollIntoView({ behavior: 'smooth' }), 100);
      }
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    } else {
      navigate('/', { state: { scrollTo: sectionId } });
      setMobileMenuOpen(false);
    }
  };

  const extendedNavLinks = [
    ...navLinks,
    {
      name: 'Login',
      path: 'http://localhost:8888/login',
      external: true,
    },
  ];

  const navLinksWithActions = extendedNavLinks.map(link => {
    if (link.external) return link;

    if (link.name === 'Contact') {
      return {
        ...link,
        action: (e: React.MouseEvent) => {
          e.preventDefault();
          setContactOpen(true);
          setMobileMenuOpen(false);
        },
      };
    }

    if (link.path.startsWith('/#') && location.pathname === '/') {
      return {
        ...link,
        action: (e: React.MouseEvent) => {
          e.preventDefault();
          scrollToSection(link.path.replace('/#', ''));
        },
      };
    }

    return link;
  });

  const toggleMobileMenu = () => setMobileMenuOpen(open => !open);

  return (
    <>
      <header
        className={cn(
          'fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center justify-between rounded-xl px-6 py-3 transition-all duration-300 border border-gray-200',
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

        <div className="flex-1 flex justify-end items-center gap-4">
          <DesktopNav
            navLinks={navLinksWithActions.filter(link => link.name !== 'Login')}
            location={location}
            scrollToSection={scrollToSection}
          />

          {/* Login Button */}
        <a
            className="hidden md:inline-block px-5 py-2 text-sm font-semibold rounded-md bg-[#3a4150] text-white hover:bg-[#3a4150]/90 transition"
            href="http://connect.renometa.com/login"
          >
            Login
          </a>


          {/* Get Started Button */}
          

          {/* Mobile Menu Toggle */}
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
          navLinks={navLinksWithActions}
          location={location}
          scrollToSection={scrollToSection}
          onClose={() => setMobileMenuOpen(false)}
        />
      </header>

      <ContactModal open={contactOpen} onOpenChange={setContactOpen} />
    </>
  );
};

export default Navbar;
