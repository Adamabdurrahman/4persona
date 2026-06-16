import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import PageWrapper from '../components/layout/PageWrapper';
import StatsCard from '../components/StatsCard';
import { getPublicMetrics } from '../services/metricsService';
import { getPublicVoucherInfo } from '../services/voucherService';
import { useVisitorPing } from '../hooks/useVisitorPing';
import { ELEMENT_DATA, PixelIcon } from '../data/elementData';
import GiveCoffeeBadge from '../components/GiveCoffeeBadge';

/* ── Element Persona Data ─────────────────────────────────── */
const ELEMENTS = [
  {
    key: 'API',
    ...ELEMENT_DATA.API,
    tagline: 'Berani, Intens & Bersemangat',
    desc: 'Kamu adalah jiwa yang memimpin. Penuh energi, tegas, dan selalu terdepan. Parfum ini mencerminkan semangatmu yang membara.',
  },
  {
    key: 'AIR',
    ...ELEMENT_DATA.AIR,
    tagline: 'Dalam, Puitis & Introspektif',
    desc: 'Kamu peka terhadap keindahan tersembunyi. Pemikir mendalam yang menghargai setiap detail. Parfum ini beresonansi dengan jiwamu.',
  },
  {
    key: 'ANGIN',
    ...ELEMENT_DATA.ANGIN,
    tagline: 'Cerah, Segar & Menginspirasi',
    desc: 'Energimu menular ke semua orang. Kamu adalah jiwa sosial yang membawa keceriaan ke mana pun kamu pergi.',
  },
  {
    key: 'TANAH',
    ...ELEMENT_DATA.TANAH,
    tagline: 'Tenang, Stabil & Harmonis',
    desc: 'Kamu adalah sumber ketenangan. Bijaksana, sabar, dan selalu hadir untuk orang-orang tercinta. Parfum ini menenangkan jiwa.',
  },
];

/* ── Animated Hero Canvas Background ─────────────────────── */
function HeroCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const initWidth = window.innerWidth;
    const initHeight = window.innerHeight;

    const resize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent ? parent.offsetWidth || window.innerWidth : window.innerWidth;
      canvas.height = parent ? parent.offsetHeight || window.innerHeight : window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Particles (Glowing spheres / Orbs)
    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * initWidth,
      y: Math.random() * initHeight,
      r: Math.random() * 3.6 + 2.7, // 10% smaller: 2.7px to 6.3px radius (previously 3px to 7px)
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      opacity: Math.random() * 0.35 + 0.3, // Clearly visible opacity: 30% to 65%
    }));

    let t = 0;
    const draw = () => {
      t += 0.004;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const isMobile = canvas.width < 768;
      const maxP = isMobile ? 24 : 55;
      const maxDist = isMobile ? 75 : 120;
      const lineOpacity = isMobile ? 0.10 : 0.18;
      const lineWidth = isMobile ? 0.45 : 0.75;
      const speedFactor = isMobile ? 0.70 : 1;

      // Soft radial gradient background
      const gradRadius = isMobile ? canvas.height * 0.6 : canvas.width * 0.8;
      const grad = ctx.createRadialGradient(
        canvas.width * 0.5, canvas.height * 0.4, 0,
        canvas.width * 0.5, canvas.height * 0.5, gradRadius
      );
      grad.addColorStop(0, 'rgba(201,169,110,0.08)');
      grad.addColorStop(0.5, 'rgba(201,169,110,0.03)');
      grad.addColorStop(1, 'rgba(248,246,242,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const activeParticles = particles.slice(0, maxP);

      // Draw glowing particles
      activeParticles.forEach(p => {
        p.x += p.vx * speedFactor;
        p.y += p.vy * speedFactor;
        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;
        if (p.y < -20) p.y = canvas.height + 20;
        if (p.y > canvas.height + 20) p.y = -20;

        ctx.beginPath();
        const radius = isMobile ? p.r * 0.75 : p.r;
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        
        // Soft glow shadow
        ctx.shadowBlur = isMobile ? 5 : 10;
        ctx.shadowColor = `rgba(201, 169, 110, ${p.opacity * 0.5})`;
        ctx.fillStyle = `rgba(201, 169, 110, ${p.opacity})`;
        ctx.fill();
        
        // Reset shadow
        ctx.shadowBlur = 0;
      });

      // Connect nearby particles with lines
      activeParticles.forEach((a, i) => {
        activeParticles.slice(i + 1).forEach(b => {
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < maxDist) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(201,169,110,${lineOpacity * (1 - dist / maxDist)})`;
            ctx.lineWidth = lineWidth;
            ctx.stroke();
          }
        });
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
}

/* ── Element Card (Teaser Section) ───────────────────── */
function ElementCard({ el, index, activeCard, setActiveCard }) {
  const iconSize = 100;
  const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  const [hoveredDesktop, setHoveredDesktop] = useState(false);
  const hovered = isTouch ? activeCard === el.key : hoveredDesktop;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => { if (!isTouch) setHoveredDesktop(true); }}
      onMouseLeave={() => { if (!isTouch) setHoveredDesktop(false); }}
      onClick={() => { if (isTouch) setActiveCard(activeCard === el.key ? null : el.key); }}
      style={{
        background: hovered ? el.light : '#fff',
        border: `1.5px solid ${hovered ? el.color + '50' : 'var(--color-border)'}`,
        borderRadius: 'var(--radius-2xl)',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
        boxShadow: hovered ? `0 16px 48px ${el.color}25` : 'var(--shadow-card)',
        transform: hovered ? 'translateY(-6px)' : 'none',
        textAlign: 'center',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <motion.div
        animate={{ rotate: hovered ? [0, -8, 8, 0] : 0 }}
        transition={{ duration: 0.5 }}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '150px', // Restricts the visual space occupied by the icon
          marginTop: '0.5rem', // Tighter space at the top of the card
          marginBottom: '0.25rem', // Tighter space before text starts
          position: 'relative',
          width: '100%',
        }}
      >
        <PixelIcon
          src={el.pixelSrc}
          alt={el.name}
          size={iconSize}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            filter: hovered
              ? `drop-shadow(0 8px 24px ${el.color}80)`
              : `drop-shadow(0 4px 12px rgba(0,0,0,0.10))`,
            transition: 'filter 0.3s, transform 0.3s',
          }}
        />
      </motion.div>

      <div style={{ padding: '0 1.25rem 1.75rem', width: '100%' }}>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-2xl)',
          fontWeight: 500,
          color: hovered ? el.color : 'var(--color-text)',
          marginBottom: '0.2rem',
          transition: 'color 0.3s',
          lineHeight: 1.15,
        }}>
          {el.name}
        </p>
        <p style={{
          fontSize: 'var(--text-xs)',
          fontWeight: 700,
          letterSpacing: 'var(--tracking-wider)',
          textTransform: 'uppercase',
          color: el.color,
          marginBottom: '0.75rem',
          opacity: 0.9,
        }}>
          {el.parfum}
        </p>
        <p style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--color-text-muted)',
          fontStyle: 'italic',
          lineHeight: 'var(--leading-snug)',
          marginBottom: hovered ? '0.75rem' : 0,
          transition: 'margin 0.3s',
        }}>
          "{el.tagline}"
        </p>
        <p style={{
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-light)',
          lineHeight: 'var(--leading-normal)',
          maxHeight: hovered ? '120px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.4s ease',
        }}>
          {el.desc}
        </p>
      </div>
    </motion.div>
  );
}


/* ── Main HomePage ────────────────────────────────────────── */
export default function HomePage() {
  const [metrics, setMetrics] = useState(null);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [voucherInfo, setVoucherInfo] = useState(null);
  const [activeCard, setActiveCard] = useState(null);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroY = useTransform(scrollY, [0, 400], [0, -60]);

  // Increment visitor counter — fire-and-forget, once per 30-min session
  useVisitorPing();

  useEffect(() => {
    getPublicMetrics()
      .then(setMetrics)
      .catch(() => setMetrics(null))
      .finally(() => setMetricsLoading(false));

    getPublicVoucherInfo()
      .then(setVoucherInfo)
      .catch(() => setVoucherInfo(null));
  }, []);

  // Calculate dominant element percentage
  const totalTests = metrics?.totalTests ?? 0;
  const dominantElement = metrics?.dominantElement;
  const elementBreakdown = metrics?.elementBreakdown ?? [];
  const dominantCount = elementBreakdown.find(b => b.element === dominantElement)?.count ?? 0;
  const dominantPercentage = totalTests > 0 ? Math.round((dominantCount / totalTests) * 100) : 0;

  return (
    <PageWrapper>
      {/* ═══ HERO SECTION ════════════════════════════════════ */}
      <section className="hero-section">
        <HeroCanvas />

        {/* Gradient overlay bottom */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '30%',
          background: 'linear-gradient(to bottom, transparent, var(--color-bg))',
          pointerEvents: 'none',
        }} />

        <motion.div
          style={{ opacity: heroOpacity, y: heroY, position: 'relative', zIndex: 1 }}
          className="container"
        >
          <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
            {/* Eyebrow */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              style={{
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                letterSpacing: 'var(--tracking-wider)',
                textTransform: 'uppercase',
                color: 'var(--color-accent)',
                marginBottom: 'var(--space-4)',
              }}
            >
              Tes Kepribadian 4 Elemen
            </motion.p>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                fontWeight: 500,
                lineHeight: 'var(--leading-tight)',
                color: 'var(--color-text)',
                letterSpacing: 'var(--tracking-tight)',
                marginBottom: 'var(--space-4)',
              }}
            >
              Temukan Parfum yang
              <br />
              <em style={{ color: 'var(--color-accent)', fontStyle: 'italic' }}>Mencerminkan Jati Dirimu</em>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              style={{
                fontSize: 'var(--text-lg)',
                color: 'var(--color-text-muted)',
                lineHeight: 'var(--leading-normal)',
                marginBottom: 'var(--space-6)',
                maxWidth: 520,
                margin: '0 auto var(--space-6)',
              }}
            >
              Ikuti tes kepribadian berbasis 4 elemen dan dapatkan rekomendasi parfum Vun Diego yang paling sesuai denganmu. Gratis, hanya 5 menit.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}
            >
              <Link
                to="/test"
                id="btn-hero-cta"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '1rem 2.5rem',
                  background: 'var(--color-text)',
                  color: 'var(--color-text-inv)',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 500,
                  fontSize: 'var(--text-sm)',
                  letterSpacing: 'var(--tracking-wide)',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  transition: 'opacity 0.2s',
                  boxShadow: 'var(--shadow-md)',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                Mulai Tes Gratis →
              </Link>
              <a
                href="#elemen"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '1rem 2rem',
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
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-text)'; e.currentTarget.style.color = 'var(--color-text)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border-md)'; e.currentTarget.style.color = 'var(--color-text-muted)'; }}
              >
                Lihat 4 Elemen ↓
              </a>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                marginTop: 'var(--space-6)',
              }}
            >
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase', margin: 0 }}>Scroll</p>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  width: 20,
                  height: 32,
                  border: '1.5px solid var(--color-border-md)',
                  borderRadius: 10,
                  display: 'flex',
                  justifyContent: 'center',
                  padding: '4px',
                }}
              >
                <div style={{
                  width: 4,
                  height: 8,
                  background: 'var(--color-accent)',
                  borderRadius: 2,
                  animation: 'fadeIn 0.3s',
                }} />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ═══ STATS SECTION ═══════════════════════════════════ */}
      <section style={{
        padding: 'var(--space-20) 0',
        background: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}
          >
            <p style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              letterSpacing: 'var(--tracking-wider)',
              textTransform: 'uppercase',
              color: 'var(--color-accent)',
              marginBottom: 'var(--space-3)',
            }}>
              Bergabung Bersama Ribuan Orang
            </p>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-3xl)',
              fontWeight: 500,
              color: 'var(--color-text)',
            }}>
              Komunitas 4Persona Vun Diego
            </h2>
          </motion.div>

          <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', justifyContent: 'center' }}>
            <StatsCard
              label="Total Pengunjung"
              value={metrics?.totalVisitors ?? 0}
              loading={metricsLoading}
            />
            <StatsCard
              label="Tes Selesai"
              value={metrics?.totalTests ?? 0}
              loading={metricsLoading}
            />
            <StatsCard
              label="Parfum Terjual"
              value={metrics?.totalSales ?? 0}
              loading={metricsLoading}
            />
            <StatsCard
              label="Persona Terpopuler"
              value={dominantElement ? dominantPercentage : 0}
              suffix={dominantElement ? "%" : ""}
              element={dominantElement}
              loading={metricsLoading}
            />
          </div>
        </div>
      </section>

      {/* ═══ CTA SECTION ═════════════════════════════════════ */}
      <section style={{
        padding: 'var(--space-24) 0',
        background: 'var(--color-bg)',
        textAlign: 'center',
      }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: 'var(--color-text)',
              borderRadius: 'var(--radius-2xl)',
              padding: 'clamp(2.5rem, 6vw, 5rem) clamp(1.5rem, 4vw, 4rem)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Decorative glow */}
            <div style={{
              position: 'absolute',
              top: '-30%',
              right: '-10%',
              width: '50%',
              paddingBottom: '50%',
              background: 'radial-gradient(circle, rgba(201,169,110,0.15) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />

            <p style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              letterSpacing: 'var(--tracking-wider)',
              textTransform: 'uppercase',
              color: 'var(--color-accent)',
              marginBottom: 'var(--space-4)',
            }}>
              Siap Mengenal Dirimu?
            </p>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.75rem, 4vw, 3rem)',
              fontWeight: 500,
              color: '#fff',
              lineHeight: 'var(--leading-tight)',
              marginBottom: 'var(--space-4)',
            }}>
              Cek Persona Kamu Sekarang,<br />
              <em style={{ color: 'var(--color-accent)', fontStyle: 'italic' }}>Sepenuhnya Gratis</em>
            </h2>
            <p style={{
              fontSize: 'var(--text-base)',
              color: 'rgba(248,246,242,0.65)',
              marginBottom: 'var(--space-8)',
              maxWidth: 480,
              margin: '0 auto var(--space-8)',
              lineHeight: 'var(--leading-normal)',
            }}>
              21 pertanyaan · 5 menit · Hasil langsung di email kamu
            </p>
            <Link
              to="/test"
              id="btn-cta-mulai"
              style={{
                display: 'inline-flex',
                padding: '1rem 3rem',
                background: 'var(--color-accent)',
                color: '#fff',
                borderRadius: 'var(--radius-md)',
                fontWeight: 600,
                fontSize: 'var(--text-sm)',
                letterSpacing: 'var(--tracking-wide)',
                textTransform: 'uppercase',
                textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(201,169,110,0.4)',
                transition: 'opacity 0.2s, transform 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'scale(1.03)'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1)'; }}
            >
              Mulai Tes Gratis →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══ ELEMENT TEASER SECTION ══════════════════════════ */}
      <section id="elemen" style={{
        padding: 'var(--space-24) 0',
        background: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)',
      }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}
          >
            <p style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              letterSpacing: 'var(--tracking-wider)',
              textTransform: 'uppercase',
              color: 'var(--color-accent)',
              marginBottom: 'var(--space-3)',
            }}>
              4 Elemen Kepribadian
            </p>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-3xl)',
              fontWeight: 500,
              color: 'var(--color-text)',
              marginBottom: 'var(--space-4)',
            }}>
              What's Your Element?
            </h2>
            <p style={{
              color: 'var(--color-text-muted)',
              maxWidth: 480,
              margin: '0 auto',
              fontSize: 'var(--text-base)',
              lineHeight: 'var(--leading-normal)',
            }}>
              Setiap orang memiliki kombinasi unik dari 4 elemen ini. Temukan mana yang dominan dalam dirimu.
            </p>
          </motion.div>

          <div className="element-grid">
            {ELEMENTS.map((el, i) => (
              <ElementCard 
                key={el.key} 
                el={el} 
                index={i} 
                activeCard={activeCard} 
                setActiveCard={setActiveCard} 
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            style={{ textAlign: 'center', marginTop: 'var(--space-12)' }}
          >
            <p style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-light)',
              marginBottom: 'var(--space-4)',
              letterSpacing: 'var(--tracking-wide)',
            }}>
              Suka dengan parfum kami? Kunjungi toko resmi kami
            </p>
            <a
              href="https://vundiego.com/"
              target="_blank"
              rel="noopener noreferrer"
              id="btn-vundiego-website"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.875rem 2rem',
                background: 'linear-gradient(135deg, var(--color-accent), #b8873a)',
                color: '#fff',
                borderRadius: 'var(--radius-md)',
                fontWeight: 600,
                fontSize: 'var(--text-sm)',
                letterSpacing: 'var(--tracking-wide)',
                textTransform: 'uppercase',
                textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(201,169,110,0.35)',
                transition: 'transform 0.2s, box-shadow 0.2s, opacity 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 28px rgba(201,169,110,0.5)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(201,169,110,0.35)';
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              Kunjungi Vun Diego.com
            </a>
          </motion.div>
        </div>
      </section>

      {/* ═══ VOUCHER PROMO SECTION (conditional) ═══════════════ */}
      {voucherInfo?.isEnabled && voucherInfo?.remainingStock > 0 && (
        <section style={{
          padding: 'var(--space-20) 0',
          background: 'var(--color-bg)',
        }}>
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{
                background: 'linear-gradient(135deg, #faf6ee, #f2e8d0)',
                border: '1.5px solid rgba(201,169,110,0.3)',
                borderRadius: 'var(--radius-2xl)',
                padding: 'clamp(2rem, 5vw, 3.5rem)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Decorative glow */}
              <div style={{
                position: 'absolute', top: '-20%', right: '-5%',
                width: '40%', paddingBottom: '40%',
                background: 'radial-gradient(circle, rgba(201,169,110,0.15) 0%, transparent 70%)',
                pointerEvents: 'none',
              }} />

              <div style={{ position: 'relative', zIndex: 1 }}>
                {/* Badge */}
                <p style={{
                  fontSize: 'var(--text-xs)', fontWeight: 700,
                  letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase',
                  color: 'var(--color-accent)', marginBottom: 'var(--space-3)',
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                }}>
                  🎁 Promo Spesial
                </p>

                {/* Headline */}
                <h2 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)',
                  fontWeight: 500, color: 'var(--color-text)',
                  lineHeight: 'var(--leading-tight)',
                  marginBottom: 'var(--space-2)',
                }}>
                  Dapatkan Voucher Diskon Shopee
                </h2>

                <p style={{
                  fontSize: 'var(--text-base)', color: 'var(--color-text-muted)',
                  marginBottom: 'var(--space-4)', lineHeight: 'var(--leading-normal)',
                }}>
                  <strong>{voucherInfo.discountLabel}</strong> untuk pembelian parfum <strong>SOUL PERSONALITY</strong> Vun Diego
                </p>

                {/* Stock indicator */}
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  background: 'rgba(255,255,255,0.7)',
                  border: '1px solid rgba(201,169,110,0.25)',
                  borderRadius: 'var(--radius-full)',
                  marginBottom: 'var(--space-8)',
                }}>
                  <span style={{ fontSize: '0.875rem' }}>🔥</span>
                  <span style={{
                    fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text)',
                  }}>
                    Tersisa {voucherInfo.remainingStock} dari {voucherInfo.totalStock} voucher
                  </span>
                </div>

                {/* 3 Steps */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: 'var(--space-4)',
                  marginBottom: 'var(--space-8)',
                }}>
                  {[
                    {
                      num: '①',
                      title: 'Ikuti Tes Kepribadian',
                      desc: 'Gratis & hanya 5 menit. Jawab 20 pertanyaan tentang dirimu.',
                    },
                    {
                      num: '②',
                      title: 'Dapatkan Voucher',
                      desc: 'Otomatis muncul di halaman profil setelah tes selesai.',
                    },
                    {
                      num: '③',
                      title: 'Pakai di Shopee',
                      desc: 'Buka aplikasi Shopee, Pilih parfum Personalitymu, Saat checkout tempel kode di "Masukkan Kode Voucher".',
                    },
                  ].map((step) => (
                    <div
                      key={step.num}
                      style={{
                        background: 'rgba(255,255,255,0.6)',
                        border: '1px solid rgba(201,169,110,0.15)',
                        borderRadius: 'var(--radius-xl)',
                        padding: '1.25rem',
                      }}
                    >
                      <p style={{
                        fontSize: 'var(--text-xl)', marginBottom: '0.375rem',
                      }}>
                        {step.num}
                      </p>
                      <p style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'var(--text-base)', fontWeight: 500,
                        color: 'var(--color-text)', marginBottom: '0.25rem',
                      }}>
                        {step.title}
                      </p>
                      <p style={{
                        fontSize: 'var(--text-xs)',
                        color: 'var(--color-text-muted)',
                        lineHeight: 'var(--leading-normal)',
                      }}>
                        {step.desc}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Note */}
                <p style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-text-light)',
                  marginBottom: 'var(--space-6)',
                  fontStyle: 'italic',
                }}>
                  * Voucher hanya berlaku untuk produk <strong>SOUL PERSONALITY</strong> Vun Diego · Berlaku 3 hari setelah didapatkan · 1 voucher per akun
                </p>

                {/* CTA */}
                <Link
                  to="/test"
                  id="btn-voucher-cta"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.875rem 2.25rem',
                    background: 'var(--color-text)',
                    color: '#fff',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 600, fontSize: 'var(--text-sm)',
                    letterSpacing: 'var(--tracking-wide)',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    boxShadow: 'var(--shadow-md)',
                    transition: 'opacity 0.2s, transform 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'scale(1.03)'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1)'; }}
                >
                  Mulai Tes & Dapatkan Voucher →
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}
      
      {/* Floating Donation Badge */}
      <GiveCoffeeBadge />
    </PageWrapper>
  );
}
