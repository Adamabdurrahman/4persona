import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const ELEMENT_DATA = {
  API: {
    emoji: '🔥', name: 'Api', parfum: 'Choleric',
    color: 'var(--color-api)', light: 'var(--color-api-light)',
    tagline: 'Berani, Intens & Bersemangat',
    desc: 'Kamu adalah jiwa yang memimpin. Penuh energi, tegas, dan selalu terdepan dalam setiap situasi.',
    trait: ['Berjiwa pemimpin', 'Penuh semangat', 'Tegas & percaya diri', 'Suka tantangan'],
  },
  AIR: {
    emoji: '💧', name: 'Air', parfum: 'Melancholic',
    color: 'var(--color-air)', light: 'var(--color-air-light)',
    tagline: 'Dalam, Puitis & Introspektif',
    desc: 'Kamu peka terhadap keindahan tersembunyi. Pemikir mendalam yang menghargai setiap detail dan nuansa.',
    trait: ['Peka & empatik', 'Analitis mendalam', 'Perfeksionis', 'Kreatif & artistik'],
  },
  ANGIN: {
    emoji: '🌬', name: 'Angin', parfum: 'Sanguine',
    color: 'var(--color-angin)', light: 'var(--color-angin-light)',
    tagline: 'Cerah, Segar & Menginspirasi',
    desc: 'Energimu menular ke semua orang. Jiwa sosial yang membawa keceriaan ke mana pun kamu pergi.',
    trait: ['Supel & karismatik', 'Energik & antusias', 'Kreatif & spontan', 'Menginspirasi orang lain'],
  },
  TANAH: {
    emoji: '🌿', name: 'Tanah', parfum: 'Phlegmatic',
    color: 'var(--color-tanah)', light: 'var(--color-tanah-light)',
    tagline: 'Tenang, Stabil & Harmonis',
    desc: 'Kamu adalah sumber ketenangan. Bijaksana, sabar, dan selalu hadir untuk orang-orang tercinta.',
    trait: ['Tenang & sabar', 'Dapat diandalkan', 'Loyal & setia', 'Penyeimbang situasi'],
  },
};

/**
 * TeaserPage — Halaman reveal persona setelah tes selesai
 * Route: /teaser (menerima state dari TestPage setelah submit)
 */
export default function TeaserPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [revealed, setRevealed] = useState(false);
  const [phase, setPhase] = useState('countdown'); // 'countdown' | 'reveal'
  const [count, setCount] = useState(3);

  const { personaPrimer, personaSekunder, reportToken, scores } = location.state || {};

  // Redirect jika tidak ada data
  useEffect(() => {
    if (!personaPrimer || !reportToken) {
      navigate('/', { replace: true });
    }
  }, [personaPrimer, reportToken, navigate]);

  // Countdown sebelum reveal
  useEffect(() => {
    if (phase !== 'countdown') return;

    const timer = setInterval(() => {
      setCount(c => {
        if (c <= 1) {
          clearInterval(timer);
          setTimeout(() => setPhase('reveal'), 300);
          return 0;
        }
        return c - 1;
      });
    }, 900);

    return () => clearInterval(timer);
  }, [phase]);

  if (!personaPrimer) return null;

  const el = ELEMENT_DATA[personaPrimer];
  const elSek = ELEMENT_DATA[personaSekunder];

  // Total skor untuk persentase
  const totalScore = Object.values(scores || {}).reduce((a, b) => a + b, 0) || 24;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-bg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1.5rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background glow */}
      <motion.div
        animate={phase === 'reveal' ? { opacity: 1, scale: 1.2 } : { opacity: 0 }}
        transition={{ duration: 1.2 }}
        style={{
          position: 'fixed',
          inset: 0,
          background: `radial-gradient(ellipse 70% 60% at 50% 40%, ${el.light} 0%, transparent 70%)`,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Countdown Phase */}
      <AnimatePresence mode="wait">
        {phase === 'countdown' && (
          <motion.div
            key="countdown"
            exit={{ opacity: 0, scale: 0.8 }}
            style={{
              textAlign: 'center',
              zIndex: 1,
            }}
          >
            <p style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              letterSpacing: 'var(--tracking-wider)',
              textTransform: 'uppercase',
              color: 'var(--color-text-muted)',
              marginBottom: '2rem',
            }}>
              Menganalisa kepribadianmu...
            </p>
            <AnimatePresence mode="wait">
              <motion.div
                key={count}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0.4 }}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(5rem, 20vw, 10rem)',
                  fontWeight: 600,
                  color: 'var(--color-text)',
                  lineHeight: 1,
                }}
              >
                {count > 0 ? count : '✨'}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}

        {/* Reveal Phase */}
        {phase === 'reveal' && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              width: '100%',
              maxWidth: 600,
              textAlign: 'center',
              zIndex: 1,
            }}
          >
            {/* Persona Primer */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <p style={{
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                letterSpacing: 'var(--tracking-wider)',
                textTransform: 'uppercase',
                color: 'var(--color-text-muted)',
                marginBottom: '1rem',
              }}>
                Persona Utamamu
              </p>

              <motion.p
                initial={{ scale: 0.6 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                style={{ fontSize: 'clamp(4rem, 10vw, 6rem)', marginBottom: '0.5rem' }}
              >
                {el.emoji}
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.5rem, 8vw, 4rem)',
                  fontWeight: 500,
                  color: el.color,
                  marginBottom: '0.25rem',
                  lineHeight: 1,
                }}
              >
                {el.name}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  letterSpacing: 'var(--tracking-wider)',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-muted)',
                  marginBottom: '1.25rem',
                }}
              >
                {el.parfum}
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-xl)',
                  fontStyle: 'italic',
                  color: 'var(--color-text)',
                  marginBottom: '1rem',
                }}
              >
                "{el.tagline}"
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                style={{
                  fontSize: 'var(--text-base)',
                  color: 'var(--color-text-muted)',
                  lineHeight: 'var(--leading-normal)',
                  maxWidth: 440,
                  margin: '0 auto 2rem',
                }}
              >
                {el.desc}
              </motion.p>
            </motion.div>

            {/* Traits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginBottom: '2rem' }}
            >
              {el.trait.map((t) => (
                <span key={t} style={{
                  padding: '0.375rem 0.875rem',
                  background: el.light,
                  color: el.color,
                  borderRadius: 'var(--radius-full)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  border: `1px solid ${el.color}30`,
                }}>
                  {t}
                </span>
              ))}
            </motion.div>

            {/* Sekunder */}
            {personaSekunder && elSek && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.85 }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-text-muted)',
                  marginBottom: '2.5rem',
                }}
              >
                Persona sekunder: <span style={{ color: elSek.color, fontWeight: 600 }}>
                  {elSek.emoji} {elSek.name}
                </span>
              </motion.div>
            )}

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
            >
              <Link
                to={`/report/${reportToken}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.875rem 2rem',
                  background: 'var(--color-text)',
                  color: '#fff',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 500,
                  fontSize: 'var(--text-sm)',
                  letterSpacing: 'var(--tracking-wide)',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  boxShadow: 'var(--shadow-md)',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                Lihat Laporan Lengkap →
              </Link>
              <Link
                to="/"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.875rem 1.5rem',
                  background: 'transparent',
                  color: 'var(--color-text-muted)',
                  border: '1.5px solid var(--color-border-md)',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 500,
                  fontSize: 'var(--text-sm)',
                  letterSpacing: 'var(--tracking-wide)',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
              >
                Beranda
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              style={{
                marginTop: '1.5rem',
                fontSize: 'var(--text-xs)',
                color: 'var(--color-text-light)',
              }}
            >
              📩 Laporan lengkap sudah dikirim ke emailmu
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
