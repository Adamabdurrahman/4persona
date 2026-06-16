import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ELEMENT_CONFIG } from './ui/Badge';
import { ELEMENT_DATA, PixelIcon } from '../data/elementData';

export default function StatsCard({ label, value, suffix = '', element, loading = false }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [displayed, setDisplayed] = useState(0);

  const numericValue = typeof value === 'number' ? value : 0;

  // Count-up animation
  useEffect(() => {
    if (!inView) return;
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
  }, [inView, numericValue]);

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
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Slanted corner ribbon badge */}
      {element && ELEMENT_DATA[element] && !loading && (
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '75px',
          height: '75px',
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: 2,
        }}>
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '-28px',
            width: '95px',
            background: ELEMENT_DATA[element].color,
            color: '#fff',
            textAlign: 'center',
            transform: 'rotate(45deg)',
            padding: '4px 0',
            fontSize: '0.625rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {ELEMENT_DATA[element].name}
          </div>
        </div>
      )}

      {loading ? (
        <>
          <div className="skeleton" style={{ height: 48, width: '60%', margin: '0 auto 0.75rem' }} />
          <div className="skeleton" style={{ height: 16, width: '80%', margin: '0 auto' }} />
        </>
      ) : (
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

          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase', margin: 0 }}>
            {label}
          </p>
        </>
      )}
    </motion.div>
  );
}
