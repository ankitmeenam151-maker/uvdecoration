import React from 'react';
import { motion } from 'framer-motion';

export default function GlowingButton({ children, onClick, className = '' }) {
  return (
    <motion.button
      className={`relative overflow-hidden rounded-xl px-6 py-3 font-semibold text-white bg-gradient-to-r from-[#FF9A9E] to-[#D4AF37] shadow-[0_0_10px_#FF9A9E] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_#FF9A9E] ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}
