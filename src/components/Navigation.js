import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLenis } from '@studio-freight/react-lenis';
import { Arrow } from './ui/Button';

const SPOTIFY = 'https://open.spotify.com/artist/77uddrwADVuSI16ASFWF3c?si=bVUiHtZyS-u8cE4CuxYLFA';

const navLinks = [
  { name: 'Tour', path: '/tour' },
  { name: 'Merch', path: '/merch' },
  { name: 'News', path: '/blog' },
];

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const location = useLocation();
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    const onScroll = () => setHasScrolled(lenis.scroll > 50);
    lenis.on('scroll', onScroll);
    return () => lenis.off('scroll', onScroll);
  }, [lenis]);

  useEffect(() => {
    if (!lenis) return;
    if (isOpen) lenis.stop();
    else lenis.start();
  }, [isOpen, lenis]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === 'Escape' && setIsOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const isActive = (path) => location.pathname === path || (path === '/blog' && location.pathname.startsWith('/blog'));

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,padding,box-shadow] duration-300 ease-out
        ${hasScrolled && !isOpen ? 'bg-nn-bg/85 backdrop-blur-md py-3 shadow-[0_1px_0_rgba(237,235,230,0.10)]' : 'bg-transparent py-6'}`}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-6 flex items-center justify-between">
        <Link
          to="/"
          className="relative z-50 rounded-nn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nn-text focus-visible:ring-offset-4 focus-visible:ring-offset-nn-bg"
          onClick={() => setIsOpen(false)}
          aria-label="Northern National home"
        >
          <img
            src="/images/nn-logo.svg"
            alt=""
            className={`brightness-0 invert transition-[height] duration-300 ${hasScrolled ? 'h-12' : 'h-16 md:h-20'}`}
          />
        </Link>

        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              aria-current={isActive(link.path) ? 'page' : undefined}
              className={`label h-10 px-4 inline-flex items-center gap-2 rounded-nn transition-colors duration-200
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nn-text
                ${isActive(link.path) ? 'text-nn-text' : 'text-nn-text/75 hover:text-nn-text'}`}
            >
              <span
                className={`h-1.5 w-1.5 bg-nn-brand transition-transform duration-200 ${isActive(link.path) ? 'scale-100' : 'scale-0'}`}
                aria-hidden="true"
              />
              {link.name}
            </Link>
          ))}
          <a
            href={SPOTIFY}
            target="_blank"
            rel="noopener noreferrer"
            className="label ml-2 h-10 px-4 inline-flex items-center gap-2 rounded-nn border border-nn-line text-nn-text
              transition-colors duration-200 hover:bg-nn-text hover:text-nn-bg
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nn-text focus-visible:ring-offset-2 focus-visible:ring-offset-nn-bg"
          >
            Listen <Arrow external />
          </a>
        </div>

        <button
          className="md:hidden relative z-50 h-10 px-3 -mr-3 label text-nn-text rounded-nn
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nn-text"
          onClick={() => setIsOpen((o) => !o)}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          {isOpen ? 'Close' : 'Menu'}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.5, ease: [0.83, 0, 0.32, 1] }}
            className="fixed inset-0 bg-nn-bg md:hidden flex flex-col justify-end px-5 pb-10 pt-32"
          >
            <ul className="flex flex-col gap-2">
              {[{ name: 'Home', path: '/' }, ...navLinks].map((link, i) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`display block text-[64px] ${location.pathname === link.path ? 'text-nn-brand' : 'text-nn-text'}`}
                  >
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <div className="mt-10 pt-6 border-t border-nn-line flex items-center justify-between">
              <span className="label text-nn-muted">Dallas, TX</span>
              <a href={SPOTIFY} target="_blank" rel="noopener noreferrer" className="label text-nn-text inline-flex items-center gap-2">
                Listen on Spotify <Arrow external />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navigation;
