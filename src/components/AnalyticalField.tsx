"use client";

import React, { useEffect, useRef, useState } from "react";

interface Point3D {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  cluster: number;
  size: number;
  alpha: number;
  phase: number;
  speed: number;
}

export const AnalyticalField: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check user preference for reduced motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleMediaChange);
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = container.clientWidth);
    let height = (canvas.height = container.clientHeight);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const setupCanvas = () => {
      if (!container || !canvas) return;
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    setupCanvas();

    const handleResize = () => {
      setupCanvas();
    };

    window.addEventListener("resize", handleResize);

    // Determine point count based on screen width
    const pointCount = width < 640 ? 650 : width < 1024 ? 1100 : 1650;
    const points: Point3D[] = [];

    // Define 3 primary analytical distribution clusters (Centroids)
    const clusterCenters = [
      { x: -90, y: -20, z: 20, spread: 85, weight: 0.45 },   // Core Baseline Distribution
      { x: 95, y: -10, z: -40, spread: 75, weight: 0.35 },   // Stratified Risk Cohort
      { x: 5, y: 55, z: 30, spread: 65, weight: 0.20 },     // Operational Lineage Stream
    ];

    // Seed points into organic manifold distributions
    for (let i = 0; i < pointCount; i++) {
      const rand = Math.random();
      let chosenCluster = 0;
      let cumulative = 0;
      for (let c = 0; c < clusterCenters.length; c++) {
        cumulative += clusterCenters[c].weight;
        if (rand <= cumulative) {
          chosenCluster = c;
          break;
        }
      }

      const center = clusterCenters[chosenCluster];
      // Gaussian-like distribution around centroid with slight non-linear warping
      const u = Math.random() + Math.random() - 1;
      const v = Math.random() + Math.random() - 1;
      const w = Math.random() + Math.random() - 1;
      const distance = Math.sqrt(u * u + v * v + w * w) || 1;
      const r = Math.pow(Math.random(), 0.7) * center.spread;

      const px = center.x + (u / distance) * r + Math.sin(v * 4) * 8;
      const py = center.y + (v / distance) * (r * 0.7) + Math.cos(w * 3) * 6;
      const pz = center.z + (w / distance) * (r * 0.9);

      points.push({
        x: px,
        y: py,
        z: pz,
        baseX: px,
        baseY: py,
        baseZ: pz,
        cluster: chosenCluster,
        size: Math.random() * 0.9 + 0.65,
        alpha: Math.random() * 0.4 + 0.2,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.002 + 0.001,
      });
    }

    // Dynamic Anomaly State (DATA -> PATTERN -> ANOMALY -> VALIDATION -> INSIGHT)
    const anomalyState = {
      x: 0,
      y: 0,
      z: 0,
      originX: clusterCenters[0].x,
      originY: clusterCenters[0].y,
      originZ: clusterCenters[0].z,
      targetX: -200,
      targetY: -65,
      targetZ: 70,
      cycleProgress: 0, // 0 to 1
      active: true,
    };

    // Camera & View Parameters
    const focalLength = 340;
    let angleX = 0.08;
    let angleY = 0;
    let targetAngleX = 0.08;
    let targetAngleY = 0;

    let mouseX = width / 2;
    let mouseY = height / 2;
    let isMouseActive = false;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
        isMouseActive = true;
        // Subtle restrained perspective tilt
        targetAngleY = ((mouseX / width) - 0.5) * 0.28;
        targetAngleX = -((mouseY / height) - 0.5) * 0.18 + 0.08;
      } else {
        isMouseActive = false;
        targetAngleY = 0;
        targetAngleX = 0.08;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      // Smooth camera interpolation
      if (!prefersReducedMotion) {
        angleY += (targetAngleY - angleY) * 0.04;
        angleX += (targetAngleX - angleX) * 0.04;
        // Ambient gentle drift
        if (!isMouseActive) {
          angleY += 0.0006;
        }
      }

      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);

      const centerX = width / 2;
      const centerY = height * 0.54;

      // Anomaly Cycle: 0 -> 1 over ~12 seconds
      if (!prefersReducedMotion) {
        anomalyState.cycleProgress = (time * 0.000085) % 1;
      } else {
        anomalyState.cycleProgress = 0.45; // Static representative state
      }

      // Calculate Anomaly Position along its path
      const p = anomalyState.cycleProgress;
      let anomalyX = 0;
      let anomalyY = 0;
      let anomalyZ = 0;
      let anomalyAlpha = 0.3;
      let validationProbe = false;
      let probeIntensity = 0;

      if (p < 0.35) {
        // Phase 1: Drift out from cluster into outlier territory
        const t = p / 0.35;
        const ease = t * t * (3 - 2 * t);
        anomalyX = anomalyState.originX + (anomalyState.targetX - anomalyState.originX) * ease;
        anomalyY = anomalyState.originY + (anomalyState.targetY - anomalyState.originY) * ease + Math.sin(t * Math.PI) * 15;
        anomalyZ = anomalyState.originZ + (anomalyState.targetZ - anomalyState.originZ) * ease;
        anomalyAlpha = 0.3 + 0.4 * ease;
      } else if (p < 0.65) {
        // Phase 2: Isolated Anomaly / Forensic Detection & Validation
        const t = (p - 0.35) / 0.3;
        anomalyX = anomalyState.targetX + Math.sin(t * Math.PI * 2) * 5;
        anomalyY = anomalyState.targetY + Math.cos(t * Math.PI * 2) * 4;
        anomalyZ = anomalyState.targetZ;
        anomalyAlpha = 0.75 + Math.sin(t * Math.PI * 4) * 0.2;
        validationProbe = true;
        probeIntensity = Math.sin(t * Math.PI);
      } else {
        // Phase 3: Resolution & Reconnection into Cluster Manifold
        const t = (p - 0.65) / 0.35;
        const ease = t * t * (3 - 2 * t);
        // Returns along an elliptical arc back into origin
        anomalyX = anomalyState.targetX + (anomalyState.originX - anomalyState.targetX) * ease;
        anomalyY = anomalyState.targetY + (anomalyState.originY - anomalyState.targetY) * ease - Math.sin(t * Math.PI) * 18;
        anomalyZ = anomalyState.targetZ + (anomalyState.originZ - anomalyState.targetZ) * ease;
        anomalyAlpha = 0.95 - 0.65 * ease;
      }

      anomalyState.x = anomalyX;
      anomalyState.y = anomalyY;
      anomalyState.z = anomalyZ;

      // Projected points buffer for rendering and micro-filament connections
      const projected: { sx: number; sy: number; sz: number; alpha: number; size: number; c: number }[] = [];

      for (let i = 0; i < points.length; i++) {
        const pt = points[i];

        // Slight breathing perturbation per point
        const offset = Math.sin(time * pt.speed + pt.phase) * 1.5;
        const x0 = pt.baseX + offset;
        const y0 = pt.baseY + offset * 0.7;
        const z0 = pt.baseZ;

        // 3D Rotation (Yaw around Y, Pitch around X)
        const x1 = x0 * cosY - z0 * sinY;
        const z1 = x0 * sinY + z0 * cosY;

        const y2 = y0 * cosX - z1 * sinX;
        const z2 = y0 * sinX + z1 * cosX;

        // Perspective scale
        const zDist = focalLength + z2;
        if (zDist <= 10) continue;

        const scale = focalLength / zDist;
        const sx = x1 * scale + centerX;
        const sy = y2 * scale + centerY;

        // Depth-based opacity: points further back are dimmer
        const depthAlpha = Math.max(0.08, Math.min(0.85, (z2 + 140) / 280)) * pt.alpha;
        const renderSize = pt.size * scale;

        projected.push({ sx, sy, sz: z2, alpha: depthAlpha, size: renderSize, c: pt.cluster });

        // Draw point
        ctx.beginPath();
        ctx.arc(sx, sy, renderSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240, 240, 245, ${depthAlpha})`;
        ctx.fill();
      }

      // Micro-mesh filaments: connect close points in dense cluster regions
      // Sample step to maintain high performance
      const step = width < 640 ? 4 : 2;
      for (let i = 0; i < projected.length; i += step) {
        const p1 = projected[i];
        for (let j = i + 1; j < Math.min(i + 14, projected.length); j++) {
          const p2 = projected[j];
          if (p1.c !== p2.c) continue; // Only connect within same manifold

          const dx = p1.sx - p2.sx;
          const dy = p1.sy - p2.sy;
          const distSq = dx * dx + dy * dy;

          if (distSq < 480) { // ~22px distance threshold
            const dist = Math.sqrt(distSq);
            const lineAlpha = (1 - dist / 22) * 0.05 * Math.min(p1.alpha, p2.alpha);
            ctx.beginPath();
            ctx.moveTo(p1.sx, p1.sy);
            ctx.lineTo(p2.sx, p2.sy);
            ctx.strokeStyle = `rgba(220, 225, 235, ${lineAlpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // Project & Render the Dynamic Anomaly Point
      const ax1 = anomalyState.x * cosY - anomalyState.z * sinY;
      const az1 = anomalyState.x * sinY + anomalyState.z * cosY;
      const ay2 = anomalyState.y * cosX - az1 * sinX;
      const az2 = anomalyState.y * sinX + az1 * cosX;

      const aScale = focalLength / (focalLength + az2);
      const asx = ax1 * aScale + centerX;
      const asy = ay2 * aScale + centerY;

      // Project origin centroid for validation vector
      const ox1 = anomalyState.originX * cosY - anomalyState.originZ * sinY;
      const oz1 = anomalyState.originX * sinY + anomalyState.originZ * cosY;
      const oy2 = anomalyState.originY * cosX - oz1 * sinX;
      const osx = ox1 * aScale + centerX;
      const osy = oy2 * aScale + centerY;

      // If active detection probe is firing (Phase 2): draw analytical validation ray
      if (validationProbe && probeIntensity > 0.05) {
        ctx.beginPath();
        ctx.moveTo(osx, osy);
        ctx.lineTo(asx, asy);
        ctx.strokeStyle = `rgba(250, 250, 255, ${probeIntensity * 0.18})`;
        ctx.lineWidth = 0.8;
        ctx.setLineDash([3, 5]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Small validation node pulse on the vector
        const pulseT = (time * 0.002) % 1;
        const px = osx + (asx - osx) * pulseT;
        const py = osy + (asy - osy) * pulseT;
        ctx.beginPath();
        ctx.arc(px, py, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${probeIntensity * 0.6})`;
        ctx.fill();
      }

      // Draw the Anomaly Point itself
      ctx.beginPath();
      ctx.arc(asx, asy, 2.2 * aScale, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${anomalyAlpha})`;
      ctx.fill();

      // Subtle halo around anomaly during detection
      if (validationProbe) {
        ctx.beginPath();
        ctx.arc(asx, asy, (4 + probeIntensity * 3) * aScale, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${probeIntensity * 0.22})`;
        ctx.lineWidth = 0.75;
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[320px] sm:h-[420px] md:h-[480px] lg:h-[520px] pointer-events-auto overflow-hidden select-none"
      aria-label="Analytical Field: interactive 3D data distribution manifold showing patterns, anomalies, and validation lineage"
      role="img"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-crosshair opacity-90 transition-opacity duration-700"
      />

      {/* Subtle bottom fade mask ensuring the visual seamlessly dissolves into the pitch-black page */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-[#030304]" />
      <div className="absolute inset-x-0 bottom-0 h-24 pointer-events-none bg-gradient-to-t from-[#030304] to-transparent" />
      <div className="absolute inset-x-0 top-0 h-16 pointer-events-none bg-gradient-to-b from-[#030304] to-transparent" />
    </div>
  );
};
