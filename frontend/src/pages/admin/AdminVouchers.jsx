import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Ticket, Save, Users, Package, Clock, ExternalLink, ToggleLeft, ToggleRight } from 'lucide-react';
import { getVoucherConfig, updateVoucherConfig, getVoucherClaims } from '../../services/adminService';

export default function AdminVouchers() {
  const [config, setConfig] = useState(null);
  const [claims, setClaims] = useState({ claims: [], total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Form state
  const [form, setForm] = useState({
    isEnabled: false,
    voucherCode: '',
    discountLabel: '',
    totalStock: 0,
    expiryHours: 72,
    shopeeUrl: '',
  });

  useEffect(() => {
    Promise.all([
      getVoucherConfig(),
      getVoucherClaims(1),
    ])
      .then(([cfg, cls]) => {
        setConfig(cfg);
        setClaims(cls);
        setForm({
          isEnabled: cfg.isEnabled,
          voucherCode: cfg.voucherCode,
          discountLabel: cfg.discountLabel,
          totalStock: cfg.totalStock,
          expiryHours: cfg.expiryHours,
          shopeeUrl: cfg.shopeeUrl,
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updateVoucherConfig(form);
      setConfig(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      alert('Gagal menyimpan: ' + (err?.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async () => {
    const newVal = !form.isEnabled;
    setForm(f => ({ ...f, isEnabled: newVal }));
    try {
      const updated = await updateVoucherConfig({ isEnabled: newVal });
      setConfig(updated);
    } catch (err) {
      setForm(f => ({ ...f, isEnabled: !newVal }));
      alert('Gagal mengubah status');
    }
  };

  const loadClaimsPage = async (page) => {
    try {
      const cls = await getVoucherClaims(page);
      setClaims(cls);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2.5rem 2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton" style={{ height: 60, borderRadius: 'var(--radius-xl)' }} />
          ))}
        </div>
      </div>
    );
  }

  const remaining = Math.max(0, (config?.totalStock ?? 0) - (config?.claimedCount ?? 0));
  const claimedPct = config?.totalStock > 0
    ? Math.round(((config?.claimedCount ?? 0) / config.totalStock) * 100)
    : 0;

  return (
    <div style={{ padding: '2.5rem 2rem', maxWidth: 860 }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)',
          fontWeight: 500, color: 'var(--color-text)',
          display: 'flex', alignItems: 'center', gap: '0.5rem',
        }}>
          <Ticket size={24} /> Kelola Voucher
        </h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
          Atur kode, stok, dan status sistem voucher Shopee
        </p>
      </motion.div>

      {/* ─── Toggle & Stats Row ──────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        {/* Toggle Card */}
        <div style={{
          background: '#fff', border: '1.5px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)', padding: '1.25rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              Status Sistem
            </p>
            <p style={{
              fontSize: 'var(--text-base)', fontWeight: 600,
              color: form.isEnabled ? '#22c55e' : 'var(--color-api)',
            }}>
              {form.isEnabled ? '● Aktif' : '● Nonaktif'}
            </p>
          </div>
          <button
            onClick={handleToggle}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: form.isEnabled ? '#22c55e' : 'var(--color-text-light)',
              transition: 'color 0.2s',
            }}
          >
            {form.isEnabled
              ? <ToggleRight size={36} strokeWidth={1.5} />
              : <ToggleLeft size={36} strokeWidth={1.5} />
            }
          </button>
        </div>

        {/* Stock Card */}
        <div style={{
          background: '#fff', border: '1.5px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)', padding: '1.25rem',
        }}>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Stok Voucher
          </p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 600, color: 'var(--color-text)' }}>
              {remaining}
            </span>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
              / {config?.totalStock ?? 0} tersisa
            </span>
          </div>
          <div style={{ height: 6, background: 'var(--color-surface)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${claimedPct}%`,
              background: claimedPct > 80 ? 'var(--color-api)' : 'var(--color-accent)',
              borderRadius: 3,
              transition: 'width 0.5s ease',
            }} />
          </div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)', marginTop: '0.375rem' }}>
            {config?.claimedCount ?? 0} sudah di-claim ({claimedPct}%)
          </p>
        </div>

        {/* Claimed Users Count */}
        <div style={{
          background: '#fff', border: '1.5px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)', padding: '1.25rem',
          display: 'flex', alignItems: 'center', gap: '1rem',
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: 'var(--color-accent-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Users size={20} color="var(--color-accent)" />
          </div>
          <div>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.125rem' }}>
              User Mendapatkan
            </p>
            <p style={{ fontSize: 'var(--text-xl)', fontWeight: 600, color: 'var(--color-text)' }}>
              {claims.total}
            </p>
          </div>
        </div>
      </motion.div>

      {/* ─── Configuration Form ──────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          background: '#fff', border: '1.5px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)', padding: '1.5rem',
          marginBottom: '1.5rem',
        }}
      >
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)',
          fontWeight: 500, color: 'var(--color-text)', marginBottom: '1.25rem',
          display: 'flex', alignItems: 'center', gap: '0.5rem',
        }}>
          <Package size={18} /> Konfigurasi Voucher
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {/* Kode Voucher */}
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <span style={labelStyle}>Kode Voucher Shopee</span>
            <input
              type="text"
              value={form.voucherCode}
              onChange={e => setForm(f => ({ ...f, voucherCode: e.target.value.toUpperCase() }))}
              placeholder="Contoh: VUNPERSONA20"
              style={inputStyle}
            />
          </label>

          {/* Label Diskon */}
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <span style={labelStyle}>Label Diskon</span>
            <input
              type="text"
              value={form.discountLabel}
              onChange={e => setForm(f => ({ ...f, discountLabel: e.target.value }))}
              placeholder="Contoh: Potongan Rp4.000"
              style={inputStyle}
            />
          </label>

          {/* Total Stok */}
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <span style={labelStyle}>Total Stok</span>
            <input
              type="number"
              min={0}
              value={form.totalStock}
              onChange={e => setForm(f => ({ ...f, totalStock: parseInt(e.target.value) || 0 }))}
              style={inputStyle}
            />
          </label>

          {/* Masa Berlaku */}
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <span style={labelStyle}>Masa Berlaku (jam)</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="number"
                min={1}
                value={form.expiryHours}
                onChange={e => setForm(f => ({ ...f, expiryHours: parseInt(e.target.value) || 72 }))}
                style={{ ...inputStyle, flex: 1 }}
              />
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)', whiteSpace: 'nowrap' }}>
                = {Math.floor(form.expiryHours / 24)} hari
              </span>
            </div>
          </label>
        </div>

        {/* Shopee URL — full width */}
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', marginTop: '1rem' }}>
          <span style={labelStyle}>URL Shopee</span>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input
              type="url"
              value={form.shopeeUrl}
              onChange={e => setForm(f => ({ ...f, shopeeUrl: e.target.value }))}
              placeholder="https://shopee.co.id/..."
              style={{ ...inputStyle, flex: 1 }}
            />
            {form.shopeeUrl && (
              <a
                href={form.shopeeUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--color-accent)', flexShrink: 0 }}
              >
                <ExternalLink size={18} />
              </a>
            )}
          </div>
        </label>

        {/* Save Button */}
        <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.75rem 1.75rem',
              background: saved ? '#22c55e' : 'var(--color-text)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              letterSpacing: 'var(--tracking-wide)',
              textTransform: 'uppercase',
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.6 : 1,
              transition: 'all 0.2s',
            }}
          >
            <Save size={15} />
            {saved ? '✓ Tersimpan!' : saving ? 'Menyimpan...' : 'Simpan Konfigurasi'}
          </button>
        </div>
      </motion.div>

      {/* ─── Claims Table ────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        style={{
          background: '#fff', border: '1.5px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)', overflow: 'hidden',
        }}
      >
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)',
            fontWeight: 500, color: 'var(--color-text)',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
          }}>
            <Users size={18} /> Daftar Klaim ({claims.total})
          </h2>
        </div>

        {claims.claims.length === 0 ? (
          <div style={{ padding: '2.5rem', textAlign: 'center' }}>
            <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📭</p>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
              Belum ada user yang mengklaim voucher
            </p>
          </div>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
                    {['Nama', 'Email', 'Kode', 'Waktu Klaim', 'Status'].map(h => (
                      <th key={h} style={{
                        padding: '0.75rem 1rem',
                        textAlign: 'left',
                        fontWeight: 600,
                        fontSize: 'var(--text-xs)',
                        color: 'var(--color-text-light)',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {claims.claims.map((c, i) => (
                    <tr key={c.id} style={{
                      borderBottom: i < claims.claims.length - 1 ? '1px solid var(--color-border)' : 'none',
                    }}>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 500, color: 'var(--color-text)' }}>
                        {c.user?.name || '-'}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--color-text-muted)' }}>
                        {c.user?.email || '-'}
                      </td>
                      <td style={{
                        padding: '0.75rem 1rem',
                        fontFamily: 'monospace',
                        fontWeight: 600,
                        fontSize: 'var(--text-xs)',
                        color: 'var(--color-text)',
                        letterSpacing: '0.1em',
                      }}>
                        {c.voucherCode}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>
                        {new Date(c.claimedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '0.2rem 0.6rem',
                          borderRadius: 'var(--radius-full)',
                          fontSize: 'var(--text-xs)',
                          fontWeight: 600,
                          background: c.isExpired ? 'rgba(184,50,50,0.1)' : 'rgba(34,197,94,0.1)',
                          color: c.isExpired ? 'var(--color-api)' : '#22c55e',
                        }}>
                          {c.isExpired ? 'Expired' : 'Aktif'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {claims.totalPages > 1 && (
              <div style={{
                padding: '0.75rem 1.5rem',
                borderTop: '1px solid var(--color-border)',
                display: 'flex',
                justifyContent: 'center',
                gap: '0.5rem',
              }}>
                {Array.from({ length: claims.totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => loadClaimsPage(i + 1)}
                    style={{
                      width: 32, height: 32,
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      background: claims.page === i + 1 ? 'var(--color-text)' : '#fff',
                      color: claims.page === i + 1 ? '#fff' : 'var(--color-text-muted)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}

// ─── Shared Styles ──────────────────────────────────────────
const labelStyle = {
  fontSize: 'var(--text-xs)',
  fontWeight: 600,
  color: 'var(--color-text-muted)',
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
};

const inputStyle = {
  padding: '0.625rem 0.875rem',
  fontSize: 'var(--text-sm)',
  color: 'var(--color-text)',
  background: 'var(--color-surface)',
  border: '1.5px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  fontFamily: 'var(--font-body)',
  outline: 'none',
  transition: 'border-color 0.15s',
};
