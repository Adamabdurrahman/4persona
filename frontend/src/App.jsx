import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import PageWrapper from './components/layout/PageWrapper';
import ScrollProgressBar from './components/ui/ScrollProgressBar';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import TestPage from './pages/TestPage';
import TeaserPage from './pages/TeaserPage';
import ReportPage from './pages/ReportPage';
import ProfilePage from './pages/ProfilePage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminQuestions from './pages/admin/AdminQuestions';
import AdminResults from './pages/admin/AdminResults';
import AdminTemplates from './pages/admin/AdminTemplates';

function NotFoundPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 'var(--space-4)', textAlign: 'center' }}>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-6xl)', fontWeight: 600, color: 'var(--color-border-md)' }}>404</p>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', color: 'var(--color-text)' }}>Halaman Tidak Ditemukan</p>
      <p style={{ color: 'var(--color-text-muted)', maxWidth: 360 }}>Halaman yang kamu cari mungkin sudah dipindahkan atau tidak ada.</p>
      <a href="/" style={{ marginTop: 'var(--space-4)', padding: '0.75rem 1.5rem', background: 'var(--color-text)', color: '#fff', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', fontWeight: 500, letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase', textDecoration: 'none' }}>
        Kembali ke Beranda
      </a>
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* ── Public ─────────────────────────────────────── */}
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/auth/callback" element={<AuthPage />} />
        <Route path="/report/:token" element={<ReportPage />} />

        {/* ── User Protected ──────────────────────────────── */}
        <Route path="/test" element={<TestPage />} />
        <Route path="/teaser" element={<TeaserPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* ── Admin — nested with sidebar layout ─────────── */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="questions" element={<AdminQuestions />} />
          <Route path="results" element={<AdminResults />} />
          <Route path="templates" element={<AdminTemplates />} />
        </Route>

        {/* ── 404 ────────────────────────────────────────── */}
        <Route path="*" element={
          <PageWrapper>
            <NotFoundPage />
          </PageWrapper>
        } />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollProgressBar />
        <AnimatedRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
