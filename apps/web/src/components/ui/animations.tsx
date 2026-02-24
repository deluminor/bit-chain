'use client';

import { cn } from '@/lib/utils';
import { motion, AnimatePresence, Variants, HTMLMotionProps } from 'framer-motion';
import { forwardRef } from 'react';

// Base animation variants
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const slideUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const slideDown: Variants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

export const slideLeft: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

export const slideRight: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

export const bounceIn: Variants = {
  initial: { opacity: 0, scale: 0.3 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 20 },
  },
  exit: { opacity: 0, scale: 0.3 },
};

// Stagger container for children animations
export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

// Component wrappers with animations
interface AnimatedDivProps extends HTMLMotionProps<'div'> {
  variant?:
    | 'fadeIn'
    | 'slideUp'
    | 'slideDown'
    | 'slideLeft'
    | 'slideRight'
    | 'scaleIn'
    | 'bounceIn';
  delay?: number;
  duration?: number;
  children: React.ReactNode;
}

export const AnimatedDiv = forwardRef<HTMLDivElement, AnimatedDivProps>(
  ({ className, variant = 'fadeIn', delay = 0, duration = 0.3, children, ...props }, ref) => {
    const variants = {
      fadeIn,
      slideUp,
      slideDown,
      slideLeft,
      slideRight,
      scaleIn,
      bounceIn,
    };

    return (
      <motion.div
        ref={ref}
        className={className}
        variants={variants[variant]}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration, delay }}
        {...props}
      >
        {children}
      </motion.div>
    );
  },
);

AnimatedDiv.displayName = 'AnimatedDiv';

// Page transition wrapper
interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}

// Modal/Dialog animation wrapper
interface ModalTransitionProps {
  children: React.ReactNode;
  isOpen: boolean;
  className?: string;
}

export function ModalTransition({ children, isOpen, className }: ModalTransitionProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={cn('fixed inset-0 z-50 flex items-center justify-center p-4', className)}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// List item animations
interface AnimatedListProps {
  children: React.ReactNode[];
  className?: string;
  itemClassName?: string;
}

export function AnimatedList({ children, className, itemClassName }: AnimatedListProps) {
  return (
    <motion.div
      className={className}
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {children.map((child, index) => (
        <motion.div
          key={index}
          className={itemClassName}
          variants={staggerItem}
          transition={{ duration: 0.3 }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

// Card hover animations
export const cardHover: Variants = {
  rest: { scale: 1, boxShadow: '0 1px 3px rgb(0 0 0 / 0.1)' },
  hover: {
    scale: 1.02,
    boxShadow: '0 10px 25px rgb(0 0 0 / 0.15)',
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
};

interface AnimatedCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  enableHover?: boolean;
}

export const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ className, children, enableHover = true, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={className}
        variants={enableHover ? cardHover : undefined}
        initial={enableHover ? 'rest' : undefined}
        whileHover={enableHover ? 'hover' : undefined}
        animate={enableHover ? 'rest' : undefined}
        {...props}
      >
        {children}
      </motion.div>
    );
  },
);

AnimatedCard.displayName = 'AnimatedCard';

// Button press animation
export const buttonPress = {
  whileTap: { scale: 0.95 },
  transition: { type: 'spring', stiffness: 400, damping: 30 },
};

interface AnimatedButtonProps extends HTMLMotionProps<'button'> {
  children: React.ReactNode;
}

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        className={className}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        {...props}
      >
        {children}
      </motion.button>
    );
  },
);

AnimatedButton.displayName = 'AnimatedButton';

// Number counter animation
interface CounterProps {
  from: number;
  to: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function AnimatedCounter({
  from,
  to,
  duration = 1,
  className,
  prefix = '',
  suffix = '',
}: CounterProps) {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {prefix}
      <motion.span
        initial={{ value: from } as any}
        animate={{ value: to } as any}
        transition={{ duration, ease: 'easeOut' }}
      >
        {from}
      </motion.span>
      {suffix}
    </motion.span>
  );
}
