import { motion } from 'framer-motion';

const ELEMENT_STYLE = {
  API:   { color: 'var(--color-api)',   light: 'var(--color-api-light)',   emoji: '🔥', name: 'Api' },
  AIR:   { color: 'var(--color-air)',   light: 'var(--color-air-light)',   emoji: '💧', name: 'Air' },
  ANGIN: { color: 'var(--color-angin)', light: 'var(--color-angin-light)', emoji: '🌬', name: 'Angin' },
  TANAH: { color: 'var(--color-tanah)', light: 'var(--color-tanah-light)', emoji: '🌿', name: 'Tanah' },
};

/**
 * QuestionCard — Kartu soal individual
 * Dipanggil oleh CardStack sebagai kartu terdepan
 */
export default function QuestionCard({
  question,
  onAnswer,
  questionNumber,
  totalQuestions,
}) {
  const isClosing = question.isClosingQuestion;
  const progress = (questionNumber / totalQuestions) * 100;

  return (
    <div style={{
      width: '100%',
      maxWidth: 520,
      background: '#fff',
      borderRadius: 'var(--radius-2xl)',
      boxShadow: 'var(--shadow-xl)',
      overflow: 'hidden',
      border: '1px solid var(--color-border)',
      userSelect: 'none',
    }}>
      {/* Progress bar */}
      <div style={{ height: 3, background: 'var(--color-surface)' }}>
        <motion.div
          style={{ height: '100%', background: 'var(--color-accent)', transformOrigin: 'left' }}
          initial={{ scaleX: (questionNumber - 1) / totalQuestions }}
          animate={{ scaleX: progress / 100 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>

      {/* Header */}
      <div style={{
        padding: '1.5rem 2rem 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{
          fontSize: 'var(--text-xs)',
          fontWeight: 600,
          letterSpacing: 'var(--tracking-wider)',
          textTransform: 'uppercase',
          color: 'var(--color-text-light)',
        }}>
          {isClosing ? 'Pertanyaan Penutup' : `Soal ${questionNumber} dari ${totalQuestions - 1}`}
        </span>
        <span style={{
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-light)',
          fontVariantNumeric: 'tabular-nums',
        }}>
          {Math.round(progress)}%
        </span>
      </div>

      {/* Question text */}
      <div style={{ padding: '1.25rem 2rem 1.75rem' }}>
        {isClosing && (
          <p style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            letterSpacing: 'var(--tracking-wider)',
            textTransform: 'uppercase',
            color: 'var(--color-accent)',
            marginBottom: '0.5rem',
          }}>
            🎉 Hampir selesai!
          </p>
        )}
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.1rem, 2.5vw, 1.375rem)',
          fontWeight: 500,
          color: 'var(--color-text)',
          lineHeight: 'var(--leading-snug)',
        }}>
          {question.text}
        </h2>
      </div>

      {/* Answer Options */}
      <div style={{
        padding: '0 1.25rem 1.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.625rem',
      }}>
        {question.options.map((opt, i) => (
          <AnswerOption
            key={opt.id}
            option={opt}
            index={i}
            onSelect={() => onAnswer(opt)}
            isClosing={isClosing}
          />
        ))}
      </div>
    </div>
  );
}

function AnswerOption({ option, index, onSelect, isClosing }) {
  const el = !isClosing && option.targetType ? ELEMENT_STYLE[option.targetType] : null;

  return (
    <motion.button
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onClick={onSelect}
      whileHover={{ scale: 1.015, x: 4 }}
      whileTap={{ scale: 0.98 }}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '0.875rem',
        padding: '0.875rem 1.25rem',
        background: 'var(--color-surface)',
        border: '1.5px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'border-color 0.15s, background 0.15s',
        fontFamily: 'var(--font-body)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = el ? el.color : 'var(--color-accent)';
        e.currentTarget.style.background = el ? el.light : 'var(--color-accent-light)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--color-border)';
        e.currentTarget.style.background = 'var(--color-surface)';
      }}
    >
      {/* Option letter */}
      <span style={{
        width: 28,
        height: 28,
        borderRadius: '50%',
        background: el ? el.light : 'var(--color-surface-2)',
        color: el ? el.color : 'var(--color-text-muted)',
        fontSize: 'var(--text-xs)',
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        border: `1px solid ${el ? el.color + '30' : 'var(--color-border)'}`,
      }}>
        {String.fromCharCode(65 + index)}
      </span>

      <span style={{
        fontSize: 'var(--text-sm)',
        color: 'var(--color-text)',
        lineHeight: 'var(--leading-snug)',
        flex: 1,
      }}>
        {option.text}
      </span>
    </motion.button>
  );
}
