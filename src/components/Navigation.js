import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLenis } from '@studio-freight/react-lenis';

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const location = useLocation();
  const lenis = useLenis();

  const navLinks = [
    { name: 'MERCH', path: '/merch' },
    { name: 'TOUR', path: '/tour' },
    { name: 'BLOG', path: '/blog' }
  ];

  useEffect(() => {
    if (!lenis) return;

    function handleScroll() {
      setHasScrolled(lenis.scroll > 50);
    }

    // Subscribe to scroll updates
    lenis.on('scroll', handleScroll);

    return () => {
      lenis.off('scroll', handleScroll);
    };
  }, [lenis]);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${hasScrolled ? 'bg-zinc-950/80 backdrop-blur-lg py-4' : 'bg-transparent py-8'}`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="relative z-50">
            <img 
              src="/images/nn-logo.svg" 
              alt="Northern National" 
              className={`transition-all duration-300 brightness-0 invert
                ${hasScrolled ? 'h-8 md:h-10' : 'h-10 md:h-12'}`}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors duration-200 
                  ${location.pathname === link.path 
                    ? 'text-[#D4FF99]' 
                    : 'text-white hover:text-[#D4FF99]'
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden relative z-50 text-white hover:text-[#D4FF99] transition-colors duration-200"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-x-0 top-0 bg-zinc-950 p-6 md:hidden"
              >
                <div className="pt-16 pb-6 space-y-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`block text-lg font-medium transition-colors duration-200 
                        ${location.pathname === link.path 
                          ? 'text-[#D4FF99]' 
                          : 'text-white hover:text-[#D4FF99]'
                        }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}

export default Navigation; 