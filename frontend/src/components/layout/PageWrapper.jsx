import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';

/**
 * PageWrapper — Layout wrapper dengan Navbar, Footer, dan page transition
 * showFooter: tampilkan footer (default: true)
 * maxWidth:   override max-width (default: var(--max-width))
 */
export default function PageWrapper({
  children,
  showFooter = true,
  noPadding = false,
  className = '',
}) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <motion.main
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        style={{
          flex: 1,
          paddingTop: 'var(--navbar-height)',
        }}
        className={className}
      >
        {children}
      </motion.main>

      {showFooter && <Footer />}
    </div>
  );
}
