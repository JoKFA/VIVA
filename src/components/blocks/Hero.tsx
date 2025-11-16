import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface CTAButton {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary';
}

interface HeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  ctaButtons?: CTAButton[];
}

export function Hero({ title, subtitle, description, ctaButtons = [] }: HeroProps) {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.2,
        delayChildren: prefersReducedMotion ? 0 : 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.6,
        ease: 'easeOut',
      },
    },
  };

  const circleVariants = {
    animate: {
      scale: prefersReducedMotion ? 1 : [1, 1.2, 1],
      x: prefersReducedMotion ? 0 : [0, 30, 0],
      y: prefersReducedMotion ? 0 : [0, -20, 0],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const circleVariants2 = {
    animate: {
      scale: prefersReducedMotion ? 1 : [1.2, 1, 1.2],
      x: prefersReducedMotion ? 0 : [0, -40, 0],
      y: prefersReducedMotion ? 0 : [0, 30, 0],
      transition: {
        duration: 10,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const circleVariants3 = {
    animate: {
      scale: prefersReducedMotion ? 1 : [1, 1.3, 1],
      x: prefersReducedMotion ? 0 : [0, 20, 0],
      y: prefersReducedMotion ? 0 : [0, 40, 0],
      transition: {
        duration: 12,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          variants={circleVariants}
          animate="animate"
          className="absolute -top-40 -left-40 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl"
        />
        <motion.div
          variants={circleVariants2}
          animate="animate"
          className="absolute top-1/2 -right-32 w-80 h-80 bg-accent-200/30 rounded-full blur-3xl"
        />
        <motion.div
          variants={circleVariants3}
          animate="animate"
          className="absolute -bottom-20 left-1/3 w-72 h-72 bg-primary-300/20 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center"
      >
        {subtitle && (
          <motion.p
            variants={itemVariants}
            className="text-primary-600 font-semibold text-lg mb-4 tracking-wide uppercase"
          >
            {subtitle}
          </motion.p>
        )}

        <motion.h1
          variants={itemVariants}
          className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
        >
          {title}
        </motion.h1>

        {description && (
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            {description}
          </motion.p>
        )}

        {ctaButtons.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {ctaButtons.map((button, index) => (
              <a
                key={index}
                href={button.href}
                className={`
                  inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl
                  transition-all duration-300 transform hover:scale-105
                  ${
                    button.variant === 'secondary'
                      ? 'bg-white text-primary-600 border-2 border-primary-600 hover:bg-primary-50 shadow-soft'
                      : 'bg-primary-600 text-white hover:bg-primary-700 shadow-soft-lg'
                  }
                `}
              >
                {button.label}
              </a>
            ))}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
