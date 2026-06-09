import { motion, AnimatePresence } from 'framer-motion';
import { ELEMENT_CONFIG } from './Badge';

/**
 * LoadingScreen — Full-screen loading tematik elemen
 * Digunakan sebagai page transition & saat fetch soal
 */
export default function LoadingScreen({
  isVisible = true,
  element = null, // 'API' | 'AIR' | 'ANGIN' | 'TANAH' | null
  message = 'Mempersiapkan Pengalamanmu...',
}) {
  const config = element ? ELEMENT_CONFIG[element] : null;
  const bgColor = config ? config.bg : 'var(--color-bg)';
  const accentColor = config ? config.color : 'var(--color-accent)';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: config ? bgColor : 'var(--color-bg)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2rem',
          }}
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            style={{ textAlign: 'center' }}
          >
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-2xl)',
              fontWeight: 500,
              color: 'var(--color-text)',
              letterSpacing: '0.1em',
            }}>
              Vundiego
            </p>
            {element && config && (
              <p style={{
                fontSize: 'var(--text-sm)',
                color: accentColor,
                letterSpacing: 'var(--tracking-wider)',
                textTransform: 'uppercase',
                marginTop: '0.25rem',
              }}>
                {config.label}
              </p>
            )}
          </motion.div>

          {/* Animated Orbs */}
          <div style={{ position: 'relative', width: 80, height: 80 }}>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  border: `2px solid ${accentColor}`,
                  opacity: 0.6 - i * 0.2,
                }}
                animate={{ scale: [1, 1.5 + i * 0.3, 1], opacity: [0.6 - i * 0.2, 0, 0.6 - i * 0.2] }}
                transition={{
                  duration: 2,
                  delay: i * 0.35,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            ))}
            {/* Center dot */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: accentColor,
            }} />
          </div>

          {/* Message */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-muted)',
              letterSpacing: 'var(--tracking-wide)',
              textAlign: 'center',
            }}
          >
            {message}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
