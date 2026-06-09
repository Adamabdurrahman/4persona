import { forwardRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Input Component
 * Types: text | email | password
 */
const Input = forwardRef(({
  label,
  type = 'text',
  placeholder,
  error,
  hint,
  icon: Icon,
  disabled = false,
  className = '',
  id,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 500,
            letterSpacing: 'var(--tracking-wider)',
            textTransform: 'uppercase',
            color: error ? 'var(--color-api)' : focused ? 'var(--color-text)' : 'var(--color-text-muted)',
            transition: 'color var(--duration-fast)',
          }}
        >
          {label}
        </label>
      )}

      <div style={{ position: 'relative' }}>
        {Icon && (
          <div style={{
            position: 'absolute',
            left: '0.875rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--color-text-light)',
            pointerEvents: 'none',
            display: 'flex',
          }}>
            <Icon size={16} />
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={inputType}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%',
            padding: Icon ? '0.75rem 0.875rem 0.75rem 2.5rem' : '0.75rem 0.875rem',
            paddingRight: type === 'password' ? '2.75rem' : '0.875rem',
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text)',
            background: disabled ? 'var(--color-surface)' : '#fff',
            border: `1.5px solid ${error ? 'var(--color-api)' : focused ? 'var(--color-text)' : 'var(--color-border-md)'}`,
            borderRadius: 'var(--radius-md)',
            outline: 'none',
            transition: 'border-color var(--duration-fast), box-shadow var(--duration-fast)',
            boxShadow: focused && !error ? '0 0 0 3px rgba(201, 169, 110, 0.15)' : 'none',
            cursor: disabled ? 'not-allowed' : 'text',
            opacity: disabled ? 0.6 : 1,
          }}
          className={className}
          {...props}
        />

        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(p => !p)}
            style={{
              position: 'absolute',
              right: '0.875rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-text-light)',
              cursor: 'pointer',
              display: 'flex',
              padding: '2px',
            }}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--color-api)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}
          >
            {error}
          </motion.p>
        )}
        {hint && !error && (
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)' }}>
            {hint}
          </p>
        )}
      </AnimatePresence>
    </div>
  );
});

Input.displayName = 'Input';
export default Input;

/* Minimal inline icons untuk menghindari dependency tambahan */
function Eye({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

function EyeOff({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}
