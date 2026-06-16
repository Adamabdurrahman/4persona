import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { register as registerService, login as loginService, loginWithGoogle, saveAuth } from '../services/authService';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

/**
 * AuthPage — Halaman login & register dalam satu halaman
 * Route: /auth
 * Route callback: /auth/callback?token=...
 */
export default function AuthPage() {
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Redirect jika sudah login
  useEffect(() => {
    if (isLoggedIn) navigate('/', { replace: true });
  }, [isLoggedIn, navigate]);

  // Handle Google OAuth callback: /auth/callback?token=xxx&name=xxx&email=xxx
  useEffect(() => {
    const token = searchParams.get('token');
    const name = searchParams.get('name');
    const email = searchParams.get('email');

    if (token && name && email) {
      const userData = { name: decodeURIComponent(name), email: decodeURIComponent(email) };
      saveAuth(token, userData);
      login(userData);
      navigate('/', { replace: true });
    }
  }, [searchParams, login, navigate]);

  const handleTabChange = (newTab) => {
    setTab(newTab);
    setApiError('');
    resetLogin();
    resetRegister();
  };

  // ── Login Form ────────────────────────────────────────────
  const {
    register: regLogin,
    handleSubmit: handleLogin,
    formState: { errors: loginErrors },
    reset: resetLogin,
  } = useForm();

  const onLogin = async (data) => {
    setLoading(true);
    setApiError('');
    try {
      const result = await loginService(data);
      login(result.user);
      navigate('/', { replace: true });
    } catch (err) {
      setApiError(err.response?.data?.message || 'Login gagal. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  // ── Register Form ─────────────────────────────────────────
  const {
    register: regRegister,
    handleSubmit: handleRegister,
    formState: { errors: registerErrors },
    watch: watchRegister,
    reset: resetRegister,
  } = useForm();

  const onRegister = async (data) => {
    setLoading(true);
    setApiError('');
    try {
      const result = await registerService(data);
      login(result.user);
      navigate('/', { replace: true });
    } catch (err) {
      setApiError(err.response?.data?.message || 'Pendaftaran gagal. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
    }}>
      {/* Decorative background */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, var(--color-accent-light) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: '100%',
          maxWidth: 440,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-3xl)',
              fontWeight: 500,
              color: 'var(--color-text)',
              letterSpacing: '0.08em',
            }}>
              Vun Diego
            </h1>
          </Link>
          <p style={{
            marginTop: '0.5rem',
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-muted)',
          }}>
            {tab === 'login' ? 'Masuk ke akunmu' : 'Buat akun baru'}
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: '#fff',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-2xl)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
        }}>
          {/* Tab Switcher */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid var(--color-border)',
          }}>
            {[
              { key: 'login', label: 'Masuk' },
              { key: 'register', label: 'Daftar' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handleTabChange(key)}
                style={{
                  flex: 1,
                  padding: '1rem',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 500,
                  letterSpacing: 'var(--tracking-wide)',
                  textTransform: 'uppercase',
                  color: tab === key ? 'var(--color-text)' : 'var(--color-text-muted)',
                  background: tab === key ? '#fff' : 'var(--color-surface)',
                  borderBottom: tab === key ? '2px solid var(--color-accent)' : '2px solid transparent',
                  cursor: 'pointer',
                  transition: 'all var(--duration-fast)',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Form Area */}
          <div style={{ padding: '2rem' }}>
            {/* Google OAuth Button */}
            <button
              id="btn-google-auth"
              onClick={loginWithGoogle}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                padding: '0.75rem',
                background: '#fff',
                border: '1.5px solid var(--color-border-md)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-sm)',
                fontWeight: 500,
                color: 'var(--color-text)',
                cursor: 'pointer',
                marginBottom: '1.5rem',
                transition: 'all var(--duration-fast)',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--color-surface)'}
              onMouseLeave={e => e.currentTarget.style.background = '#fff'}
            >
              <GoogleIcon />
              Lanjutkan dengan Google
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)' }}>atau</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
            </div>

            {/* API Error */}
            <AnimatePresence>
              {apiError && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    padding: '0.75rem 1rem',
                    background: 'var(--color-api-light)',
                    border: '1px solid rgba(184, 50, 50, 0.2)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-api)',
                    marginBottom: '1.25rem',
                  }}
                >
                  {apiError}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Login Form */}
            <AnimatePresence mode="wait">
              {tab === 'login' ? (
                <motion.form
                  key="login"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleLogin(onLogin)}
                  style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
                >
                  <Input
                    id="login-email"
                    label="Email"
                    type="email"
                    placeholder="nama@email.com"
                    error={loginErrors.email?.message}
                    {...regLogin('email', {
                      required: 'Email wajib diisi',
                      pattern: { value: /^\S+@\S+\.\S+$/, message: 'Format email tidak valid' },
                    })}
                  />
                  <Input
                    id="login-password"
                    label="Password"
                    type="password"
                    placeholder="Password kamu"
                    error={loginErrors.password?.message}
                    {...regLogin('password', { required: 'Password wajib diisi' })}
                  />
                  <Button
                    id="btn-login-submit"
                    type="submit"
                    loading={loading}
                    fullWidth
                    size="lg"
                  >
                    Masuk
                  </Button>
                </motion.form>
              ) : (
                /* Register Form */
                <motion.form
                  key="register"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleRegister(onRegister)}
                  style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
                >
                  <Input
                    id="register-name"
                    label="Nama Lengkap"
                    type="text"
                    placeholder="Nama kamu"
                    error={registerErrors.name?.message}
                    {...regRegister('name', {
                      required: 'Nama wajib diisi',
                      minLength: { value: 2, message: 'Nama minimal 2 karakter' },
                    })}
                  />
                  <Input
                    id="register-email"
                    label="Email"
                    type="email"
                    placeholder="nama@email.com"
                    error={registerErrors.email?.message}
                    {...regRegister('email', {
                      required: 'Email wajib diisi',
                      pattern: { value: /^\S+@\S+\.\S+$/, message: 'Format email tidak valid' },
                    })}
                  />
                  <Input
                    id="register-password"
                    label="Password"
                    type="password"
                    placeholder="Minimal 8 karakter"
                    hint="Gunakan kombinasi huruf dan angka"
                    error={registerErrors.password?.message}
                    {...regRegister('password', {
                      required: 'Password wajib diisi',
                      minLength: { value: 8, message: 'Password minimal 8 karakter' },
                    })}
                  />
                  <Button
                    id="btn-register-submit"
                    type="submit"
                    loading={loading}
                    fullWidth
                    size="lg"
                  >
                    Buat Akun
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer note */}
        <p style={{
          textAlign: 'center',
          marginTop: '1.5rem',
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-light)',
          lineHeight: 'var(--leading-normal)',
        }}>
          Dengan mendaftar, kamu menyetujui penggunaan data<br />untuk keperluan tes kepribadian dan rekomendasi parfum.
        </p>
      </motion.div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}
