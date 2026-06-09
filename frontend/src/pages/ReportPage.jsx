import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getReport, submitFeedback } from '../services/testsService';
import PersonaRadarChart from '../components/PersonaRadarChart';
import PersonaShareButton from '../components/PersonaShareButton';
import Spinner from '../components/ui/Spinner';

const ELEMENT_DATA = {
  API:   { emoji: '🔥', name: 'Api',   parfum: 'Choleric',    color: 'var(--color-api)',   light: 'var(--color-api-light)'   },
  AIR:   { emoji: '💧', name: 'Air',   parfum: 'Melancholic', color: 'var(--color-air)',   light: 'var(--color-air-light)'   },
  ANGIN: { emoji: '🌬', name: 'Angin', parfum: 'Sanguine',    color: 'var(--color-angin)', light: 'var(--color-angin-light)' },
  TANAH: { emoji: '🌿', name: 'Tanah', parfum: 'Phlegmatic',  color: 'var(--color-tanah)', light: 'var(--color-tanah-light)' },
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] },
});

const FB_LABELS = ['', 'Tidak sama sekali', 'Kurang relate', 'Lumayan relate', 'Sangat relate!', 'Persis banget! 🎯'];

export default function ReportPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [report, setReport]           = useState(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const [fbRating, setFbRating]       = useState(0);
  const [fbHover, setFbHover]         = useState(0);
  const [fbText, setFbText]           = useState('');
  const [fbSubmitting, setFbSubmitting] = useState(false);
  const [fbDone, setFbDone]           = useState(false);

  useEffect(() => {
    if (!token) { navigate('/'); return; }
    getReport(token)
      .then((data) => {
        setReport(data);
        if (data.feedbackRating) { setFbRating(data.feedbackRating); setFbDone(true); }
      })
      .catch((err) => {
        const s = err.response?.status;
        if (s === 410) setError('Link laporan sudah kadaluarsa (30 hari). Coba ikuti tes baru.');
        else if (s === 404) setError('Laporan tidak ditemukan.');
        else setError('Gagal memuat laporan. Coba lagi.');
      })
      .finally(() => setLoading(false));
  }, [token, navigate]);

  const handleFeedbackSubmit = async () => {
    if (!fbRating || !report?.id) return;
    setFbSubmitting(true);
    try {
      await submitFeedback(report.id, fbRating, fbText || undefined);
      setFbDone(true);
    } catch (e) {
      console.error('Feedback error:', e);
    } finally {
      setFbSubmitting(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
      <Spinner size={40} />
    </div>
  );

  if (error) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', textAlign: 'center', padding: '2rem', background: 'var(--color-bg)' }}>
      <p style={{ fontSize: '2.5rem' }}>🔒</p>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', color: 'var(--color-text)' }}>Laporan Tidak Tersedia</h2>
      <p style={{ color: 'var(--color-text-muted)', maxWidth: 360 }}>{error}</p>
      <Link to="/" style={{ padding: '0.75rem 2rem', background: 'var(--color-text)', color: '#fff', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', fontWeight: 500, letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase', textDecoration: 'none' }}>
        Kembali ke Beranda
      </Link>
    </div>
  );

  const primer   = ELEMENT_DATA[report.personaPrimer];
  const sekunder = ELEMENT_DATA[report.personaSekunder];
  const total    = Object.values(report.scores).reduce((a, b) => a + b, 0) || 24;
  const expDate  = new Date(report.expiresAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>

      {/* ── HERO ─────────────────────────────────────────── */}
      <div style={{ background: 'var(--color-text)', padding: 'clamp(3rem, 8vw, 6rem) 1.5rem clamp(2.5rem, 6vw, 4.5rem)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)', width: '60%', paddingBottom: '40%', background: `radial-gradient(circle, ${primer.color} 0%, transparent 70%)`, opacity: 0.12, pointerEvents: 'none' }} />
        <motion.div {...fadeUp()}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 400, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Vundiego</p>
          <p style={{ fontSize: 'var(--text-4xl)', marginBottom: '0.5rem' }}>{primer.emoji}</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 500, color: primer.color, letterSpacing: 'var(--tracking-tight)', marginBottom: '0.375rem' }}>{primer.name}</h1>
          <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '0.75rem' }}>{primer.parfum}</p>
          {report.user?.name && (
            <p style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.55)' }}>
              Laporan untuk <strong style={{ color: 'rgba(255,255,255,0.85)' }}>{report.user.name}</strong>
            </p>
          )}
        </motion.div>
      </div>

      {/* ── BODY ──────────────────────────────────────────── */}
      <div className="container" style={{ padding: 'clamp(2rem, 5vw, 4rem) 1.5rem', maxWidth: 720, margin: '0 auto' }}>

        {/* Radar Chart */}
        <motion.section {...fadeUp(0.1)} style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', padding: '2rem', marginBottom: '1.5rem', boxShadow: 'var(--shadow-card)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 500, color: 'var(--color-text)', marginBottom: '1.5rem', textAlign: 'center' }}>Peta Kepribadianmu</h2>
          <PersonaRadarChart scores={report.scores} />
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '1.5rem' }}>
            {Object.entries(report.scores).map(([el, score]) => {
              const e = ELEMENT_DATA[el];
              const pct = Math.round((score / total) * 100);
              return (
                <div key={el} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 0.75rem', background: e.light, borderRadius: 'var(--radius-full)', border: `1px solid ${e.color}30` }}>
                  <span>{e.emoji}</span>
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: e.color }}>{e.name}</span>
                  <span style={{ fontSize: 'var(--text-xs)', color: e.color, opacity: 0.7 }}>{pct}%</span>
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* Persona Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
          <motion.div {...fadeUp(0.2)} style={{ background: primer.light, border: `1.5px solid ${primer.color}30`, borderRadius: 'var(--radius-2xl)', padding: '1.75rem', boxShadow: 'var(--shadow-card)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.75rem' }}>{primer.emoji}</span>
              <div>
                <p style={{ fontWeight: 700, fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase', color: primer.color, opacity: 0.7 }}>Persona Utama</p>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 500, color: primer.color }}>{primer.name}</p>
              </div>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 'var(--leading-normal)', fontStyle: report.templatePrimer?.description ? 'normal' : 'italic' }}>
              {report.templatePrimer?.description || 'Analisis mendalam akan tersedia setelah konten laporan ditambahkan oleh admin.'}
            </p>
          </motion.div>

          <motion.div {...fadeUp(0.3)} style={{ background: sekunder.light, border: `1.5px solid ${sekunder.color}30`, borderRadius: 'var(--radius-2xl)', padding: '1.75rem', boxShadow: 'var(--shadow-card)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.75rem' }}>{sekunder.emoji}</span>
              <div>
                <p style={{ fontWeight: 700, fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase', color: sekunder.color, opacity: 0.7 }}>Persona Sekunder</p>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 500, color: sekunder.color }}>{sekunder.name}</p>
              </div>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 'var(--leading-normal)', fontStyle: report.templateSekunder?.description ? 'normal' : 'italic' }}>
              {report.templateSekunder?.description || 'Analisis persona sekunder akan tersedia setelah konten laporan ditambahkan.'}
            </p>
          </motion.div>
        </div>

        {/* Parfum Recommendation */}
        {report.templatePrimer?.parfumRecommendation && (
          <motion.section {...fadeUp(0.4)} style={{ background: 'var(--color-text)', borderRadius: 'var(--radius-2xl)', padding: '2rem', marginBottom: '1.5rem', textAlign: 'center' }}>
            <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '0.75rem' }}>Rekomendasi Parfum</p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 500, color: '#fff', marginBottom: '0.5rem' }}>{report.templatePrimer.parfumRecommendation}</p>
            {report.templatePrimer.parfumTagline && (
              <p style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.6)', fontStyle: 'italic' }}>"{report.templatePrimer.parfumTagline}"</p>
            )}
          </motion.section>
        )}

        {/* ── Share Card ─────────────────────────────────── */}
        <motion.div
          {...fadeUp(0.5)}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', padding: '2rem', background: '#fff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', boxShadow: 'var(--shadow-card)', textAlign: 'center' }}
        >
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 500, color: 'var(--color-text)', marginBottom: '0.25rem' }}>Bagikan Hasil Personamu</p>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: '0.75rem', maxWidth: 340 }}>
            Simpan kartu persona sebagai gambar dan bagikan ke media sosial!
          </p>
          <PersonaShareButton personaPrimer={report.personaPrimer} userName={report.user?.name} scores={report.scores} />
        </motion.div>

        {/* ── Feedback ───────────────────────────────────── */}
        <motion.section
          {...fadeUp(0.6)}
          style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', padding: '2rem', marginBottom: '1.5rem', boxShadow: 'var(--shadow-card)', textAlign: 'center' }}
        >
          <AnimatePresence mode="wait">
            {fbDone ? (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}>
                <p style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🙏</p>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 500, color: 'var(--color-text)', marginBottom: '0.375rem' }}>Terima kasih atas masukanmu!</p>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>Feedback kamu membantu kami terus berkembang.</p>
                <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginTop: '1rem' }}>
                  {[1,2,3,4,5].map(s => <span key={s} style={{ fontSize: '1.5rem', opacity: s <= fbRating ? 1 : 0.2 }}>⭐</span>)}
                </div>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 500, color: 'var(--color-text)', marginBottom: '0.5rem' }}>Bagaimana pengalamanmu?</p>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>Hasil ini sesuai dengan kepribadianmu?</p>
                <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  {[1,2,3,4,5].map(star => (
                    <motion.button key={star} onClick={() => setFbRating(star)} onMouseEnter={() => setFbHover(star)} onMouseLeave={() => setFbHover(0)} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 'clamp(1.75rem, 5vw, 2.25rem)', filter: star <= (fbHover || fbRating) ? 'none' : 'grayscale(1) opacity(0.3)', transition: 'filter 0.1s', padding: '2px', minHeight: 'unset' }}
                    >⭐</motion.button>
                  ))}
                </div>
                <AnimatePresence mode="wait">
                  {(fbHover || fbRating) > 0 && (
                    <motion.p key={fbHover || fbRating} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-accent)', marginBottom: '1rem', letterSpacing: 'var(--tracking-wide)' }}
                    >{FB_LABELS[fbHover || fbRating]}</motion.p>
                  )}
                </AnimatePresence>
                {fbRating > 0 && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ marginBottom: '1rem' }}>
                    <textarea value={fbText} onChange={e => setFbText(e.target.value)} placeholder="Ada yang ingin kamu sampaikan? (opsional)" rows={3} maxLength={500}
                      style={{ width: '100%', boxSizing: 'border-box', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-border)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', resize: 'vertical', lineHeight: 1.6, outline: 'none' }}
                      onFocus={e => e.target.style.borderColor = 'var(--color-accent)'}
                      onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
                    />
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)', textAlign: 'right', marginTop: '0.25rem' }}>{fbText.length}/500</p>
                  </motion.div>
                )}
                <motion.button onClick={handleFeedbackSubmit} disabled={!fbRating || fbSubmitting} whileTap={{ scale: 0.97 }}
                  style={{ padding: '0.75rem 2rem', background: fbRating ? 'var(--color-text)' : 'var(--color-border)', color: fbRating ? '#fff' : 'var(--color-text-light)', border: 'none', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', fontWeight: 500, cursor: fbRating ? 'pointer' : 'default', fontFamily: 'var(--font-body)', letterSpacing: 'var(--tracking-wide)', opacity: fbSubmitting ? 0.7 : 1, minHeight: 'unset' }}
                >{fbSubmitting ? 'Mengirim...' : 'Kirim Feedback'}</motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* Footer */}
        <motion.div {...fadeUp(0.7)} style={{ textAlign: 'center', padding: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)', marginBottom: '1rem' }}>
            Link laporan ini berlaku hingga <strong>{expDate}</strong>
          </p>
          <Link to="/" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-accent)', fontFamily: 'var(--font-display)', textDecoration: 'none', letterSpacing: '0.05em' }}>
            ← Kembali ke Vundiego
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
