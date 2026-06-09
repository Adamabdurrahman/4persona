import { useEffect, useState } from 'react';
import { getAdminTemplates, updateAdminTemplate } from '../../services/adminService';

const ELEMENT_DATA = {
  API:   { emoji: '🔥', name: 'Api',   color: 'var(--color-api)'   },
  AIR:   { emoji: '💧', name: 'Air',   color: 'var(--color-air)'   },
  ANGIN: { emoji: '🌬', name: 'Angin', color: 'var(--color-angin)' },
  TANAH: { emoji: '🌿', name: 'Tanah', color: 'var(--color-tanah)' },
};

function TextArea({ label, value, onChange, rows = 4, placeholder }) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
        {label}
      </label>
      <textarea
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-border)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', resize: 'vertical', lineHeight: 1.6, boxSizing: 'border-box', color: 'var(--color-text)' }}
      />
    </div>
  );
}

function Input({ label, value, onChange, placeholder }) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
        {label}
      </label>
      <input
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-border)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', boxSizing: 'border-box', color: 'var(--color-text)' }}
      />
    </div>
  );
}

export default function AdminTemplates() {
  const [templates, setTemplates] = useState([]);
  const [selected, setSelected] = useState('API');
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminTemplates()
      .then(data => {
        setTemplates(data);
        const initial = data.find(t => t.id === 'API') || data[0];
        if (initial) setForm(initial);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = (id) => {
    setSelected(id);
    const t = templates.find(t => t.id === id);
    if (t) setForm({ ...t });
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updateAdminTemplate(selected, form);
      setTemplates(prev => prev.map(t => t.id === selected ? updated : t));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      alert('Gagal menyimpan: ' + (err?.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const update = (field) => (val) => setForm(f => ({ ...f, [field]: val }));
  const el = ELEMENT_DATA[selected];

  return (
    <div style={{ padding: '2.5rem 2rem', maxWidth: 840 }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 500, color: 'var(--color-text)' }}>
          Template Laporan
        </h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
          Konten yang ditampilkan di halaman laporan peserta
        </p>
      </div>

      {/* Elemen Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {['API', 'AIR', 'ANGIN', 'TANAH'].map(id => {
          const e = ELEMENT_DATA[id];
          const isActive = selected === id;
          return (
            <button
              key={id}
              onClick={() => handleSelect(id)}
              style={{
                padding: '0.5rem 1.25rem', borderRadius: 'var(--radius-md)',
                border: `1.5px solid ${isActive ? e.color : 'var(--color-border)'}`,
                background: isActive ? e.color + '12' : 'transparent',
                color: isActive ? e.color : 'var(--color-text-muted)',
                fontSize: 'var(--text-sm)', fontWeight: isActive ? 600 : 400,
                cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.15s',
              }}
            >
              {e.emoji} {e.name}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 100, borderRadius: 'var(--radius-lg)' }} />)}
        </div>
      ) : (
        <div style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', padding: '2rem', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--color-surface)' }}>
            <span style={{ fontSize: '1.5rem' }}>{el?.emoji}</span>
            <div>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 500, color: el?.color }}>{el?.name}</p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Edit konten laporan untuk persona ini</p>
            </div>
          </div>

          <Input label="Nama Parfum" value={form.parfumName} onChange={update('parfumName')} placeholder="Contoh: Choleric" />
          <TextArea label="Deskripsi Umum" value={form.description} onChange={update('description')} placeholder="Deskripsi singkat persona ini yang muncul di laporan..." rows={3} />
          <TextArea label="Kelebihan (Deskripsi +)" value={form.descriptionPlus} onChange={update('descriptionPlus')} placeholder="Kekuatan dan sifat positif persona ini..." />
          <TextArea label="Kekurangan (Deskripsi -)" value={form.descriptionMinus} onChange={update('descriptionMinus')} placeholder="Area pengembangan dan tantangan persona ini..." />
          <Input label="Rekomendasi Parfum" value={form.parfumRecommendation} onChange={update('parfumRecommendation')} placeholder="Nama parfum yang direkomendasikan..." />
          <Input label="Tagline Parfum" value={form.parfumTagline} onChange={update('parfumTagline')} placeholder="Tagline atau deskripsi singkat parfum..." />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input label="Link Shopee" value={form.shopeeLink} onChange={update('shopeeLink')} placeholder="https://shopee.co.id/..." />
            <Input label="Link TikTok" value={form.tiktokLink} onChange={update('tiktokLink')} placeholder="https://tiktok.com/..." />
            <Input label="Link Instagram" value={form.instagramLink} onChange={update('instagramLink')} placeholder="https://instagram.com/..." />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem', marginTop: '0.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-surface)' }}>
            {saved && (
              <span style={{ fontSize: 'var(--text-sm)', color: '#059669', fontWeight: 500 }}>
                ✓ Tersimpan!
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: '0.75rem 2rem', background: 'var(--color-text)', color: '#fff',
                border: 'none', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)',
                fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-body)',
                opacity: saving ? 0.7 : 1, transition: 'opacity 0.15s',
              }}
            >
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
