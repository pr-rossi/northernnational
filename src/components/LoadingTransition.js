import { motion } from 'framer-motion';

function LoadingTransition() {
  return (
    <motion.div
      className="fixed inset-0 bg-zinc-950 z-50 flex items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="w-16 h-16 border-4 border-[#D4FF99] border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </motion.div>
  );
}

export default LoadingTransition; 