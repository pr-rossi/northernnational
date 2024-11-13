import { motion } from 'framer-motion';

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
        initial={{ opacity: 1, filter: "url(#liquid)" }}
        animate={{ 
          opacity: 0,
          transition: { 
            duration: 2,
            ease: "easeOut"
          }
        }}
        exit={{ 
          opacity: 1,
          transition: { 
            duration: 2,
            ease: "easeIn"
          }
        }}
        className="fixed inset-0 bg-[#D4FF99] z-50"
      />

      <div className="relative z-0">
        {children}
      </div>
    </>
  );
}

export default PageTransition; 