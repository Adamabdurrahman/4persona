import { Link } from 'react-router-dom';

/**
 * Footer — Minimal brand footer
 */
export default function Footer() {
  const year = new Date().getFullYear();

  const links = [
    { label: 'Beranda', to: '/' },
    { label: 'Mulai Tes', to: '/test' },
    { label: 'Masuk', to: '/auth' },
  ];

  const socials = [
    { label: 'Instagram', href: 'https://instagram.com/vundiego', icon: <InstagramIcon /> },
    { label: 'TikTok',    href: 'https://tiktok.com/@vundiego',  icon: <TiktokIcon /> },
  ];

  return (
    <footer style={{
      background: 'var(--color-surface)',
      borderTop: '1px solid var(--color-border)',
      padding: 'var(--space-12) 0 var(--space-8)',
    }}>
      <div className="container">
        {/* Top row */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 'var(--space-8)',
          paddingBottom: 'var(--space-8)',
          borderBottom: '1px solid var(--color-border)',
        }}>
          {/* Brand */}
          <div>
            <Link
              to="/"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-2xl)',
                fontWeight: 500,
                color: 'var(--color-text)',
                letterSpacing: '0.08em',
                textDecoration: 'none',
              }}
            >
              Vundiego
            </Link>
            <p style={{
              marginTop: 'var(--space-2)',
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-muted)',
              maxWidth: 260,
              lineHeight: 'var(--leading-normal)',
            }}>
              Temukan parfum yang mencerminkan kepribadianmu melalui tes 4 elemen.
            </p>
          </div>

          {/* Links */}
          <div style={{ display: 'flex', gap: 'var(--space-12)', flexWrap: 'wrap' }}>
            <div>
              <p style={{
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                letterSpacing: 'var(--tracking-wider)',
                textTransform: 'uppercase',
                color: 'var(--color-text-muted)',
                marginBottom: 'var(--space-4)',
              }}>
                Navigasi
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {links.map(({ label, to }) => (
                  <Link
                    key={to}
                    to={to}
                    style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-text-muted)',
                      textDecoration: 'none',
                      transition: 'color var(--duration-fast)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p style={{
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                letterSpacing: 'var(--tracking-wider)',
                textTransform: 'uppercase',
                color: 'var(--color-text-muted)',
                marginBottom: 'var(--space-4)',
              }}>
                Sosial
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {socials.map(({ label, href, icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-2)',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-text-muted)',
                      textDecoration: 'none',
                      transition: 'color var(--duration-fast)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
                  >
                    {icon}
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: 'var(--space-6)',
          flexWrap: 'wrap',
          gap: 'var(--space-4)',
        }}>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)' }}>
            © {year} Vundiego. All rights reserved.
          </p>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)' }}>
            Dibuat dengan ❤ untuk menemukan dirimu
          </p>
        </div>
      </div>
    </footer>
  );
}

function InstagramIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
    </svg>
  );
}

function TiktokIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.82a8.2 8.2 0 0 0 4.77 1.52V6.89a4.85 4.85 0 0 1-1-.2z"/>
    </svg>
  );
}
