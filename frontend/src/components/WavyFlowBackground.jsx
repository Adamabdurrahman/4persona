import { useEffect, useRef } from 'react';

/**
 * WavyFlowBackground — Animasi 2D canvas latar belakang yang menampilkan 2 garis putih
 * meliuk-liuk secara organik (seperti angin/asap) dan memudar di bagian tengah.
 */
export default function WavyFlowBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = canvas.width = canvas.offsetWidth;
    let H = canvas.height = canvas.offsetHeight;

    const onResize = () => {
      if (!canvas) return;
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', onResize);

    let rafId;
    let t = 0;

    // Parameter gelombang untuk Line 1 & Line 2
    // Line 1: Lebih cepat, amplitudo lebih besar
    const line1 = {
      centerY: H / 2 - 25,
      amp1: 45,
      freq1: 0.004,
      speed1: 0.0012,
      amp2: 15,
      freq2: 0.008,
      speed2: 0.0022,
      lineWidth: 1.8,
    };

    // Line 2: Lebih lambat, amplitudo lebih kecil, offset vertikal ke bawah
    const line2 = {
      centerY: H / 2 + 35,
      amp1: 30,
      freq1: 0.003,
      speed1: 0.0008,
      amp2: 10,
      freq2: 0.006,
      speed2: 0.0016,
      lineWidth: 1.2,
    };

    const drawLine = (config) => {
      ctx.beginPath();
      ctx.lineWidth = config.lineWidth;
      
      // Setup glow lembut
      ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
      ctx.shadowBlur = 8;

      // Setup gradient horizontal untuk memudar di tengah dan tepi
      const grad = ctx.createLinearGradient(0, 0, W, 0);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      grad.addColorStop(0.12, 'rgba(255, 255, 255, 0.35)');
      grad.addColorStop(0.35, 'rgba(255, 255, 255, 0.35)');
      grad.addColorStop(0.46, 'rgba(255, 255, 255, 0)'); // Pudar penuh sebelum konten tengah
      grad.addColorStop(0.54, 'rgba(255, 255, 255, 0)'); // Mulai muncul kembali setelah konten
      grad.addColorStop(0.65, 'rgba(255, 255, 255, 0.35)');
      grad.addColorStop(0.88, 'rgba(255, 255, 255, 0.35)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.strokeStyle = grad;

      // Gambar garis dari kiri ke kanan dengan increment 4px
      for (let x = 0; x <= W; x += 4) {
        // Gabungan sine & cosine waves untuk gerakan organik meliuk
        const y = config.centerY + 
          Math.sin(x * config.freq1 + t * config.speed1) * config.amp1 + 
          Math.cos(x * config.freq2 - t * config.speed2) * config.amp2;

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    };

    const render = (timestamp) => {
      t = timestamp;
      ctx.clearRect(0, 0, W, H);
      
      // Update centerY dinamis jika tinggi canvas berubah saat resize
      line1.centerY = H / 2 - 25;
      line2.centerY = H / 2 + 35;

      drawLine(line1);
      drawLine(line2);

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
