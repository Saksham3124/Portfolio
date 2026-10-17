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

  // Scroll visibility & active state
  const [hasScrolledPastHero, setHasScrolledPastHero] = useState(false);
  const [hasLanded, setHasLanded] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Monitor scroll: appears past hero section (> 280px), vanishes back into left when entering hero (<= 280px)
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolledPastHero(window.scrollY > 280);
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
      const nextDelay = 3800 + Math.random() * 3200;
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

  // Spring physics for multi-joint articulated tracking:
  // Base / Floating Pedestal
  const baseRotate = useSpring(0, { stiffness: 160, damping: 24, mass: 0.7 });
  const baseShiftX = useSpring(0, { stiffness: 180, damping: 24, mass: 0.6 });
  const baseShiftY = useSpring(0, { stiffness: 180, damping: 24, mass: 0.6 });

  // Articulated Neck Column & Cone Collar
  const neckRotate = useSpring(0, { stiffness: 220, damping: 22, mass: 0.4 });
  const neckScaleY = useSpring(1, { stiffness: 240, damping: 22, mass: 0.3 });

  // Metallic Rectangular Head
  const headRotate = useSpring(0, { stiffness: 260, damping: 22, mass: 0.45 });
  const headShiftX = useSpring(0, { stiffness: 240, damping: 22, mass: 0.4 });
  const headShiftY = useSpring(0, { stiffness: 240, damping: 22, mass: 0.4 });

  // Round Ruby Camera Lens Pupils
  const pupilX = useSpring(0, { stiffness: 380, damping: 26, mass: 0.25 });
  const pupilY = useSpring(0, { stiffness: 380, damping: 26, mass: 0.25 });

  // Frame-by-frame cursor tracking
  useAnimationFrame(() => {
    if (!mascotRef.current || shouldReduceMotion || isTouchDevice || !hasLanded) return;

    // Check if cursor has left the window or is hidden
    if (cursorVariant === "hidden") {
      baseRotate.set(0);
      baseShiftX.set(0);
      baseShiftY.set(0);
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
    const mascotCenterY = rect.top + rect.height * 0.35;

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
    const normY = Math.max(-0.8, Math.min(0.8, -dy / (winHeight * 0.85)));

    // 1. Head Rotation & Tilt: Rectangular head leans actively toward cursor
    let targetHeadRotate = normX * 12 - 1;
    let targetHeadX = normX * 4.2;
    let targetHeadY = -normY * 4.8;

    // 2. Neck: Follows head with hydraulic dampening and height stretch
    let targetNeckRotate = normX * 6.0;
    let targetNeckScaleY = 1 + normY * 0.12;

    // 3. Floating Pedestal / Base: Tilts slightly to counterbalance
    let targetBaseRotate = normX * 4.5;
    let targetBaseShiftX = normX * 2.8;
    let targetBaseShiftY = -normY * 2.0;

    // 4. Project Button Glance: perks up when hovering over projects
    if (isHoveringProject) {
      targetHeadRotate += 4.5;
      targetHeadX += 2.0;
      targetHeadY -= 3.5;
      targetNeckRotate += 2.5;
      targetNeckScaleY += 0.08;
      targetBaseRotate += 2.0;
      targetBaseShiftX += 1.2;
      targetBaseShiftY -= 0.8;
    }

    // 5. Bounded Circular Eye Tracking: Ruby pupils stay strictly within round sockets
    const angle = Math.atan2(dy, dx);
    const maxPupilRadius = 2.4;
    const pullFactor = Math.min(1, dist / 240);

    const targetPupilX = Math.cos(angle) * maxPupilRadius * pullFactor;
    const targetPupilY = Math.sin(angle) * maxPupilRadius * pullFactor;

    // Update springs
    baseRotate.set(targetBaseRotate);
    baseShiftX.set(targetBaseShiftX);
    baseShiftY.set(targetBaseShiftY);
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
          aria-label="Interactive 3D mechanical companion"
          initial={
            shouldReduceMotion
              ? { opacity: 0 }
              : { x: -140, opacity: 0, scale: 0.85 }
          }
          animate={
            shouldReduceMotion
              ? { opacity: 1 }
              : { x: 0, opacity: 1, scale: 1 }
          }
          exit={
            shouldReduceMotion
              ? { opacity: 0 }
              : {
                  x: -140,
                  opacity: 0,
                  scale: 0.85,
                  transition: { duration: 0.32, ease: [0.32, 0, 0.67, 0] },
                }
          }
          transition={
            shouldReduceMotion
              ? { duration: 0.2 }
              : {
                  type: "spring",
                  stiffness: 280,
                  damping: 20,
                  mass: 0.8,
                }
          }
          onAnimationComplete={() => setHasLanded(true)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="fixed left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 hidden sm:flex flex-col items-center select-none pointer-events-auto"
        >
          {/* Ambient Floating Glow & Soft Shadow */}
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
            className="w-20 h-4 rounded-full bg-black/80 blur-[6px] absolute -bottom-3 z-0"
          />

          {/* Dismiss Button (Discreet circular close on hover) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              dismissMascot();
            }}
            title="Dismiss companion"
            aria-label="Dismiss mascot companion"
            className={`absolute -top-3 -right-2 z-40 w-5 h-5 rounded-full bg-[#120820]/95 border border-purple-400/30 text-purple-200 hover:text-white hover:bg-purple-900 transition-all duration-200 shadow-lg flex items-center justify-center cursor-pointer ${
              isHovered
                ? "opacity-100 scale-100"
                : "opacity-0 scale-75 pointer-events-none"
            }`}
          >
            <X className="w-2.5 h-2.5" />
          </button>

          {/* 
            3D MECHANICAL MASCOT - EXACT REFERENCE FROM USER IMAGE
            Features:
            - Metallic rectangular head with softly beveled corners & side ear dial
            - Two prominent circular camera lens eyes with glowing ruby/amber pupils
            - Flared metallic cone neck collar and chrome vertical post
            - Stepped geometric floating pedestal base with obsidian & purple specular rims
            - Ambient vertical floating hover
          */}
          <motion.div
            animate={
              shouldReduceMotion || !hasLanded
                ? {}
                : {
                    y: [0, -3.5, 0],
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
            {/* TIER 1: Rectangular Metallic Head */}
            <motion.div
              style={{
                rotate: headRotate,
                x: headShiftX,
                y: headShiftY,
              }}
              className="relative z-30"
            >
              {/* Head Shell: Dark purple & obsidian black casing with chrome/lavender top specular highlight */}
              <div className="relative w-[58px] h-[40px] rounded-[11px] bg-gradient-to-b from-[#2d1250] via-[#170929] to-[#07020d] border border-purple-500/40 shadow-[0_8px_24px_rgba(0,0,0,0.85),0_0_16px_rgba(168,85,247,0.25),inset_0_1.5px_2px_rgba(233,213,255,0.5)] flex flex-col items-center justify-center p-1.5 overflow-visible">
                
                {/* Side Ear Dial / Bolt (Visible on the left side in reference photo) */}
                <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-2 h-3 rounded-l-[3px] rounded-r-[1px] bg-gradient-to-b from-slate-300 via-slate-500 to-slate-700 border border-slate-400/60 shadow-sm flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-slate-900/90" />
                </div>

                {/* Top Specular Edge Highlight */}
                <div className="absolute top-0 inset-x-2 h-[1px] bg-gradient-to-r from-transparent via-purple-200 to-transparent opacity-90" />
                <div className="absolute top-1 inset-x-3 h-[0.5px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

                {/* Recessed Obsidian Face Frame */}
                <div className="relative w-full h-[28px] rounded-[7px] bg-[#05020a] border border-purple-900/60 shadow-[inset_0_2px_5px_rgba(0,0,0,0.95)] flex items-center justify-center gap-3 px-2 overflow-hidden">
                  
                  {/* Diagonal Studio Glass Curvature Reflection */}
                  <div className="absolute -top-3 -left-3 w-16 h-8 bg-gradient-to-br from-white/[0.12] via-purple-300/[0.04] to-transparent rotate-[-24deg] pointer-events-none" />

                  {/* Left Circular Camera Lens Eye */}
                  <div className="relative w-[14px] h-[14px] rounded-full bg-gradient-to-b from-slate-400 via-slate-600 to-slate-900 border border-slate-300/40 shadow-[0_0_4px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.3)] flex items-center justify-center overflow-hidden">
                    <div className="w-[11px] h-[11px] rounded-full bg-[#040106] flex items-center justify-center relative">
                      {/* Ruby Optical Pupil */}
                      <motion.div
                        style={{
                          x: pupilX,
                          y: pupilY,
                        }}
                        animate={{
                          scaleY: isBlinking ? 0.08 : 1,
                          scale: isHoveringProject ? 1.25 : 1,
                        }}
                        transition={{
                          scaleY: { duration: 0.1 },
                          scale: { duration: 0.2 },
                        }}
                        className={`w-[6.5px] h-[6.5px] rounded-full bg-gradient-to-br from-[#f87171] via-[#dc2626] to-[#991b1b] shadow-[0_0_8px_rgba(239,68,68,0.9),0_0_12px_rgba(248,113,113,0.5)] flex items-center justify-center relative ${
                          isHoveringProject ? "shadow-[0_0_12px_rgba(239,68,68,1),0_0_18px_rgba(248,113,113,0.8)]" : ""
                        }`}
                      >
                        {/* Specular Glint */}
                        <div className="absolute top-[1px] left-[1px] w-[1.5px] h-[1.5px] rounded-full bg-white/90" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Right Circular Camera Lens Eye */}
                  <div className="relative w-[14px] h-[14px] rounded-full bg-gradient-to-b from-slate-400 via-slate-600 to-slate-900 border border-slate-300/40 shadow-[0_0_4px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.3)] flex items-center justify-center overflow-hidden">
                    <div className="w-[11px] h-[11px] rounded-full bg-[#040106] flex items-center justify-center relative">
                      {/* Ruby Optical Pupil */}
                      <motion.div
                        style={{
                          x: pupilX,
                          y: pupilY,
                        }}
                        animate={{
                          scaleY: isBlinking ? 0.08 : 1,
                          scale: isHoveringProject ? 1.25 : 1,
                        }}
                        transition={{
                          scaleY: { duration: 0.1 },
                          scale: { duration: 0.2 },
                        }}
                        className={`w-[6.5px] h-[6.5px] rounded-full bg-gradient-to-br from-[#f87171] via-[#dc2626] to-[#991b1b] shadow-[0_0_8px_rgba(239,68,68,0.9),0_0_12px_rgba(248,113,113,0.5)] flex items-center justify-center relative ${
                          isHoveringProject ? "shadow-[0_0_12px_rgba(239,68,68,1),0_0_18px_rgba(248,113,113,0.8)]" : ""
                        }`}
                      >
                        {/* Specular Glint */}
                        <div className="absolute top-[1px] left-[1px] w-[1.5px] h-[1.5px] rounded-full bg-white/90" />
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Bottom Chin Specular Line */}
                <div className="absolute bottom-1 w-6 h-[1px] rounded-full bg-purple-500/40" />
              </div>
            </motion.div>

            {/* TIER 2: Articulated Metallic Neck with Flared Cone Collar */}
            <motion.div
              style={{
                rotate: neckRotate,
                scaleY: neckScaleY,
              }}
              className="relative z-20 -my-0.5 flex flex-col items-center"
            >
              {/* Inverted Metallic Cone Collar (Wider at top under head, tapered at bottom) */}
              <div
                className="w-[18px] h-[10px] bg-gradient-to-b from-slate-300 via-purple-200 to-slate-500 border border-slate-300/60 shadow-md"
                style={{
                  clipPath: "polygon(12% 0%, 88% 0%, 75% 100%, 25% 100%)",
                }}
              />
              {/* Metallic Collar Ring */}
              <div className="w-[10px] h-[2.5px] rounded-[1px] bg-gradient-to-r from-slate-500 via-slate-100 to-slate-600 shadow-sm -mt-[0.5px]" />
              {/* Chrome Vertical Cylinder Rod */}
              <div className="w-[6px] h-[5px] bg-gradient-to-r from-slate-600 via-slate-200 to-slate-700 shadow-inner" />
            </motion.div>

            {/* TIER 3: Stepped Geometric Floating Pedestal Base */}
            <motion.div
              style={{
                rotate: baseRotate,
                x: baseShiftX,
                y: baseShiftY,
              }}
              className="relative z-10 flex flex-col items-center"
            >
              {/* Pedestal Tier 1 (Top Collar Mount) */}
              <div className="w-[30px] h-[4px] rounded-[2px] bg-gradient-to-b from-[#341656] via-[#1a0c2e] to-[#0d0418] border-t border-x border-purple-400/50 shadow-sm" />

              {/* Pedestal Tier 2 (Middle Stepped Plateau) */}
              <div className="w-[52px] h-[6px] rounded-[3px] bg-gradient-to-b from-[#2a1246] via-[#170a2a] to-[#0a0314] border-t border-x border-purple-400/40 shadow-sm relative">
                <div className="absolute top-0 inset-x-2 h-[0.5px] bg-gradient-to-r from-transparent via-purple-300/80 to-transparent" />
              </div>

              {/* Pedestal Tier 3 (Main Thick Monolith Block) */}
              <div className="relative w-[78px] h-[20px] rounded-[6px] bg-gradient-to-b from-[#240e3c] via-[#120620] to-[#06020c] border border-purple-500/40 shadow-[0_10px_26px_rgba(0,0,0,0.85),0_0_18px_rgba(168,85,247,0.25),inset_0_1.5px_2px_rgba(216,180,254,0.5)] flex items-center justify-center overflow-hidden">
                {/* Specular Rim Light across the top bevel */}
                <div className="absolute top-0 inset-x-3 h-[1px] bg-gradient-to-r from-transparent via-purple-200 to-transparent opacity-90" />
                <div className="absolute top-1 inset-x-4 h-[0.5px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                {/* Subtle Front Surface Bevel Reflection */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-purple-500/[0.06] to-transparent pointer-events-none" />

                {/* Status Indicator */}
                <div className="flex items-center gap-1.5 px-2">
                  <span
                    className={`w-1 h-1 rounded-full bg-purple-400 shadow-[0_0_6px_#c084fc] ${
                      isHoveringProject ? "animate-ping" : "animate-pulse"
                    }`}
                  />
                  <span className="text-[6.5px] font-mono tracking-widest text-purple-300/70 uppercase font-bold">
                    {isHoveringProject ? "ACTIVE" : "SYS"}
                  </span>
                </div>
              </div>

              {/* Underside Inverted Floating Steps (Gives the authentic hovering pedestal look) */}
              <div className="w-[56px] h-[3px] rounded-[1px] bg-[#120722] -mt-[0.5px] shadow-sm" />
              <div className="w-[38px] h-[2.5px] rounded-[1px] bg-[#090312] -mt-[0.5px] shadow-sm" />
            </motion.div>
          </motion.div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
