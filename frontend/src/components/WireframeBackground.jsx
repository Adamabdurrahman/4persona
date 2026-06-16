import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import * as THREE from 'three';

/**
 * WireframeBackground — Animasi geometri 3D wireframe sebagai background dekoratif
 *
 * Teknik morphing: Rotation-swap — objek berputar cepat saat hendak ganti bentuk,
 * lalu melambat setelah geometry baru terpasang.
 *
 * Dirender via React Portal ke document.body agar benar-benar fixed ke viewport.
 * Ini menghindari masalah CSS transform dari Framer Motion (motion.main di PageWrapper)
 * yang mengubah containing block untuk position:fixed children.
 *
 * @param {string}  elementKey - 'API' | 'AIR' | 'ANGIN' | 'TANAH' | 'accent'
 * @param {number}  opacity    - Opacity wireframe (0–1), default 0.18
 */

// Actual hex colors — Three.js tidak mengerti CSS variables
const ELEMENT_HEX = {
  API:    '#b83232',
  AIR:    '#3b77bc', // Ditingkatkan ke sapphire blue cerah agar wireframe air terlihat jelas
  ANGIN:  '#c5963a',
  TANAH:  '#3a5c3a',
  accent: '#b48d53', // Lebih gelap/rich dibanding #c9a96e agar terlihat jelas
};

// Geometry builders — 5 bentuk geometri yang akan di-swap
const GEOM_BUILDERS = [
  () => new THREE.BoxGeometry(1.2, 1.2, 1.2),
  () => new THREE.TetrahedronGeometry(1.1, 0),
  () => new THREE.OctahedronGeometry(1.0, 0),
  () => new THREE.DodecahedronGeometry(0.95, 0),
  () => new THREE.IcosahedronGeometry(0.9, 0),
];

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function buildEdges(gi) {
  return new THREE.EdgesGeometry(GEOM_BUILDERS[gi]());
}

function spawnObjects(scene, count, W, H) {
  const list = [];
  const isDesktop = W >= 1024;
  const cardHalfWidth = 360; // Setengah dari 720px
  const marginPx = 40; // Jarak aman dari card

  for (let i = 0; i < count; i++) {
    const gi = Math.floor(Math.random() * GEOM_BUILDERS.length);
    const geom = buildEdges(gi);
    const dummyMat  = new THREE.LineBasicMaterial({ transparent: true, opacity: 0 });

    // Gunakan Group untuk menggabungkan 5 mesh wireframe dengan sedikit offset cross-pattern.
    // Ini mensimulasikan ketebalan garis (fat-line 5px blueprint style) yang sangat jelas lintas browser.
    const group = new THREE.Group();

    // Line 1: Tengah
    const m1 = new THREE.LineSegments(geom, dummyMat);
    group.add(m1);

    // Line 2: Atas-Kanan
    const m2 = new THREE.LineSegments(geom, dummyMat);
    m2.position.set(0.022, 0.022, 0);
    group.add(m2);

    // Line 3: Bawah-Kiri
    const m3 = new THREE.LineSegments(geom, dummyMat);
    m3.position.set(-0.022, -0.022, 0);
    group.add(m3);

    // Line 4: Atas-Kiri
    const m4 = new THREE.LineSegments(geom, dummyMat);
    m4.position.set(-0.022, 0.022, 0.022);
    group.add(m4);

    // Line 5: Bawah-Kanan
    const m5 = new THREE.LineSegments(geom, dummyMat);
    m5.position.set(0.022, -0.022, -0.022);
    group.add(m5);

    // Tentukan penempatan kiri/kanan di desktop agar tidak tertutup card profil di tengah
    const isLeft = isDesktop ? (i % 2 === 0) : (Math.random() < 0.5);

    // Hitung batas awal berdasarkan kedalaman Z acak agar presisi di dalam viewport
    const startZ = rand(-7, -2);
    const D = 13 - startZ; // camera.position.z = 13
    const fovRad = (55 * Math.PI) / 360;
    const hVisible = 2 * D * Math.tan(fovRad);
    const aspect = W / H;
    const wVisible = hVisible * aspect;
    const halfW = wVisible / 2;

    let xMin, xMax;
    if (isDesktop) {
      if (isLeft) {
        const leftLimitPx = W / 2 - cardHalfWidth - marginPx;
        xMin = -halfW;
        xMax = ((leftLimitPx / W) * 2 - 1) * halfW;
        if (xMax < -halfW + 1.5) xMax = -halfW + 1.5;
      } else {
        const rightLimitPx = W / 2 + cardHalfWidth + marginPx;
        xMin = ((rightLimitPx / W) * 2 - 1) * halfW;
        xMax = halfW;
        if (xMin > halfW - 1.5) xMin = halfW - 1.5;
      }
    } else {
      xMin = -halfW;
      xMax = halfW;
    }

    const startX = rand(xMin, xMax);
    const startY = rand(-(hVisible / 2 - 1.0), hVisible / 2 - 1.0);

    group.scale.setScalar(rand(0.55, 1.25));
    group.position.set(startX, startY, startZ);
    group.rotation.set(
      rand(0, Math.PI * 2),
      rand(0, Math.PI * 2),
      rand(0, Math.PI * 2),
    );

    scene.add(group);

    // Kecepatan gerak drift 2D lambat/santai (unit per milidetik)
    const vx = (Math.random() < 0.5 ? 1 : -1) * rand(0.00015, 0.00035);
    const vy = (Math.random() < 0.5 ? 1 : -1) * rand(0.00015, 0.00035);

    list.push({
      group,
      meshes: [m1, m2, m3, m4, m5],
      geomIndex:   gi,
      isLeft,
      vx,
      vy,
      rx: (Math.random() < 0.5 ? 1 : -1) * rand(0.002, 0.005),
      ry: (Math.random() < 0.5 ? 1 : -1) * rand(0.003, 0.007),
      rz: (Math.random() < 0.5 ? 1 : -1) * rand(0.001, 0.003),
      morphTimer:  rand(0, 10000),
      morphDur:    rand(7000, 15000),
    });
  }
  return list;
}

export default function WireframeBackground({ elementKey = 'accent', opacity = 0.18 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.warn('[WireframeBackground] Canvas ref is null');
      return;
    }

    const W = window.innerWidth;
    const H = window.innerHeight;
    const count = W < 768 ? 3 : 6;
    console.log('[WireframeBackground] Initializing with', { elementKey, opacity, count, W, H });

    // Renderer dengan alpha: true → background transparan
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(W, H, false);
    renderer.setClearColor(0x000000, 0);

    // Scene & Camera
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 100);
    camera.position.z = 13;

    // Shared material
    const hex = ELEMENT_HEX[elementKey] ?? ELEMENT_HEX.accent;
    const sharedMat = new THREE.LineBasicMaterial({
      color:       new THREE.Color(hex),
      transparent: true,
      opacity,
    });

    // Spawn objects & replace placeholder material — pasang W dan H
    const objects = spawnObjects(scene, count, W, H);
    for (const o of objects) {
      for (const mesh of o.meshes) {
        mesh.material.dispose();
        mesh.material = sharedMat;
      }
    }

    // Resize handler
    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    window.addEventListener('resize', onResize);

    // Animation loop
    let rafId;
    let lastT = 0;

    const animate = (t) => {
      rafId = requestAnimationFrame(animate);
      if (document.hidden) return;

      const dt = Math.min(t - lastT, 50);
      lastT = t;

      const currW = window.innerWidth;
      const currH = window.innerHeight;
      const isDesktop = currW >= 1024;
      const cardHalfWidth = 360;
      const marginPx = 40;

      for (const o of objects) {
        // Update pergerakan dinamis drift 2D
        o.group.position.x += o.vx * dt;
        o.group.position.y += o.vy * dt;

        // Hitung batas dinamis berdasarkan kedalaman objek (Z) dan ukuran viewport saat ini
        const D = 13 - o.group.position.z;
        const fovRad = (55 * Math.PI) / 360;
        const hVisible = 2 * D * Math.tan(fovRad);
        const aspect = currW / currH;
        const wVisible = hVisible * aspect;
        const halfW = wVisible / 2;

        let xMin, xMax;
        if (isDesktop) {
          if (o.isLeft) {
            // Kiri: dari tepi kiri layar sampai tepi kiri card (W/2 - 360 - marginPx)
            const leftLimitPx = currW / 2 - cardHalfWidth - marginPx;
            xMin = -halfW;
            xMax = ((leftLimitPx / currW) * 2 - 1) * halfW;
            if (xMax < -halfW + 1.5) xMax = -halfW + 1.5;
          } else {
            // Kanan: dari tepi kanan card (W/2 + 360 + marginPx) sampai tepi kanan layar
            const rightLimitPx = currW / 2 + cardHalfWidth + marginPx;
            xMin = ((rightLimitPx / currW) * 2 - 1) * halfW;
            xMax = halfW;
            if (xMin > halfW - 1.5) xMin = halfW - 1.5;
          }
        } else {
          // Mobile: bebas melayang penuh
          xMin = -halfW;
          xMax = halfW;
        }

        // Batas pantulan vertikal dinamis (agar tidak terpotong bagian atas/bawah layar)
        const halfH = hVisible / 2;
        const yBound = halfH - 1.0; // Sisakan ruang 1 unit agar mesh tidak melintasi batas viewport
        
        if (o.group.position.y > yBound) {
          o.group.position.y = yBound;
          o.vy = -Math.abs(o.vy);
        } else if (o.group.position.y < -yBound) {
          o.group.position.y = -yBound;
          o.vy = Math.abs(o.vy);
        }

        // Pantulan horizontal dinamis sesuai zona kiri/kanan card
        if (o.group.position.x > xMax) {
          o.group.position.x = xMax;
          o.vx = -Math.abs(o.vx);
        } else if (o.group.position.x < xMin) {
          o.group.position.x = xMin;
          o.vx = Math.abs(o.vx);
        }

        o.morphTimer += dt;
        const progress = o.morphTimer / o.morphDur;

        // Spin-up: 1x normal → 11x cepat saat mendekati morph
        const spinFactor = progress > 0.8
          ? 1 + ((progress - 0.8) / 0.2) * 10
          : 1;

        o.group.rotation.x += o.rx * spinFactor;
        o.group.rotation.y += o.ry * spinFactor;
        o.group.rotation.z += o.rz * spinFactor;

        // Swap geometry di puncak kecepatan
        if (o.morphTimer >= o.morphDur) {
          o.morphTimer = 0;
          o.morphDur   = rand(7000, 15000);

          let next;
          do {
            next = Math.floor(Math.random() * GEOM_BUILDERS.length);
          } while (next === o.geomIndex && GEOM_BUILDERS.length > 1);

          o.geomIndex = next;
          
          const oldGeom = o.meshes[0].geometry; // Semuanya berbagi geometry yang sama
          const newGeom = buildEdges(next);
          
          for (const mesh of o.meshes) {
            mesh.geometry = newGeom;
          }
          
          oldGeom.dispose();
        }
      }

      renderer.render(scene, camera);
    };

    rafId = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      for (const o of objects) {
        o.meshes[0].geometry.dispose();
        scene.remove(o.group);
      }
      sharedMat.dispose();
      renderer.dispose();
    };
  }, [elementKey, opacity]);

  // KUNCI: Portal ke document.body agar canvas tidak terpengaruh
  // CSS transform Framer Motion dari parent (motion.main di PageWrapper)
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
    document.body,
  );
}
