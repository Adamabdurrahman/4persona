import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import PageWrapper from '../components/layout/PageWrapper';
import StatsCard from '../components/StatsCard';
import { getPublicMetrics } from '../services/metricsService';
import { useVisitorPing } from '../hooks/useVisitorPing';

/* ── Element Persona Data ─────────────────────────────────── */
const ELEMENTS = [
  {
    key: 'API', emoji: '🔥', name: 'Api',
    parfum: 'Choleric',
    color: 'var(--color-api)', light: 'var(--color-api-light)',
    tagline: 'Berani, Intens & Bersemangat',
    desc: 'Kamu adalah jiwa yang memimpin. Penuh energi, tegas, dan selalu terdepan. Parfum ini mencerminkan semangatmu yang membara.',
  },
  {
    key: 'AIR', emoji: '💧', name: 'Air',
    parfum: 'Melancholic',
    color: 'var(--color-air)', light: 'var(--color-air-light)',
    tagline: 'Dalam, Puitis & Introspektif',
    desc: 'Kamu peka terhadap keindahan tersembunyi. Pemikir mendalam yang menghargai setiap detail. Parfum ini beresonansi dengan jiwamu.',
  },
  {
    key: 'ANGIN', emoji: '🌬', name: 'Angin',
    parfum: 'Sanguine',
    color: 'var(--color-angin)', light: 'var(--color-angin-light)',
    tagline: 'Cerah, Segar & Menginspirasi',
    desc: 'Energimu menular ke semua orang. Kamu adalah jiwa sosial yang membawa keceriaan ke mana pun kamu pergi.',
  },
  {
    key: 'TANAH', emoji: '🌿', name: 'Tanah',
    parfum: 'Phlegmatic',
    color: 'var(--color-tanah)', light: 'var(--color-tanah-light)',
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

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Particles
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.4 + 0.1,
    }));

    let t = 0;
    const draw = () => {
      t += 0.004;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Soft radial gradient background
      const grad = ctx.createRadialGradient(
        canvas.width * 0.5, canvas.height * 0.3, 0,
        canvas.width * 0.5, canvas.height * 0.5, canvas.width * 0.8
      );
      grad.addColorStop(0, 'rgba(201,169,110,0.08)');
      grad.addColorStop(0.5, 'rgba(201,169,110,0.03)');
      grad.addColorStop(1, 'rgba(248,246,242,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,169,110,${p.opacity})`;
        ctx.fill();
      });

      // Connect nearby particles
      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach(b => {
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(201,169,110,${0.12 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
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

/* ── Element Card (Teaser Section) ───────────────────────── */
function ElementCard({ el, index }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: '1 1 220px',
        background: hovered ? el.light : '#fff',
        border: `1.5px solid ${hovered ? el.color + '40' : 'var(--color-border)'}`,
        borderRadius: 'var(--radius-2xl)',
        padding: '2rem 1.5rem',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
        boxShadow: hovered ? `0 12px 40px ${el.color}20` : 'var(--shadow-card)',
        transform: hovered ? 'translateY(-6px)' : 'none',
        textAlign: 'center',
      }}
    >
      <motion.p
        style={{ fontSize: 'var(--text-5xl)', marginBottom: '1rem' }}
        animate={{ rotate: hovered ? [0, -8, 8, 0] : 0 }}
        transition={{ duration: 0.5 }}
      >
        {el.emoji}
      </motion.p>

      <p style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'var(--text-2xl)',
        fontWeight: 500,
        color: hovered ? el.color : 'var(--color-text)',
        marginBottom: '0.25rem',
        transition: 'color 0.3s',
      }}>
        {el.name}
      </p>

      <p style={{
        fontSize: 'var(--text-xs)',
        fontWeight: 600,
        letterSpacing: 'var(--tracking-wider)',
        textTransform: 'uppercase',
        color: el.color,
        marginBottom: '1rem',
        opacity: 0.8,
      }}>
        {el.parfum}
      </p>

      <p style={{
        fontSize: 'var(--text-sm)',
        color: 'var(--color-text-muted)',
        fontStyle: 'italic',
        marginBottom: '0.75rem',
        lineHeight: 'var(--leading-snug)',
      }}>
        "{el.tagline}"
      </p>

      <p style={{
        fontSize: 'var(--text-xs)',
        color: 'var(--color-text-light)',
        lineHeight: 'var(--leading-normal)',
        maxHeight: hovered ? '100px' : '0',
        overflow: 'hidden',
        transition: 'max-height 0.4s ease',
      }}>
        {el.desc}
      </p>
    </motion.div>
  );
}

/* ── Main HomePage ────────────────────────────────────────── */
export default function HomePage() {
  const [metrics, setMetrics] = useState(null);
  const [metricsLoading, setMetricsLoading] = useState(true);
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
  }, []);

  return (
    <PageWrapper>
      {/* ═══ HERO SECTION ════════════════════════════════════ */}
      <section style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: 'var(--color-bg)',
      }}>
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
                marginBottom: 'var(--space-5)',
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
                marginBottom: 'var(--space-6)',
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
                marginBottom: 'var(--space-10)',
                maxWidth: 520,
                margin: '0 auto var(--space-10)',
              }}
            >
              Ikuti tes kepribadian berbasis 4 elemen dan dapatkan rekomendasi parfum Vundiego yang paling sesuai denganmu. Gratis, hanya 5 menit.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}
            >
              <Link
                to="/auth"
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
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          style={{
            position: 'absolute',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase' }}>Scroll</p>
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
              Komunitas 4Persona Vundiego
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
              value={metrics?.dominantElement ?? null}
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
              25 pertanyaan · 5 menit · Hasil langsung di email kamu
            </p>
            <Link
              to="/auth"
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
              Kamu yang Manakah?
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

          <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', justifyContent: 'center' }}>
            {ELEMENTS.map((el, i) => (
              <ElementCard key={el.key} el={el} index={i} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            style={{ textAlign: 'center', marginTop: 'var(--space-12)' }}
          >
            <Link
              to="/auth"
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-muted)',
                letterSpacing: 'var(--tracking-wide)',
                textDecoration: 'underline',
                textUnderlineOffset: '4px',
                textDecorationColor: 'var(--color-border-md)',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
            >
              Temukan elemenmu — mulai tes sekarang →
            </Link>
          </motion.div>
        </div>
      </section>
    </PageWrapper>
  );
}
