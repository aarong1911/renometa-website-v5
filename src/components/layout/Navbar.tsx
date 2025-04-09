
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

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

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services', submenu: [
      { name: 'Smart Website Development', path: '/services/website-development' },
      { name: 'Advanced SEO', path: '/services/advanced-seo' },
      { name: 'AI-Powered Agents', path: '/services/ai-agents' },
      { name: 'Intelligent Automation', path: '/services/automation' },
      { name: 'Seamless Integration', path: '/services/integration' },
    ]},
    { name: 'Blog', path: '/blog' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null);

  const toggleSubmenu = (index: number) => {
    setActiveSubmenu(activeSubmenu === index ? null : index);
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 w-full z-50 transition-all duration-300',
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      )}
    >
      <div className="container-custom flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold font-heading text-blue-dark">
            Digital<span className="text-teal">Forge</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link, index) => (
            <div key={link.name} className="relative group">
              {link.submenu ? (
                <>
                  <button
                    className={cn(
                      'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      location.pathname === link.path || location.pathname.startsWith(`${link.path}/`)
                        ? 'text-teal'
                        : 'text-gray-700 hover:text-teal'
                    )}
                    onClick={() => toggleSubmenu(index)}
                  >
                    {link.name}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 inline-block ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className={cn(
                    "absolute top-full left-0 bg-white shadow-lg rounded-md py-2 w-64 transition-all transform origin-top",
                    activeSubmenu === index ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                  )}>
                    {link.submenu.map(subItem => (
                      <Link
                        key={subItem.name}
                        to={subItem.path}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-teal"
                        onClick={() => setActiveSubmenu(null)}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <Link
                  to={link.path}
                  className={cn(
                    'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    location.pathname === link.path
                      ? 'text-teal'
                      : 'text-gray-700 hover:text-teal'
                  )}
                >
                  {link.name}
                </Link>
              )}
            </div>
          ))}
          <Button className="ml-4 bg-blue-dark hover:bg-blue-light">Get Started</Button>
        </nav>

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

      {/* Mobile Menu */}
      <div
        className={cn(
          'fixed inset-0 bg-white z-40 md:hidden transition-transform transform pt-20',
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="container-custom flex flex-col space-y-4 pt-4">
          {navLinks.map((link, index) => (
            <div key={link.name}>
              {link.submenu ? (
                <>
                  <button
                    className="w-full text-left px-3 py-2 border-b border-gray-100 flex justify-between items-center"
                    onClick={() => toggleSubmenu(index)}
                  >
                    <span className={location.pathname.startsWith(link.path) ? 'text-teal' : 'text-gray-700'}>
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
                          location.pathname === subItem.path ? "text-teal" : "text-gray-600"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <Link
                  to={link.path}
                  className={cn(
                    "block px-3 py-2 border-b border-gray-100",
                    location.pathname === link.path ? "text-teal" : "text-gray-700"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              )}
            </div>
          ))}
          <div className="pt-4">
            <Button className="w-full bg-blue-dark hover:bg-blue-light">Get Started</Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
