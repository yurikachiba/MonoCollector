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
        'bg-white dark:bg-gray-900',
        'border border-gray-200 dark:border-gray-800',
        'rounded-2xl shadow-sm',
        'transition-all duration-300',
        paddingClasses[padding],
        hover && 'cursor-pointer hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700',
        className
      )}
    >
      {children}
    </motion.div>
  );
}
