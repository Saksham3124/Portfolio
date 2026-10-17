"use client";

import React, { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

interface Particle {
  baseXRatio: number; // 0.14 - 0.84 of container width
  baseYRatio: number; // 0.02 - 0.98 of container height
  driftSpeedX: number;
  driftSpeedY: number;
  driftAmpX: number;
  driftAmpY: number;
  driftPhase: number;
  ox: number; // interactive repulsion offset X
  oy: number; // interactive repulsion offset Y
  ovx: number; // velocity X
  ovy: number; // velocity Y
  radius: number; // 0.55 - 1.45 px (1 - 3 CSS px diameter)
  baseAlpha: number; // 0.20 - 0.58
  colorBase: string; // RGB string e.g. "6, 182, 212"
  pulseSpeed: number;
  pulsePhase: number;
}

export const DataWaveform: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Detect touch / coarse pointer
    const isTouch =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches;

    // Handle high-DPI retina screens and responsive resizing
    const handleResize = () => {
      if (!canvas) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });

    // Track scroll position to fade in after hero section (> 220px)
    let currentScrollY = window.scrollY;
    const handleScroll = () => {
      currentScrollY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Track cursor position for subtle localized repulsion
    const mousePos = { x: -1000, y: -1000 };
    const handlePointerMove = (e: PointerEvent) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
    };
    const handlePointerLeave = () => {
      mousePos.x = -1000;
      mousePos.y = -1000;
    };

    if (!isTouch) {
      window.addEventListener("pointermove", handlePointerMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", handlePointerLeave, { passive: true });
    }

    // Curated color palette: muted slate blue, deep cobalt, soft sky, cyan accents
    const colorPalette = [
      "148, 163, 184", // Muted slate / steel blue (neutral, understated)
      "59, 130, 246",  // Deep royal / cobalt blue
      "56, 189, 248",  // Soft electric sky blue
      "6, 182, 212",   // Electric cyan accent
      "147, 197, 253", // Pale luminous sky blue
    ];

    // Increased particle density: ~60% increase from baseline 34 -> 55 particles (28 on touch)
    const particleCount = isTouch ? 28 : 55;

    // Subtle natural clustering attractor centers along the vertical strip
    const clusterAttractors = [0.22, 0.48, 0.76];

    const particles: Particle[] = Array.from({ length: particleCount }, (_, idx) => {
      let baseY: number;

      // ~35% of particles form subtle organic cluster groupings around attractors
      if (idx % 3 === 0) {
        const attractor = clusterAttractors[(idx / 3) % clusterAttractors.length];
        const jitter = (Math.random() - 0.5) * 0.12;
        baseY = Math.max(0.04, Math.min(0.96, attractor + jitter));
      } else {
        // Remaining 65% distribute evenly along the visible height with slight stratified jitter
        const segmentHeight = 1 / particleCount;
        baseY = Math.max(
          0.02,
          Math.min(0.98, idx * segmentHeight + (Math.random() - 0.5) * segmentHeight * 0.9)
        );
      }

      // Particle size distribution:
      // ~75% tiny (0.55 - 0.95 px radius => 1.1 - 1.9 CSS px diameter)
      // ~25% slightly larger (1.05 - 1.45 px radius) for visual depth
      const isLarger = Math.random() < 0.25;
      const radius = isLarger
        ? 1.05 + Math.random() * 0.4
        : 0.55 + Math.random() * 0.4;

      // Opacity: mostly low/subtle (0.20 - 0.42), occasional accent at 0.55
      const baseAlpha = isLarger
        ? 0.38 + Math.random() * 0.2
        : 0.2 + Math.random() * 0.25;

      return {
        baseXRatio: 0.14 + Math.random() * 0.72,
        baseYRatio: baseY,
        driftSpeedX: 0.00025 + Math.random() * 0.00045,
        driftSpeedY: 0.0003 + Math.random() * 0.0005,
        driftAmpX: 1.8 + Math.random() * 3.5,
        driftAmpY: 2.2 + Math.random() * 4.2,
        driftPhase: Math.random() * Math.PI * 2,
        ox: 0,
        oy: 0,
        ovx: 0,
        ovy: 0,
        radius,
        baseAlpha,
        colorBase: colorPalette[idx % colorPalette.length],
        pulseSpeed: 0.0012 + Math.random() * 0.0018,
        pulsePhase: Math.random() * Math.PI * 2,
      };
    });

    const startTime = performance.now();

    const render = (now: number) => {
      if (!ctx || width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Hero section behavior:
      // Completely hidden when in hero section (< 220px)
      // Gradually reveals smoothly between 220px and 460px scroll depth
      const heroFade = Math.min(1, Math.max(0, (currentScrollY - 220) / 240));

      if (heroFade > 0.005) {
        const elapsed = now - startTime;
        const interactionRadius = 75; // Localized cursor interaction radius

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];

          // 1. Organic, extremely slow floating micro-drift
          const driftX =
            Math.sin(elapsed * p.driftSpeedX + p.driftPhase) * p.driftAmpX;
          const driftY =
            Math.cos(elapsed * p.driftSpeedY + p.driftPhase) * p.driftAmpY;

          const currentX = p.baseXRatio * width + driftX + p.ox;
          const currentY = p.baseYRatio * height + driftY + p.oy;

          // 2. Cursor repulsion physics (only if pointer is active within interaction radius)
          let proximityBoost = 0;
          if (!isTouch && !shouldReduceMotion && mousePos.x > -500) {
            const dx = currentX - mousePos.x;
            const dy = currentY - mousePos.y;
            const dist = Math.hypot(dx, dy);

            if (dist < interactionRadius && dist > 0.5) {
              const linearForce = 1 - dist / interactionRadius;
              const force = linearForce * linearForce; // Smooth quadratic falloff
              const angle = Math.atan2(dy, dx);

              // Gentle repulsion impulse away from pointer
              p.ovx += Math.cos(angle) * force * 1.35;
              p.ovy += Math.sin(angle) * force * 1.35;

              // Subtle luminescence boost when cursor is near
              proximityBoost = force * 0.32;
            }
          }

          // 3. Smooth spring return to original resting anchor with damping
          p.ovx += -p.ox * 0.05;
          p.ovy += -p.oy * 0.05;
          p.ovx *= 0.88;
          p.ovy *= 0.88;
          p.ox += p.ovx;
          p.oy += p.ovy;

          // Bounded displacement clamp: ensure particles move only a short distance (< 16px)
          const offsetDist = Math.hypot(p.ox, p.oy);
          if (offsetDist > 16) {
            p.ox = (p.ox / offsetDist) * 16;
            p.oy = (p.oy / offsetDist) * 16;
          }

          // 4. Subtle alpha breathing / twinkle
          const pulse =
            0.85 + Math.sin(elapsed * p.pulseSpeed + p.pulsePhase) * 0.15;
          const finalAlpha = Math.min(
            1,
            (p.baseAlpha * pulse + proximityBoost) * heroFade
          );

          // 5. Render particle
          ctx.save();
          if (proximityBoost > 0.08) {
            ctx.shadowColor = "rgba(6, 182, 212, 0.85)";
            ctx.shadowBlur = 4;
            ctx.fillStyle = `rgba(186, 230, 253, ${finalAlpha})`;
          } else {
            ctx.shadowColor = `rgba(${p.colorBase}, 0.4)`;
            ctx.shadowBlur = p.radius > 1.1 ? 2.5 : 0;
            ctx.fillStyle = `rgba(${p.colorBase}, ${finalAlpha})`;
          }

          ctx.beginPath();
          ctx.arc(currentX, currentY, p.radius + proximityBoost * 0.25, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // Continue animation loop if motion is enabled
      if (!shouldReduceMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    if (shouldReduceMotion) {
      render(startTime);
    } else {
      animationFrameId = requestAnimationFrame(render);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      if (!isTouch) {
        window.removeEventListener("pointermove", handlePointerMove);
        document.documentElement.removeEventListener("pointerleave", handlePointerLeave);
      }
    };
  }, [shouldReduceMotion]);

  return (
    <div
      aria-hidden="true"
      className="fixed left-0 top-0 h-screen w-14 sm:w-16 md:w-20 z-20 pointer-events-none select-none overflow-hidden hidden sm:block"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ pointerEvents: "none" }}
      />
    </div>
  );
};
