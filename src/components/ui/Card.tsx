import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'glass' | 'glass-strong' | 'elevated';
  hover?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function Card({
  children,
  variant = 'default',
  hover = false,
  className = '',
  onClick,
}: CardProps) {
  const prefersReducedMotion = useReducedMotion();

  const variantStyles = {
    default: 'bg-white border border-gray-200 rounded-2xl',
    glass: 'glass-card',
    'glass-strong': 'glass-card-strong',
    elevated: 'bg-white rounded-2xl shadow-soft-lg',
  };

  const baseClassName = `${variantStyles[variant]} ${className}`;

  if (hover && !prefersReducedMotion) {
    return (
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={`${baseClassName} cursor-pointer`}
        onClick={onClick}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      className={`${baseClassName} ${hover ? 'hover:shadow-soft-lg transition-shadow cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
