import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ELEMENT_DATA, PixelIcon } from '../data/elementData';
import WireframeBackground from '../components/WireframeBackground';

// Extra fields yang hanya dipakai TeaserPage
const TEASER_EXTRA = {
  API:   { tagline: 'Berani, Intens & Bersemangat', desc: 'Kamu adalah jiwa yang memimpin. Penuh energi, tegas, dan selalu terdepan dalam setiap situasi.', trait: ['Berjiwa pemimpin', 'Penuh semangat', 'Tegas & percaya diri', 'Suka tantangan'] },
  AIR:   { tagline: 'Dalam, Puitis & Introspektif',  desc: 'Kamu peka terhadap keindahan tersembunyi. Pemikir mendalam yang menghargai setiap detail dan nuansa.', trait: ['Peka & empatik', 'Analitis mendalam', 'Perfeksionis', 'Kreatif & artistik'] },
  ANGIN: { tagline: 'Cerah, Segar & Menginspirasi',  desc: 'Energimu menular ke semua orang. Jiwa sosial yang membawa keceriaan ke mana pun kamu pergi.', trait: ['Supel & karismatik', 'Energik & antusias', 'Kreatif & spontan', 'Menginspirasi orang lain'] },
  TANAH: { tagline: 'Tenang, Stabil & Harmonis',     desc: 'Kamu adalah sumber ketenangan. Bijaksana, sabar, dan selalu hadir untuk orang-orang tercinta.', trait: ['Tenang & sabar', 'Dapat diandalkan', 'Loyal & setia', 'Penyeimbang situasi'] },
};

// Floating orb positions & animation configs untuk background
const ORB_CONFIGS = [
  { size: 320, x: '-10%', y: '10%',  delay: 0,    duration: 8  },
  { size: 200, x: '80%',  y: '-5%',  delay: 1.5,  duration: 10 },
  { size: 160, x: '60%',  y: '70%',  delay: 0.8,  duration: 7  },
  { size: 120, x: '5%',   y: '65%',  delay: 2.5,  duration: 9  },
  { size: 80,  x: '45%',  y: '15%',  delay: 1.2,  duration: 6  },
];

// Warna orb dengan rgba nyata — el.light adalah CSS var (#f9eaea) terlalu pucat di background cream
const GLOW_RGBA = {
  API:   'rgba(184, 50, 50, 0.22)',
  AIR:   'rgba(59, 119, 188, 0.35)', // Ditingkatkan ke sapphire blue yang lebih cerah & kuat untuk mengimbangi intensitas cahaya
  ANGIN: 'rgba(197, 150, 58, 0.22)',
  TANAH: 'rgba(58, 92, 58, 0.22)',
};

/**
 * TeaserPage — Halaman reveal persona setelah tes selesai
 * Route: /teaser (menerima state dari TestPage setelah submit)
 */
export default function TeaserPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [phase, setPhase] = useState('countdown'); // 'countdown' | 'reveal'
  const [count, setCount] = useState(3);

  const { personaPrimer, personaSekunder, reportToken, scores, hasVoucher } = location.state || {};

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

  const el = { ...ELEMENT_DATA[personaPrimer], ...TEASER_EXTRA[personaPrimer] };
  const elSek = personaSekunder ? { ...ELEMENT_DATA[personaSekunder], ...TEASER_EXTRA[personaSekunder] } : null;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'transparent',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1.5rem',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* ── Wireframe 3D Background — z-index -1, always visible ── */}
      <WireframeBackground elementKey="accent" opacity={0.20} />

      {/* ── Animated Background Orbs ─────────────────────────── */}
      {ORB_CONFIGS.map((orb, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={phase === 'reveal'
            ? {
                opacity: [0, 0.55, 0.35, 0.55],
                y: [0, -18, 0, 18, 0],
                scale: [1, 1.04, 1, 0.97, 1],
              }
            : { opacity: 0 }
          }
          transition={{
            delay: orb.delay + 0.5,
            duration: orb.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            position: 'fixed',
            left: orb.x,
            top: orb.y,
            width: orb.size,
            height: orb.size,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${GLOW_RGBA[personaPrimer]} 0%, transparent 70%)`,
            pointerEvents: 'none',
            zIndex: 0,
            filter: 'blur(2px)',
          }}
        />
      ))}

      {/* Accent ring background (large, centered) */}
      <motion.div
        animate={phase === 'reveal'
          ? { opacity: 1, scale: 1.1 }
          : { opacity: 0, scale: 0.9 }
        }
        transition={{ duration: 1.4, ease: 'easeOut' }}
        style={{
          position: 'fixed',
          inset: 0,
          background: `radial-gradient(ellipse 65% 55% at 50% 42%, ${GLOW_RGBA[personaPrimer]} 0%, transparent 72%)`,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ── Countdown Phase ──────────────────────────────────── */}
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

        {/* ── Reveal Phase ─────────────────────────────────────── */}
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
                marginBottom: '1.25rem',
              }}>
                Persona Utamamu
              </p>

              {/* Pixel Icon */}
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                style={{ marginBottom: '1.25rem' }}
              >
                <PixelIcon
                  src={el.pixelSrc}
                  alt={el.name}
                  size={128}
                  style={{ filter: `drop-shadow(0 6px 32px ${el.color}70)` }}
                />
              </motion.div>

              {/* Element Name */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.5rem, 8vw, 4rem)',
                  fontWeight: 500,
                  color: el.color,
                  marginBottom: '0.875rem',
                  lineHeight: 1,
                }}
              >
                {el.name}
              </motion.h1>

              {/* Divider line — pemisah visual antara nama elemen & parfum */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.38, duration: 0.4 }}
                style={{
                  width: 32,
                  height: 2,
                  background: el.color,
                  margin: '0 auto 0.75rem',
                  borderRadius: 2,
                  opacity: 0.5,
                }}
              />

              {/* Parfum Name */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.42 }}
                style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  letterSpacing: 'var(--tracking-wider)',
                  textTransform: 'uppercase',
                  color: el.color,
                  opacity: 0.75,
                  marginBottom: '1.75rem',
                }}
              >
                {el.parfum}
              </motion.p>

              {/* Tagline */}
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

              {/* Description */}
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

            {/* Traits chips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
                justifyContent: 'center',
                marginBottom: '2.5rem',
              }}
            >
              {el.trait.map((t, i) => (
                <motion.span
                  key={t}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.07 }}
                  style={{
                    padding: '0.375rem 0.875rem',
                    background: el.light,
                    color: el.color,
                    borderRadius: 'var(--radius-full)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 600,
                    border: `1px solid ${el.color}30`,
                  }}
                >
                  {t}
                </motion.span>
              ))}
            </motion.div>

            {/* ── Persona Sekunder — Card yang proper ─────────── */}
            {personaSekunder && elSek && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                style={{ marginBottom: '2.5rem' }}
              >
                <p style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  letterSpacing: 'var(--tracking-wider)',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-light)',
                  marginBottom: '0.75rem',
                }}>
                  Persona Sekunder
                </p>

                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.875rem 1.5rem 0.875rem 0.875rem',
                  background: elSek.light,
                  border: `1.5px solid ${elSek.color}35`,
                  borderRadius: 'var(--radius-2xl)',
                  boxShadow: `0 4px 20px ${elSek.color}18`,
                }}>
                  {/* Pixel Icon — ukuran proper & visible */}
                  <div style={{
                    width: 72,
                    height: 72,
                    borderRadius: 'var(--radius-xl)',
                    background: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    border: `1px solid ${elSek.color}25`,
                    overflow: 'hidden',
                  }}>
                    <PixelIcon
                      src={elSek.pixelSrc}
                      alt={elSek.name}
                      size={56}
                      style={{ filter: `drop-shadow(0 2px 8px ${elSek.color}50)` }}
                    />
                  </div>

                  {/* Teks info sekunder */}
                  <div style={{ textAlign: 'left' }}>
                    <p style={{
                      fontSize: 'var(--text-xs)',
                      fontWeight: 600,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: elSek.color,
                      opacity: 0.7,
                      marginBottom: '0.2rem',
                    }}>
                      {elSek.parfum}
                    </p>
                    <p style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'var(--text-xl)',
                      fontWeight: 500,
                      color: elSek.color,
                      lineHeight: 1.2,
                    }}>
                      {elSek.name}
                    </p>
                    <p style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--color-text-muted)',
                      marginTop: '0.25rem',
                      maxWidth: 200,
                    }}>
                      {elSek.tagline}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── CTA Buttons ──────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.05 }}
              style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
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
              transition={{ delay: 1.25 }}
              style={{
                marginTop: '1.5rem',
                fontSize: 'var(--text-xs)',
                color: 'var(--color-text-light)',
              }}
            >
              📩 Laporan lengkap sudah dikirim ke emailmu
            </motion.p>

            {/* Voucher notification */}
            {hasVoucher && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                style={{
                  marginTop: '1rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.625rem 1.25rem',
                  background: 'linear-gradient(135deg, #faf6ee, #f2e8d0)',
                  border: '1px solid rgba(201,169,110,0.35)',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  color: 'var(--color-accent)',
                }}
              >
                🎁 Voucher diskon sudah menunggumu di
                <Link
                  to="/profile"
                  style={{
                    color: 'var(--color-text)',
                    textDecoration: 'underline',
                    textUnderlineOffset: '2px',
                    fontWeight: 700,
                  }}
                >
                  Profil
                </Link>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
