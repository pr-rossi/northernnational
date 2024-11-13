import { motion } from 'framer-motion';

function PageTransition({ children }) {
  return (
    <>
      <div className="ripple-background absolute inset-0 z-50">
        <motion.div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat brightness-75 origin-center"
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
          style={{ 
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(10px)'
          }}
        />
      </div>

      <div className="relative z-0">
        {children}
      </div>
    </>
  );
}

export default PageTransition; 