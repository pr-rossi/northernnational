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

    lenis.on('scroll', handleScroll);

    return () => {
      lenis.off('scroll', handleScroll);
    };
  }, [lenis]);

  const menuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1]
      }
    },
    open: {
      opacity: 1,
      height: "100vh",
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const linkVariants = {
    closed: {
      opacity: 0,
      y: 20,
    },
    open: i => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1]
      }
    })
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${hasScrolled ? 'bg-zinc-950/80 backdrop-blur-lg py-4' : 'bg-transparent py-8'}`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo - Added onClick to close menu */}
          <Link 
            to="/" 
            className="relative z-50"
            onClick={() => setIsOpen(false)}
          >
            <img 
              src="/images/nn-logo.svg" 
              alt="Northern National" 
              className={`transition-all duration-300 brightness-0 invert
                ${hasScrolled ? 'h-16' : 'h-20'}`}
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
                variants={menuVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="fixed inset-0 bg-zinc-950 md:hidden"
              >
                <div className="flex flex-col justify-center items-center h-full">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.name}
                      custom={i}
                      variants={linkVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                      className="mb-8"
                    >
                      <Link
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className={`text-4xl font-bold transition-colors duration-200 
                          ${location.pathname === link.path 
                            ? 'text-[#D4FF99]' 
                            : 'text-white hover:text-[#D4FF99]'
                          }`}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
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