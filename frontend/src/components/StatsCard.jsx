import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ELEMENT_CONFIG } from './ui/Badge';

const ELEMENT_LABELS = {
  API:   { emoji: '🔥', name: 'Api',   parfum: 'Choleric',    color: 'var(--color-api)'   },
  AIR:   { emoji: '💧', name: 'Air',   parfum: 'Melancholic', color: 'var(--color-air)'   },
  ANGIN: { emoji: '🌬', name: 'Angin', parfum: 'Sanguine',    color: 'var(--color-angin)' },
  TANAH: { emoji: '🌿', name: 'Tanah', parfum: 'Phlegmatic',  color: 'var(--color-tanah)' },
};

/**
 * StatsCard — Kartu statistik dengan animasi count-up saat muncul
 */
export default function StatsCard({ label, value, suffix = '', element, loading = false }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [displayed, setDisplayed] = useState(0);

  const isElementValue = typeof value === 'string' && ELEMENT_LABELS[value];
  const numericValue = typeof value === 'number' ? value : 0;

  // Count-up animation
  useEffect(() => {
    if (!inView || isElementValue) return;
    if (numericValue === 0) { setDisplayed(0); return; }

    const duration = 1800;
    const steps = 60;
    const stepMs = duration / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += numericValue / steps;
      if (current >= numericValue) {
        setDisplayed(numericValue);
        clearInterval(timer);
      } else {
        setDisplayed(Math.floor(current));
      }
    }, stepMs);

    return () => clearInterval(timer);
  }, [inView, numericValue, isElementValue]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: '#fff',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        padding: '2rem 1.75rem',
        boxShadow: 'var(--shadow-card)',
        textAlign: 'center',
        flex: 1,
        minWidth: 180,
      }}
    >
      {loading ? (
        <>
          <div className="skeleton" style={{ height: 48, width: '60%', margin: '0 auto 0.75rem' }} />
          <div className="skeleton" style={{ height: 16, width: '80%', margin: '0 auto' }} />
        </>
      ) : isElementValue ? (
        /* Elemen dominan */
        <>
          <p style={{ fontSize: 'var(--text-4xl)', marginBottom: '0.25rem' }}>
            {ELEMENT_LABELS[value]?.emoji}
          </p>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-2xl)',
            fontWeight: 500,
            color: ELEMENT_LABELS[value]?.color || 'var(--color-text)',
            marginBottom: '0.5rem',
          }}>
            {ELEMENT_LABELS[value]?.name}
          </p>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase' }}>
            {label}
          </p>
        </>
      ) : (
        /* Angka numerik */
        <>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-5xl)',
            fontWeight: 600,
            color: 'var(--color-text)',
            lineHeight: 1,
            marginBottom: '0.5rem',
            letterSpacing: 'var(--tracking-tight)',
          }}>
            {inView ? displayed.toLocaleString('id-ID') : 0}
            {suffix && <span style={{ fontSize: 'var(--text-3xl)', color: 'var(--color-accent)' }}>{suffix}</span>}
          </p>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase' }}>
            {label}
          </p>
        </>
      )}
    </motion.div>
  );
}
