"use client";

import React, { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

interface Particle {
  baseXRatio: number; // 0 to 1
  baseYRatio: number; // 0.02 to 0.98
  driftSpeedX: number;
  driftSpeedY: number;
  driftAmpX: number;
  driftAmpY: number;
  driftPhase: number;
  ox: number; // interactive repulsion offset X
  oy: number; // interactive repulsion offset Y
  ovx: number; // velocity X
  ovy: number; // velocity Y
  radius: number; // CSS radius
  baseAlpha: number;
  colorBase: string; // RGB string
  pulseSpeed: number;
  pulsePhase: number;
  isFocal: boolean;
  rank: number; // 0 to 1 for scroll depth density modulation
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

    // Track scroll position to fade in after hero and modulate density between About and Contact
    let currentScrollY = window.scrollY;
    const handleScroll = () => {
      currentScrollY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Track cursor position for localized repulsion throughout particle field
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

    // Curated color palette matching reference: electric cyan, sky blue, luminous ice, diamond white, royal blue
    const colorPalette = [
      "6, 182, 212",   // Electric cyan
      "56, 189, 248",  // Vivid sky blue
      "186, 230, 253", // Soft luminous ice blue
      "240, 249, 255", // Sparkling diamond white-blue
      "59, 130, 246",  // Royal / cobalt blue
      "37, 99, 235",   // Deep electric blue
    ];

    // Rich particle count: 280 on desktop for dense visible field, 100 on touch
    const particleCount = isTouch ? 100 : 280;

    // Natural clustering attractor centers along the vertical axis
    const clusterAttractors = [0.14, 0.28, 0.44, 0.62, 0.78, 0.90];

    const particles: Particle[] = Array.from({ length: particleCount }, (_, idx) => {
      // 3-Zone Horizontal distribution across the left margin and toward the center of the page:
      // Zone 1: Dense core hugging left edge (45% of particles, 0.01 to 0.28 width)
      // Zone 2: Midfield dispersion (35% of particles, 0.28 to 0.65 width)
      // Zone 3: Extended bridge into the page (20% of particles, 0.65 to 0.96 width)
      let baseXRatio: number;
      const zoneSeed = Math.random();

      if (zoneSeed < 0.45) {
        // High-density left cluster
        baseXRatio = 0.01 + Math.pow(Math.random(), 1.35) * 0.27;
      } else if (zoneSeed < 0.80) {
        // Midfield dispersion across left margin
        baseXRatio = 0.28 + Math.pow(Math.random(), 1.15) * 0.37;
      } else {
        // Outer ambient field extending toward page center
        baseXRatio = 0.65 + Math.random() * 0.31;
      }

      // Vertical distribution with organic clustering
      let baseY: number;
      if (idx % 4 === 0) {
        // Subtle cluster groupings around attractor centers
        const attractor = clusterAttractors[(idx / 4) % clusterAttractors.length];
        const jitter = (Math.random() - 0.5) * 0.14;
        baseY = Math.max(0.02, Math.min(0.98, attractor + jitter));
      } else {
        // Stratified vertical distribution across full visible height
        const segmentHeight = 1 / particleCount;
        baseY = Math.max(
          0.02,
          Math.min(0.98, idx * segmentHeight + (Math.random() - 0.5) * segmentHeight * 0.95)
        );
      }

      // Particle hierarchy:
      // ~60% micro-stardust (0.65 - 1.1px radius)
      // ~28% medium bright nodes (1.25 - 1.9px radius)
      // ~12% luminous focal stars (2.1 - 2.8px radius with glowing corona)
      const sizeSeed = Math.random();
      let radius: number;
      let baseAlpha: number;
      let isFocal = false;

      if (sizeSeed < 0.60) {
        radius = 0.65 + Math.random() * 0.45;
        baseAlpha = 0.45 + Math.random() * 0.30;
      } else if (sizeSeed < 0.88) {
        radius = 1.25 + Math.random() * 0.65;
        baseAlpha = 0.65 + Math.random() * 0.25;
      } else {
        radius = 2.10 + Math.random() * 0.70;
        baseAlpha = 0.85 + Math.random() * 0.15;
        isFocal = true;
      }

      return {
        baseXRatio,
        baseYRatio: baseY,
        driftSpeedX: 0.00020 + Math.random() * 0.00040,
        driftSpeedY: 0.00025 + Math.random() * 0.00045,
        driftAmpX: 2.0 + Math.random() * 4.0,
        driftAmpY: 2.5 + Math.random() * 4.5,
        driftPhase: Math.random() * Math.PI * 2,
        ox: 0,
        oy: 0,
        ovx: 0,
        ovy: 0,
        radius,
        baseAlpha,
        colorBase: isFocal
          ? "56, 189, 248" // Focal stars in vivid sky blue
          : colorPalette[idx % colorPalette.length],
        pulseSpeed: 0.0010 + Math.random() * 0.0020,
        pulsePhase: Math.random() * Math.PI * 2,
        isFocal,
        rank: Math.random(), // For section depth density modulation
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
      // Completely hidden when in hero section (< 180px)
      // Gradually reveals smoothly between 180px and 450px scroll depth
      const heroFade = Math.min(1, Math.max(0, (currentScrollY - 180) / 270));

      if (heroFade > 0.005) {
        const elapsed = now - startTime;
        const interactionRadius = 90; // Localized cursor interaction radius

        // Section density modulation based on reference images:
        // About Section: Medium density (activeDensity = 1.0)
        // Contact Section: Lower density (activeDensity = 0.65)
        const docHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const scrollFraction = Math.min(1, Math.max(0, currentScrollY / docHeight));
        const activeDensity = 1.0 - scrollFraction * 0.35;

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];

          // Density gating: lower rank particles fade out in Contact section
          let densityFade = 1.0;
          if (p.rank > activeDensity) {
            densityFade = Math.max(0.10, 1 - (p.rank - activeDensity) / 0.35);
          }

          // 1. Organic, ultra-slow floating micro-drift
          const driftX =
            Math.sin(elapsed * p.driftSpeedX + p.driftPhase) * p.driftAmpX;
          const driftY =
            Math.cos(elapsed * p.driftSpeedY + p.driftPhase) * p.driftAmpY;

          const currentX = p.baseXRatio * width + driftX + p.ox;
          const currentY = p.baseYRatio * height + driftY + p.oy;

          // 2. Cursor repulsion physics across the particle field
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
              p.ovx += Math.cos(angle) * force * 1.5;
              p.ovy += Math.sin(angle) * force * 1.5;

              // Luminescence flare when cursor is near
              proximityBoost = force * 0.40;
            }
          }

          // 3. Smooth spring return to resting position with damping
          p.ovx += -p.ox * 0.045;
          p.ovy += -p.oy * 0.045;
          p.ovx *= 0.88;
          p.ovy *= 0.88;
          p.ox += p.ovx;
          p.oy += p.ovy;

          // Displacement clamp (< 18px)
          const offsetDist = Math.hypot(p.ox, p.oy);
          if (offsetDist > 18) {
            p.ox = (p.ox / offsetDist) * 18;
            p.oy = (p.oy / offsetDist) * 18;
          }

          // 4. Lateral opacity fade that preserves visibility across the left portion of the page:
          // Near left edge: 1.0
          // Extending outward: stays between 0.55 and 0.85
          const xNorm = Math.min(1, Math.max(0, currentX / width));
          const lateralFade = 1 - Math.pow(xNorm, 1.8) * 0.45;

          // 5. Subtle alpha breathing / twinkle
          const pulse =
            0.82 + Math.sin(elapsed * p.pulseSpeed + p.pulsePhase) * 0.18;
          const finalAlpha = Math.min(
            1,
            (p.baseAlpha * pulse * lateralFade * densityFade + proximityBoost) * heroFade
          );

          if (finalAlpha <= 0.02) continue;

          // 6. Render particle with luminous corona
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
            ctx.shadowBlur = 4;
            ctx.fillStyle = `rgba(${p.colorBase}, ${finalAlpha})`;
          } else {
            ctx.fillStyle = `rgba(${p.colorBase}, ${finalAlpha})`;
          }

          ctx.beginPath();
          ctx.arc(currentX, currentY, p.radius + proximityBoost * 0.35, 0, Math.PI * 2);
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
      className="fixed left-0 top-0 h-screen w-48 sm:w-80 md:w-[420px] lg:w-[480px] xl:w-[560px] z-30 pointer-events-none select-none overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ pointerEvents: "none" }}
      />
    </div>
  );
};
