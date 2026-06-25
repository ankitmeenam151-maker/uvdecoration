import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen({ onFinish }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      if (onFinish) onFinish();
    }, 2500); // simulate loading time
    return () => clearTimeout(timer);
  }, [onFinish]);

  const balloonVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: [0, 1.2, 1],
      transition: { type: 'spring', stiffness: 260, damping: 20 }
    },
    exit: { opacity: 0, transition: { duration: 0.5 } }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="flex flex-col items-center"
            variants={balloonVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Simple balloon SVG */}
            <svg width="120" height="150" viewBox="0 0 120 150" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M60 0C71.0457 0 80 8.9543 80 20C80 31.0457 71.0457 40 60 40C48.9543 40 40 31.0457 40 20C40 8.9543 48.9543 0 60 0Z" fill="#FF9A9E" />
              <path d="M60 40V120" stroke="#FF9A9E" strokeWidth="12" strokeLinecap="round" />
              <path d="M45 110L60 120L75 110" stroke="#FF9A9E" strokeWidth="8" strokeLinecap="round" />
            </svg>
            <motion.p
              className="mt-6 text-xl text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.5 } }}
            >
              Preparing Your Celebration...
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
