/**
 * elementData.js — Single source of truth untuk semua data elemen 4Persona
 *
 * Menggunakan pixel art dari folder ASET sebagai pengganti emoji.
 * Import file ini di semua halaman yang membutuhkan data elemen.
 */

import pixelFire  from '../assets/pixel-fire.png';
import pixelWater from '../assets/pixel-water.png';
import pixelLeaf  from '../assets/pixel-leaf.png';
import pixelDirt  from '../assets/pixel-dirt.png';

/**
 * PixelIcon — Komponen kecil untuk render pixel art element
 * @param {string} src   - path gambar
 * @param {string} alt   - alt text
 * @param {number} size  - ukuran dalam px (default 40)
 */
export function PixelIcon({ src, alt, size = 40, style = {} }) {
  return (
    <img
      src={src}
      alt={alt}
      draggable={false}
      style={{
        width: size,
        height: size,
        objectFit: 'contain',
        imageRendering: 'pixelated',
        display: 'inline-block',
        flexShrink: 0,
        ...style,
      }}
    />
  );
}

/**
 * ELEMENT_DATA — Map elemen ke semua properti visual & teks
 */
export const ELEMENT_DATA = {
  API: {
    emoji: '🔥',
    pixelSrc: pixelFire,
    name: 'Api',
    parfum: 'Choleric',
    color: 'var(--color-api)',
    light: 'var(--color-api-light)',
  },
  AIR: {
    emoji: '💧',
    pixelSrc: pixelWater,
    name: 'Air',
    parfum: 'Melancholic',
    color: 'var(--color-air)',
    light: 'var(--color-air-light)',
  },
  ANGIN: {
    emoji: '🍃',
    pixelSrc: pixelLeaf,
    name: 'Angin',
    parfum: 'Sanguine',
    color: 'var(--color-angin)',
    light: 'var(--color-angin-light)',
  },
  TANAH: {
    emoji: '🌿',
    pixelSrc: pixelDirt,
    name: 'Tanah',
    parfum: 'Phlegmatic',
    color: 'var(--color-tanah)',
    light: 'var(--color-tanah-light)',
  },
};

export default ELEMENT_DATA;
