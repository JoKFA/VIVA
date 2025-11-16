import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface AccordionProps {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}

export function Accordion({ question, answer, defaultOpen = false }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const prefersReducedMotion = useReducedMotion();

  const contentVariants = {
    hidden: {
      height: 0,
      opacity: 0,
      transition: {
        height: { duration: prefersReducedMotion ? 0 : 0.3 },
        opacity: { duration: prefersReducedMotion ? 0 : 0.2 },
      },
    },
    visible: {
      height: 'auto',
      opacity: 1,
      transition: {
        height: { duration: prefersReducedMotion ? 0 : 0.3 },
        opacity: { duration: prefersReducedMotion ? 0 : 0.3, delay: prefersReducedMotion ? 0 : 0.1 },
      },
    },
  };

  const iconVariants = {
    closed: { rotate: 0 },
    open: { rotate: 180 },
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-soft">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-gray-900 text-lg pr-4">{question}</span>
        <motion.div
          variants={iconVariants}
          animate={isOpen ? 'open' : 'closed'}
          transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
          className="flex-shrink-0"
        >
          {isOpen ? (
            <Minus className="w-5 h-5 text-primary-600" />
          ) : (
            <Plus className="w-5 h-5 text-primary-600" />
          )}
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2 text-gray-600 leading-relaxed border-t border-gray-100">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
