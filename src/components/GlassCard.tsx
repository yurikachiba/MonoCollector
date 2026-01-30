'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  padding?: 'sm' | 'md' | 'lg';
}

export default function GlassCard({
  children,
  className,
  hover = false,
  onClick,
  padding = 'md',
}: GlassCardProps) {
  const paddingClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, y: -2 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={clsx(
        'backdrop-blur-xl bg-white/30 dark:bg-white/10',
        'border border-white/40 dark:border-white/20',
        'rounded-2xl shadow-lg',
        'transition-all duration-300',
        paddingClasses[padding],
        hover && 'cursor-pointer hover:bg-white/40 dark:hover:bg-white/15',
        hover && 'hover:shadow-xl hover:border-white/50',
        className
      )}
    >
      {children}
    </motion.div>
  );
}
