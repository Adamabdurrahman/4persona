import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { getHistory } from '../services/testsService';
import { getMyVoucher } from '../services/voucherService';
import PageWrapper from '../components/layout/PageWrapper';
import VoucherCard from '../components/VoucherCard';
import { ELEMENT_DATA, PixelIcon } from '../data/elementData';
import WireframeBackground from '../components/WireframeBackground';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] },
});

const getPixelSize = (elementKey, baseSize) => {
  return baseSize;
};

/* ── Sub-component for individual history card to manage its own hover state ── */
function HistoryCard({ test, index, date }) {
  const [hovered, setHovered] = useState(false);
  const el = ELEMENT_DATA[test.personaPrimer];
  const elSek = ELEMENT_DATA[test.personaSekunder];
  const isExpired = new Date() > new Date(test.reportTokenExp);

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? el.light : '#fff',
        border: `1.5px solid ${hovered ? el.color + '60' : 'rgba(28, 27, 25, 0.22)'}`,
        borderRadius: 'var(--radius-xl)',
        padding: '1.25rem 1.5rem',
        boxShadow: hovered ? `0 12px 36px ${el.color}15` : 'var(--shadow-card)',
        transform: hovered ? 'translateY(-2px)' : 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        flexWrap: 'wrap',
        transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      <div style={{
        width: 72,
        height: 72,
        borderRadius: '50%',
        background: hovered ? '#fff' : el.light,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        border: `1.5px solid ${hovered ? el.color : el.color + '50'}`,
        overflow: 'hidden',
        transition: 'all 0.3s',
      }}>
        <PixelIcon src={el.pixelSrc} alt={el.name} size={getPixelSize(test.personaPrimer, 40)} />
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-base)',
            fontWeight: 500,
            color: hovered ? el.color : 'var(--color-text)',
            transition: 'color 0.3s',
          }}>
            {el.name}
          </span>
          {elSek && (
            <span style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              color: elSek.color,
              padding: '0.125rem 0.5rem',
              background: hovered ? '#fff' : elSek.light,
              borderRadius: 'var(--radius-full)',
              border: `1px solid ${elSek.color}20`,
              transition: 'all 0.3s',
            }}>
              + {elSek.name}
            </span>
          )}
        </div>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)' }}>{date}</p>
      </div>

      {!isExpired ? (
        <Link to={`/report/${test.reportToken}`} style={{
          padding: '0.375rem 0.875rem',
          fontSize: 'var(--text-xs)',
          fontWeight: 600,
          color: hovered ? '#fff' : 'var(--color-text)',
          background: hovered ? el.color : 'transparent',
          border: hovered ? `1.5px solid ${el.color}` : '1.5px solid var(--color-border-md)',
          borderRadius: 'var(--radius-md)',
          textDecoration: 'none',
          letterSpacing: 'var(--tracking-wide)',
          textTransform: 'uppercase',
          transition: 'all 0.2s',
        }}
        >
          Laporan →
        </Link>
      ) : (
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)', fontStyle: 'italic' }}>
          Kadaluarsa
        </span>
      )}
    </motion.div>
  );
}

export default function ProfilePage() {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [voucher, setVoucher] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) { navigate('/auth'); return; }

    Promise.all([
      getHistory().catch(() => []),
      getMyVoucher().catch(() => null),
    ])
      .then(([hist, vch]) => {
        setHistory(hist);
        setVoucher(vch);
      })
      .finally(() => setLoading(false));
  }, [isLoggedIn, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  const lastTest = history[0];
  const lastEl = lastTest ? ELEMENT_DATA[lastTest.personaPrimer] : null;

  return (
    <PageWrapper>
      {/* Wireframe 3D background — selalu tampil, ikuti warna persona terakhir */}
      <WireframeBackground
        elementKey={lastTest?.personaPrimer || 'accent'}
        opacity={0.20}
      />
      <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(2rem, 5vw, 4rem) 1.5rem' }}>

        {/* ── Profile Header ── */}
        <motion.div {...fadeUp(0)} style={{
          background: '#ebdcb9',
          border: `1.5px solid rgba(28, 27, 25, 0.25)`,
          borderRadius: 'var(--radius-2xl)',
          padding: 'clamp(2rem, 5vw, 3rem)',
          marginBottom: '1.5rem',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: lastEl 
            ? `0 20px 48px ${lastEl.color}15`
            : 'var(--shadow-card)',
        }}>
          {/* Glow based on last persona */}
          {lastEl && (
            <div style={{
              position: 'absolute', top: '-30%', right: '-10%', width: '55%', paddingBottom: '55%',
              background: `radial-gradient(circle, ${lastEl.color}25 0%, transparent 70%)`,
              pointerEvents: 'none',
            }} />
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            {/* Avatar */}
            <div style={{
              width: 104, height: 104, borderRadius: '50%',
              background: lastEl?.light || 'var(--color-accent-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, overflow: 'hidden',
              border: `2.5px solid ${lastEl?.color || 'var(--color-accent)'}`,
            }}>
              {lastEl
                ? <PixelIcon src={lastEl.pixelSrc} alt={lastEl.name} size={getPixelSize(lastTest.personaPrimer, 56)} />
                : <span style={{ fontSize: '2.5rem' }}>👤</span>
              }
            </div>

            <div style={{ flex: 1 }}>
              <h1 style={{
                fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)',
                fontWeight: 500, color: 'var(--color-text)', marginBottom: '0.25rem',
              }}>
                {user.name}
              </h1>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>{user.email}</p>
              {user.isAdmin && (
                <span style={{
                  display: 'inline-block', marginTop: '0.375rem',
                  padding: '0.2rem 0.6rem', background: 'var(--color-text)',
                  color: 'var(--color-text-inv)', borderRadius: 'var(--radius-full)',
                  fontSize: 'var(--text-xs)', fontWeight: 600,
                }}>
                  Admin
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
              {user.isAdmin && (
                <Link to="/admin" style={{
                  padding: '0.5rem 1rem', background: 'var(--color-text)',
                  color: 'var(--color-text-inv)', borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-xs)', fontWeight: 600,
                  letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase',
                  textDecoration: 'none', transition: 'opacity 0.2s',
                  boxShadow: 'var(--shadow-sm)',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  Dashboard Admin →
                </Link>
              )}
              <button onClick={handleLogout} style={{
                padding: '0.5rem 1.25rem', background: 'transparent',
                color: 'var(--color-api)', borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-xs)', fontWeight: 600,
                letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase',
                cursor: 'pointer', border: '1.5px solid var(--color-api)',
                fontFamily: 'var(--font-body)', transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.background = 'var(--color-api)';
                e.currentTarget.style.borderColor = 'var(--color-api)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(184, 50, 50, 0.2)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = 'var(--color-api)';
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(184, 50, 50, 0.4)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                Keluar
              </button>
            </div>
          </div>

          {/* Persona summary jika sudah pernah tes */}
          {lastEl && (
            <div style={{
              marginTop: '1.5rem', paddingTop: '1.5rem',
              borderTop: '1.5px solid rgba(28, 27, 25, 0.2)',
              display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap',
            }}>
              <div style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: lastEl.light,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                border: `1.5px solid ${lastEl.color}40`,
                overflow: 'hidden',
              }}>
                <PixelIcon src={lastEl.pixelSrc} alt={lastEl.name} size={getPixelSize(lastTest.personaPrimer, 32)} />
              </div>
              <div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: '0.125rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
                  Persona Terakhir
                </p>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  flexWrap: 'wrap',
                  marginTop: '0.25rem',
                }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', color: lastEl.color, fontWeight: 500 }}>
                    {lastEl.name}
                  </span>
                  {lastTest.personaSekunder && ELEMENT_DATA[lastTest.personaSekunder] && (() => {
                    const elSek = ELEMENT_DATA[lastTest.personaSekunder];
                    return (
                      <span style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 600,
                        color: elSek.color,
                        padding: '0.125rem 0.5rem',
                        background: elSek.light,
                        borderRadius: 'var(--radius-full)',
                        border: `1px solid ${elSek.color}20`,
                        display: 'inline-flex',
                        alignItems: 'center',
                      }}>
                        + {elSek.name}
                      </span>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* ── CTA Tes ── */}
        <motion.div {...fadeUp(0.1)} style={{
          background: '#fff', border: '1.5px solid rgba(28, 27, 25, 0.22)',
          borderRadius: 'var(--radius-2xl)', padding: '1.5rem',
          marginBottom: '1.5rem', boxShadow: 'var(--shadow-card)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
        }}>
          <div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 500, color: 'var(--color-text)', marginBottom: '0.25rem' }}>
              {history.length === 0 ? 'Mulai Tes Pertamamu' : 'Ulangi Tes'}
            </p>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
              {history.length === 0 ? '24 soal kepribadian · 5 menit · Gratis' : `Sudah ${history.length}x tes. Kepribadian bisa berubah!`}
            </p>
          </div>
          <Link to="/test" style={{
            padding: '0.75rem 1.75rem', background: 'var(--color-text)', color: '#fff',
            borderRadius: 'var(--radius-md)', fontWeight: 500, fontSize: 'var(--text-sm)',
            letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase',
            textDecoration: 'none', transition: 'opacity 0.2s', boxShadow: 'var(--shadow-sm)',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            {history.length === 0 ? 'Mulai Tes →' : 'Tes Ulang →'}
          </Link>
        </motion.div>

        {/* ── Voucher Card (jika ada) ── */}
        {voucher && (
          <motion.div {...fadeUp(0.15)} style={{ marginBottom: '1.5rem' }}>
            <VoucherCard voucher={voucher} />
          </motion.div>
        )}

        {/* ── Riwayat Tes ── */}
        <motion.div {...fadeUp(0.2)}>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)',
            fontWeight: 500, color: 'var(--color-text)', marginBottom: '1rem',
          }}>
            Riwayat Tes
          </h2>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[1, 2].map(i => (
                <div key={i} className="skeleton" style={{ height: 80, borderRadius: 'var(--radius-xl)' }} />
              ))}
            </div>
          ) : history.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '3rem 1.5rem',
              background: 'var(--color-surface)', borderRadius: 'var(--radius-2xl)',
              border: '1px dashed var(--color-border-md)',
            }}>
              <p style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📋</p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', color: 'var(--color-text)', marginBottom: '0.5rem' }}>
                Belum ada riwayat tes
              </p>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                Ikuti tes untuk melihat hasil kepribadianmu di sini
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {history.map((test, i) => {
                const date = new Date(test.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
                return (
                  <HistoryCard
                    key={test.id}
                    test={test}
                    index={i}
                    date={date}
                  />
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </PageWrapper>
  );
}
