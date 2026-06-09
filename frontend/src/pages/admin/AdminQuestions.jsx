import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getAdminQuestions,
  createAdminQuestion,
  deleteAdminQuestion,
  toggleAdminQuestion,
} from '../../services/adminService';

const ELEMENTS = ['API', 'AIR', 'ANGIN', 'TANAH'];
const ELEMENT_LABELS = { API: '🔥 Api', AIR: '💧 Air', ANGIN: '🌬 Angin', TANAH: '🌿 Tanah' };
const ELEMENT_COLORS = {
  API: 'var(--color-api)', AIR: 'var(--color-air)',
  ANGIN: 'var(--color-angin)', TANAH: 'var(--color-tanah)',
};

const emptyForm = {
  text: '',
  element: 'API',
  options: [
    { text: '', targetType: 'API', order: 0 },
    { text: '', targetType: 'AIR', order: 1 },
    { text: '', targetType: 'ANGIN', order: 2 },
    { text: '', targetType: 'TANAH', order: 3 },
  ],
};

export default function AdminQuestions() {
  const [questions, setQuestions] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const load = (el) => {
    setLoading(true);
    getAdminQuestions(el || undefined)
      .then(setQuestions)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(filter); }, [filter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.text.trim()) return;
    setSaving(true);
    try {
      await createAdminQuestion(form);
      setShowForm(false);
      setForm(emptyForm);
      load(filter);
    } catch (err) {
      alert(err?.response?.data?.message || 'Gagal menyimpan soal');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id) => {
    await toggleAdminQuestion(id);
    load(filter);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus soal ini? Tindakan tidak bisa dibatalkan.')) return;
    await deleteAdminQuestion(id);
    load(filter);
  };

  const updateOption = (index, field, value) => {
    const opts = [...form.options];
    opts[index] = { ...opts[index], [field]: value };
    setForm(f => ({ ...f, options: opts }));
  };

  // Stats per elemen
  const stats = ELEMENTS.reduce((acc, el) => ({
    ...acc,
    [el]: questions.filter(q => q.element === el && q.isActive).length,
  }), {});

  return (
    <div style={{ padding: '2.5rem 2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 500, color: 'var(--color-text)' }}>Bank Soal</h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            Butuh minimal 6 soal aktif per elemen untuk menjalankan sesi tes
          </p>
        </div>
        <button onClick={() => setShowForm(true)} style={{
          padding: '0.75rem 1.5rem', background: 'var(--color-text)', color: '#fff',
          border: 'none', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)',
          fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-body)',
          letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase',
        }}>
          + Tambah Soal
        </button>
      </div>

      {/* Elemen stat badges */}
      <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setFilter('')}
          style={{
            padding: '0.375rem 0.875rem', borderRadius: 'var(--radius-full)',
            border: `1.5px solid ${filter === '' ? 'var(--color-text)' : 'var(--color-border)'}`,
            background: filter === '' ? 'var(--color-text)' : 'transparent',
            color: filter === '' ? '#fff' : 'var(--color-text-muted)',
            fontSize: 'var(--text-xs)', fontWeight: 600, cursor: 'pointer',
            fontFamily: 'var(--font-body)', transition: 'all 0.15s',
          }}
        >
          Semua ({questions.length})
        </button>
        {ELEMENTS.map(el => (
          <button
            key={el}
            onClick={() => setFilter(filter === el ? '' : el)}
            style={{
              padding: '0.375rem 0.875rem', borderRadius: 'var(--radius-full)',
              border: `1.5px solid ${filter === el ? ELEMENT_COLORS[el] : 'var(--color-border)'}`,
              background: filter === el ? ELEMENT_COLORS[el] + '15' : 'transparent',
              color: filter === el ? ELEMENT_COLORS[el] : 'var(--color-text-muted)',
              fontSize: 'var(--text-xs)', fontWeight: 600, cursor: 'pointer',
              fontFamily: 'var(--font-body)', transition: 'all 0.15s',
            }}
          >
            {ELEMENT_LABELS[el]} · {stats[el] ?? '?'}✓
          </button>
        ))}
      </div>

      {/* Questions List */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 72, borderRadius: 'var(--radius-xl)' }} />)}
        </div>
      ) : questions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--color-text-muted)' }}>
          <p style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📭</p>
          <p>Belum ada soal. Tambahkan soal pertama!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <AnimatePresence>
            {questions.map((q, i) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                style={{
                  background: q.isActive ? '#fff' : 'var(--color-surface)',
                  border: `1px solid ${q.isActive ? 'var(--color-border)' : 'var(--color-border)'}`,
                  borderLeft: `3px solid ${ELEMENT_COLORS[q.element]}`,
                  borderRadius: 'var(--radius-xl)', padding: '1rem 1.25rem',
                  display: 'flex', gap: '1rem', alignItems: 'flex-start',
                  boxShadow: 'var(--shadow-card)', opacity: q.isActive ? 1 : 0.55,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: ELEMENT_COLORS[q.element], letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase' }}>
                      {ELEMENT_LABELS[q.element]}
                    </span>
                    <span style={{
                      fontSize: 'var(--text-xs)', padding: '0.125rem 0.5rem',
                      background: q.isActive ? '#d1fae5' : '#fee2e2',
                      color: q.isActive ? '#065f46' : '#991b1b',
                      borderRadius: 'var(--radius-full)', fontWeight: 600,
                    }}>
                      {q.isActive ? '✓ Aktif' : '✕ Nonaktif'}
                    </span>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)' }}>
                      {q.options?.length} pilihan
                    </span>
                  </div>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 'var(--leading-snug)', fontWeight: 400 }}>
                    {q.text}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.375rem', flexShrink: 0 }}>
                  <button
                    onClick={() => handleToggle(q.id)}
                    title={q.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                    style={{
                      padding: '0.375rem 0.625rem', background: 'transparent',
                      border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--text-xs)', cursor: 'pointer', fontFamily: 'var(--font-body)',
                      color: 'var(--color-text-muted)', transition: 'all 0.15s',
                    }}
                  >
                    {q.isActive ? '⏸' : '▶'}
                  </button>
                  <button
                    onClick={() => handleDelete(q.id)}
                    title="Hapus"
                    style={{
                      padding: '0.375rem 0.625rem', background: 'transparent',
                      border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--text-xs)', cursor: 'pointer', fontFamily: 'var(--font-body)',
                      color: '#ef4444', transition: 'all 0.15s',
                    }}
                  >
                    🗑
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add Question Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 50, padding: '1.5rem',
            }}
            onClick={e => { if (e.target === e.currentTarget) setShowForm(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{
                background: '#fff', borderRadius: 'var(--radius-2xl)',
                padding: '2rem', maxWidth: 600, width: '100%',
                maxHeight: '85vh', overflowY: 'auto',
                boxShadow: 'var(--shadow-xl)',
              }}
            >
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 500, marginBottom: '1.5rem', color: 'var(--color-text)' }}>
                Tambah Soal Baru
              </h2>
              <form onSubmit={handleSubmit}>
                {/* Element select */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                    Elemen Soal
                  </label>
                  <select
                    value={form.element}
                    onChange={e => setForm(f => ({ ...f, element: e.target.value }))}
                    style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-border)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text)', background: '#fff' }}
                  >
                    {ELEMENTS.map(el => <option key={el} value={el}>{ELEMENT_LABELS[el]}</option>)}
                  </select>
                </div>

                {/* Question text */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                    Teks Pertanyaan *
                  </label>
                  <textarea
                    value={form.text}
                    onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
                    required rows={3}
                    placeholder="Tuliskan pertanyaan di sini..."
                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-border)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', resize: 'vertical', boxSizing: 'border-box' }}
                  />
                </div>

                {/* Options */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                    Pilihan Jawaban (4 pilihan)
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                    {form.options.map((opt, i) => (
                      <div key={i} style={{ display: 'flex', gap: '0.625rem', alignItems: 'center' }}>
                        <span style={{ width: 20, height: 20, borderRadius: '50%', background: ELEMENT_COLORS[opt.targetType] + '20', color: ELEMENT_COLORS[opt.targetType], fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1px solid ${ELEMENT_COLORS[opt.targetType]}40` }}>
                          {String.fromCharCode(65 + i)}
                        </span>
                        <input
                          value={opt.text}
                          onChange={e => updateOption(i, 'text', e.target.value)}
                          placeholder={`Pilihan ${String.fromCharCode(65 + i)} (untuk ${ELEMENT_LABELS[opt.targetType]})`}
                          style={{ flex: 1, padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-border)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)' }}
                        />
                        <select
                          value={opt.targetType}
                          onChange={e => updateOption(i, 'targetType', e.target.value)}
                          style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-border)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', background: '#fff' }}
                        >
                          {ELEMENTS.map(el => <option key={el} value={el}>{el}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={() => setShowForm(false)} style={{ padding: '0.625rem 1.25rem', background: 'transparent', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                    Batal
                  </button>
                  <button type="submit" disabled={saving} style={{ padding: '0.625rem 1.5rem', background: 'var(--color-text)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 500, opacity: saving ? 0.7 : 1 }}>
                    {saving ? 'Menyimpan...' : 'Simpan Soal'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
