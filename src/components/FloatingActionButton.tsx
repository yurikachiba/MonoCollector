'use client';

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick: () => void;
}

export default function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full
                 bg-gradient-to-r from-pink-400 to-purple-500
                 shadow-lg shadow-pink-400/30
                 flex items-center justify-center
                 hover:shadow-xl hover:shadow-pink-400/40
                 transition-shadow"
    >
      <Plus className="w-8 h-8 text-white" />
    </motion.button>
  );
}
