import { motion } from 'framer-motion';

/**
 * Card Component — Surface card dengan hover effect
 * Variants: default | elevated | flat | glass
 */
export default function Card({
  children,
  variant = 'default',
  hover = true,
  padding = true,
  onClick,
  className = '',
  style: extraStyle = {},
  ...props
}) {
  const variants = {
    default: {
      background: '#fff',
      border: '1px solid var(--color-border)',
      boxShadow: 'var(--shadow-card)',
    },
    elevated: {
      background: '#fff',
      border: '1px solid var(--color-border)',
      boxShadow: 'var(--shadow-lg)',
    },
    flat: {
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      boxShadow: 'none',
    },
    glass: {
      background: 'rgba(255, 255, 255, 0.6)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid rgba(255,255,255,0.8)',
      boxShadow: 'var(--shadow-md)',
    },
  };

  const baseStyle = {
    borderRadius: 'var(--radius-xl)',
    padding: padding ? 'var(--space-6)' : 0,
    cursor: onClick ? 'pointer' : 'default',
    overflow: 'hidden',
    position: 'relative',
    transition: 'box-shadow var(--duration-normal) var(--ease-out), transform var(--duration-normal) var(--ease-out)',
    ...variants[variant],
    ...extraStyle,
  };

  return (
    <motion.div
      style={baseStyle}
      onClick={onClick}
      whileHover={hover ? { y: -3, boxShadow: '0 12px 40px rgba(0,0,0,0.12)' } : {}}
      transition={{ duration: 0.2 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
