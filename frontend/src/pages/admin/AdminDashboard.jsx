import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAdminStats } from '../../services/adminService';

const ELEMENT_DATA = {
  API:   { emoji: '🔥', name: 'Api',   color: 'var(--color-api)'   },
  AIR:   { emoji: '💧', name: 'Air',   color: 'var(--color-air)'   },
  ANGIN: { emoji: '🌬', name: 'Angin', color: 'var(--color-angin)' },
  TANAH: { emoji: '🌿', name: 'Tanah', color: 'var(--color-tanah)' },
};

function StatCard({ icon, label, value, color, loading }) {
  return (
    <div style={{
      background: '#fff', border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-xl)', padding: '1.5rem',
      boxShadow: 'var(--shadow-card)',
    }}>
      {loading ? (
        <>
          <div className="skeleton" style={{ height: 36, width: '60%', marginBottom: '0.5rem' }} />
          <div className="skeleton" style={{ height: 14, width: '80%' }} />
        </>
      ) : (
        <>
          <p style={{ fontSize: 'var(--text-3xl)', fontFamily: 'var(--font-display)', fontWeight: 600, color: color || 'var(--color-text)', lineHeight: 1, marginBottom: '0.375rem' }}>
            {typeof value === 'number' ? value.toLocaleString('id-ID') : value}
          </p>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 600, letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase' }}>
            {icon} {label}
          </p>
        </>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats().then(setStats).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: '2.5rem 2rem' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 500, color: 'var(--color-text)' }}>
          Dashboard
        </h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
          Ringkasan performa 4Persona Vundiego
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { icon: '👤', label: 'Total Pengguna', value: stats?.totalUsers, key: 'users' },
          { icon: '📝', label: 'Total Tes', value: stats?.totalTests, key: 'tests' },
          { icon: '❓', label: 'Soal Aktif', value: stats?.totalQuestions, key: 'questions' },
          { icon: '🛒', label: 'Parfum Terjual', value: stats?.totalSales, key: 'sales' },
          { icon: '👁', label: 'Total Pengunjung', value: stats?.totalVisitors, key: 'visitors' },
        ].map(({ icon, label, value, key }) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * ['users','tests','questions','sales','visitors'].indexOf(key) }}
          >
            <StatCard icon={icon} label={label} value={value} loading={loading} />
          </motion.div>
        ))}
      </div>

      {/* Element Breakdown */}
      {!loading && stats?.elementBreakdown?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            background: '#fff', border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)', padding: '1.75rem',
            boxShadow: 'var(--shadow-card)', marginBottom: '2rem',
          }}
        >
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 500, color: 'var(--color-text)', marginBottom: '1.25rem' }}>
            Distribusi Persona
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {stats.elementBreakdown.map(({ element, count, percentage }) => {
              const el = ELEMENT_DATA[element];
              if (!el) return null;
              return (
                <div key={element}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-text)' }}>
                      {el.emoji} {el.name}
                    </span>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', fontVariantNumeric: 'tabular-nums' }}>
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div style={{ height: 6, background: 'var(--color-surface)', borderRadius: 3 }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
                      style={{ height: '100%', background: el.color, borderRadius: 3 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Recent Tests */}
      {!loading && stats?.recentTests?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            background: '#fff', border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)', padding: '1.75rem',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 500, color: 'var(--color-text)' }}>
              Tes Terbaru
            </h2>
            <Link to="/admin/results" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 600, letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase' }}>
              Lihat semua →
            </Link>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  {['Pengguna', 'Persona', 'Sumber', 'Tanggal'].map(h => (
                    <th key={h} style={{ padding: '0.5rem 0.75rem', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.recentTests.map((t, i) => {
                  const el = ELEMENT_DATA[t.personaPrimer];
                  return (
                    <tr key={t.id} style={{ borderBottom: '1px solid var(--color-surface)', background: i % 2 === 0 ? 'transparent' : 'var(--color-surface)' }}>
                      <td style={{ padding: '0.625rem 0.75rem', color: 'var(--color-text)' }}>
                        <div>{t.user?.name || '—'}</div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{t.user?.email}</div>
                      </td>
                      <td style={{ padding: '0.625rem 0.75rem' }}>
                        <span style={{ color: el?.color, fontWeight: 500 }}>{el?.emoji} {el?.name}</span>
                      </td>
                      <td style={{ padding: '0.625rem 0.75rem', color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>
                        {t.surveySource || '—'}
                      </td>
                      <td style={{ padding: '0.625rem 0.75rem', color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', whiteSpace: 'nowrap' }}>
                        {new Date(t.createdAt).toLocaleDateString('id-ID')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
