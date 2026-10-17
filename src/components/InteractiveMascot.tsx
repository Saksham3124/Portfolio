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

  // Scroll visibility & physical landing state
  const [hasScrolledPastHero, setHasScrolledPastHero] = useState(false);
  const [hasLanded, setHasLanded] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Monitor scroll to trigger entrance when scrolling past hero section (> 300px)
  useEffect(() => {
    const handleScroll = () => {
      // Once scrolled past hero, introduce the mascot and keep it fixed in the corner
      if (window.scrollY > 300) {
        setHasScrolledPastHero(true);
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
      const nextDelay = 3800 + Math.random() * 3000;
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

  // Spring physics for genuinely articulated multi-joint tracking:
  // Tier 1: Lower Body / Torso
  const bodyRotate = useSpring(0, { stiffness: 180, damping: 22, mass: 0.6 });
  const bodyShiftX = useSpring(0, { stiffness: 190, damping: 24, mass: 0.5 });
  const bodyShiftY = useSpring(0, { stiffness: 180, damping: 24, mass: 0.5 });

  // Tier 2: Articulated Neck Column
  const neckRotate = useSpring(0, { stiffness: 220, damping: 20, mass: 0.4 });
  const neckScaleY = useSpring(1, { stiffness: 240, damping: 22, mass: 0.3 });

  // Tier 3: Rectangular Metallic Head
  const headRotate = useSpring(0, { stiffness: 260, damping: 22, mass: 0.45 });
  const headShiftX = useSpring(0, { stiffness: 240, damping: 22, mass: 0.4 });
  const headShiftY = useSpring(0, { stiffness: 240, damping: 22, mass: 0.4 });

  // Tier 4: Expressive Silver-White Eyes
  const pupilX = useSpring(0, { stiffness: 380, damping: 26, mass: 0.25 });
  const pupilY = useSpring(0, { stiffness: 380, damping: 26, mass: 0.25 });

  // Frame-by-frame full body and multi-joint cursor tracking
  useAnimationFrame(() => {
    if (!mascotRef.current || shouldReduceMotion || isTouchDevice || !hasLanded) return;

    // Check if cursor has left the window or is hidden
    if (cursorVariant === "hidden") {
      bodyRotate.set(0);
      bodyShiftX.set(0);
      bodyShiftY.set(0);
      neckRotate.set(0);
      neckScaleY.set(1);
      headRotate.set(0);
      headShiftX.set(0);
      headShiftY.set(0);
      pupilX.set(0);
      pupilY.set(0);
      return;
    }

    const rect = mascotRef.current.getBoundingClientRect();
    const mascotCenterX = rect.left + rect.width / 2;
    const mascotCenterY = rect.top + rect.height * 0.38;

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

    const normX = Math.max(-0.2, Math.min(1, dx / (winWidth * 0.85)));
    const normY = Math.max(-0.2, Math.min(1, -dy / (winHeight * 0.85)));

    // 1. Head Rotation & Tilt: Rectangular head leans actively toward cursor
    let targetHeadRotate = normX * 10 - 1;
    let targetHeadX = normX * 3.8;
    let targetHeadY = -normY * 4.2;

    // 2. Articulated Neck: Follows head with hydraulic dampening and height stretch
    let targetNeckRotate = normX * 5.2;
    let targetNeckScaleY = 1 + normY * 0.12;

    // 3. Torso / Body: Follows head with mechanical delay
    let targetBodyRotate = normX * 5.5;
    let targetBodyShiftX = normX * 3.4;
    let targetBodyShiftY = -normY * 2.2;

    // 4. Project Card Glance: perks up when hovering over projects
    if (isHoveringProject) {
      targetHeadRotate += 4.5;
      targetHeadX += 1.5;
      targetHeadY -= 3.5;
      targetNeckRotate += 2.5;
      targetNeckScaleY += 0.08;
      targetBodyRotate += 2.8;
      targetBodyShiftX += 1.2;
      targetBodyShiftY -= 0.8;
    }

    // 5. Bounded Eye Tracking: Silver-white pupils stay smoothly within sockets
    const angle = Math.atan2(dy, dx);
    const maxHorizontalPupil = 3.6;
    const maxVerticalPupil = 2.4;
    const pullFactor = Math.min(1, dist / 260);

    const targetPupilX = Math.cos(angle) * maxHorizontalPupil * pullFactor;
    const targetPupilY = Math.sin(angle) * maxVerticalPupil * pullFactor;

    // Update springs
    bodyRotate.set(targetBodyRotate);
    bodyShiftX.set(targetBodyShiftX);
    bodyShiftY.set(targetBodyShiftY);
    neckRotate.set(targetNeckRotate);
    neckScaleY.set(targetNeckScaleY);
    headRotate.set(targetHeadRotate);
    headShiftX.set(targetHeadX);
    headShiftY.set(targetHeadY);
    pupilX.set(targetPupilX);
    pupilY.set(targetPupilY);
  });

  // Never render on touch devices or if dismissed
  if (isTouchDevice || isMascotDismissed) {
    return null;
  }

  const isVisible = hasScrolledPastHero;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.aside
          ref={mascotRef}
          aria-label="Interactive mechanical companion"
          initial={
            shouldReduceMotion
              ? { opacity: 0 }
              : { y: 160, opacity: 0, scaleY: 1.15, scaleX: 0.9 }
          }
          animate={
            shouldReduceMotion
              ? { opacity: 1 }
              : { y: 0, opacity: 1, scaleY: 1, scaleX: 1 }
          }
          exit={
            shouldReduceMotion
              ? { opacity: 0 }
              : {
                  y: 160,
                  opacity: 0,
                  scale: 0.8,
                  transition: { duration: 0.35, ease: [0.32, 0, 0.67, 0] },
                }
          }
          transition={
            shouldReduceMotion
              ? { duration: 0.2 }
              : {
                  type: "spring",
                  stiffness: 240,
                  damping: 17,
                  mass: 0.85,
                }
          }
          onAnimationComplete={() => setHasLanded(true)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="fixed bottom-6 left-6 z-30 hidden sm:flex flex-col items-center select-none pointer-events-auto"
        >
          {/* Ambient Ground Floating Shadow (No platform, soft dimensional shadow) */}
          <motion.div
            animate={
              shouldReduceMotion
                ? {}
                : {
                    scale: [1, 0.88, 1],
                    opacity: [0.55, 0.35, 0.55],
                  }
            }
            transition={
              shouldReduceMotion
                ? {}
                : {
                    repeat: Infinity,
                    duration: 3.6,
                    ease: "easeInOut",
                  }
            }
            className="w-14 h-3 rounded-full bg-black/80 blur-[4px] absolute -bottom-1 z-0"
          />

          {/* Dismiss Button (Accessible, discreet circular close) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              dismissMascot();
            }}
            title="Dismiss companion"
            aria-label="Dismiss mascot companion"
            className={`absolute -top-2 -right-2 z-40 w-5 h-5 rounded-full bg-[#120820]/95 border border-purple-400/30 text-purple-200 hover:text-white hover:bg-purple-900 transition-all duration-200 shadow-lg flex items-center justify-center ${
              isHovered
                ? "opacity-100 scale-100"
                : "opacity-0 scale-75 pointer-events-none"
            }`}
          >
            <X className="w-2.5 h-2.5" />
          </button>

          {/* 
            ARTICULATED 3D MECHANICAL MASCOT
            Reference design:
            - Metallic rectangular head with softly rounded corners
            - Two prominent, expressive silver-white eyes
            - Dark purple & obsidian black reflective casing
            - Articulated metallic neck cylinder with hydraulic ring collars
            - Compact geometric body with reflective silver and purple surfaces
            - Studio-style highlights and reflections
          */}
          <motion.div
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
                    duration: 3.6,
                    ease: "easeInOut",
                  }
            }
            className="relative z-10 flex flex-col items-center cursor-default"
          >
            {/* TIER 3: Rectangular Metallic Head */}
            <motion.div
              style={{
                rotate: headRotate,
                x: headShiftX,
                y: headShiftY,
              }}
              className="relative z-20"
            >
              {/* Head Shell: Dark purple & obsidian black reflective casing */}
              <div className="relative w-[56px] h-[44px] rounded-[13px] bg-gradient-to-b from-[#2a1347] via-[#160a26] to-[#07030d] border border-purple-500/40 shadow-[0_8px_24px_rgba(0,0,0,0.85),0_0_15px_rgba(168,85,247,0.22),inset_0_1.5px_2px_rgba(233,213,255,0.45)] flex flex-col items-center justify-center p-2 overflow-hidden">
                
                {/* Studio Top Directional Chrome Specular Edge */}
                <div className="absolute top-0 inset-x-2 h-[1px] bg-gradient-to-r from-transparent via-purple-200 to-transparent opacity-90" />
                <div className="absolute top-1 inset-x-3 h-[0.5px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

                {/* Recessed Obsidian Face Frame */}
                <div className="relative w-full h-[30px] rounded-[9px] bg-[#05020a] border border-purple-900/60 shadow-[inset_0_2px_5px_rgba(0,0,0,0.95)] flex items-center justify-center gap-2.5 px-2 overflow-hidden">
                  
                  {/* Studio Diagonal Glass Curvature Reflection */}
                  <div className="absolute -top-3 -left-3 w-16 h-8 bg-gradient-to-br from-white/[0.12] via-purple-300/[0.04] to-transparent rotate-[-24deg] pointer-events-none" />

                  {/* TIER 4: Left Silver-White Eye */}
                  <div className="relative w-[15px] h-[18px] rounded-[6px] bg-[#030105] border border-slate-400/50 shadow-[0_0_4px_rgba(255,255,255,0.2),inset_0_1px_3px_rgba(0,0,0,0.9)] flex items-center justify-center overflow-hidden">
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
                      className="w-[10px] h-[13px] rounded-[4px] bg-gradient-to-b from-[#ffffff] via-[#e2e8f0] to-[#cbd5e1] shadow-[0_0_8px_rgba(255,255,255,0.95)] flex items-center justify-center"
                    >
                      {/* Deep Inner Optical Center */}
                      <div className="w-1 h-1.5 rounded-[2px] bg-[#0f172a]/80" />
                    </motion.div>
                  </div>

                  {/* TIER 4: Right Silver-White Eye */}
                  <div className="relative w-[15px] h-[18px] rounded-[6px] bg-[#030105] border border-slate-400/50 shadow-[0_0_4px_rgba(255,255,255,0.2),inset_0_1px_3px_rgba(0,0,0,0.9)] flex items-center justify-center overflow-hidden">
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
                      className="w-[10px] h-[13px] rounded-[4px] bg-gradient-to-b from-[#ffffff] via-[#e2e8f0] to-[#cbd5e1] shadow-[0_0_8px_rgba(255,255,255,0.95)] flex items-center justify-center"
                    >
                      {/* Deep Inner Optical Center */}
                      <div className="w-1 h-1.5 rounded-[2px] bg-[#0f172a]/80" />
                    </motion.div>
                  </div>
                </div>

                {/* Lower Chin Sensor Line */}
                <div className="absolute bottom-1 w-6 h-[1.5px] rounded-full bg-purple-500/40" />
              </div>
            </motion.div>

            {/* TIER 2: Articulated Metallic Hydraulic Neck Column */}
            <motion.div
              style={{
                rotate: neckRotate,
                scaleY: neckScaleY,
              }}
              className="relative z-10 -my-1 flex flex-col items-center"
            >
              {/* Hydraulic Collar Segment 1 */}
              <div className="w-4 h-[3.5px] rounded-[2px] bg-gradient-to-r from-slate-500 via-slate-100 to-slate-600 border-x border-slate-400/40 shadow-sm" />
              {/* Hydraulic Collar Segment 2 */}
              <div className="w-3.5 h-[3px] bg-gradient-to-r from-slate-600 via-slate-200 to-slate-700 -my-[0.5px]" />
              {/* Hydraulic Collar Segment 3 */}
              <div className="w-4.5 h-[3.5px] rounded-[2px] bg-gradient-to-r from-slate-500 via-slate-100 to-slate-600 border-x border-slate-400/40 shadow-sm" />
            </motion.div>

            {/* TIER 1: Compact Geometric Body with Reflective Silver & Purple Surfaces */}
            <motion.div
              style={{
                rotate: bodyRotate,
                x: bodyShiftX,
                y: bodyShiftY,
              }}
              className="relative z-0"
            >
              <div className="relative w-[50px] h-[38px] rounded-b-[16px] rounded-t-[8px] bg-gradient-to-b from-[#1a0c2e] via-[#10061d] to-[#08020f] border border-purple-500/30 shadow-[0_10px_25px_rgba(0,0,0,0.7),inset_0_1px_2px_rgba(216,180,254,0.3)] flex flex-col items-center justify-between p-1.5 overflow-hidden">
                
                {/* Silver Chest Armour Inset with Studio Reflections */}
                <div className="w-full h-[16px] rounded-[6px] bg-gradient-to-r from-slate-300 via-white to-slate-300 border border-slate-200 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_2px_4px_rgba(0,0,0,0.4)] flex items-center justify-between px-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-700/80 shadow-sm" />
                  <div className="w-4 h-[2px] rounded-full bg-slate-500/50" />
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-700/80 shadow-sm" />
                </div>

                {/* Abdomen Power Reactor Core */}
                <div className="w-full flex items-center justify-between px-2 pt-0.5">
                  <div className="w-2.5 h-[3px] rounded-full bg-purple-900/60" />
                  <div className="flex items-center gap-1">
                    <span
                      className={`w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_6px_#c084fc] ${
                        isHoveringProject ? "animate-ping" : "animate-pulse"
                      }`}
                    />
                    <span className="text-[6.5px] font-mono tracking-wider text-purple-300/80 uppercase font-bold">
                      {isHoveringProject ? "LOCK" : "PWR"}
                    </span>
                  </div>
                  <div className="w-2.5 h-[3px] rounded-full bg-purple-900/60" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
