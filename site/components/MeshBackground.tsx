'use client';

import { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface Pulse {
  a: number;
  b: number;
  t: number;
  speed: number;
}

const NODE_COUNT = 26;
const CONNECT_DIST = 200;
const PULSE_INTERVAL = 900;
// CPU budget (2026-09-11): a visitor's laptop hit ~180% CPU on this loop.
// The canvas now renders at most 30 fps, at no more than 1.5x device pixels,
// only while it is on screen and the tab is visible, and draws a single
// static frame for reduced-motion users. Size is cached from the
// ResizeObserver instead of forcing layout every frame.
const MAX_FPS = 30;
const MAX_DPR = 1.5;

export function MeshBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const frameInterval = 1000 / MAX_FPS;

    let animId = 0;
    let nodes: Node[] = [];
    let pulses: Pulse[] = [];
    let lastPulse = 0;
    let lastFrame = 0;
    let w = 0;
    let h = 0;
    let onScreen = true;
    let running = false;

    const initNodes = () => {
      nodes = Array.from({ length: NODE_COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
      }));
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initNodes();
      if (reducedMotion) renderFrame(performance.now(), true);
    };

    const getEdges = () => {
      const edges: [number, number, number][] = [];
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) edges.push([i, j, dist]);
        }
      }
      return edges;
    };

    const renderFrame = (ts: number, still = false) => {
      ctx.clearRect(0, 0, w, h);

      if (!still) {
        nodes.forEach(n => {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0) { n.x = 0; n.vx *= -1; }
          if (n.x > w) { n.x = w; n.vx *= -1; }
          if (n.y < 0) { n.y = 0; n.vy *= -1; }
          if (n.y > h) { n.y = h; n.vy *= -1; }
        });
      }

      const edges = getEdges();

      if (!still && ts - lastPulse > PULSE_INTERVAL && edges.length > 0) {
        const [a, b] = edges[Math.floor(Math.random() * edges.length)];
        pulses.push({ a, b, t: 0, speed: 0.007 + Math.random() * 0.005 });
        lastPulse = ts;
      }

      edges.forEach(([i, j, dist]) => {
        const alpha = (1 - dist / CONNECT_DIST) * 0.18;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.strokeStyle = `rgba(59,130,246,${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });

      nodes.forEach(n => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(96,165,250,0.45)';
        ctx.fill();
      });

      if (still) return;

      pulses = pulses.filter(p => {
        p.t += p.speed;
        if (p.t > 1) return false;
        const na = nodes[p.a];
        const nb = nodes[p.b];
        if (!na || !nb) return false;
        const px = na.x + (nb.x - na.x) * p.t;
        const py = na.y + (nb.y - na.y) * p.t;
        const g = ctx.createRadialGradient(px, py, 0, px, py, 10);
        g.addColorStop(0, 'rgba(147,197,253,0.75)');
        g.addColorStop(1, 'rgba(59,130,246,0)');
        ctx.beginPath();
        ctx.arc(px, py, 10, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(219,234,254,0.9)';
        ctx.fill();
        return true;
      });
    };

    const loop = (ts: number) => {
      if (!running) return;
      animId = requestAnimationFrame(loop);
      if (ts - lastFrame < frameInterval) return;
      lastFrame = ts;
      renderFrame(ts);
    };

    const start = () => {
      if (running || reducedMotion) return;
      running = true;
      lastFrame = 0;
      animId = requestAnimationFrame(loop);
    };

    const stop = () => {
      running = false;
      if (animId) cancelAnimationFrame(animId);
      animId = 0;
    };

    const sync = () => {
      if (onScreen && document.visibilityState === 'visible') start();
      else stop();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const io = new IntersectionObserver(entries => {
      onScreen = entries.some(e => e.isIntersecting);
      sync();
    }, { threshold: 0 });
    io.observe(canvas);

    document.addEventListener('visibilitychange', sync);
    sync();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.55 }}
    />
  );
}
