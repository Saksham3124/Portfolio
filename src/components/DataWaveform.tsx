"use client";

import React, { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

interface Particle {
  baseXRatio: number;
  baseYRatio: number;
  driftSpeedX: number;
  driftSpeedY: number;
  driftAmpX: number;
  driftAmpY: number;
  driftPhase: number;
  ox: number;
  oy: number;
  ovx: number;
  ovy: number;
  radius: number;
  baseAlpha: number;
  colorBase: string;
  pulseSpeed: number;
  pulsePhase: number;
  isFocal: boolean;
  rank: number;
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

    // Track scroll position
    let currentScrollY = window.scrollY;
    const handleScroll = () => {
      currentScrollY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Track cursor position for localized repulsion
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

    // Curated color palette: electric cyan, sky blue, luminous ice, diamond white, royal blue
    const colorPalette = [
      "6, 182, 212",   // Electric cyan
      "56, 189, 248",  // Vivid sky blue
      "186, 230, 253", // Soft luminous ice blue
      "240, 249, 255", // Sparkling diamond white-blue
      "59, 130, 246",  // Royal / cobalt blue
      "37, 99, 235",   // Deep electric blue
    ];

    // High density on the left border, but strictly confined away from central content
    const particleCount = isTouch ? 90 : 250;

    // Natural clustering attractor centers along the vertical axis
    const clusterAttractors = [0.14, 0.28, 0.44, 0.62, 0.78, 0.90];

    const particles: Particle[] = Array.from({ length: particleCount }, (_, idx) => {
      // Confine particles to the left margin/gutter:
      // Zone 1: Far-left dense core (75% of particles, 0.01 to 0.35 width)
      // Zone 2: Mid-gutter dispersion (20% of particles, 0.35 to 0.65 width)
      // Zone 3: Outer edge buffer (5% of particles, 0.65 to 0.78 width)
      let baseXRatio: number;
      const zoneSeed = Math.random();

      if (zoneSeed < 0.75) {
        baseXRatio = 0.01 + Math.pow(Math.random(), 1.45) * 0.34;
      } else if (zoneSeed < 0.95) {
        baseXRatio = 0.35 + Math.pow(Math.random(), 1.25) * 0.30;
      } else {
        baseXRatio = 0.65 + Math.random() * 0.13;
      }

      // Vertical distribution with natural clustering
      let baseY: number;
      if (idx % 4 === 0) {
        const attractor = clusterAttractors[(idx / 4) % clusterAttractors.length];
        const jitter = (Math.random() - 0.5) * 0.14;
        baseY = Math.max(0.02, Math.min(0.98, attractor + jitter));
      } else {
        const segmentHeight = 1 / particleCount;
        baseY = Math.max(
          0.02,
          Math.min(0.98, idx * segmentHeight + (Math.random() - 0.5) * segmentHeight * 0.95)
        );
      }

      // Particle hierarchy:
      // Focal stars and larger nodes are kept strictly in the far-left strip (baseXRatio <= 0.35)
      // Any particles extending further right are faint micro-dust
      let radius: number;
      let baseAlpha: number;
      let isFocal = false;

      if (baseXRatio <= 0.35) {
        const sizeSeed = Math.random();
        if (sizeSeed < 0.55) {
          radius = 0.65 + Math.random() * 0.45;
          baseAlpha = 0.50 + Math.random() * 0.30;
        } else if (sizeSeed < 0.85) {
          radius = 1.20 + Math.random() * 0.60;
          baseAlpha = 0.68 + Math.random() * 0.25;
        } else {
          radius = 2.00 + Math.random() * 0.65;
          baseAlpha = 0.88 + Math.random() * 0.12;
          isFocal = true;
        }
      } else {
        // Outer particles: low-density, delicate micro-dust that never crowds text
        radius = 0.55 + Math.random() * 0.40;
        baseAlpha = 0.22 + Math.random() * 0.20;
        isFocal = false;
      }

      return {
        baseXRatio,
        baseYRatio: baseY,
        driftSpeedX: 0.00018 + Math.random() * 0.00035,
        driftSpeedY: 0.00022 + Math.random() * 0.00040,
        driftAmpX: 1.5 + Math.random() * 3.2,
        driftAmpY: 2.0 + Math.random() * 3.8,
        driftPhase: Math.random() * Math.PI * 2,
        ox: 0,
        oy: 0,
        ovx: 0,
        ovy: 0,
        radius,
        baseAlpha,
        colorBase: isFocal
          ? "56, 189, 248"
          : colorPalette[idx % colorPalette.length],
        pulseSpeed: 0.0010 + Math.random() * 0.0020,
        pulsePhase: Math.random() * Math.PI * 2,
        isFocal,
        rank: Math.random(),
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
      // Completely hidden when in hero section (stays hidden until hero is >= 65% covered)
      // Ramps up smoothly as content card covers hero
      const heroCoverThreshold = window.innerHeight * 0.65;
      const heroFadeRange = window.innerHeight * 0.25;
      const heroFade = Math.min(1, Math.max(0, (currentScrollY - heroCoverThreshold) / heroFadeRange));

      if (heroFade > 0.005) {
        const elapsed = now - startTime;
        const interactionRadius = 85;

        // Section density modulation based on reference images:
        // About Section: Medium density (activeDensity = 1.0)
        // Contact Section: Lower density (activeDensity = 0.65)
        const docHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const scrollFraction = Math.min(1, Math.max(0, currentScrollY / docHeight));
        const activeDensity = 1.0 - scrollFraction * 0.35;

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];

          // Density gating: lower rank particles fade out toward Contact
          let densityFade = 1.0;
          if (p.rank > activeDensity) {
            densityFade = Math.max(0.08, 1 - (p.rank - activeDensity) / 0.35);
          }

          // 1. Floating micro-drift
          const driftX =
            Math.sin(elapsed * p.driftSpeedX + p.driftPhase) * p.driftAmpX;
          const driftY =
            Math.cos(elapsed * p.driftSpeedY + p.driftPhase) * p.driftAmpY;

          const currentX = p.baseXRatio * width + driftX + p.ox;
          const currentY = p.baseYRatio * height + driftY + p.oy;

          // 2. Cursor repulsion physics
          let proximityBoost = 0;
          if (!isTouch && !shouldReduceMotion && mousePos.x > -500) {
            const dx = currentX - mousePos.x;
            const dy = currentY - mousePos.y;
            const dist = Math.hypot(dx, dy);

            if (dist < interactionRadius && dist > 0.5) {
              const linearForce = 1 - dist / interactionRadius;
              const force = linearForce * linearForce;
              const angle = Math.atan2(dy, dx);

              p.ovx += Math.cos(angle) * force * 1.4;
              p.ovy += Math.sin(angle) * force * 1.4;

              proximityBoost = force * 0.35;
            }
          }

          // 3. Smooth spring return
          p.ovx += -p.ox * 0.045;
          p.ovy += -p.oy * 0.045;
          p.ovx *= 0.88;
          p.ovy *= 0.88;
          p.ox += p.ovx;
          p.oy += p.ovy;

          const offsetDist = Math.hypot(p.ox, p.oy);
          if (offsetDist > 16) {
            p.ox = (p.ox / offsetDist) * 16;
            p.oy = (p.oy / offsetDist) * 16;
          }

          // 4. Sharp lateral taper that completely prevents dots from bleeding into the central content area:
          // Left 35% of field: 100% brilliance
          // 35% to 68%: tapers gracefully from 1.0 to 0.25
          // 68% to 80%: tapers down to 0
          // > 80%: 0 opacity (completely clear content area)
          const xNorm = Math.min(1, Math.max(0, currentX / width));
          let lateralFade: number;
          if (xNorm < 0.35) {
            lateralFade = 1.0;
          } else if (xNorm < 0.68) {
            lateralFade = 1.0 - ((xNorm - 0.35) / 0.33) * 0.75;
          } else if (xNorm < 0.82) {
            lateralFade = Math.max(0, 0.25 * (1 - (xNorm - 0.68) / 0.14));
          } else {
            lateralFade = 0;
          }

          if (lateralFade <= 0.01) continue;

          // 5. Twinkle pulse
          const pulse =
            0.84 + Math.sin(elapsed * p.pulseSpeed + p.pulsePhase) * 0.16;
          const finalAlpha = Math.min(
            1,
            (p.baseAlpha * pulse * lateralFade * densityFade + proximityBoost) * heroFade
          );

          if (finalAlpha <= 0.02) continue;

          // 6. Render particle
          ctx.save();
          if (proximityBoost > 0.08) {
            ctx.shadowColor = "rgba(6, 182, 212, 0.95)";
            ctx.shadowBlur = 8;
            ctx.fillStyle = `rgba(224, 242, 254, ${finalAlpha})`;
          } else if (p.isFocal) {
            ctx.shadowColor = `rgba(${p.colorBase}, 0.85)`;
            ctx.shadowBlur = 10;
            ctx.fillStyle = `rgba(${p.colorBase}, ${finalAlpha})`;
          } else if (p.radius > 1.2) {
            ctx.shadowColor = `rgba(${p.colorBase}, 0.45)`;
            ctx.shadowBlur = 3.5;
            ctx.fillStyle = `rgba(${p.colorBase}, ${finalAlpha})`;
          } else {
            ctx.fillStyle = `rgba(${p.colorBase}, ${finalAlpha})`;
          }

          ctx.beginPath();
          ctx.arc(currentX, currentY, p.radius + proximityBoost * 0.3, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

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
      className="fixed left-0 top-0 h-screen w-32 sm:w-56 md:w-64 lg:w-72 xl:w-[320px] z-[5] pointer-events-none select-none overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ pointerEvents: "none" }}
      />
    </div>
  );
};
