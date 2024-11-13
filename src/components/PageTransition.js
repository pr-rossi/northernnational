import { motion } from 'framer-motion';

const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.98,
    y: 30
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: -30,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

const overlayVariants = {
  initial: {
    scaleY: 1,
    originY: 0
  },
  animate: {
    scaleY: 0,
    originY: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  exit: {
    scaleY: 1,
    originY: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

function PageTransition({ children }) {
  return (
    <>
      <motion.div
        className="fixed inset-0 bg-[#D4FF99] z-50"
        variants={overlayVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      />
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children}
      </motion.div>
    </>
  );
}

export default PageTransition; 