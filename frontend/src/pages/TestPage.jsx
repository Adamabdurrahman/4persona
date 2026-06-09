import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import CardStack from '../components/CardStack';
import LoadingScreen from '../components/ui/LoadingScreen';
import api from '../services/api';

const ELEMENT_COLORS = {
  API: 'var(--color-api)',
  AIR: 'var(--color-air)',
  ANGIN: 'var(--color-angin)',
  TANAH: 'var(--color-tanah)',
};

/**
 * TestPage — Halaman tes kepribadian
 * Protected route: redirect ke /auth jika belum login
 */
export default function TestPage() {
  const { user, isLoggedIn, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [phase, setPhase] = useState('loading'); // 'loading' | 'intro' | 'test' | 'submitting'
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]); // { questionId, optionId, targetType }
  const [direction, setDirection] = useState('left');
  const [error, setError] = useState('');
  const [loadingMessage, setLoadingMessage] = useState('Mempersiapkan soal...');

  // Auth guard
  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      navigate('/auth', { replace: true });
    }
  }, [authLoading, isLoggedIn, navigate]);

  // Fetch questions
  useEffect(() => {
    if (!isLoggedIn || authLoading) return;

    const fetchQuestions = async () => {
      try {
        setLoadingMessage('Menyiapkan soal untukmu...');
        const { data } = await api.get('/api/questions/session');
        setQuestions(data);

        // Show intro setelah soal siap
        setTimeout(() => setPhase('intro'), 800);
      } catch (err) {
        const msg = err.response?.data?.message || 'Gagal memuat soal. Coba lagi.';
        setError(msg);
        setPhase('error');
      }
    };

    fetchQuestions();
  }, [isLoggedIn, authLoading]);

  // Handle answer selection
  const handleAnswer = (option) => {
    const question = questions[currentIndex];
    const newAnswer = {
      questionId: question.id,
      optionId: option.id,
      targetType: option.targetType,
      isClosing: question.isClosingQuestion,
      surveySource: question.isClosingQuestion ? option.text : undefined,
    };

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);

    if (currentIndex < questions.length - 1) {
      setDirection('left');
      setCurrentIndex(i => i + 1);
    } else {
      // Semua soal selesai → submit
      handleSubmit(updatedAnswers);
    }
  };

  // Submit test results
  const handleSubmit = async (finalAnswers) => {
    setPhase('submitting');
    setLoadingMessage('Menganalisa kepribadianmu...');

    try {
      const personalityAnswers = finalAnswers
        .filter(a => !a.isClosing)
        .map(a => ({ questionId: a.questionId, optionId: a.optionId, targetType: a.targetType }));

      const surveyAnswer = finalAnswers.find(a => a.isClosing);

      const { data } = await api.post('/api/tests/submit', {
        answers: personalityAnswers,
        surveySource: surveyAnswer?.surveySource || 'Tidak disebutkan',
      });

      // Navigasi ke halaman teaser dengan hasil
      navigate('/teaser', {
        state: {
          personaPrimer: data.personaPrimer,
          personaSekunder: data.personaSekunder,
          reportToken: data.reportToken,
          scores: data.scores,
        },
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan hasil. Coba lagi.');
      setPhase('error');
    }
  };

  // ── Loading Screen ───────────────────────────────────────
  if (authLoading || phase === 'loading') {
    return <LoadingScreen isVisible message={loadingMessage} />;
  }

  if (phase === 'submitting') {
    return <LoadingScreen isVisible message={loadingMessage} />;
  }

  // ── Error State ───────────────────────────────────────────
  if (phase === 'error') {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.5rem',
        padding: '2rem',
        textAlign: 'center',
        background: 'var(--color-bg)',
      }}>
        <p style={{ fontSize: '3rem' }}>😔</p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', color: 'var(--color-text)' }}>
          Terjadi Kesalahan
        </h2>
        <p style={{ color: 'var(--color-text-muted)', maxWidth: 360 }}>{error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '0.75rem 2rem',
            background: 'var(--color-text)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-sm)',
            fontWeight: 500,
            letterSpacing: 'var(--tracking-wide)',
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  // ── Intro Screen ──────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--color-bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}>
        {/* Decorative top gradient */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '40vh',
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, var(--color-accent-light) 0%, transparent 80%)',
          pointerEvents: 'none',
        }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            maxWidth: 500,
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <motion.p
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}
          >
            ✨
          </motion.p>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            fontWeight: 500,
            color: 'var(--color-text)',
            lineHeight: 'var(--leading-tight)',
            marginBottom: '1rem',
          }}>
            Halo, {user?.name?.split(' ')[0]}!<br />
            <em style={{ fontStyle: 'italic', color: 'var(--color-accent)' }}>Siap Mengenal Dirimu?</em>
          </h1>

          <p style={{
            color: 'var(--color-text-muted)',
            fontSize: 'var(--text-base)',
            lineHeight: 'var(--leading-normal)',
            marginBottom: '2rem',
            maxWidth: 420,
            margin: '0 auto 2rem',
          }}>
            Kamu akan menjawab <strong>{questions.length - 1} pertanyaan</strong> kepribadian dan 1 pertanyaan penutup. Jawab dengan jujur sesuai yang paling mencerminkan dirimu.
          </p>

          {/* Info pills */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            {[
              { icon: '⏱', text: '± 5 menit' },
              { icon: '📩', text: 'Hasil via email' },
              { icon: '🔒', text: 'Data aman' },
            ].map(({ icon, text }) => (
              <span key={text} style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                padding: '0.375rem 0.875rem',
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-full)',
                fontSize: 'var(--text-xs)',
                color: 'var(--color-text-muted)',
                fontWeight: 500,
              }}>
                {icon} {text}
              </span>
            ))}
          </div>

          <motion.button
            onClick={() => setPhase('test')}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            style={{
              padding: '1rem 3rem',
              background: 'var(--color-text)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
              letterSpacing: 'var(--tracking-wide)',
              textTransform: 'uppercase',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            Mulai Sekarang →
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // ── Test Interface ────────────────────────────────────────
  const currentQuestion = questions[currentIndex];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-bg)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Top bar */}
      <div style={{
        padding: '1.25rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--color-border)',
        background: 'rgba(248,246,242,0.9)',
        backdropFilter: 'blur(8px)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-lg)',
          fontWeight: 500,
          color: 'var(--color-text)',
        }}>
          Vundiego
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-muted)',
            fontVariantNumeric: 'tabular-nums',
          }}>
            {currentIndex + 1} / {questions.length}
          </span>

          {currentIndex > 0 && (
            <button
              onClick={() => {
                setDirection('right');
                setCurrentIndex(i => Math.max(0, i - 1));
                setAnswers(a => a.slice(0, -1));
              }}
              style={{
                padding: '0.375rem 0.75rem',
                fontSize: 'var(--text-xs)',
                color: 'var(--color-text-muted)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                background: 'transparent',
                fontFamily: 'var(--font-body)',
                letterSpacing: 'var(--tracking-wide)',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-text)'; e.currentTarget.style.color = 'var(--color-text)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-muted)'; }}
            >
              ← Kembali
            </button>
          )}
        </div>
      </div>

      {/* Card area */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            style={{ width: '100%', maxWidth: 520 }}
          >
            <CardStack
              questions={questions}
              currentIndex={currentIndex}
              onAnswer={handleAnswer}
              direction={direction}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
