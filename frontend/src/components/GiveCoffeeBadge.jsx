import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import pixelGhost from '../assets/pixel-ghost.png';
import pixelGlass from '../assets/pixel-glass.png';
import danaQr from '../assets/dana-qr.jpg';

// Mock QRIS SVG yang didesain agar terlihat pixelated & retro
function MockQRISSvg({ size = 130 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ imageRendering: 'pixelated', display: 'block', margin: '0 auto' }}>
      {/* Background putih */}
      <rect width="24" height="24" fill="#ffffff" />
      {/* Border luar & pojok kiri atas */}
      <rect x="1" y="1" width="7" height="7" fill="#000000" />
      <rect x="2" y="2" width="5" height="5" fill="#ffffff" />
      <rect x="3" y="3" width="3" height="3" fill="#000000" />

      {/* Pojok kanan atas */}
      <rect x="16" y="1" width="7" height="7" fill="#000000" />
      <rect x="17" y="2" width="5" height="5" fill="#ffffff" />
      <rect x="18" y="3" width="3" height="3" fill="#000000" />

      {/* Pojok kiri bawah */}
      <rect x="1" y="16" width="7" height="7" fill="#000000" />
      <rect x="2" y="17" width="5" height="5" fill="#ffffff" />
      <rect x="3" y="18" width="3" height="3" fill="#000000" />

      {/* Titik-titik pixel random (Mock Data) */}
      <rect x="9" y="1" width="2" height="2" fill="#000000" />
      <rect x="12" y="2" width="1" height="3" fill="#000000" />
      <rect x="14" y="4" width="1" height="1" fill="#000000" />
      
      <rect x="9" y="6" width="1" height="2" fill="#000000" />
      <rect x="11" y="7" width="3" height="1" fill="#000000" />
      <rect x="13" y="5" width="2" height="2" fill="#000000" />

      <rect x="1" y="9" width="3" height="1" fill="#000000" />
      <rect x="5" y="9" width="1" height="2" fill="#000000" />
      <rect x="7" y="11" width="2" height="2" fill="#000000" />
      <rect x="10" y="9" width="4" height="2" fill="#000000" />
      
      <rect x="15" y="9" width="2" height="1" fill="#000000" />
      <rect x="18" y="9" width="1" height="3" fill="#000000" />
      <rect x="20" y="10" width="3" height="2" fill="#000000" />

      <rect x="1" y="13" width="2" height="1" fill="#000000" />
      <rect x="4" y="12" width="2" height="3" fill="#000000" />
      <rect x="9" y="13" width="1" height="2" fill="#000000" />
      <rect x="11" y="14" width="3" height="1" fill="#000000" />
      <rect x="15" y="12" width="2" height="2" fill="#000000" />

      <rect x="9" y="16" width="2" height="3" fill="#000000" />
      <rect x="12" y="18" width="3" height="1" fill="#000000" />
      <rect x="14" y="16" width="1" height="2" fill="#000000" />
      <rect x="16" y="16" width="3" height="1" fill="#000000" />
      <rect x="16" y="18" width="1" height="3" fill="#000000" />
      <rect x="18" y="20" width="4" height="2" fill="#000000" />
      <rect x="22" y="17" width="1" height="2" fill="#000000" />

      <rect x="9" y="21" width="3" height="1" fill="#000000" />
      <rect x="13" y="22" width="2" height="1" fill="#000000" />
    </svg>
  );
}

// Pixel Art Coffee Icon SVG
function PixelCoffeeIcon({ size = 20, style = {}, inverted = false }) {
  const outline = inverted ? '#ffffff' : '#4e3629';
  const cup = inverted ? '#f8f6f2' : '#c9a96e'; // warna cangkir (Vundiego Gold)
  const coffee = inverted ? '#FAF6EE' : '#6f4e37'; // warna cairan kopi
  const steam = inverted ? 'rgba(255,255,255,0.7)' : '#b8865c'; // uap

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 16 16" 
      style={{ imageRendering: 'pixelated', display: 'inline-block', verticalAlign: 'middle', ...style }}
    >
      {/* Uap / Steam */}
      <rect x="5" y="1" width="1" height="2" fill={steam} />
      <rect x="7" y="2" width="1" height="2" fill={steam} />
      <rect x="9" y="1" width="1" height="2" fill={steam} />
      
      {/* Bibir Cangkir (Rim) */}
      <rect x="3" y="5" width="9" height="1" fill={outline} />
      
      {/* Badan Cangkir */}
      <rect x="3" y="6" width="1" height="5" fill={outline} /> {/* Kiri */}
      <rect x="11" y="6" width="1" height="5" fill={outline} /> {/* Kanan */}
      <rect x="4" y="7" width="7" height="4" fill={cup} /> {/* Isi Cangkir */}
      
      {/* Kopi di dalam cangkir (Bagian atas) */}
      <rect x="4" y="6" width="7" height="1" fill={coffee} />

      {/* Gagang Cangkir (Handle) */}
      <rect x="12" y="7" width="2" height="1" fill={outline} />
      <rect x="13" y="8" width="1" height="2" fill={outline} />
      <rect x="12" y="9" width="2" height="1" fill={outline} />

      {/* Bagian bawah cangkir */}
      <rect x="4" y="11" width="7" height="1" fill={outline} />
      
      {/* Tatakan (Saucer) */}
      <rect x="2" y="12" width="11" height="1" fill={outline} />
      <rect x="4" y="13" width="7" height="1" fill={outline} />
    </svg>
  );
}

// Pixel Art Thumbs Up Icon SVG
function PixelThumbsUpIcon({ size = 24, style = {} }) {
  const outline = '#4e3629';
  const fillColor = '#ffd166'; // Retro gold thumbs up
  const white = '#ffffff';

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 16 16" 
      style={{ imageRendering: 'pixelated', display: 'inline-block', verticalAlign: 'middle', ...style }}
    >
      {/* Thumb (Jempol ke atas) */}
      <rect x="6" y="2" width="3" height="1" fill={outline} />
      <rect x="5" y="3" width="1" height="5" fill={outline} />
      <rect x="6" y="3" width="2" height="5" fill={fillColor} />
      <rect x="8" y="3" width="1" height="5" fill={outline} />
      
      {/* Fist (Kepalan Tangan) */}
      <rect x="9" y="5" width="4" height="1" fill={outline} />
      <rect x="9" y="6" width="3" height="1" fill={fillColor} />
      <rect x="12" y="6" width="1" height="1" fill={outline} />

      <rect x="9" y="7" width="4" height="1" fill={outline} />
      <rect x="9" y="8" width="3" height="1" fill={fillColor} />
      <rect x="12" y="8" width="1" height="1" fill={outline} />

      <rect x="8" y="9" width="5" height="1" fill={outline} />
      <rect x="8" y="10" width="4" height="1" fill={fillColor} />
      <rect x="12" y="10" width="1" height="1" fill={outline} />
      
      <rect x="4" y="11" width="9" height="1" fill={outline} />
      <rect x="4" y="12" width="8" height="1" fill={fillColor} />
      <rect x="12" y="12" width="1" height="1" fill={outline} />
      
      {/* Bottom Border */}
      <rect x="4" y="13" width="9" height="1" fill={outline} />
      
      {/* Back / Wrist (Pergelangan tangan kiri) */}
      <rect x="4" y="8" width="1" height="3" fill={outline} />
      <rect x="5" y="8" width="3" height="3" fill={fillColor} />
      <rect x="5" y="12" width="3" height="1" fill={fillColor} />
      
      {/* Highlights */}
      <rect x="6" y="4" width="1" height="3" fill={white} opacity="0.6" />
      <rect x="9" y="6" width="1" height="1" fill={white} opacity="0.6" />
      <rect x="9" y="8" width="1" height="1" fill={white} opacity="0.6" />
    </svg>
  );
}

export default function GiveCoffeeBadge() {
  const [isOpen, setIsOpen] = useState(false);
  const [isBadgeHovered, setIsBadgeHovered] = useState(false);
  const [selectedCoffee, setSelectedCoffee] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('qris'); // 'qris' | 'bank'
  const [copiedBsi, setCopiedBsi] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [confetti, setConfetti] = useState([]);

  // Nominal Donasi kopi
  const coffeeOptions = [
    { count: 1, label: '1 Kopi', price: 'Rp 15.000', note: 'Terima kasih banyak! Ini sangat membantu.' },
    { count: 2, label: '2 Kopi', price: 'Rp 30.000', note: 'Wah, saya bisa lembur coding malam ini!' },
    { count: 3, label: '3 Kopi', price: 'Rp 45.000', note: 'Dukungan luar biasa! Anda penyelamat kami!' },
    { count: 5, label: '5 Kopi', price: 'Rp 75.000', note: 'Super Coffee! Energi kami meluap-luap!' },
  ];

  const currentOption = coffeeOptions.find(o => o.count === selectedCoffee) || coffeeOptions[0];

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedBsi(true);
    setTimeout(() => setCopiedBsi(false), 2000);
  };

  const handleConfirm = () => {
    setIsSuccess(true);
    // Generate simple particle effects
    const particles = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 80 - 40,
      y: Math.random() * -100 - 50,
      rotate: Math.random() * 360,
      emoji: Math.random() > 0.5 ? '☕' : '✨',
    }));
    setConfetti(particles);
  };

  const [animStep, setAnimStep] = useState(0);

  // Timeline loop untuk micro-interactions (Ghost & Glass)
  useEffect(() => {
    let t1, t2, t3, t4;
    const runTimeline = () => {
      setAnimStep(0); // Ghost melompat
      t1 = setTimeout(() => setAnimStep(1), 2000); // Gelas meluncur masuk
      t2 = setTimeout(() => setAnimStep(2), 3000); // Gelas diam + thumbs up 👍
      t3 = setTimeout(() => setAnimStep(3), 4500); // Gelas meluncur keluar
      t4 = setTimeout(() => setAnimStep(4), 5500); // Jeda/idle
    };

    runTimeline();
    const interval = setInterval(runTimeline, 7000);

    return () => {
      clearInterval(interval);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  // Close success screen and modal after 4 seconds
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        setIsOpen(false);
        // Reset states after animation exits
        setTimeout(() => {
          setIsSuccess(false);
          setConfetti([]);
          setSelectedCoffee(1);
          setPaymentMethod('qris');
        }, 300);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  return (
    <>
      {/* ── FLOATING BADGE BUTTON ── */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 100,
          width: '180px',
        }}
      >
        {/* Area Animasi Micro-Interaction (Ghost & Glass) diletakkan sebagai sibling button di dalam fixed-width wrapper */}
        <div style={{
          position: 'absolute',
          bottom: '100%',
          left: 0,
          width: '180px',
          height: '88px',
          pointerEvents: 'none',
          overflow: 'visible',
        }}>
          <AnimatePresence>
            {/* Ghost jumping (animStep === 0) */}
            {animStep === 0 && (
              <motion.img
                key="ghost"
                src={pixelGhost}
                alt="Ghost"
                initial={{ left: '-80px', y: 0, opacity: 0 }}
                animate={{
                  left: '180px', // Gunakan nilai pixel tetap untuk menghindari bug kalkulasi persen
                  y: [0, -16, 0, -16, 0, -16, 0, -16, 0],
                  opacity: [0, 1, 1, 1, 0],
                }}
                transition={{
                  duration: 2,
                  ease: 'linear',
                }}
                style={{
                  position: 'absolute',
                  width: '76px',
                  height: '76px',
                  imageRendering: 'pixelated',
                  bottom: '2px',
                }}
              />
            )}

            {/* Glass entering / staying / leaving (animStep === 1, 2, 3) */}
            {(animStep === 1 || animStep === 2 || animStep === 3) && (
              <motion.div
                key="glass-container"
                style={{
                  position: 'absolute',
                  width: '76px',
                  height: '76px',
                  bottom: '2px',
                }}
                initial={animStep === 1 ? { left: '-80px', opacity: 0 } : false}
                animate={
                  animStep === 1
                    ? { left: 'calc(50% - 38px)', opacity: 1 }
                    : animStep === 2
                    ? { left: 'calc(50% - 38px)', y: [0, -6, 0], opacity: 1 }
                    : { left: '180px', opacity: 0 }
                }
                transition={{
                  left: animStep === 1
                    ? { duration: 1, ease: 'easeOut' }
                    : animStep === 3
                    ? { duration: 1, ease: 'easeIn' }
                    : { duration: 0.2 },
                  y: animStep === 2
                    ? { repeat: Infinity, duration: 1.2, ease: 'easeInOut' }
                    : { duration: 0.2 },
                  opacity: { duration: 0.5 }
                }}
              >
                <img
                  src={pixelGlass}
                  alt="Glass"
                  style={{
                    width: '76px',
                    height: '76px',
                    imageRendering: 'pixelated',
                    display: 'block',
                  }}
                />

                {/* Thumbs up emoji 👍 */}
                <AnimatePresence>
                  {animStep === 2 && (
                    <motion.span
                      key="thumbs-up"
                      initial={{ scale: 0, y: 8, opacity: 0 }}
                      animate={{ scale: [0, 1.3, 1], y: -38, opacity: 1 }}
                      exit={{ scale: 0, y: -16, opacity: 0 }}
                      transition={{ duration: 0.3, type: 'spring', stiffness: 260, damping: 14 }}
                      style={{
                        position: 'absolute',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: '28px',
                        display: 'block',
                        textShadow: '0 2px 4px rgba(0,0,0,0.15)',
                      }}
                    >
                      👍
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          onClick={() => setIsOpen(true)}
          animate={{
            y: [0, -6, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 4,
            ease: 'easeInOut',
          }}
          whileHover={{
            scale: 1.05,
            transition: { duration: 0.2 },
          }}
          whileTap={{ scale: 0.95 }}
          style={{
            position: 'relative',
            width: '100%', // 100% agar presisi mengikuti wrapper fixed-width 180px
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.625rem',
            padding: '0.65rem 1rem',
            background: 'rgba(248, 246, 242, 0.45)', // Sangat transparan (Quiet Luxury bg)
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1.5px solid rgba(28, 27, 25, 0.15)',
            borderRadius: 'var(--radius-lg)',
            cursor: 'pointer',
            fontFamily: 'var(--font-pixel)',
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            color: 'rgba(28, 27, 25, 0.65)',
            boxShadow: 'var(--shadow-sm)',
            textTransform: 'uppercase',
            transition: 'background 0.3s ease, border-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease',
          }}
          onMouseEnter={e => {
            setIsBadgeHovered(true);
            e.currentTarget.style.background = 'linear-gradient(135deg, #6f4e37, #8a6245, #b8865c)';
            e.currentTarget.style.borderColor = '#6f4e37';
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(111, 78, 55, 0.4)';
          }}
          onMouseLeave={e => {
            setIsBadgeHovered(false);
            e.currentTarget.style.background = 'rgba(248, 246, 242, 0.45)';
            e.currentTarget.style.borderColor = 'rgba(28, 27, 25, 0.15)';
            e.currentTarget.style.color = 'rgba(28, 27, 25, 0.65)';
            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
          }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 10, 0] }}
            transition={{ repeat: Infinity, repeatDelay: 5, duration: 0.5 }}
            style={{ display: 'inline-flex', alignItems: 'center' }}
          >
            <PixelCoffeeIcon size={20} inverted={isBadgeHovered} />
          </motion.div>
          <span>Give us Coffee</span>
        </motion.button>
      </div>

      {/* ── CUSTOM MODAL OVERLAY ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 999,
              background: 'rgba(17, 17, 16, 0.75)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
            }}
            onClick={e => {
              if (e.target === e.currentTarget && !isSuccess) setIsOpen(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              style={{
                width: '100%',
                maxWidth: '460px',
                maxHeight: 'calc(100vh - 40px)',
                background: '#FAF6EE', // Warna warm neutral kuno / kertas
                border: '4px double #6f4e37', // Pixel border style
                borderRadius: '16px',
                boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              {/* Close Button */}
              {!isSuccess && (
                <button
                  onClick={() => setIsOpen(false)}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    width: '28px',
                    height: '28px',
                    background: '#FAF6EE',
                    border: '2px solid #6f4e37',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-pixel)',
                    fontSize: '12px',
                    color: '#6f4e37',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease',
                    zIndex: 10,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#6f4e37';
                    e.currentTarget.style.color = '#FAF6EE';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = '#FAF6EE';
                    e.currentTarget.style.color = '#6f4e37';
                  }}
                >
                  X
                </button>
              )}

              {/* Scrollable Area */}
              <div
                className="custom-scrollbar"
                style={{
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >

              {/* SUCCESS VIEW */}
              {isSuccess ? (
                <div style={{ padding: '2rem 1.5rem', textAlign: 'center', position: 'relative' }}>
                  {/* Spawning particles */}
                  {confetti.map(p => (
                    <motion.span
                      key={p.id}
                      initial={{ opacity: 1, scale: 0.8, x: 0, y: 0 }}
                      animate={{
                        opacity: 0,
                        scale: 1.2,
                        x: p.x,
                        y: p.y,
                        rotate: p.rotate,
                      }}
                      transition={{ duration: 2.2, ease: 'easeOut' }}
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '40%',
                        fontSize: '1.5rem',
                        pointerEvents: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {p.emoji === '☕' ? <PixelCoffeeIcon size={20} /> : p.emoji}
                    </motion.span>
                  ))}

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ duration: 0.5 }}
                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}
                  >
                    <PixelCoffeeIcon size={48} />
                    <span style={{ fontSize: '2.5rem' }}>✨</span>
                  </motion.div>
                  
                  <h3 style={{
                    fontFamily: 'var(--font-pixel)',
                    fontSize: 'var(--text-lg)',
                    color: '#6f4e37',
                    marginBottom: '1rem',
                    textTransform: 'uppercase',
                  }}>
                    Terima Kasih!
                  </h3>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-text-muted)',
                    lineHeight: 'var(--leading-normal)',
                  }}>
                    Dukungan Anda sebesar <strong>{currentOption.price}</strong> telah masuk ke cangkir kami. 
                    Setiap tetes kopi membantu server kami tetap terjaga dan codingan kami tetap mengalir! 🚀
                  </p>
                </div>
              ) : (
                /* REGULAR DONATION VIEW */
                <>
                  {/* Header */}
                  <div style={{
                    padding: '1.2rem 1.25rem 0.85rem',
                    borderBottom: '2px dashed rgba(111, 78, 55, 0.25)',
                    textAlign: 'center',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.35rem' }}>
                      <PixelCoffeeIcon size={36} />
                    </div>
                    <h3 style={{
                      fontFamily: 'var(--font-pixel)',
                      fontSize: 'var(--text-base)',
                      color: '#6f4e37',
                      margin: 0,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}>
                      Beri Kopi untuk Developer
                    </h3>
                    <p style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--text-xs)',
                      color: 'var(--color-text-muted)',
                      marginTop: '0.2rem',
                      marginBottom: 0,
                    }}>
                      Bantu dukung kelangsungan dan pengembangan Tes 4Persona.
                    </p>
                  </div>

                  {/* Body Content */}
                  <div style={{ padding: '0.85rem 1.25rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {/* Step 1: Select Amount */}
                    <div>
                      <p style={{
                        fontFamily: 'var(--font-pixel)',
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        color: '#6f4e37',
                        marginBottom: '0.5rem',
                        fontWeight: 600,
                      }}>
                        1. Pilih Jumlah Kopi:
                      </p>
                      
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '0.4rem',
                      }}>
                        {coffeeOptions.map(opt => {
                          const isSelected = selectedCoffee === opt.count;
                          return (
                            <button
                              key={opt.count}
                              onClick={() => setSelectedCoffee(opt.count)}
                              style={{
                                padding: '0.5rem 0.4rem',
                                background: isSelected ? 'linear-gradient(135deg, #6f4e37, #8a6245)' : '#FAF6EE',
                                color: isSelected ? '#ffffff' : '#6f4e37',
                                border: '2px solid #6f4e37',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontFamily: 'var(--font-pixel)',
                                fontSize: '11px',
                                textAlign: 'center',
                                transition: 'all 0.15s ease',
                                boxShadow: isSelected ? '0 4px 12px rgba(111, 78, 55, 0.25)' : 'none',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginBottom: '4px' }}>
                                {Array.from({ length: Math.min(opt.count, 3) }).map((_, idx) => (
                                  <PixelCoffeeIcon key={idx} size={14} inverted={isSelected} />
                                ))}
                                {opt.count > 3 && <span style={{ fontSize: '10px', fontWeight: 'bold' }}>+</span>}
                              </div>
                              <div style={{ fontWeight: 700 }}>{opt.label}</div>
                              <div style={{ fontSize: '9px', opacity: isSelected ? 0.9 : 0.6, marginTop: '2px' }}>{opt.price}</div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Note */}
                      <motion.div
                        key={selectedCoffee}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                          marginTop: '0.5rem',
                          padding: '0.4rem 0.6rem',
                          background: 'rgba(111, 78, 55, 0.05)',
                          borderRadius: '6px',
                          borderLeft: '3px solid #6f4e37',
                          fontStyle: 'italic',
                          fontSize: 'var(--text-xs)',
                          color: '#6f4e37',
                        }}
                      >
                        "{currentOption.note}"
                      </motion.div>
                    </div>

                    {/* Step 2: Payment Method */}
                    <div>
                      <p style={{
                        fontFamily: 'var(--font-pixel)',
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        color: '#6f4e37',
                        marginBottom: '0.5rem',
                        fontWeight: 600,
                      }}>
                        2. Pilih Cara Dukung:
                      </p>

                      <div style={{
                        display: 'flex',
                        border: '2px solid #6f4e37',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        marginBottom: '0.5rem',
                      }}>
                        <button
                          onClick={() => setPaymentMethod('qris')}
                          style={{
                            flex: 1,
                            padding: '0.4rem',
                            border: 'none',
                            background: paymentMethod === 'qris' ? '#6f4e37' : '#FAF6EE',
                            color: paymentMethod === 'qris' ? '#ffffff' : '#6f4e37',
                            fontFamily: 'var(--font-pixel)',
                            fontSize: '11px',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          E-Wallet / QRIS
                        </button>
                        <button
                          onClick={() => setPaymentMethod('bank')}
                          style={{
                            flex: 1,
                            padding: '0.4rem',
                            border: 'none',
                            borderLeft: '2px solid #6f4e37',
                            background: paymentMethod === 'bank' ? '#6f4e37' : '#FAF6EE',
                            color: paymentMethod === 'bank' ? '#ffffff' : '#6f4e37',
                            fontFamily: 'var(--font-pixel)',
                            fontSize: '11px',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          Transfer Bank
                        </button>
                      </div>

                      {/* Payment Detail Display */}
                      <div style={{
                        background: '#ffffff',
                        border: '2px solid #6f4e37',
                        borderRadius: '8px',
                        padding: '0.75rem',
                        textAlign: 'center',
                      }}>
                        {paymentMethod === 'qris' ? (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
                            <img 
                              src={danaQr} 
                              alt="DANA QR Code" 
                              style={{ 
                                width: '130px', 
                                height: '130px', 
                                display: 'block', 
                                margin: '0 auto',
                                border: '2px solid #6f4e37',
                                borderRadius: '8px',
                                imageRendering: 'pixelated'
                              }} 
                            />
                            <p style={{ fontFamily: 'var(--font-pixel)', fontSize: '9px', color: '#6f4e37', margin: '0.15rem 0 0' }}>
                              [ QR DANA ]
                            </p>
                            <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--color-text-muted)', margin: 0 }}>
                              Scan QR dengan aplikasi DANA Anda untuk mengirim dukungan langsung.
                            </p>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
                            {/* BSI */}
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}>
                              <div>
                                <strong style={{ fontSize: '12px', color: 'var(--color-text)' }}>Bank Syariah Indonesia (BSI)</strong>
                                <div style={{ fontSize: '13px', fontFamily: 'monospace', color: '#6f4e37', fontWeight: 600, marginTop: '2px' }}>
                                  7242891036
                                </div>
                                <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginTop: '2px' }}>a.n. Adam Abdurrahman</div>
                              </div>
                              <button
                                onClick={() => handleCopy('7242891036')}
                                style={{
                                  padding: '4px 10px',
                                  fontSize: '10px',
                                  fontFamily: 'var(--font-pixel)',
                                  background: copiedBsi ? '#3a5c3a' : '#FAF6EE',
                                  color: copiedBsi ? '#ffffff' : '#6f4e37',
                                  border: `2px solid ${copiedBsi ? '#3a5c3a' : '#6f4e37'}`,
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                }}
                              >
                                {copiedBsi ? 'Tersalin' : 'Salin'}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Step 3: Confirm Button */}
                    <button
                      onClick={handleConfirm}
                      style={{
                        padding: '0.7rem 0.85rem',
                        background: 'linear-gradient(135deg, #6f4e37, #8a6245)',
                        color: '#ffffff',
                        border: '2px solid #6f4e37',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-pixel)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        boxShadow: '0 6px 18px rgba(111, 78, 55, 0.35)',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(111, 78, 55, 0.5)';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.boxShadow = '0 6px 18px rgba(111, 78, 55, 0.35)';
                        e.currentTarget.style.transform = 'none';
                      }}
                    >
                      <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', width: '100%' }}>
                        <span>Konfirmasi Transfer</span>
                        <div style={{ display: 'inline-flex', gap: '2px', alignItems: 'center' }}>
                          {Array.from({ length: Math.min(selectedCoffee, 3) }).map((_, idx) => (
                            <PixelCoffeeIcon key={idx} size={14} inverted={true} />
                          ))}
                          {selectedCoffee > 3 && <span style={{ fontSize: '10px', fontWeight: 'bold' }}>+</span>}
                        </div>
                      </div>
                    </button>
                  </div>
                </>
              )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
