import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QuestionCard from './QuestionCard';

/**
 * CardStack — Tumpukan kartu soal dengan animasi slide out
 * Menampilkan kartu terdepan secara aktif dan 2 kartu "bayangan" di belakangnya
 */
export default function CardStack({
  questions,
  currentIndex,
  onAnswer,
  direction = 'left', // arah slide-out terakhir
}) {
  const totalQuestions = questions.length;
  const remaining = questions.slice(currentIndex);

  // Kartu yang ditampilkan: terdepan + max 2 bayangan di belakang
  const visibleCards = remaining.slice(0, 3).reverse(); // reverse agar yang belakang render duluan

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      maxWidth: 520,
      height: 'auto',
      minHeight: 520,
    }}>
      <AnimatePresence mode="wait">
        {visibleCards.map((question, stackIndex) => {
          const reversedIndex = visibleCards.length - 1 - stackIndex;
          const isActive = reversedIndex === 0;

          // Bayangan cards di belakang
          const scale = 1 - reversedIndex * 0.04;
          const yOffset = reversedIndex * 12;
          const opacity = 1 - reversedIndex * 0.25;

          return (
            <motion.div
              key={question.id}
              style={{
                position: isActive ? 'relative' : 'absolute',
                top: 0,
                left: 0,
                right: 0,
                transformOrigin: 'bottom center',
                zIndex: visibleCards.length - reversedIndex,
                pointerEvents: isActive ? 'auto' : 'none',
              }}
              initial={
                isActive
                  ? { opacity: 0, x: direction === 'left' ? 60 : -60, scale: 0.95 }
                  : { opacity, scale, y: yOffset }
              }
              animate={
                isActive
                  ? { opacity: 1, x: 0, scale: 1, y: 0 }
                  : { opacity, scale, y: yOffset }
              }
              exit={
                isActive
                  ? { opacity: 0, x: direction === 'left' ? -80 : 80, scale: 0.95 }
                  : { opacity: 0 }
              }
              transition={{
                duration: 0.38,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {isActive ? (
                <QuestionCard
                  question={question}
                  onAnswer={onAnswer}
                  questionNumber={currentIndex + 1}
                  totalQuestions={totalQuestions}
                />
              ) : (
                /* Bayangan kartu — hanya tampilkan outline */
                <div style={{
                  width: '100%',
                  height: 80,
                  background: '#fff',
                  borderRadius: 'var(--radius-2xl)',
                  border: '1px solid var(--color-border)',
                  boxShadow: 'var(--shadow-md)',
                }} />
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
