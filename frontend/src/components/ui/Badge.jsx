/**
 * Badge Component — Label elemen persona dengan warna masing-masing
 * element: 'API' | 'AIR' | 'ANGIN' | 'TANAH'
 */

const ELEMENT_CONFIG = {
  API: {
    label: '🔥 Api',
    color: 'var(--color-api)',
    bg: 'var(--color-api-light)',
    border: 'rgba(184, 50, 50, 0.2)',
    parfum: 'Choleric',
  },
  AIR: {
    label: '💧 Air',
    color: 'var(--color-air)',
    bg: 'var(--color-air-light)',
    border: 'rgba(30, 58, 95, 0.2)',
    parfum: 'Melancholic',
  },
  ANGIN: {
    label: '🌬 Angin',
    color: 'var(--color-angin)',
    bg: 'var(--color-angin-light)',
    border: 'rgba(197, 150, 58, 0.2)',
    parfum: 'Sanguine',
  },
  TANAH: {
    label: '🌿 Tanah',
    color: 'var(--color-tanah)',
    bg: 'var(--color-tanah-light)',
    border: 'rgba(58, 92, 58, 0.2)',
    parfum: 'Phlegmatic',
  },
};

export default function Badge({
  element,
  size = 'md',
  showParfum = false,
  className = '',
  style: extraStyle = {},
}) {
  const config = ELEMENT_CONFIG[element?.toUpperCase()];
  if (!config) return null;

  const sizes = {
    sm: { fontSize: '0.65rem', padding: '0.2rem 0.5rem' },
    md: { fontSize: '0.7rem',  padding: '0.3rem 0.7rem' },
    lg: { fontSize: '0.8rem',  padding: '0.4rem 1rem' },
  };

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.25rem',
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        letterSpacing: 'var(--tracking-wide)',
        textTransform: 'uppercase',
        color: config.color,
        background: config.bg,
        border: `1px solid ${config.border}`,
        borderRadius: 'var(--radius-full)',
        ...sizes[size],
        ...extraStyle,
      }}
    >
      {showParfum ? `${config.label} · ${config.parfum}` : config.label}
    </span>
  );
}

// Export config untuk dipakai komponen lain
export { ELEMENT_CONFIG };
