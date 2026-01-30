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
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full
                 bg-black dark:bg-white
                 shadow-lg
                 flex items-center justify-center
                 hover:shadow-xl
                 transition-shadow"
    >
      <Plus className="w-6 h-6 text-white dark:text-black" />
    </motion.button>
  );
}
