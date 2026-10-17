"use client";

import React, { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

interface WaveParticle {
  baseX: number;
  baseY: number;
  radius: number;
  color: string;
  alpha: number;
  waveIndex: number;
  phaseOffset: number;
  speed: number;
  ox: number;
  oy: number;
  ovx: number;
  ovy: number;
}

interface AmbientParticle {
  xRatio: number;
  yRatio: number;
  radius: number;
  color: string;
  baseAlpha: number;
  pulseSpeed: number;
  pulsePhase: number;
  driftX: number;
  driftY: number;
  speed: number;
  ox: number;
  oy: number;
  ovx: number;
  ovy: number;
  isNexus?: boolean;
}

interface HeroCanvasProps {
  containerRef: React.RefObject<HTMLElement>;
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

    // 1. Data Wave Streams: Curving flowing ribbons of glowing particle nodes
    const waveParticles: WaveParticle[] = [];
    const waveCount = 5;
    const particlesPerWave = isTouch ? 35 : 65;

    for (let w = 0; w < waveCount; w++) {
      for (let i = 0; i < particlesPerWave; i++) {
        const xFraction = i / (particlesPerWave - 1);
        const color =
          w % 3 === 0
            ? "6, 182, 212"   // Electric cyan
            : w % 3 === 1
            ? "56, 189, 248"  // Vivid sky blue
            : "186, 230, 253"; // Luminous ice blue

        waveParticles.push({
          baseX: xFraction,
          baseY: 0.52 + w * 0.08,
          radius: 0.75 + Math.random() * 1.35,
          color,
          alpha: 0.40 + Math.random() * 0.35,
          waveIndex: w,
          phaseOffset: xFraction * Math.PI * 3 + w * 1.2,
          speed: 0.0006 + (w % 3) * 0.0003,
          ox: 0,
          oy: 0,
          ovx: 0,
          ovy: 0,
        });
      }
    }

    // 2. Ambient & Nexus Particles:
    // Concentrated cluster near the domain nexus on the right (~0.72 width, 0.48 height)
    // Subtle, sparse field behind the headline on the left
    const ambientParticles: AmbientParticle[] = [];
    const ambientCount = isTouch ? 50 : 120;

    for (let i = 0; i < ambientCount; i++) {
      const isNexus = i < (isTouch ? 30 : 80);
      let xRatio: number;
      let yRatio: number;
      let color: string;
      let baseAlpha: number;

      if (isNexus) {
        // Clustered around the right-side domain network node
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.pow(Math.random(), 0.75) * 0.32;
        xRatio = Math.max(0.48, Math.min(0.96, 0.72 + Math.cos(angle) * dist * 0.8));
        yRatio = Math.max(0.12, Math.min(0.88, 0.48 + Math.sin(angle) * dist));
        color = Math.random() < 0.35 ? "6, 182, 212" : "56, 189, 248";
        baseAlpha = 0.35 + Math.random() * 0.45;
      } else {
        // Subtle, restrained left-side particles behind headline
        xRatio = 0.04 + Math.random() * 0.42;
        yRatio = 0.15 + Math.random() * 0.75;
        color = "59, 130, 246";
        baseAlpha = 0.12 + Math.random() * 0.18; // Very subtle for pristine text legibility
      }

      ambientParticles.push({
        xRatio,
        yRatio,
        radius: isNexus ? 0.8 + Math.random() * 1.4 : 0.65 + Math.random() * 0.6,
        color,
        baseAlpha,
        pulseSpeed: 0.001 + Math.random() * 0.002,
        pulsePhase: Math.random() * Math.PI * 2,
        driftX: (Math.random() - 0.5) * 4,
        driftY: (Math.random() - 0.5) * 4,
        speed: 0.0003 + Math.random() * 0.0004,
        ox: 0,
        oy: 0,
        ovx: 0,
        ovy: 0,
        isNexus,
      });
    }

    const startTime = performance.now();

    const render = (now: number) => {
      if (!ctx || width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      const elapsed = now - startTime;
      const interactionRadius = 95;

      // Draw subtle ambient background vignette gradient for atmospheric depth
      const bgGrad = ctx.createRadialGradient(
        width * 0.72,
        height * 0.48,
        50,
        width * 0.72,
        height * 0.48,
        width * 0.6
      );
      bgGrad.addColorStop(0, "rgba(6, 182, 212, 0.065)");
      bgGrad.addColorStop(0.5, "rgba(14, 30, 60, 0.035)");
      bgGrad.addColorStop(1, "rgba(3, 3, 4, 0)");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 1. Render Flowing Wave Streams
      for (let i = 0; i < waveParticles.length; i++) {
        const wp = waveParticles[i];

        // Wave curve equation: sweeping curves rising from left-center to right
        const waveX = wp.baseX * width;
        const waveOffset =
          Math.sin(wp.baseX * 4.2 + elapsed * wp.speed + wp.phaseOffset) * 42 +
          Math.cos(wp.baseX * 2.8 + elapsed * (wp.speed * 0.7)) * 25;

        const currentX = waveX + wp.ox;
        const currentY = wp.baseY * height + waveOffset + wp.oy;

        // Localized cursor repulsion
        let proximityBoost = 0;
        if (!isTouch && !shouldReduceMotion && mousePos.x > -1000) {
          const dx = currentX - mousePos.x;
          const dy = currentY - mousePos.y;
          const dist = Math.hypot(dx, dy);

          if (dist < interactionRadius && dist > 0.5) {
            const force = Math.pow(1 - dist / interactionRadius, 2);
            const angle = Math.atan2(dy, dx);
            wp.ovx += Math.cos(angle) * force * 1.5;
            wp.ovy += Math.sin(angle) * force * 1.5;
            proximityBoost = force * 0.45;
          }
        }

        // Spring return with damping
        wp.ovx += -wp.ox * 0.045;
        wp.ovy += -wp.oy * 0.045;
        wp.ovx *= 0.88;
        wp.ovy *= 0.88;
        wp.ox += wp.ovx;
        wp.oy += wp.ovy;

        // Alpha calculation
        const alpha = Math.min(1, wp.alpha + proximityBoost);

        ctx.save();
        if (proximityBoost > 0.1) {
          ctx.shadowColor = "rgba(6, 182, 212, 0.9)";
          ctx.shadowBlur = 8;
          ctx.fillStyle = `rgba(224, 242, 254, ${alpha})`;
        } else {
          ctx.shadowColor = `rgba(${wp.color}, 0.35)`;
          ctx.shadowBlur = wp.radius > 1.2 ? 3.5 : 0;
          ctx.fillStyle = `rgba(${wp.color}, ${alpha})`;
        }

        ctx.beginPath();
        ctx.arc(currentX, currentY, wp.radius + proximityBoost * 0.35, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 2. Render Ambient & Nexus Particles
      for (let i = 0; i < ambientParticles.length; i++) {
        const ap = ambientParticles[i];

        const floatX = Math.sin(elapsed * ap.speed + ap.pulsePhase) * ap.driftX;
        const floatY = Math.cos(elapsed * ap.speed + ap.pulsePhase) * ap.driftY;

        const currentX = ap.xRatio * width + floatX + ap.ox;
        const currentY = ap.yRatio * height + floatY + ap.oy;

        let proximityBoost = 0;
        if (!isTouch && !shouldReduceMotion && mousePos.x > -1000) {
          const dx = currentX - mousePos.x;
          const dy = currentY - mousePos.y;
          const dist = Math.hypot(dx, dy);

          if (dist < interactionRadius && dist > 0.5) {
            const force = Math.pow(1 - dist / interactionRadius, 2);
            const angle = Math.atan2(dy, dx);
            ap.ovx += Math.cos(angle) * force * 1.4;
            ap.ovy += Math.sin(angle) * force * 1.4;
            proximityBoost = force * 0.40;
          }
        }

        ap.ovx += -ap.ox * 0.045;
        ap.ovy += -ap.oy * 0.045;
        ap.ovx *= 0.88;
        ap.ovy *= 0.88;
        ap.ox += ap.ovx;
        ap.oy += ap.ovy;

        const pulse = 0.85 + Math.sin(elapsed * ap.pulseSpeed + ap.pulsePhase) * 0.15;
        const alpha = Math.min(1, ap.baseAlpha * pulse + proximityBoost);

        ctx.save();
        if (proximityBoost > 0.08) {
          ctx.shadowColor = "rgba(6, 182, 212, 0.9)";
          ctx.shadowBlur = 6;
          ctx.fillStyle = `rgba(224, 242, 254, ${alpha})`;
        } else if (ap.isNexus && ap.radius > 1.2) {
          ctx.shadowColor = `rgba(${ap.color}, 0.5)`;
          ctx.shadowBlur = 4;
          ctx.fillStyle = `rgba(${ap.color}, ${alpha})`;
        } else {
          ctx.fillStyle = `rgba(${ap.color}, ${alpha})`;
        }

        ctx.beginPath();
        ctx.arc(currentX, currentY, ap.radius + proximityBoost * 0.25, 0, Math.PI * 2);
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
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{ pointerEvents: "none" }}
    />
  );
};
