import { motion } from 'framer-motion';

/**
 * Button Component
 * Variants: primary | secondary | ghost | danger
 * Sizes:    sm | md | lg
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) {
  const isDisabled = disabled || loading;

  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontFamily: 'var(--font-body)',
    fontWeight: 500,
    letterSpacing: 'var(--tracking-wide)',
    textTransform: 'uppercase',
    border: '1.5px solid transparent',
    borderRadius: 'var(--radius-md)',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    opacity: isDisabled && !loading ? 0.5 : 1,
    transition: 'all var(--duration-normal) var(--ease-out)',
    width: fullWidth ? '100%' : 'auto',
    position: 'relative',
    overflow: 'hidden',
    userSelect: 'none',
  };

  const sizes = {
    sm: { padding: '0.5rem 1rem',    fontSize: 'var(--text-xs)' },
    md: { padding: '0.75rem 1.5rem', fontSize: 'var(--text-sm)' },
    lg: { padding: '1rem 2rem',      fontSize: 'var(--text-base)' },
  };

  const variants = {
    primary: {
      background: 'var(--color-accent)',
      color: '#fff',
      borderColor: 'var(--color-accent)',
    },
    secondary: {
      background: 'transparent',
      color: 'var(--color-text)',
      borderColor: 'var(--color-border-md)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--color-text-muted)',
      borderColor: 'transparent',
    },
    danger: {
      background: 'var(--color-api)',
      color: '#fff',
      borderColor: 'var(--color-api)',
    },
    dark: {
      background: 'var(--color-text)',
      color: 'var(--color-text-inv)',
      borderColor: 'var(--color-text)',
    },
  };

  const style = {
    ...baseStyle,
    ...sizes[size],
    ...variants[variant],
  };

  return (
    <motion.button
      type={type}
      style={style}
      onClick={!isDisabled ? onClick : undefined}
      disabled={isDisabled}
      className={className}
      whileHover={!isDisabled ? { scale: 1.02, y: -1 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      transition={{ duration: 0.15 }}
      {...props}
    >
      {loading ? (
        <>
          <Spinner size="sm" color={variant === 'secondary' || variant === 'ghost' ? 'var(--color-text-muted)' : '#fff'} />
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </motion.button>
  );
}

function Spinner({ size = 'sm', color = 'currentColor' }) {
  const s = size === 'sm' ? 14 : 20;
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
      style={{ animation: 'spin 0.8s linear infinite' }}
    >
      <circle cx="12" cy="12" r="10" opacity={0.25} />
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  );
}
