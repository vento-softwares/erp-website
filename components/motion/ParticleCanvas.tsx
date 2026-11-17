'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from './hooks';

type Particle = { x: number; y: number; s: number; r: number; c: string; a: number };

const LINK_DISTANCE_SQ = 8100; // 90px

/** Slowly rising, loosely connected particles behind the hero. */
export function ParticleCanvas({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || reduced) return;

    const fit = () => {
      canvas.width = canvas.offsetWidth || 1;
      canvas.height = canvas.offsetHeight || 1;
    };
    fit();
    window.addEventListener('resize', fit);

    const n = Math.round(Math.min(70, (canvas.width || 900) / 16));
    const points: Particle[] = Array.from({ length: n }, () => ({
      x: Math.random(),
      y: Math.random(),
      s: 0.3 + Math.random() * 0.9,
      r: 0.6 + Math.random() * 1.3,
      c: Math.random() > 0.45 ? '108,99,245' : '76,201,240',
      a: 0.12 + Math.random() * 0.3,
    }));

    let raf = 0;
    let cleared = false;

    const draw = () => {
      raf = requestAnimationFrame(draw);
      // Off-screen: clear once and idle until the hero is visible again.
      if (window.scrollY > window.innerHeight * 1.5) {
        if (!cleared) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          cleared = true;
        }
        return;
      }
      cleared = false;

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      for (const p of points) {
        p.y -= p.s * 0.0006;
        if (p.y < -0.02) {
          p.y = 1.02;
          p.x = Math.random();
        }
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.c},${p.a})`;
        ctx.fill();
      }

      ctx.lineWidth = 1;
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const a = points[i];
          const b = points[j];
          const dx = (a.x - b.x) * w;
          const dy = (a.y - b.y) * h;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK_DISTANCE_SQ) {
            ctx.strokeStyle = `rgba(108,99,245,${0.05 * (1 - d2 / LINK_DISTANCE_SQ)})`;
            ctx.beginPath();
            ctx.moveTo(a.x * w, a.y * h);
            ctx.lineTo(b.x * w, b.y * h);
            ctx.stroke();
          }
        }
      }
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', fit);
    };
  }, [reduced]);

  return <canvas ref={ref} aria-hidden className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />;
}
