import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAdminStats, updateAdminSales } from '../../services/adminService';
import { ELEMENT_DATA, PixelIcon } from '../../data/elementData';
import { Users, ClipboardList, HelpCircle, ShoppingBag, Eye, Pencil, Check, X } from 'lucide-react';

function StatCard({ icon: Icon, label, value, color, loading }) {
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
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 600, letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            {Icon && <Icon size={14} style={{ color: 'var(--color-accent)' }} />} {label}
          </p>
        </>
      )}
    </div>
  );
}

/* Editable Sales Card — klik edit untuk mengubah jumlah parfum terjual */
function EditableSalesCard({ value, loading, onSave }) {
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState(value ?? 0);
  const [saving, setSaving] = useState(false);

  useEffect(() => { setInputVal(value ?? 0); }, [value]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(parseInt(inputVal) || 0);
      setEditing(false);
    } catch {
      alert('Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  };

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
      ) : editing ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
            <input
              type="number"
              min={0}
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              autoFocus
              style={{
                width: '100%',
                fontSize: 'var(--text-2xl)',
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                color: 'var(--color-text)',
                border: '1.5px solid var(--color-accent)',
                borderRadius: 'var(--radius-md)',
                padding: '0.25rem 0.5rem',
                outline: 'none',
                background: 'var(--color-surface)',
              }}
              onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setEditing(false); }}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.375rem' }}>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                padding: '0.25rem 0.625rem',
                fontSize: 'var(--text-xs)', fontWeight: 600,
                color: '#fff', background: '#22c55e',
                border: 'none', borderRadius: 'var(--radius-md)',
                cursor: 'pointer', fontFamily: 'var(--font-body)',
              }}
            >
              <Check size={12} /> {saving ? '...' : 'Simpan'}
            </button>
            <button
              onClick={() => { setEditing(false); setInputVal(value ?? 0); }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                padding: '0.25rem 0.625rem',
                fontSize: 'var(--text-xs)', fontWeight: 600,
                color: 'var(--color-text-muted)', background: 'var(--color-surface)',
                border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)',
                cursor: 'pointer', fontFamily: 'var(--font-body)',
              }}
            >
              <X size={12} /> Batal
            </button>
          </div>
        </>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
            <p style={{ fontSize: 'var(--text-3xl)', fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--color-text)', lineHeight: 1 }}>
              {typeof value === 'number' ? value.toLocaleString('id-ID') : value}
            </p>
            <button
              onClick={() => setEditing(true)}
              title="Edit jumlah"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 28, height: 28, borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
                color: 'var(--color-text-muted)',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.color = 'var(--color-accent)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-muted)'; }}
            >
              <Pencil size={13} />
            </button>
          </div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 600, letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <ShoppingBag size={14} style={{ color: 'var(--color-accent)' }} /> Parfum Terjual
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

  const handleUpdateSales = async (count) => {
    await updateAdminSales(count);
    setStats(s => ({ ...s, totalSales: count }));
  };

  return (
    <div style={{ padding: '2.5rem 2rem' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 500, color: 'var(--color-text)' }}>
          Dashboard
        </h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
          Ringkasan performa 4Persona Vun Diego
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { icon: Users, label: 'Total Pengguna', value: stats?.totalUsers, key: 'users' },
          { icon: ClipboardList, label: 'Total Tes', value: stats?.totalTests, key: 'tests' },
          { icon: HelpCircle, label: 'Soal Aktif', value: stats?.totalQuestions, key: 'questions' },
          { icon: Eye, label: 'Total Pengunjung', value: stats?.totalVisitors, key: 'visitors' },
        ].map(({ icon, label, value, key }) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * ['users','tests','questions','visitors'].indexOf(key) }}
          >
            <StatCard icon={icon} label={label} value={value} loading={loading} />
          </motion.div>
        ))}

        {/* Editable Sales Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <EditableSalesCard
            value={stats?.totalSales}
            loading={loading}
            onSave={handleUpdateSales}
          />
        </motion.div>
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
                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-text)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                      <PixelIcon src={el.pixelSrc} alt={el.name} size={28} /> {el.name}
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
                        <span style={{ color: el?.color, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                          {el && <PixelIcon src={el.pixelSrc} alt={el.name} size={24} />} {el?.name}
                        </span>
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

