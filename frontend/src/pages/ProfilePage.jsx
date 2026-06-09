import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { getHistory } from '../services/testsService';
import PageWrapper from '../components/layout/PageWrapper';

const ELEMENT_DATA = {
  API:   { emoji: '🔥', name: 'Api',   color: 'var(--color-api)',   light: 'var(--color-api-light)'   },
  AIR:   { emoji: '💧', name: 'Air',   color: 'var(--color-air)',   light: 'var(--color-air-light)'   },
  ANGIN: { emoji: '🌬', name: 'Angin', color: 'var(--color-angin)', light: 'var(--color-angin-light)' },
  TANAH: { emoji: '🌿', name: 'Tanah', color: 'var(--color-tanah)', light: 'var(--color-tanah-light)' },
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] },
});

export default function ProfilePage() {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) { navigate('/auth'); return; }

    getHistory()
      .then(setHistory)
      .catch(() => setHistory([]))
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
      <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(2rem, 5vw, 4rem) 1.5rem' }}>

        {/* ── Profile Header ── */}
        <motion.div {...fadeUp(0)} style={{
          background: 'var(--color-text)',
          borderRadius: 'var(--radius-2xl)',
          padding: 'clamp(2rem, 5vw, 3rem)',
          marginBottom: '1.5rem',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Glow based on last persona */}
          {lastEl && (
            <div style={{
              position: 'absolute', top: '-30%', right: '-10%', width: '50%', paddingBottom: '50%',
              background: `radial-gradient(circle, ${lastEl.color}25 0%, transparent 70%)`,
              pointerEvents: 'none',
            }} />
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            {/* Avatar */}
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: lastEl?.light || 'var(--color-accent-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.75rem', flexShrink: 0,
              border: `2px solid ${lastEl?.color || 'var(--color-accent)'}40`,
            }}>
              {lastEl?.emoji || '👤'}
            </div>

            <div style={{ flex: 1 }}>
              <h1 style={{
                fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)',
                fontWeight: 500, color: '#fff', marginBottom: '0.25rem',
              }}>
                {user.name}
              </h1>
              <p style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.5)' }}>{user.email}</p>
              {user.isAdmin && (
                <span style={{
                  display: 'inline-block', marginTop: '0.375rem',
                  padding: '0.2rem 0.6rem', background: 'var(--color-accent)',
                  color: '#fff', borderRadius: 'var(--radius-full)',
                  fontSize: 'var(--text-xs)', fontWeight: 600,
                }}>
                  Admin
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
              {user.isAdmin && (
                <Link to="/admin" style={{
                  padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.1)',
                  color: '#fff', borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-xs)', fontWeight: 600,
                  letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase',
                  textDecoration: 'none', border: '1px solid rgba(255,255,255,0.15)',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                >
                  Dashboard Admin →
                </Link>
              )}
              <button onClick={handleLogout} style={{
                padding: '0.5rem 1rem', background: 'transparent',
                color: 'rgba(255,255,255,0.5)', borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-xs)', fontWeight: 600,
                letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase',
                cursor: 'pointer', border: '1px solid rgba(255,255,255,0.15)',
                fontFamily: 'var(--font-body)', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
              >
                Keluar
              </button>
            </div>
          </div>

          {/* Persona summary jika sudah pernah tes */}
          {lastEl && (
            <div style={{
              marginTop: '1.5rem', paddingTop: '1.5rem',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap',
            }}>
              <span style={{ fontSize: '1.25rem' }}>{lastEl.emoji}</span>
              <div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.4)', marginBottom: '0.125rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
                  Persona Terakhir
                </p>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', color: lastEl.color, fontWeight: 500 }}>
                  {lastEl.name}
                  {lastTest.personaSekunder && ELEMENT_DATA[lastTest.personaSekunder] && (
                    <span style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.4)', marginLeft: '0.5rem' }}>
                      + {ELEMENT_DATA[lastTest.personaSekunder].name}
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* ── CTA Tes ── */}
        <motion.div {...fadeUp(0.1)} style={{
          background: '#fff', border: '1px solid var(--color-border)',
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
                const el = ELEMENT_DATA[test.personaPrimer];
                const elSek = ELEMENT_DATA[test.personaSekunder];
                const isExpired = new Date() > new Date(test.reportTokenExp);
                const date = new Date(test.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

                return (
                  <motion.div
                    key={test.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    style={{
                      background: '#fff', border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-xl)', padding: '1.25rem 1.5rem',
                      boxShadow: 'var(--shadow-card)',
                      display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap',
                    }}
                  >
                    <div style={{
                      width: 44, height: 44, borderRadius: '50%', background: el.light,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.25rem', flexShrink: 0, border: `1.5px solid ${el.color}30`,
                    }}>
                      {el.emoji}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', fontWeight: 500, color: el.color }}>
                          {el.name}
                        </span>
                        {elSek && (
                          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)', padding: '0.125rem 0.5rem', background: elSek.light, borderRadius: 'var(--radius-full)' }}>
                            + {elSek.name}
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)' }}>{date}</p>
                    </div>

                    {!isExpired ? (
                      <Link to={`/report/${test.reportToken}`} style={{
                        padding: '0.375rem 0.875rem', fontSize: 'var(--text-xs)', fontWeight: 600,
                        color: 'var(--color-text)', border: '1.5px solid var(--color-border-md)',
                        borderRadius: 'var(--radius-md)', textDecoration: 'none',
                        letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-text)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border-md)'; }}
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
              })}
            </div>
          )}
        </motion.div>
      </div>
    </PageWrapper>
  );
}
