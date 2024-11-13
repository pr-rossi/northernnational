import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useLenis } from '@studio-freight/react-lenis';

function PageTransition({ children }) {
  const lenis = useLenis();

  useEffect(() => {
    document.body.style.backgroundColor = '#09090B';
    
    // Stop Lenis on unmount
    return () => {
      if (lenis) {
        lenis.stop();
      }

      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';

      // After transition completes
      setTimeout(() => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        
        // Force scroll to top
        window.scrollTo(0, 0);
        document.documentElement.scrollTo(0, 0);
        document.body.scrollTo(0, 0);

        // Restart Lenis
        if (lenis) {
          requestAnimationFrame(() => {
            lenis.start();
          });
        }
      }, 1000);
    };
  }, [lenis]);

  return (
    <motion.div
      className="min-h-screen bg-zinc-950"
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        transition: {
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1]
        }
      }}
      exit={{ 
        opacity: 0,
        y: 20,
        transition: {
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1]
        }
      }}
    >
      {children}
    </motion.div>
  );
}

export default PageTransition; 