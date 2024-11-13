import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useLenis } from '@studio-freight/react-lenis';

function PageTransition({ children }) {
  const lenis = useLenis();

  useEffect(() => {
    // Stop scrolling during transition
    if (lenis) {
      lenis.stop();
    }

    return () => {
      if (lenis) {
        requestAnimationFrame(() => {
          lenis.start();
        });
      }
    };
  }, [lenis]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.3,
        ease: 'easeInOut'
      }}
    >
      {children}
    </motion.div>
  );
}

export default PageTransition; 