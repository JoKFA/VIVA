import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    'font-medium rounded-lg transition-all inline-flex items-center justify-center';

  const variants = {
    primary:
      'bg-gradient-to-r from-teal-500 to-emerald-600 text-white hover:shadow-lg hover:scale-105',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    outline:
      'border-2 border-teal-500 text-teal-600 hover:bg-teal-50',
    ghost: 'text-teal-600 hover:bg-teal-50',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
