import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

function PageTransition({ children }) {
  return (
    <>
      <svg
        className="fixed top-0 left-0 w-0 h-0"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="liquid">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="liquid"
            />
          </filter>
        </defs>
      </svg>

      <motion.div
        initial={{ y: "100%", filter: "url(#liquid)" }}
        animate={{ 
          y: "-100%",
          transition: { 
            duration: 1.5,
            ease: [0.45, 0, 0.55, 1]
          }
        }}
        exit={{ 
          y: "-200%",
          transition: { 
            duration: 1.5,
            ease: [0.45, 0, 0.55, 1]
          }
        }}
        className="fixed inset-0 bg-[#D4FF99] z-50"
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
          transition: { 
            duration: 0.5,
            delay: 0.5 
          }
        }}
        exit={{ opacity: 0 }}
      >
        {children}
      </motion.div>
    </>
  );
}

export default PageTransition; 