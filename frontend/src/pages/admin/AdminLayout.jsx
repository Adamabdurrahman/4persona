import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: '📊', exact: true },
  { to: '/admin/questions', label: 'Bank Soal', icon: '❓' },
  { to: '/admin/results', label: 'Hasil Tes', icon: '📋' },
  { to: '/admin/templates', label: 'Template Laporan', icon: '📄' },
];

function SidebarContent({ user, location, onClose }) {
  return (
    <div style={{ width: 240, background: 'var(--color-text)', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '1.75rem 1.5rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 500, color: '#fff', letterSpacing: '0.05em' }}>Vundiego</p>
          <p style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.35)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase', marginTop: '0.25rem' }}>Admin Panel</p>
        </div>
        {onClose && (
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 'var(--radius-md)', color: '#fff', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, minHeight: 'unset' }}>
            ✕
          </button>
        )}
      </div>

      <nav style={{ flex: 1, padding: '1rem 0.75rem' }}>
        {NAV_ITEMS.map(item => {
          const isActive = item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onClose}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.625rem 0.875rem', borderRadius: 'var(--radius-lg)',
                textDecoration: 'none', marginBottom: '0.25rem',
                background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
                fontSize: 'var(--text-sm)', fontWeight: isActive ? 500 : 400,
                transition: 'all 0.15s',
                borderLeft: isActive ? '2px solid var(--color-accent)' : '2px solid transparent',
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <p style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.35)', marginBottom: '0.25rem' }}>Masuk sebagai</p>
        <p style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.7)', fontWeight: 500, marginBottom: '0.75rem' }}>{user.name}</p>
        <Link to="/" onClick={onClose}
          style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.35)', textDecoration: 'none', letterSpacing: 'var(--tracking-wide)', transition: 'color 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.65)'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
        >
          ← Kembali ke Situs
        </Link>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const { user, isLoggedIn, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (!loading && (!isLoggedIn || !user?.isAdmin)) {
    navigate('/', { replace: true });
    return null;
  }
  if (loading || !user?.isAdmin) return null;

  const currentPage = NAV_ITEMS.find(n => n.exact ? location.pathname === n.to : location.pathname.startsWith(n.to));

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar { display: none !important; }
          .admin-topbar  { display: flex !important; }
          .admin-topbar-spacer { display: block !important; }
        }
        @media (min-width: 769px) {
          .admin-topbar { display: none !important; }
          .admin-topbar-spacer { display: none !important; }
        }
      `}</style>

      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg)' }}>
        {/* Desktop Sidebar */}
        <aside className="admin-sidebar" style={{ width: 240, flexShrink: 0, position: 'sticky', top: 0, height: '100vh' }}>
          <SidebarContent user={user} location={location} onClose={null} />
        </aside>

        {/* Mobile Top Bar */}
        <div className="admin-topbar" style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 56, background: 'var(--color-text)', display: 'none', alignItems: 'center', justifyContent: 'space-between', padding: '0 1rem', zIndex: 100, boxShadow: '0 2px 12px rgba(0,0,0,0.2)' }}>
          <button onClick={() => setDrawerOpen(true)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 'var(--radius-md)', color: '#fff', width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, minHeight: 'unset' }}>☰</button>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', color: '#fff', fontWeight: 500 }}>
            {currentPage?.icon} {currentPage?.label || 'Admin'}
          </p>
          <div style={{ width: 36 }} />
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {drawerOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setDrawerOpen(false)}
                style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 150 }}
              />
              <motion.div
                initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: 240, zIndex: 200, boxShadow: '4px 0 24px rgba(0,0,0,0.3)' }}
              >
                <SidebarContent user={user} location={location} onClose={() => setDrawerOpen(false)} />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main style={{ flex: 1, overflowX: 'hidden', overflowY: 'auto' }}>
          <div className="admin-topbar-spacer" style={{ height: 56, display: 'none' }} />
          <Outlet />
        </main>
      </div>
    </>
  );
}
