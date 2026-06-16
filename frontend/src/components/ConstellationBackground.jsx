import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

/**
 * ConstellationBackground — Animasi jaring konstelasi minimalis di sisi kiri & kanan layar.
 * Gerakan, arah, kecepatan, dan warna beradaptasi secara dinamis berdasarkan elemen user.
 * 
 * @param {string} elementKey - 'API' | 'AIR' | 'ANGIN' | 'TANAH'
 */
const ELEMENT_COLORS = {
  API:    '#b83232',
  AIR:    '#3b77bc',
  ANGIN:  '#c5963a',
  TANAH:  '#3a5c3a',
  accent: '#b48d53',
};

export default function ConstellationBackground({ elementKey = 'accent' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    // Deteksi desktop
    let isDesktop = W >= 1024;

    const onResize = () => {
      if (!canvas) return;
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      isDesktop = W >= 1024;
    };
    window.addEventListener('resize', onResize);

    // Kustomisasi konfigurasi berdasarkan tipe elemen
    const type = elementKey.toUpperCase();
    const colorHex = ELEMENT_COLORS[type] ?? ELEMENT_COLORS.accent;

    // Config default
    let speedXRange = [-0.03, 0.03];
    let speedYRange = [-0.03, 0.03];
    let nodeCount = 14;
    let pulseOpacity = false;

    if (type === 'API') {
      speedXRange = [-0.05, 0.05];
      speedYRange = [-0.18, -0.06]; // Bergerak ke atas perlahan (hawa panas)
      nodeCount = 20;
      pulseOpacity = true; // Berdenyut redup-terang seperti bara
    } else if (type === 'AIR') {
      speedXRange = [-0.04, 0.04];
      speedYRange = [0.06, 0.18]; // Bergerak ke bawah (mengalir seperti air)
      nodeCount = 18;
    } else if (type === 'ANGIN') {
      speedXRange = [0.08, 0.22]; // Bergerak horizontal kanan-kiri lebih dinamis
      speedYRange = [-0.04, 0.04];
      nodeCount = 16;
    } else if (type === 'TANAH') {
      speedXRange = [-0.015, 0.015]; // Sangat lambat/hampir diam (kokoh/grounded)
      speedYRange = [-0.015, 0.015];
      nodeCount = 12;
    }

    const rand = (min, max) => min + Math.random() * (max - min);

    // Spawn partikel khusus di area margin kiri & kanan (meninggalkan area tengah 720px + margin kosong)
    const cardHalfWidth = 360;
    const marginPx = 60; // Jarak aman terluar dari card
    const particles = [];

    const spawnParticle = (index) => {
      // Bagi rata: indeks genap di kiri, ganjil di kanan
      const isLeft = index % 2 === 0;
      
      let xMin, xMax;
      if (isLeft) {
        xMin = 20;
        xMax = Math.max(20, W / 2 - cardHalfWidth - marginPx);
      } else {
        xMin = Math.min(W - 20, W / 2 + cardHalfWidth + marginPx);
        xMax = W - 20;
      }

      return {
        x: rand(xMin, xMax),
        y: rand(0, H),
        r: rand(3.5, 5.5), // Diperbesar dari 1.5-3 ke 3.5-5.5 agar lebih jelas
        vx: rand(speedXRange[0], speedXRange[1]),
        vy: rand(speedYRange[0], speedYRange[1]),
        isLeft,
        pulseOffset: Math.random() * Math.PI * 2,
        pulseSpeed: rand(0.0015, 0.003),
      };
    };

    // Inisialisasi partikel
    for (let i = 0; i < nodeCount; i++) {
      particles.push(spawnParticle(i));
    }

    let rafId;
    let lastT = 0;

    const animate = (timestamp) => {
      rafId = requestAnimationFrame(animate);
      if (document.hidden) return;

      const dt = Math.min(timestamp - lastT, 50);
      lastT = timestamp;

      ctx.clearRect(0, 0, W, H);

      // Jangan jalankan animasi/render jika di mobile/tablet (lebar < 1024px)
      // Karena konten menempuh seluruh layar dan tidak ada margin kosong.
      if (!isDesktop) return;

      const leftMarginBound = W / 2 - cardHalfWidth - marginPx;
      const rightMarginBound = W / 2 + cardHalfWidth + marginPx;

      // Update posisi partikel
      particles.forEach((p, idx) => {
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        // Batas pantulan atas & bawah (y-axis wrapping/bounce)
        if (p.y < -10) {
          p.y = H + 10;
        } else if (p.y > H + 10) {
          p.y = -10;
        }

        // Batas pantulan horizontal (x-axis bounce)
        if (p.isLeft) {
          if (p.x < 15) {
            p.x = 15;
            p.vx = Math.abs(p.vx);
          } else if (p.x > leftMarginBound) {
            p.x = leftMarginBound;
            p.vx = -Math.abs(p.vx);
          }
        } else {
          if (p.x < rightMarginBound) {
            p.x = rightMarginBound;
            p.vx = Math.abs(p.vx);
          } else if (p.x > W - 15) {
            p.x = W - 15;
            p.vx = -Math.abs(p.vx);
          }
        }

        // Gambar titik partikel
        let currentOpacity = 0.45; // Ditingkatkan dari 0.28 agar lebih solid
        if (pulseOpacity) {
          // Efek berdenyut (khusus Api)
          currentOpacity = 0.25 + Math.sin(timestamp * p.pulseSpeed + p.pulseOffset) * 0.25;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = hexToRgba(colorHex, currentOpacity);
        ctx.fill();
      });

      // Hubungkan partikel dengan garis konstelasi
      ctx.lineWidth = 1.6; // Dipertebal dari 0.8 ke 1.6
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];

          // Hanya hubungkan jika berada di sisi yang sama (kiri dengan kiri, kanan dengan kanan)
          if (a.isLeft !== b.isLeft) continue;

          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 165) {
            // Opacity berkurang seiring jauhnya jarak
            let lineOpacity = (1 - dist / 165) * 0.22; // Ditingkatkan dari 0.09 agar garis lebih menyala
            if (pulseOpacity) {
              // Denyut garis selaras dengan partikel
              const wave = Math.sin(timestamp * 0.001) * 0.05;
              lineOpacity = Math.max(0.02, lineOpacity + wave);
            }

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = hexToRgba(colorHex, lineOpacity);
            ctx.stroke();
          }
        }
      }
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
    };
  }, [elementKey]);

  return createPortal(
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -1,
      }}
    />,
    document.body
  );
}

// Helper untuk konversi Hex ke RGBA
function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
