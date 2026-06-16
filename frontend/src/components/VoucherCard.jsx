import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * VoucherCard — Kartu voucher Shopee di ProfilePage
 * Menampilkan kode voucher (masked/revealed), countdown expiry, copy, redirect Shopee
 */
export default function VoucherCard({ voucher }) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');

  const isExpired = voucher.isExpired;

  // Countdown timer
  useEffect(() => {
    if (isExpired) { setTimeLeft('Expired'); return; }

    const tick = () => {
      const now = Date.now();
      const end = new Date(voucher.expiresAt).getTime();
      const diff = end - now;
      if (diff <= 0) { setTimeLeft('Expired'); return; }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);

      if (days > 0) setTimeLeft(`${days} hari ${hours} jam lagi`);
      else if (hours > 0) setTimeLeft(`${hours} jam ${minutes} menit lagi`);
      else setTimeLeft(`${minutes} menit lagi`);
    };

    tick();
    const interval = setInterval(tick, 60000);
    return () => clearInterval(interval);
  }, [voucher.expiresAt, isExpired]);

  // Mask voucher code
  const code = voucher.voucherCode || '';
  const masked = code.length > 4
    ? code.slice(0, 3) + '•'.repeat(Math.max(1, code.length - 5)) + code.slice(-2)
    : '•••••';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShopee = () => {
    const url = voucher.shopeeUrl || 'https://shopee.co.id/vundiego';
    // On mobile, try deep link first
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
      // Extract item ID from URL for deep link
      const urlObj = new URL(url);
      const itemId = urlObj.searchParams.get('itemId');
      if (itemId) {
        // Try Shopee deep link
        const deepLink = `shopeeid://product/${itemId}`;
        const fallback = url;
        const start = Date.now();
        window.location.href = deepLink;
        // If app doesn't open within 1.5s, fallback to browser
        setTimeout(() => {
          if (Date.now() - start < 2000) {
            window.open(fallback, '_blank');
          }
        }, 1500);
        return;
      }
    }
    window.open(url, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: isExpired
          ? 'linear-gradient(135deg, #f5f0e8, #ebe5db)'
          : 'linear-gradient(135deg, #faf6ee, #f2e8d0)',
        border: isExpired
          ? '1.5px solid rgba(28,27,25,0.12)'
          : '1.5px solid rgba(201,169,110,0.35)',
        borderRadius: 'var(--radius-2xl)',
        padding: 'clamp(1.5rem, 4vw, 2rem)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: isExpired
          ? 'var(--shadow-card)'
          : '0 8px 32px rgba(201,169,110,0.15)',
      }}
    >
      {/* Decorative corner pattern */}
      <div style={{
        position: 'absolute',
        top: -20,
        right: -20,
        width: 120,
        height: 120,
        background: isExpired
          ? 'radial-gradient(circle, rgba(200,200,200,0.15) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(201,169,110,0.2) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* EXPIRED stamp overlay */}
      {isExpired && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotate(-12deg)',
          padding: '0.5rem 2rem',
          border: '3px solid rgba(184, 50, 50, 0.6)',
          borderRadius: 'var(--radius-md)',
          color: 'rgba(184, 50, 50, 0.6)',
          fontSize: 'clamp(1.5rem, 4vw, 2rem)',
          fontWeight: 800,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          pointerEvents: 'none',
          zIndex: 5,
        }}>
          EXPIRED
        </div>
      )}

      {/* Top row: badge + expiry */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
        flexWrap: 'wrap',
        gap: '0.5rem',
        opacity: isExpired ? 0.5 : 1,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <span style={{ fontSize: '1.25rem' }}>🎁</span>
          <span style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            letterSpacing: 'var(--tracking-wider)',
            textTransform: 'uppercase',
            color: isExpired ? 'var(--color-text-light)' : 'var(--color-accent)',
          }}>
            Voucher Shopee
          </span>
        </div>

        <span style={{
          fontSize: 'var(--text-xs)',
          color: isExpired ? 'var(--color-api)' : 'var(--color-text-muted)',
          fontWeight: isExpired ? 600 : 400,
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
        }}>
          {isExpired ? '⏰ Masa berlaku habis' : `⏳ ${timeLeft}`}
        </span>
      </div>

      {/* Discount label */}
      <p style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'var(--text-xl)',
        fontWeight: 500,
        color: isExpired ? 'var(--color-text-light)' : 'var(--color-text)',
        marginBottom: '0.25rem',
        opacity: isExpired ? 0.5 : 1,
      }}>
        {voucher.discountLabel || 'Potongan Rp4.000'}
      </p>

      <p style={{
        fontSize: 'var(--text-xs)',
        color: 'var(--color-text-muted)',
        marginBottom: '1rem',
        opacity: isExpired ? 0.4 : 0.8,
      }}>
        Berlaku untuk produk <strong>SOUL PERSONALITY</strong> Vun Diego
      </p>

      {/* Voucher Code */}
      <div style={{
        background: isExpired ? 'rgba(200,200,200,0.15)' : 'rgba(255,255,255,0.7)',
        border: `1px dashed ${isExpired ? 'rgba(28,27,25,0.1)' : 'var(--color-accent)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: '0.75rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem',
        gap: '0.75rem',
        opacity: isExpired ? 0.5 : 1,
      }}>
        <div>
          <p style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-light)',
            marginBottom: '0.25rem',
            letterSpacing: '0.05em',
          }}>
            Kode Voucher
          </p>
          <p style={{
            fontFamily: 'monospace',
            fontSize: 'clamp(1rem, 3vw, 1.25rem)',
            fontWeight: 700,
            color: 'var(--color-text)',
            letterSpacing: '0.15em',
          }}>
            {revealed ? code : masked}
          </p>
        </div>
        {!isExpired && (
          <button
            onClick={() => setRevealed(!revealed)}
            style={{
              padding: '0.375rem 0.75rem',
              fontSize: 'var(--text-xs)',
              color: 'var(--color-accent)',
              background: 'transparent',
              border: '1px solid var(--color-accent)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              transition: 'all 0.15s',
            }}
          >
            {revealed ? '🔒 Sembunyikan' : '👁 Tampilkan'}
          </button>
        )}
      </div>

      {/* Action buttons */}
      {!isExpired && (
        <div style={{
          display: 'flex',
          gap: '0.625rem',
          flexWrap: 'wrap',
        }}>
          <button
            onClick={handleCopy}
            style={{
              flex: 1,
              minWidth: 140,
              padding: '0.75rem 1rem',
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              letterSpacing: 'var(--tracking-wide)',
              textTransform: 'uppercase',
              color: copied ? '#fff' : 'var(--color-text)',
              background: copied ? '#22c55e' : '#fff',
              border: copied ? '1.5px solid #22c55e' : '1.5px solid var(--color-border-md)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s',
            }}
          >
            {copied ? '✓ Berhasil Disalin' : '📋 Salin Kode'}
          </button>

          <button
            onClick={handleShopee}
            style={{
              flex: 1,
              minWidth: 140,
              padding: '0.75rem 1rem',
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              letterSpacing: 'var(--tracking-wide)',
              textTransform: 'uppercase',
              color: '#fff',
              background: 'linear-gradient(135deg, #ee4d2d, #d63a1f)',
              border: '1.5px solid #ee4d2d',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(238, 77, 45, 0.25)',
            }}
          >
            🛒 Pakai di Shopee
          </button>
        </div>
      )}
    </motion.div>
  );
}
