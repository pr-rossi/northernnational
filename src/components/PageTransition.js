import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useLenis } from '@studio-freight/react-lenis';

function PageTransition({ children }) {
  const lenis = useLenis();

  useEffect(() => {
    // Only set background color
    document.body.style.backgroundColor = '#09090B';

    // Ensure Lenis is running
    if (lenis) {
      lenis.start();
    }

    return () => {
      // Scroll to top on unmount
      window.scrollTo(0, 0);
    };
  }, [lenis]);

  return (
    <motion.div
      className="min-h-screen bg-zinc-950"
      initial={{ opacity: 0, y: 100 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        transition: {
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1]
        }
      }}
      exit={{ 
        opacity: 0,
        y: 100,
        transition: {
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1]
        }
      }}
    >
      {children}
    </motion.div>
  );
}

export default PageTransition; 