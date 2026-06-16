import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import { ELEMENT_DATA } from '../data/elementData';

const ELEMENT_CONFIG = {
  API: {
    emoji: '🔥', name: 'Api', parfum: 'Choleric',
    tagline: 'Berani, Intens & Bersemangat',
    grad: ['#7c2d12', '#c2410c', '#ea580c'],
    accent: '#fb923c', bg: '#1c0a04',
  },
  AIR: {
    emoji: '💧', name: 'Air', parfum: 'Melancholic',
    tagline: 'Dalam, Puitis & Introspektif',
    grad: ['#0c4a6e', '#0284c7', '#38bdf8'],
    accent: '#7dd3fc', bg: '#020f1c',
  },
  ANGIN: {
    emoji: '🍃', name: 'Angin', parfum: 'Sanguine',
    tagline: 'Cerah, Segar & Menginspirasi',
    grad: ['#14532d', '#15803d', '#4ade80'],
    accent: '#86efac', bg: '#020f06',
  },
  TANAH: {
    emoji: '🌿', name: 'Tanah', parfum: 'Phlegmatic',
    tagline: 'Tenang, Stabil & Harmonis',
    grad: ['#713f12', '#a16207', '#ca8a04'],
    accent: '#fde047', bg: '#120c01',
  },
};

function PersonaCardCanvas({ el, userName, scores, cardRef }) {
  const cfg = ELEMENT_CONFIG[el];
  const total = Object.values(scores).reduce((a, b) => a + b, 0) || 24;
  const bars = [
    { key: 'API',   emoji: '🔥', label: 'Api',   pct: Math.round((scores.API   / total) * 100) },
    { key: 'AIR',   emoji: '💧', label: 'Air',   pct: Math.round((scores.AIR   / total) * 100) },
    { key: 'ANGIN', emoji: '🍃', label: 'Angin', pct: Math.round((scores.ANGIN / total) * 100) },
    { key: 'TANAH', emoji: '🌿', label: 'Tanah', pct: Math.round((scores.TANAH / total) * 100) },
  ].sort((a, b) => b.pct - a.pct);

  return (
    <div ref={cardRef} style={{ width: 480, height: 640, background: cfg.bg, borderRadius: 24, overflow: 'hidden', position: 'relative', fontFamily: 'Georgia, serif', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${cfg.grad[1]}40 0%, transparent 70%)`, pointerEvents: 'none' }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 40px 36px', position: 'relative', zIndex: 1 }}>
        <p style={{ fontSize: 11, fontWeight: 400, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 16 }}>VUN DIEGO · 4PERSONA</p>
        <img 
          src={ELEMENT_DATA[el].pixelSrc} 
          alt={cfg.name} 
          style={{ 
            width: 150, 
            height: 150, 
            marginBottom: 6, 
            imageRendering: 'pixelated',
            objectFit: 'contain'
          }} 
        />
        <h2 style={{ fontSize: 52, fontWeight: 400, color: cfg.accent, margin: '0 0 16px', letterSpacing: '-0.02em', lineHeight: 1.15 }}>{cfg.name}</h2>
        <p style={{ fontSize: 11, fontWeight: 400, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>{cfg.parfum}</p>
        <p style={{ fontSize: 15, fontStyle: 'italic', color: 'rgba(255,255,255,0.7)', textAlign: 'center', lineHeight: 1.6, maxWidth: 320, marginBottom: 16 }}>"{cfg.tagline}"</p>
        {userName && (
          <div style={{ 
            display: 'inline-block',
            height: 30,
            lineHeight: '28px',
            padding: '0 20px',
            border: `1px solid ${cfg.accent}40`, 
            borderRadius: 100, 
            background: `${cfg.accent}12`,
            textAlign: 'center',
            boxSizing: 'border-box'
          }}>
            <span style={{ fontSize: 13, color: cfg.accent, letterSpacing: '0.08em' }}>{userName}</span>
          </div>
        )}
      </div>
      <div style={{ padding: '20px 40px 32px', borderTop: '1px solid rgba(255,255,255,0.07)', background: 'rgba(0,0,0,0.3)', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {bars.map(b => (
            <div key={b.key} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img 
                src={ELEMENT_DATA[b.key].pixelSrc} 
                alt={b.label} 
                style={{ 
                  width: 26, 
                  height: 26, 
                  imageRendering: 'pixelated',
                  objectFit: 'contain'
                }} 
              />
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', width: 36, marginLeft: 2 }}>{b.label}</span>
              <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2 }}>
                <div style={{ width: `${b.pct}%`, height: '100%', background: cfg.accent, borderRadius: 2, opacity: b.key === el ? 1 : 0.4 }} />
              </div>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', width: 28, textAlign: 'right' }}>{b.pct}%</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', textAlign: 'center', marginTop: 16, letterSpacing: '0.15em', textTransform: 'uppercase' }}>vundiego.com · Temukan Parfummu</p>
      </div>
    </div>
  );
}

export default function PersonaShareButton({ personaPrimer, userName, scores }) {
  const cardRef = useRef(null);
  const [status, setStatus] = useState('idle');
  const [previewUrl, setPreviewUrl] = useState(null);
  const cfg = ELEMENT_CONFIG[personaPrimer];

  const generateCanvas = async () => {
    if (!cardRef.current) return null;
    return html2canvas(cardRef.current, { scale: 2, useCORS: true, backgroundColor: null, logging: false });
  };

  const handlePreview = async () => {
    setStatus('generating');
    try {
      const canvas = await generateCanvas();
      setPreviewUrl(canvas.toDataURL('image/png'));
      setStatus('previewing');
    } catch (e) {
      console.error(e);
      setStatus('idle');
    }
  };

  const handleDownload = () => {
    if (!previewUrl) return;
    const a = document.createElement('a');
    a.href = previewUrl;
    a.download = `4persona-${personaPrimer?.toLowerCase()}-${Date.now()}.png`;
    a.click();
    setStatus('done');
    setTimeout(() => setStatus('idle'), 2500);
  };

  const handleShare = async () => {
    if (!previewUrl) return;
    if (navigator.share && navigator.canShare) {
      try {
        const res = await fetch(previewUrl);
        const blob = await res.blob();
        const file = new File([blob], `persona-${personaPrimer}.png`, { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: `Persona ${cfg?.name} — Vun Diego`, text: `Aku adalah ${cfg?.name}! Cek hasil tesmu di Vun Diego.` });
          return;
        }
      } catch {}
    }
    handleDownload();
  };

  return (
    <>
      <div style={{ position: 'fixed', left: -9999, top: -9999, pointerEvents: 'none', zIndex: -1 }}>
        <PersonaCardCanvas el={personaPrimer} userName={userName} scores={scores} cardRef={cardRef} />
      </div>

      <motion.button onClick={status === 'idle' ? handlePreview : undefined} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: 'var(--color-surface)', color: 'var(--color-text)', border: '1.5px solid var(--color-border-md)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', fontWeight: 500, cursor: status === 'idle' ? 'pointer' : 'default', fontFamily: 'var(--font-body)', letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase', opacity: status === 'generating' ? 0.7 : 1 }}
      >
        {status === 'generating' ? '⏳ Membuat kartu...' : status === 'done' ? '✓ Tersimpan!' : '📸 Simpan & Bagikan'}
      </motion.button>

      <AnimatePresence>
        {status === 'previewing' && previewUrl && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={(e) => { if (e.target === e.currentTarget) setStatus('idle'); }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '2rem 1.5rem', gap: '1.25rem' }}
          >
            <motion.div initial={{ opacity: 0, scale: 0.88, y: 32 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92 }} transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}
            >
              <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>Preview Kartamu</p>
              <img src={previewUrl} alt="Persona Card" style={{ width: '100%', maxWidth: 300, borderRadius: 16, boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }} />
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <motion.button whileTap={{ scale: 0.96 }} onClick={handleDownload}
                  style={{ padding: '0.75rem 1.75rem', background: '#fff', color: '#1c1b19', border: 'none', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase' }}
                >⬇ Download PNG</motion.button>
                {typeof navigator !== 'undefined' && navigator.share && (
                  <motion.button whileTap={{ scale: 0.96 }} onClick={handleShare}
                    style={{ padding: '0.75rem 1.75rem', background: cfg?.accent || '#c9a96e', color: '#000', border: 'none', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase' }}
                  >↗ Bagikan</motion.button>
                )}
                <button onClick={() => setStatus('idle')}
                  style={{ padding: '0.75rem 1.25rem', background: 'transparent', color: 'rgba(255,255,255,0.5)', border: '1.5px solid rgba(255,255,255,0.15)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}
                >Tutup</button>
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.3)' }}>Tap di luar untuk menutup</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
