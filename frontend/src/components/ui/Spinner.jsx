/**
 * Spinner Component — Loading spinner dengan size & color variants
 */
export default function Spinner({
  size = 'md',
  color = 'var(--color-accent)',
  className = '',
}) {
  const sizes = {
    sm:  { width: 16, height: 16, strokeWidth: 2.5 },
    md:  { width: 24, height: 24, strokeWidth: 2 },
    lg:  { width: 40, height: 40, strokeWidth: 2 },
    xl:  { width: 60, height: 60, strokeWidth: 1.5 },
  };

  const { width, height, strokeWidth } = sizes[size] || sizes.md;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      className={className}
      style={{ animation: 'spin 0.75s linear infinite', flexShrink: 0 }}
      aria-label="Loading"
      role="status"
    >
      <circle cx="12" cy="12" r="10" opacity={0.2} />
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  );
}

/**
 * SpinnerOverlay — Spinner full-page centered
 */
export function SpinnerOverlay({ label = 'Memuat...' }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      minHeight: '40vh',
    }}>
      <Spinner size="lg" />
      {label && (
        <p style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--color-text-muted)',
          letterSpacing: 'var(--tracking-wide)',
        }}>
          {label}
        </p>
      )}
    </div>
  );
}
