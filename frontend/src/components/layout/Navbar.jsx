import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Navbar — Header utama website
 * Fitur: scroll-aware background, mobile menu, user avatar dropdown
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Tutup mobile menu saat navigasi
  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: '/', label: 'Beranda' },
    { to: '/test', label: 'Mulai Tes' },
  ];

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <>
      <motion.header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: 'var(--navbar-height)',
          display: 'flex',
          alignItems: 'center',
          transition: 'background 0.3s, box-shadow 0.3s',
          background: scrolled ? 'rgba(248, 246, 242, 0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
          boxShadow: scrolled ? '0 1px 20px rgba(0,0,0,0.06)' : 'none',
          borderBottom: scrolled ? '1px solid var(--color-border)' : '1px solid transparent',
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Link
            to="/"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-xl)',
              fontWeight: 500,
              letterSpacing: '0.08em',
              color: 'var(--color-text)',
              textDecoration: 'none',
            }}
          >
            Vun Diego
          </Link>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }}>
            {/* Links */}
            <div style={{ display: 'flex', gap: 'var(--space-6)' }} className="desktop-nav">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: 500,
                    letterSpacing: 'var(--tracking-wide)',
                    color: isActive(to) ? 'var(--color-text)' : 'var(--color-text-muted)',
                    textDecoration: 'none',
                    textTransform: 'uppercase',
                    transition: 'color var(--duration-fast)',
                    position: 'relative',
                    paddingBottom: '2px',
                  }}
                >
                  {label}
                  {isActive(to) && (
                    <motion.span
                      layoutId="nav-underline"
                      style={{
                        position: 'absolute',
                        bottom: -2,
                        left: 0,
                        right: 0,
                        height: '1.5px',
                        background: 'var(--color-accent)',
                        borderRadius: 'var(--radius-full)',
                      }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Auth Area */}
            {user ? (
              /* User Avatar */
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setDropdownOpen(o => !o)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: 'var(--color-accent-light)',
                    border: '2px solid var(--color-accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 600,
                    color: 'var(--color-accent-dark)',
                    cursor: 'pointer',
                    transition: 'transform var(--duration-fast)',
                  }}
                >
                  {user.name?.[0]?.toUpperCase() || 'U'}
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 0.5rem)',
                        right: 0,
                        background: '#fff',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: 'var(--shadow-lg)',
                        minWidth: 180,
                        overflow: 'hidden',
                        zIndex: 200,
                      }}
                    >
                      <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--color-border)' }}>
                        <p style={{ fontWeight: 500, fontSize: 'var(--text-sm)' }}>{user.name}</p>
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{user.email}</p>
                      </div>
                      <DropdownItem to="/profile" label="Profil & Riwayat" />
                      {user.isAdmin && <DropdownItem to="/admin" label="Admin Dashboard" />}
                      <button
                        onClick={() => { logout(); navigate('/'); }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '0.625rem 1rem',
                          fontSize: 'var(--text-sm)',
                          color: 'var(--color-api)',
                          cursor: 'pointer',
                          transition: 'background var(--duration-fast)',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--color-api-light)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        Keluar
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Login Button */
              <Link
                to="/auth"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.5rem 1.25rem',
                  background: 'var(--color-text)',
                  color: 'var(--color-text-inv)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 500,
                  letterSpacing: 'var(--tracking-wide)',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  transition: 'opacity var(--duration-fast)',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                Masuk
              </Link>
            )}

            {/* Hamburger (mobile) */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="hamburger"
              aria-label="Toggle menu"
              style={{
                display: 'none',
                flexDirection: 'column',
                gap: '5px',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              {[0, 1, 2].map(i => (
                <motion.span
                  key={i}
                  style={{
                    display: 'block',
                    width: 22,
                    height: 1.5,
                    background: 'var(--color-text)',
                    borderRadius: '2px',
                    transformOrigin: 'center',
                  }}
                  animate={
                    menuOpen
                      ? i === 0 ? { rotate: 45, y: 6.5 }
                      : i === 1 ? { opacity: 0 }
                      : { rotate: -45, y: -6.5 }
                      : { rotate: 0, y: 0, opacity: 1 }
                  }
                  transition={{ duration: 0.2 }}
                />
              ))}
            </button>
          </nav>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'fixed',
              top: 'var(--navbar-height)',
              left: 0,
              right: 0,
              zIndex: 99,
              background: 'rgba(248, 246, 242, 0.97)',
              backdropFilter: 'blur(12px)',
              borderBottom: '1px solid var(--color-border)',
              overflow: 'hidden',
            }}
          >
            <div className="container" style={{ padding: '1.5rem 1.5rem' }}>
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  style={{
                    display: 'block',
                    padding: '0.75rem 0',
                    fontSize: 'var(--text-base)',
                    fontWeight: 500,
                    color: isActive(to) ? 'var(--color-accent)' : 'var(--color-text)',
                    borderBottom: '1px solid var(--color-border)',
                    textDecoration: 'none',
                  }}
                >
                  {label}
                </Link>
              ))}
              {!user && (
                <Link
                  to="/auth"
                  style={{
                    display: 'block',
                    padding: '0.75rem 0',
                    fontSize: 'var(--text-base)',
                    fontWeight: 500,
                    color: 'var(--color-accent)',
                    textDecoration: 'none',
                  }}
                >
                  Masuk / Daftar
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
}

function DropdownItem({ to, label }) {
  return (
    <Link
      to={to}
      style={{
        display: 'block',
        padding: '0.625rem 1rem',
        fontSize: 'var(--text-sm)',
        color: 'var(--color-text)',
        textDecoration: 'none',
        transition: 'background var(--duration-fast)',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--color-surface)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      {label}
    </Link>
  );
}
