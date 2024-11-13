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
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: 30,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

const overlayVariants = {
  initial: {
    scaleY: 1,
    originY: 1
  },
  animate: {
    scaleY: 0,
    originY: 1,
    transition: {
      duration: 1.5,
      delay: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  exit: {
    scaleY: 1,
    originY: 1,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

const logoVariants = {
  initial: {
    opacity: 1,
    scale: 1
  },
  animate: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.5,
      delay: 0.8,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

function PageTransition({ children }) {
  return (
    <>
      <motion.div
        className="fixed inset-0 bg-[#D4FF99] z-50 flex items-center justify-center"
        variants={overlayVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <motion.img
          src="/images/nn-logo.svg"
          alt="Northern National"
          className="w-32 h-32" // Adjust size as needed
          variants={logoVariants}
          initial="initial"
          animate="animate"
        />
      </motion.div>
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