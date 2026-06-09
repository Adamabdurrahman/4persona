import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAdminResults } from '../../services/adminService';

const ELEMENT_DATA = {
  API:   { emoji: '🔥', name: 'Api',   color: 'var(--color-api)'   },
  AIR:   { emoji: '💧', name: 'Air',   color: 'var(--color-air)'   },
  ANGIN: { emoji: '🌬', name: 'Angin', color: 'var(--color-angin)' },
  TANAH: { emoji: '🌿', name: 'Tanah', color: 'var(--color-tanah)' },
};

export default function AdminResults() {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAdminResults(page).then(setData).catch(console.error).finally(() => setLoading(false));
  }, [page]);

  return (
    <div style={{ padding: '2.5rem 2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 500, color: 'var(--color-text)' }}>
          Hasil Tes
        </h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
          {data ? `${data.total.toLocaleString('id-ID')} total tes tercatat` : 'Memuat...'}
        </p>
      </div>

      <div style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Memuat data...</div>
        ) : !data?.results?.length ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            <p style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📭</p>
            <p>Belum ada hasil tes</p>
          </div>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
                <thead>
                  <tr style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
                    {['Pengguna', 'Persona', 'Skor', 'Rating', 'Sumber', 'Laporan', 'Tanggal'].map(h => (
                      <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.results.map((t, i) => {
                    const el = ELEMENT_DATA[t.personaPrimer];
                    const elSek = ELEMENT_DATA[t.personaSekunder];
                    return (
                      <tr key={t.id} style={{ borderBottom: '1px solid var(--color-surface)', background: i % 2 === 0 ? 'transparent' : '#fafaf9' }}>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <p style={{ fontWeight: 500, color: 'var(--color-text)' }}>{t.user?.name || '—'}</p>
                          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{t.user?.email}</p>
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <span style={{ color: el?.color, fontWeight: 500 }}>{el?.emoji} {el?.name}</span>
                          {elSek && <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', display: 'block' }}>+ {elSek.name}</span>}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontVariantNumeric: 'tabular-nums' }}>
                          🔥{t.scoreApi} 💧{t.scoreAir} 🌬{t.scoreAngin} 🌿{t.scoreTanah}
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          {t.feedbackRating ? (
                            <span style={{ fontSize: 'var(--text-sm)' }}>{'⭐'.repeat(t.feedbackRating)}</span>
                          ) : (
                            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)' }}>—</span>
                          )}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {t.surveySource || '—'}
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <Link
                            to={`/report/${t.reportToken}`}
                            target="_blank"
                            style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 600 }}
                          >
                            Buka →
                          </Link>
                        </td>
                        <td style={{ padding: '0.75rem 1rem', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                          {new Date(t.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: '2-digit' })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {data.totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '1rem', borderTop: '1px solid var(--color-border)' }}>
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{ padding: '0.375rem 0.875rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', background: 'transparent', cursor: page === 1 ? 'default' : 'pointer', opacity: page === 1 ? 0.4 : 1, fontSize: 'var(--text-xs)', fontFamily: 'var(--font-body)' }}
                >
                  ← Prev
                </button>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', fontVariantNumeric: 'tabular-nums' }}>
                  {page} / {data.totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
                  disabled={page === data.totalPages}
                  style={{ padding: '0.375rem 0.875rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', background: 'transparent', cursor: page === data.totalPages ? 'default' : 'pointer', opacity: page === data.totalPages ? 0.4 : 1, fontSize: 'var(--text-xs)', fontFamily: 'var(--font-body)' }}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
