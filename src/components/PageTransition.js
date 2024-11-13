import { motion } from 'framer-motion';
import { useEffect } from 'react';

function PageTransition({ children }) {
  useEffect(() => {
    document.body.style.backgroundColor = '#09090B';
    
    const originalStyle = window.getComputedStyle(document.body).overflow;
    
    return () => {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';

      setTimeout(() => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = originalStyle;
        window.scrollTo(0, scrollY);
      }, 1000);
    };
  }, []);

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