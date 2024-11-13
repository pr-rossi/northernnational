import { motion } from 'framer-motion';

function PageTransition({ children }) {
  return (
    <motion.div
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
      className="bg-zinc-950"
    >
      {children}
    </motion.div>
  );
}

export default PageTransition; 