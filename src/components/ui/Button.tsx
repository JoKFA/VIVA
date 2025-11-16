import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  href?: string;
  external?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      icon: Icon,
      iconPosition = 'left',
      href,
      external,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantStyles = {
      primary:
        'bg-primary-600 hover:bg-primary-700 text-white shadow-soft hover:shadow-soft-lg transform hover:-translate-y-0.5 focus:ring-primary-500',
      secondary:
        'bg-white border-2 border-primary-200 text-primary-700 hover:border-primary-300 hover:bg-primary-50 focus:ring-primary-500',
      accent:
        'bg-accent-500 hover:bg-accent-600 text-white shadow-soft hover:shadow-soft-lg transform hover:-translate-y-0.5 focus:ring-accent-500',
      ghost:
        'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-500',
      outline:
        'bg-transparent border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 focus:ring-gray-500',
    };

    const sizeStyles = {
      sm: 'px-4 py-2 text-sm rounded-lg gap-1.5',
      md: 'px-6 py-3 text-base rounded-xl gap-2',
      lg: 'px-8 py-4 text-lg rounded-xl gap-2.5',
    };

    const iconSizes = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    };

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

    const content = (
      <>
        {Icon && iconPosition === 'left' && (
          <Icon className={iconSizes[size]} />
        )}
        {children}
        {Icon && iconPosition === 'right' && (
          <Icon className={iconSizes[size]} />
        )}
      </>
    );

    if (href) {
      if (external) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={combinedClassName}
          >
            {content}
          </a>
        );
      }
      return (
        <Link to={href} className={combinedClassName}>
          {content}
        </Link>
      );
    }

    return (
      <button ref={ref} className={combinedClassName} {...props}>
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
