"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useAnimationFrame,
  useSpring,
} from "framer-motion";
import { X } from "lucide-react";
import { usePointer } from "@/context/PointerContext";

export const InteractiveMascot: React.FC = () => {
  const {
    mouseX,
    mouseY,
    cursorVariant,
    isHoveringProject,
    isTouchDevice,
    isMascotDismissed,
    dismissMascot,
  } = usePointer();

  const shouldReduceMotion = useReducedMotion();
  const mascotRef = useRef<HTMLDivElement | null>(null);

  // Scroll visibility & Session entrance tracking
  const [hasScrolledPastHero, setHasScrolledPastHero] = useState(false);
  const [alreadyEnteredSession, setAlreadyEnteredSession] = useState(false);
  const [hasLanded, setHasLanded] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Check if entrance already played during this page session
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const entered = sessionStorage.getItem("portfolio_mascot_entered");
        if (entered === "true") {
          setAlreadyEnteredSession(true);
          setHasLanded(true);
        }
      } catch {
        // Ignore session storage errors
      }
    }
  }, []);

  // Monitor scroll to trigger entrance when scrolling past hero section (> 380px)
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 380) {
        setHasScrolledPastHero(true);
      } else {
        setHasScrolledPastHero(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Natural blinking behavior: occasional blink every 4 to 7 seconds
  useEffect(() => {
    if (shouldReduceMotion) return;

    let timeoutId: NodeJS.Timeout;

    const scheduleBlink = () => {
      const nextDelay = 4200 + Math.random() * 2800;
      timeoutId = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          scheduleBlink();
        }, 130);
      }, nextDelay);
    };

    scheduleBlink();
    return () => clearTimeout(timeoutId);
  }, [shouldReduceMotion]);

  // Motion springs for Full-Body Cursor Tracking (Layer 2 & 3)
  // These springs update DOM transforms directly with 0 React re-renders!
  const bodyRotate = useSpring(0, { stiffness: 180, damping: 22, mass: 0.6 });
  const bodyShiftX = useSpring(0, { stiffness: 200, damping: 24, mass: 0.5 });
  const postureTiltY = useSpring(0, { stiffness: 190, damping: 22, mass: 0.5 });
  const headTilt = useSpring(0, { stiffness: 220, damping: 20, mass: 0.4 });
  const pupilX = useSpring(0, { stiffness: 360, damping: 26, mass: 0.3 });
  const pupilY = useSpring(0, { stiffness: 360, damping: 26, mass: 0.3 });

  // Frame-by-frame full body and eye cursor tracking
  useAnimationFrame(() => {
    if (!mascotRef.current || shouldReduceMotion || isTouchDevice || !hasLanded) return;

    // Check if cursor has left the window or is hidden
    if (cursorVariant === "hidden") {
      bodyRotate.set(0);
      bodyShiftX.set(0);
      postureTiltY.set(0);
      headTilt.set(0);
      pupilX.set(0);
      pupilY.set(0);
      return;
    }

    const rect = mascotRef.current.getBoundingClientRect();
    const mascotCenterX = rect.left + rect.width / 2;
    const mascotCenterY = rect.top + rect.height * 0.42;

    const curX = mouseX.get();
    const curY = mouseY.get();

    // If mouse has not moved yet
    if (curX < 0 || curY < 0) return;

    const dx = curX - mascotCenterX;
    const dy = curY - mascotCenterY;
    const dist = Math.hypot(dx, dy);

    // Normalize horizontal and vertical positions across viewport
    const winWidth = typeof window !== "undefined" ? window.innerWidth : 1200;
    const winHeight = typeof window !== "undefined" ? window.innerHeight : 800;

    // Normalized horizontal vector: Mascot is at bottom-left, so dx is almost always positive
    const normX = Math.max(0, Math.min(1, dx / (winWidth * 0.85)));
    // Normalized vertical vector: -dy reaches upward toward top of screen
    const normY = Math.max(0, Math.min(1, -dy / (winHeight * 0.85)));

    // 1. Full Body Rotation: Leans subtly rightward toward visitor's cursor (up to ~7deg)
    let targetRotate = normX * 8 - 1;

    // 2. Lateral Body Shift: Shifts slightly (up to 5px rightward)
    let targetShiftX = normX * 5.2;

    // 3. Posture Adjustment: Stretches/tilts upward when looking toward top of screen
    let targetPostureY = -normY * 4.2;

    // 4. Head and Visor Tilt
    let targetHeadTilt = normX * 6 - normY * 3.5;

    // 5. Glance towards hovered project card
    if (isHoveringProject) {
      targetRotate += 3.5;
      targetShiftX += 1.8;
      targetPostureY -= 2.5;
      targetHeadTilt += 4;
    }

    // 6. Bounded Pupil Tracking: strictly clamped within eye socket visor bounds
    const angle = Math.atan2(dy, dx);
    const maxHorizontalPupil = 4.6;
    const maxVerticalPupil = 2.8;
    const pullFactor = Math.min(1, dist / 260);

    const targetPupilX = Math.cos(angle) * maxHorizontalPupil * pullFactor;
    const targetPupilY = Math.sin(angle) * maxVerticalPupil * pullFactor;

    // Apply values to springs
    bodyRotate.set(targetRotate);
    bodyShiftX.set(targetShiftX);
    postureTiltY.set(targetPostureY);
    headTilt.set(targetHeadTilt);
    pupilX.set(targetPupilX);
    pupilY.set(targetPupilY);
  });

  // Never render on touch devices or if dismissed
  if (isTouchDevice || isMascotDismissed) {
    return null;
  }

  const isVisible = hasScrolledPastHero;

  // Handle completion of physical landing jump
  const handleEntranceComplete = () => {
    setHasLanded(true);
    setAlreadyEnteredSession(true);
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem("portfolio_mascot_entered", "true");
      } catch {
        // Ignore
      }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <aside
          ref={mascotRef}
          aria-label="Interactive portfolio companion"
          className="fixed bottom-6 left-6 z-30 hidden sm:flex flex-col items-center select-none pointer-events-auto"
        >
          {/* LAYER 1: Independent Entrance Jump & Landing Squash/Stretch */}
          <motion.div
            initial={
              alreadyEnteredSession || shouldReduceMotion
                ? { y: 0, opacity: 1, scaleY: 1, scaleX: 1 }
                : { y: 140, opacity: 0, scaleY: 1.22, scaleX: 0.82 }
            }
            animate={
              alreadyEnteredSession || shouldReduceMotion
                ? { y: 0, opacity: 1, scaleY: 1, scaleX: 1 }
                : {
                    // Physical bounce: jumps from below screen -> slight overshoot (-16px) -> subtle squash on landing -> settles
                    y: [140, -16, 4, -2, 0],
                    opacity: [0, 1, 1, 1, 1],
                    scaleY: [1.22, 0.94, 1.06, 0.98, 1],
                    scaleX: [0.82, 1.08, 0.95, 1.01, 1],
                  }
            }
            transition={
              alreadyEnteredSession || shouldReduceMotion
                ? { duration: 0.2 }
                : {
                    duration: 0.85,
                    times: [0, 0.45, 0.72, 0.88, 1],
                    ease: [0.22, 1.15, 0.36, 1],
                  }
            }
            onAnimationComplete={handleEntranceComplete}
            exit={{
              y: 60,
              opacity: 0,
              scale: 0.8,
              transition: { duration: 0.25, ease: "easeIn" },
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative flex flex-col items-center"
          >
            {/* Ambient Ground Shadow with Physical Reactivity */}
            <motion.div
              animate={
                shouldReduceMotion
                  ? {}
                  : {
                      scale: [1, 0.9, 1],
                      opacity: [0.45, 0.28, 0.45],
                    }
              }
              transition={
                shouldReduceMotion
                  ? {}
                  : {
                      repeat: Infinity,
                      duration: 3.8,
                      ease: "easeInOut",
                    }
              }
              className="w-14 h-3 rounded-full bg-black/70 blur-[4px] absolute -bottom-1 z-0"
            />

            {/* LAYER 2: Full-Body Cursor Lean, Lateral Shift & Organic Idle Floating */}
            <motion.div
              style={{
                rotate: bodyRotate,
                x: bodyShiftX,
              }}
              animate={
                shouldReduceMotion || !hasLanded
                  ? {}
                  : {
                      y: [0, -3.2, 0],
                    }
              }
              transition={
                shouldReduceMotion
                  ? {}
                  : {
                      repeat: Infinity,
                      duration: 3.8,
                      ease: "easeInOut",
                    }
              }
              className="relative z-10 flex flex-col items-center group cursor-default"
            >
              {/* Dismiss Button (Accessible, discreet circular close) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  dismissMascot();
                }}
                title="Dismiss companion for this session"
                aria-label="Dismiss mascot companion"
                className={`absolute -top-2 -right-2 z-30 w-5 h-5 rounded-full bg-[#0a0d14]/90 border border-white/20 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all duration-200 shadow-lg flex items-center justify-center ${
                  isHovered
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-75 pointer-events-none"
                }`}
              >
                <X className="w-2.5 h-2.5" />
              </button>

              {/* LAYER 3: Head Tilt & Vertical Posture Adjustment */}
              <motion.div
                style={{
                  rotate: headTilt,
                  y: postureTiltY,
                }}
                className="relative"
              >
                {/* 
                  AERO / LUMINA: Sculpted Pearl-White & Luminous Silver 3D Character
                  - Clean, organic aerodynamic silhouette
                  - High contrast against black #030304 background
                  - NO clunky antennas, NO robot ear blocks
                */}
                <div className="relative w-[56px] h-[64px] rounded-[22px] bg-gradient-to-b from-[#ffffff] via-[#f1f5f9] to-[#cbd5e1] border border-white/80 shadow-[0_12px_28px_rgba(0,0,0,0.65),0_0_18px_rgba(56,189,248,0.25),inset_0_2px_4px_rgba(255,255,255,0.95)] flex flex-col items-center justify-between p-2.5 overflow-hidden">
                  
                  {/* Top Directional Specular Sheen (Gives polished 3D ceramic/pearl depth) */}
                  <div className="absolute top-0 inset-x-2 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-95" />

                  {/* Soft Internal Cyan Ambient Ambient Rim Lighting */}
                  <div className="absolute inset-0 rounded-[22px] bg-gradient-to-tr from-cyan-400/10 via-transparent to-white/40 pointer-events-none" />

                  {/* Curved Obsidian Glass Visor Screen */}
                  <div className="relative w-full h-[29px] rounded-[13px] bg-[#05070c] border border-black/80 flex items-center justify-center gap-2.5 px-2 shadow-[inset_0_2px_6px_rgba(0,0,0,0.9),0_1px_2px_rgba(255,255,255,0.5)] overflow-hidden mt-0.5">
                    
                    {/* Diagonal Visor Glass Curvature Reflection */}
                    <div className="absolute -top-3 -left-3 w-16 h-8 bg-gradient-to-br from-white/[0.14] via-white/[0.04] to-transparent rotate-[-22deg] pointer-events-none" />

                    {/* LAYER 4: Left Eye & Pupil (Bounded Tracking) */}
                    <div className="relative w-3.5 h-4 rounded-full bg-black/60 flex items-center justify-center overflow-hidden">
                      <motion.div
                        style={{
                          x: pupilX,
                          y: pupilY,
                        }}
                        animate={{
                          scaleY: isBlinking ? 0.08 : 1,
                          scale: isHoveringProject ? 1.15 : 1,
                        }}
                        transition={{
                          scaleY: { duration: 0.1 },
                          scale: { duration: 0.2 },
                        }}
                        className="w-2.5 h-3.5 rounded-full bg-gradient-to-b from-[#67e8f9] to-[#0284c7] shadow-[0_0_8px_#38bdf8] flex items-center justify-center"
                      >
                        {/* Luminous Core Glimmer */}
                        <div className="w-1 h-1 rounded-full bg-white shadow-[0_0_3px_#ffffff]" />
                      </motion.div>
                    </div>

                    {/* LAYER 4: Right Eye & Pupil (Bounded Tracking) */}
                    <div className="relative w-3.5 h-4 rounded-full bg-black/60 flex items-center justify-center overflow-hidden">
                      <motion.div
                        style={{
                          x: pupilX,
                          y: pupilY,
                        }}
                        animate={{
                          scaleY: isBlinking ? 0.08 : 1,
                          scale: isHoveringProject ? 1.15 : 1,
                        }}
                        transition={{
                          scaleY: { duration: 0.1 },
                          scale: { duration: 0.2 },
                        }}
                        className="w-2.5 h-3.5 rounded-full bg-gradient-to-b from-[#67e8f9] to-[#0284c7] shadow-[0_0_8px_#38bdf8] flex items-center justify-center"
                      >
                        {/* Luminous Core Glimmer */}
                        <div className="w-1 h-1 rounded-full bg-white shadow-[0_0_3px_#ffffff]" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Micro Telemetry Status Pill (Recessed Cyan Indicator Notch) */}
                  <div className="w-full flex items-center justify-between px-1.5 pt-0.5">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full bg-[#0284c7] shadow-[0_0_5px_#38bdf8] ${
                          isHoveringProject ? "animate-ping" : "animate-pulse"
                        }`}
                      />
                      <span className="text-[7.5px] font-mono tracking-wider text-slate-600 uppercase font-bold">
                        {isHoveringProject ? "TARGET" : "ONLINE"}
                      </span>
                    </div>
                    <div className="w-4 h-[2px] rounded-full bg-slate-300" />
                  </div>
                </div>

                {/* Subtle base shadow gradient */}
                <div className="absolute inset-x-2 -bottom-1 h-2 rounded-full bg-slate-400/20 blur-sm pointer-events-none" />
              </motion.div>
            </motion.div>
          </motion.div>
        </aside>
      )}
    </AnimatePresence>
  );
};
