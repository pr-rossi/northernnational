import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useLenis } from '@studio-freight/react-lenis';

function PageTransition({ children }) {
  const lenis = useLenis();

  useEffect(() => {
    document.body.style.backgroundColor = '#09090B';

    // Make sure Lenis is running when component mounts
    if (lenis) {
      lenis.start();
    }
    
    return () => {
      // On unmount, scroll to top before transition
      window.scrollTo(0, 0);
      document.documentElement.scrollTo(0, 0);
      document.body.scrollTo(0, 0);
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
      onAnimationComplete={() => {
        // Ensure Lenis is running after animation completes
        if (lenis) {
          lenis.start();
        }
      }}
    >
      {children}
    </motion.div>
  );
}

export default PageTransition; 