"use client";

import React, { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

interface Particle {
  y: number;
  speed: number;
  curveIndex: number;
  offset: number;
  radius: number;
  alpha: number;
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

    // Track scroll position for subtle telemetry phase shift
    let scrollY = window.scrollY;
    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Sparse data particles initialized along the stream
    const particleCount = 18;
    const particles: Particle[] = Array.from({ length: particleCount }, () => ({
      y: Math.random() * (height || 800),
      speed: 0.35 + Math.random() * 0.65,
      curveIndex: Math.floor(Math.random() * 4),
      offset: (Math.random() - 0.5) * 6,
      radius: 0.75 + Math.random() * 0.9,
      alpha: 0.3 + Math.random() * 0.55,
      pulsePhase: Math.random() * Math.PI * 2,
    }));

    // Curve definitions: abstract multi-frequency signal processing streams
    const curves = [
      // 1. Primary Electric Cyan Signal (Prominent with restrained glow)
      {
        baseX: 0.44,
        amp1: 14,
        freq1: 0.0035,
        speed1: 0.0016,
        amp2: 7,
        freq2: 0.008,
        speed2: 0.0022,
        phase: 0,
        color: "rgba(6, 182, 212, 0.72)", // cyan-500
        lineWidth: 1.15,
        glowColor: "rgba(6, 182, 212, 0.5)",
        glowBlur: 6,
      },
      // 2. High-Frequency Electric Sky Blue Stream
      {
        baseX: 0.48,
        amp1: 12,
        freq1: 0.0048,
        speed1: 0.0012,
        amp2: 6,
        freq2: 0.011,
        speed2: 0.0019,
        phase: 1.8,
        color: "rgba(56, 189, 248, 0.62)", // sky-400
        lineWidth: 0.95,
        glowColor: "rgba(56, 189, 248, 0.35)",
        glowBlur: 4,
      },
      // 3. Deeper Carrier Wave (Royal / Cobalt Blue)
      {
        baseX: 0.42,
        amp1: 16,
        freq1: 0.0026,
        speed1: 0.0009,
        amp2: 8,
        freq2: 0.0065,
        speed2: 0.0015,
        phase: 3.4,
        color: "rgba(59, 130, 246, 0.42)", // blue-500
        lineWidth: 0.8,
        glowColor: "rgba(59, 130, 246, 0.25)",
        glowBlur: 0,
      },
      // 4. Muted Deep Data Flow (Atmospheric background carrier)
      {
        baseX: 0.52,
        amp1: 10,
        freq1: 0.004,
        speed1: 0.0007,
        amp2: 5,
        freq2: 0.009,
        speed2: 0.0011,
        phase: 5.1,
        color: "rgba(14, 165, 233, 0.22)", // sky-600
        lineWidth: 0.65,
        glowColor: "transparent",
        glowBlur: 0,
      },
    ];

    // Compute curve X coordinate at a given Y and time
    const getCurveX = (
      curve: typeof curves[0],
      y: number,
      time: number,
      scrollShift: number
    ) => {
      const base = width * curve.baseX;
      const w1 =
        Math.sin(y * curve.freq1 + time * curve.speed1 + curve.phase + scrollShift) *
        curve.amp1;
      const w2 =
        Math.cos(y * curve.freq2 - time * curve.speed2 + curve.phase * 0.5) *
        curve.amp2;
      return base + w1 + w2;
    };

    const startTime = performance.now();

    const render = (now: number) => {
      if (!ctx || width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      const elapsed = now - startTime;
      const scrollShift = scrollY * 0.0012;

      // Draw each curve with smooth vertical stepping
      curves.forEach((curve) => {
        ctx.save();
        ctx.beginPath();

        if (curve.glowBlur > 0) {
          ctx.shadowColor = curve.glowColor;
          ctx.shadowBlur = curve.glowBlur;
        }

        ctx.strokeStyle = curve.color;
        ctx.lineWidth = curve.lineWidth;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        const step = 8; // Sample points along vertical axis
        let isFirst = true;

        for (let y = -10; y <= height + 10; y += step) {
          const x = getCurveX(curve, y, elapsed, scrollShift);
          if (isFirst) {
            ctx.moveTo(x, y);
            isFirst = false;
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.stroke();
        ctx.restore();
      });

      // Update and draw tiny drifting telemetry particles
      particles.forEach((p) => {
        // Drift downward gently
        p.y += p.speed;
        if (p.y > height + 20) {
          p.y = -20;
          p.curveIndex = Math.floor(Math.random() * curves.length);
        }

        const targetCurve = curves[p.curveIndex] || curves[0];
        const curveX = getCurveX(targetCurve, p.y, elapsed, scrollShift);
        const px = curveX + p.offset;

        // Subtle alpha breathing
        const pulse = 0.75 + Math.sin(elapsed * 0.003 + p.pulsePhase) * 0.25;
        const currentAlpha = p.alpha * pulse;

        ctx.save();
        ctx.fillStyle = `rgba(186, 230, 253, ${currentAlpha})`; // sky-200
        ctx.shadowColor = "rgba(56, 189, 248, 0.7)";
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.arc(px, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Continue animation if not reduced motion
      if (!shouldReduceMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    // If reduced motion, render a single frame
    if (shouldReduceMotion) {
      render(startTime);
    } else {
      animationFrameId = requestAnimationFrame(render);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [shouldReduceMotion]);

  return (
    <div
      aria-hidden="true"
      className="fixed left-0 top-0 h-screen w-16 sm:w-20 md:w-24 z-20 pointer-events-none select-none overflow-hidden hidden sm:block opacity-75 sm:opacity-90 transition-opacity duration-300"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ pointerEvents: "none" }}
      />
    </div>
  );
};
