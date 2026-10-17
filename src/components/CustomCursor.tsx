"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring, useReducedMotion } from "framer-motion";
import { usePointer } from "@/context/PointerContext";

export const CustomCursor: React.FC = () => {
  const { mouseX, mouseY, cursorVariant, isTouchDevice } = usePointer();
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);

  useEffect(() => {
    setMounted(true);

    const markMoved = () => {
      setHasMoved(true);
      window.removeEventListener("pointermove", markMoved);
    };
    window.addEventListener("pointermove", markMoved, { passive: true });

    return () => {
      window.removeEventListener("pointermove", markMoved);
    };
  }, []);

  // Spring physics for the central dot (instant, ultra-crisp)
  const dotX = useSpring(mouseX, { stiffness: 1200, damping: 50, mass: 0.1 });
  const dotY = useSpring(mouseY, { stiffness: 1200, damping: 50, mass: 0.1 });

  // Spring physics for the outer ring (fluid, smooth deceleration)
  const ringX = useSpring(mouseX, { stiffness: 280, damping: 26, mass: 0.4 });
  const ringY = useSpring(mouseY, { stiffness: 280, damping: 26, mass: 0.4 });

  // Spring physics for the trailing satellite (deliberate, restrained delay)
  const trailX = useSpring(mouseX, { stiffness: 120, damping: 18, mass: 0.5 });
  const trailY = useSpring(mouseY, { stiffness: 120, damping: 18, mass: 0.5 });

  // Manage desktop document-level cursor class
  useEffect(() => {
    if (!mounted || isTouchDevice || shouldReduceMotion) return;

    document.documentElement.classList.add("has-custom-cursor");
    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [mounted, isTouchDevice, shouldReduceMotion]);

  // Don't render on touch devices, reduced motion, or before hydration
  if (!mounted || isTouchDevice || shouldReduceMotion || !hasMoved) {
    return null;
  }

  const isHidden = cursorVariant === "hidden";
  const isText = cursorVariant === "text";
  const isPointer = cursorVariant === "pointer";
  const isProject = cursorVariant === "project";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none"
    >
      {/* 1. Subtle Trailing Satellite Particle */}
      <motion.div
        style={{
          x: trailX,
          y: trailY,
        }}
        animate={{
          opacity: isHidden || isText ? 0 : 0.35,
          scale: isProject ? 1.4 : isPointer ? 1.2 : 1,
        }}
        transition={{ duration: 0.2 }}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-400/40 blur-[0.5px]"
      />

      {/* 2. Outer Contextual Ring */}
      <motion.div
        style={{
          x: ringX,
          y: ringY,
        }}
        animate={{
          opacity: isHidden ? 0 : isText ? 0 : 1,
          scale: isProject ? 2.1 : isPointer ? 1.5 : 1,
          width: 32,
          height: 32,
        }}
        transition={{
          type: "spring",
          stiffness: 380,
          damping: 24,
        }}
        className={`fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center transition-colors duration-200 ${
          isProject
            ? "border border-white/40 bg-white/[0.04] shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            : isPointer
            ? "border border-blue-400/60 bg-blue-500/[0.08] shadow-[0_0_15px_rgba(56,189,248,0.2)]"
            : "border border-white/25 bg-white/[0.015]"
        }`}
      >
        {/* Project Card "VIEW" Badge */}
        {isProject && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-[8px] font-mono tracking-widest uppercase font-semibold text-white/90"
          >
            VIEW
          </motion.span>
        )}
      </motion.div>

      {/* 3. Central Responsive Dot */}
      <motion.div
        style={{
          x: dotX,
          y: dotY,
        }}
        animate={{
          opacity: isHidden ? 0 : isText ? 0 : 1,
          scale: isProject ? 0 : isPointer ? 0.75 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28,
        }}
        className={`fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
          isPointer ? "bg-blue-400" : "bg-white"
        } shadow-[0_0_6px_rgba(255,255,255,0.6)]`}
      />
    </div>
  );
};
