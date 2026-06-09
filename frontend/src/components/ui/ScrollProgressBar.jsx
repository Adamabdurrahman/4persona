import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * ScrollProgressBar — Gold bar at top of page tracking scroll depth
 */
export default function ScrollProgressBar() {
  const location = useLocation();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });
  const [visible, setVisible] = useState(false);

  const showOn = ['/report/', '/profile', '/admin'];
  const shouldShow = showOn.some(p => location.pathname.startsWith(p)) || location.pathname === '/';

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v) => setVisible(v > 0.01));
    return unsubscribe;
  }, [scrollYProgress]);

  if (!shouldShow) return null;

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        height: 2,
        background: 'var(--color-accent)',
        scaleX,
        transformOrigin: '0%',
        zIndex: 9999,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s',
        pointerEvents: 'none',
      }}
    />
  );
}
