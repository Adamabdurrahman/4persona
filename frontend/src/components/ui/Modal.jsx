import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';

/**
 * Modal Component — Overlay modal dengan animasi backdrop blur
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showClose = true,
  closeOnBackdrop = true,
}) {
  const modalRef = useRef(null);

  // Close on ESC key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && isOpen) onClose?.();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const sizes = {
    sm: '380px',
    md: '520px',
    lg: '720px',
    xl: '900px',
    full: 'calc(100vw - 3rem)',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeOnBackdrop ? onClose : undefined}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'var(--color-overlay)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
            }}
          >
            {/* Modal Panel */}
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#fff',
                borderRadius: 'var(--radius-2xl)',
                boxShadow: 'var(--shadow-xl)',
                width: '100%',
                maxWidth: sizes[size],
                maxHeight: 'calc(100vh - 3rem)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              {/* Header */}
              {(title || showClose) && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1.5rem 1.75rem',
                  borderBottom: '1px solid var(--color-border)',
                }}>
                  {title && (
                    <h2 style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'var(--text-xl)',
                      fontWeight: 500,
                      color: 'var(--color-text)',
                    }}>
                      {title}
                    </h2>
                  )}
                  {showClose && (
                    <button
                      onClick={onClose}
                      style={{
                        color: 'var(--color-text-muted)',
                        cursor: 'pointer',
                        padding: '4px',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        transition: 'color var(--duration-fast)',
                        marginLeft: 'auto',
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
                    >
                      <CloseIcon />
                    </button>
                  )}
                </div>
              )}

              {/* Content */}
              <div style={{ padding: '1.75rem', overflowY: 'auto', flex: 1 }}>
                {children}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function CloseIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}
