"use client";

import React, { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

interface HeroParticle {
  // Base normalized position (0..1 ratio of canvas width and height)
  baseX: number;
  baseY: number;
  // Visual appearance
  radius: number;
  color: string;
  baseAlpha: number;
  // Independent slow drift properties (microscopic Lissajous float)
  driftSpeed: number;
  driftRadiusX: number;
  driftRadiusY: number;
  driftPhaseX: number;
  driftPhaseY: number;
  // Subtle brightness shimmer
  pulseSpeed: number;
  pulsePhase: number;
  // Cursor interaction physics (spring displacement & velocity)
  ox: number;
  oy: number;
  ovx: number;
  ovy: number;
  // Flag for particles clustered near domain visualization nexus
  isNexus?: boolean;
}

interface HeroCanvasProps {
  containerRef: React.RefObject<HTMLElement>;
}

/**
 * Fast, deterministic Mulberry32 pseudo-random number generator.
 * Guarantees a stable particle distribution across renders and window resizes.
 */
function createRng(seed = 42) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const HeroCanvas: React.FC<HeroCanvasProps> = ({ containerRef }) => {
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

    // Track cursor coordinates relative to hero canvas
    const mousePos = { x: -2000, y: -2000 };
    const handlePointerMove = (e: PointerEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mousePos.x = e.clientX - rect.left;
      mousePos.y = e.clientY - rect.top;
    };

    const handlePointerLeave = () => {
      mousePos.x = -2000;
      mousePos.y = -2000;
    };

    const container = containerRef.current || window;
    if (!isTouch) {
      container.addEventListener("pointermove", handlePointerMove as EventListener, { passive: true });
      container.addEventListener("pointerleave", handlePointerLeave as EventListener, { passive: true });
    }

    // -------------------------------------------------------------
    // Single Coherent, Randomly Distributed Particle Field
    // -------------------------------------------------------------
    const particles: HeroParticle[] = [];
    const rng = createRng(1337);
    const totalCount = isTouch ? 80 : 180;
    const nexusTargetCount = Math.floor(totalCount * 0.35); // ~35% organically clustered around right domain nexus

    const nexusCenterX = 0.72;
    const nexusCenterY = 0.48;

    let generated = 0;
    let attempts = 0;

    while (generated < totalCount && attempts < 3000) {
      attempts++;
      const isNexus = generated < nexusTargetCount;
      let baseX: number;
      let baseY: number;

      if (isNexus) {
        // Natural distribution clustered around the right-side domain constellation
        const angle = rng() * Math.PI * 2;
        const dist = Math.pow(rng(), 0.72) * 0.32;
        baseX = nexusCenterX + Math.cos(angle) * dist * 0.85;
        baseY = nexusCenterY + Math.sin(angle) * dist;

        if (baseX < 0.46 || baseX > 0.96 || baseY < 0.08 || baseY > 0.92) {
          continue;
        }
      } else {
        // Naturally scattered across the entire hero background
        baseX = 0.03 + rng() * 0.94;
        baseY = 0.05 + rng() * 0.90;

        // Preserve comfortable negative space behind headline & supporting narrative
        // Left column text area roughly: x from 0.06 to 0.44, y from 0.18 to 0.68
        if (baseX > 0.06 && baseX < 0.44 && baseY > 0.18 && baseY < 0.68) {
          if (rng() < 0.65) {
            // Keep background behind text sparse and unobtrusive
            continue;
          }
        }
      }

      // Color selection: technical blue & cyan palette
      const colorRoll = rng();
      let color: string;
      if (colorRoll < 0.48) {
        color = "6, 182, 212";   // Electric cyan (#06b6d4)
      } else if (colorRoll < 0.88) {
        color = "56, 189, 248";  // Vivid sky blue (#38bdf8)
      } else {
        color = "186, 230, 253"; // Luminous ice blue accent (#bae6fd)
      }

      // Particle size: predominantly tiny dots (1-2px diameter), occasional subtle accent
      const sizeRoll = rng();
      let radius: number;
      let isAccent = false;

      if (sizeRoll < 0.72) {
        radius = 0.65 + rng() * 0.45; // ~1.3 - 2.2px diameter
      } else if (sizeRoll < 0.92) {
        radius = 1.1 + rng() * 0.35;  // ~2.2 - 2.9px diameter
      } else {
        radius = 1.45 + rng() * 0.45; // ~2.9 - 3.8px diameter (restrained accent)
        isAccent = true;
      }

      // Opacity: most dim and restrained, few brighter accents
      let baseAlpha: number;
      if (isNexus) {
        baseAlpha = 0.35 + rng() * 0.35; // 0.35 - 0.70 near domain nexus
      } else if (baseX < 0.44) {
        baseAlpha = 0.16 + rng() * 0.22; // 0.16 - 0.38 behind headline for crisp contrast
      } else {
        baseAlpha = 0.22 + rng() * 0.32; // 0.22 - 0.54 general ambient field
      }

      if (isAccent) {
        baseAlpha = Math.min(0.85, baseAlpha + 0.20);
      }

      // Very slow, independent, multi-directional 2D drift
      const driftSpeed = 0.00014 + rng() * 0.00022;
      const driftRadiusX = 3 + rng() * 6; // 3 to 9px subtle range
      const driftRadiusY = 3 + rng() * 6;
      const driftPhaseX = rng() * Math.PI * 2;
      const driftPhaseY = rng() * Math.PI * 2;

      // Subtle brightness shimmer
      const pulseSpeed = 0.0008 + rng() * 0.0016;
      const pulsePhase = rng() * Math.PI * 2;

      particles.push({
        baseX,
        baseY,
        radius,
        color,
        baseAlpha,
        driftSpeed,
        driftRadiusX,
        driftRadiusY,
        driftPhaseX,
        driftPhaseY,
        pulseSpeed,
        pulsePhase,
        ox: 0,
        oy: 0,
        ovx: 0,
        ovy: 0,
        isNexus,
      });

      generated++;
    }

    const startTime = performance.now();

    const render = (now: number) => {
      if (!ctx || width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      const elapsed = now - startTime;
      const interactionRadius = 85;

      // Draw subtle ambient vignette gradient around domain nexus for atmospheric depth
      const bgGrad = ctx.createRadialGradient(
        width * 0.72,
        height * 0.48,
        40,
        width * 0.72,
        height * 0.48,
        width * 0.55
      );
      bgGrad.addColorStop(0, "rgba(6, 182, 212, 0.05)");
      bgGrad.addColorStop(0.5, "rgba(14, 30, 60, 0.025)");
      bgGrad.addColorStop(1, "rgba(3, 3, 4, 0)");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Render the single coherent field of randomly distributed particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // 1. Slow, independent, multi-directional 2D drift
        const floatX = Math.sin(elapsed * p.driftSpeed + p.driftPhaseX) * p.driftRadiusX;
        const floatY = Math.cos(elapsed * (p.driftSpeed * 0.88) + p.driftPhaseY) * p.driftRadiusY;

        const currentX = p.baseX * width + floatX + p.ox;
        const currentY = p.baseY * height + floatY + p.oy;

        // 2. Cursor repulsion physics (only nearby particles within interactionRadius)
        let proximityBoost = 0;
        if (!isTouch && !shouldReduceMotion && mousePos.x > -1000) {
          const dx = currentX - mousePos.x;
          const dy = currentY - mousePos.y;
          const dist = Math.hypot(dx, dy);

          if (dist < interactionRadius && dist > 0.5) {
            const force = Math.pow(1 - dist / interactionRadius, 2);
            const angle = Math.atan2(dy, dx);
            p.ovx += Math.cos(angle) * force * 1.25;
            p.ovy += Math.sin(angle) * force * 1.25;
            proximityBoost = force * 0.35;
          }
        }

        // Spring return with smooth damping
        p.ovx += -p.ox * 0.045;
        p.ovy += -p.oy * 0.045;
        p.ovx *= 0.88;
        p.ovy *= 0.88;
        p.ox += p.ovx;
        p.oy += p.ovy;

        // 3. Subtle shimmer pulse
        const pulse = 0.88 + Math.sin(elapsed * p.pulseSpeed + p.pulsePhase) * 0.12;
        const alpha = Math.min(1, p.baseAlpha * pulse + proximityBoost);

        // 4. Draw particle
        ctx.save();
        if (proximityBoost > 0.08) {
          ctx.shadowColor = "rgba(6, 182, 212, 0.85)";
          ctx.shadowBlur = 6;
          ctx.fillStyle = `rgba(224, 242, 254, ${alpha})`;
        } else if (p.isNexus && p.radius > 1.2) {
          ctx.shadowColor = `rgba(${p.color}, 0.45)`;
          ctx.shadowBlur = 3.5;
          ctx.fillStyle = `rgba(${p.color}, ${alpha})`;
        } else {
          ctx.fillStyle = `rgba(${p.color}, ${alpha})`;
        }

        ctx.beginPath();
        ctx.arc(currentX, currentY, p.radius + proximityBoost * 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
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
      if (!isTouch) {
        container.removeEventListener("pointermove", handlePointerMove as EventListener);
        container.removeEventListener("pointerleave", handlePointerLeave as EventListener);
      }
    };
  }, [containerRef, shouldReduceMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
      style={{ pointerEvents: "none" }}
    />
  );
};
