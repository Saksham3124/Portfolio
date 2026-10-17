"use client";

import React, { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

interface Particle {
  baseXRatio: number; // 0.15 - 0.85 of container width
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
  radius: number; // 0.75 - 1.6 px
  baseAlpha: number; // 0.25 - 0.65
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

    // Curated color palette: electric cyan, sky blue, royal blue, muted slate blue
    const colorPalette = [
      "6, 182, 212",   // Electric cyan
      "56, 189, 248",  // Electric sky blue
      "59, 130, 246",  // Royal / cobalt blue
      "147, 197, 253", // Soft luminous light blue
      "148, 163, 184", // Muted slate blue
    ];

    // Generate sparse, elegant particles distributed along the vertical strip
    const particleCount = isTouch ? 18 : 34;
    const particles: Particle[] = Array.from({ length: particleCount }, (_, idx) => {
      // Evenly distribute base anchors vertically with slight jitter to prevent clustering
      const segmentHeight = 1 / particleCount;
      const baseY = Math.max(
        0.02,
        Math.min(0.98, idx * segmentHeight + (Math.random() - 0.5) * segmentHeight * 0.8)
      );

      return {
        baseXRatio: 0.18 + Math.random() * 0.64,
        baseYRatio: baseY,
        driftSpeedX: 0.0006 + Math.random() * 0.0009,
        driftSpeedY: 0.0008 + Math.random() * 0.0012,
        driftAmpX: 4 + Math.random() * 7,
        driftAmpY: 5 + Math.random() * 9,
        driftPhase: Math.random() * Math.PI * 2,
        ox: 0,
        oy: 0,
        ovx: 0,
        ovy: 0,
        radius: 0.75 + Math.random() * 0.85,
        baseAlpha: 0.28 + Math.random() * 0.38,
        colorBase: colorPalette[idx % colorPalette.length],
        pulseSpeed: 0.0015 + Math.random() * 0.002,
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
      // Gradually reveals smoothly between 220px and 480px scroll depth
      const heroFade = Math.min(1, Math.max(0, (currentScrollY - 220) / 240));

      if (heroFade > 0.005) {
        const elapsed = now - startTime;
        const interactionRadius = 75; // Small localized cursor radius

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];

          // 1. Organic, extremely slow floating drift
          const driftX =
            Math.sin(elapsed * p.driftSpeedX + p.driftPhase) * p.driftAmpX;
          const driftY =
            Math.cos(elapsed * p.driftSpeedY + p.driftPhase) * p.driftAmpY;

          const currentX = p.baseXRatio * width + driftX + p.ox;
          const currentY = p.baseYRatio * height + driftY + p.oy;

          // 2. Cursor repulsion physics (only if cursor is active and within interaction radius)
          let proximityBoost = 0;
          if (!isTouch && !shouldReduceMotion && mousePos.x > -500) {
            const dx = currentX - mousePos.x;
            const dy = currentY - mousePos.y;
            const dist = Math.hypot(dx, dy);

            if (dist < interactionRadius && dist > 0.5) {
              const force = (1 - dist / interactionRadius);
              const angle = Math.atan2(dy, dx);

              // Gentle repulsion impulse away from cursor
              p.ovx += Math.cos(angle) * force * 1.4;
              p.ovy += Math.sin(angle) * force * 1.4;

              // Subtle luminescence boost when cursor is near
              proximityBoost = force * 0.38;
            }
          }

          // 3. Smooth spring return to original resting position with damping
          p.ovx += -p.ox * 0.045;
          p.ovy += -p.oy * 0.045;
          p.ovx *= 0.88;
          p.ovy *= 0.88;
          p.ox += p.ovx;
          p.oy += p.ovy;

          // 4. Subtle alpha breathing / twinkle
          const pulse =
            0.82 + Math.sin(elapsed * p.pulseSpeed + p.pulsePhase) * 0.18;
          const finalAlpha = Math.min(
            1,
            (p.baseAlpha * pulse + proximityBoost) * heroFade
          );

          // 5. Render particle
          ctx.save();
          if (proximityBoost > 0.08) {
            ctx.shadowColor = "rgba(6, 182, 212, 0.85)";
            ctx.shadowBlur = 5;
            ctx.fillStyle = `rgba(186, 230, 253, ${finalAlpha})`;
          } else {
            ctx.shadowColor = `rgba(${p.colorBase}, 0.5)`;
            ctx.shadowBlur = p.radius > 1.2 ? 3 : 0;
            ctx.fillStyle = `rgba(${p.colorBase}, ${finalAlpha})`;
          }

          ctx.beginPath();
          ctx.arc(currentX, currentY, p.radius + proximityBoost * 0.3, 0, Math.PI * 2);
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
