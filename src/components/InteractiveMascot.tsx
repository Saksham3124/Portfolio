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
    isHoveringProject,
    isTouchDevice,
    isMascotDismissed,
    dismissMascot,
  } = usePointer();

  const shouldReduceMotion = useReducedMotion();
  const mascotRef = useRef<HTMLDivElement | null>(null);

  // Scroll visibility: appears after scrolling past hero section (> 380px)
  const [hasScrolledPastHero, setHasScrolledPastHero] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isNearCursor, setIsNearCursor] = useState(false);

  // Springs for bounded pupil movement (no React re-renders)
  const pupilTargetX = useSpring(0, { stiffness: 350, damping: 25 });
  const pupilTargetY = useSpring(0, { stiffness: 350, damping: 25 });

  // Check scroll position
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
      const nextDelay = 4000 + Math.random() * 3000;
      timeoutId = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          scheduleBlink();
        }, 140);
      }, nextDelay);
    };

    scheduleBlink();
    return () => clearTimeout(timeoutId);
  }, [shouldReduceMotion]);

  // Frame-by-frame pupil tracking using single shared MotionValues
  useAnimationFrame(() => {
    if (!mascotRef.current || shouldReduceMotion || isTouchDevice) return;

    const rect = mascotRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height * 0.42; // Eye-level anchor

    const dx = mouseX.get() - centerX;
    const dy = mouseY.get() - centerY;
    const distance = Math.hypot(dx, dy);

    // Check if cursor is hovering close to mascot (< 140px)
    if (distance < 140 && !isNearCursor) {
      setIsNearCursor(true);
    } else if (distance >= 140 && isNearCursor) {
      setIsNearCursor(false);
    }

    const angle = Math.atan2(dy, dx);

    // Bounded pupil movement: stays comfortably inside the visor sockets
    const maxHorizontal = 4.5;
    const maxVertical = 2.8;

    const pull = Math.min(1, distance / 240);
    const targetX = Math.cos(angle) * maxHorizontal * pull;
    const targetY = Math.sin(angle) * maxVertical * pull;

    pupilTargetX.set(targetX);
    pupilTargetY.set(targetY);
  });

  // Never render on touch devices or if dismissed by user
  if (isTouchDevice || isMascotDismissed) {
    return null;
  }

  const isVisible = hasScrolledPastHero;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.aside
          ref={mascotRef}
          aria-label="Interactive digital companion"
          initial={
            shouldReduceMotion
              ? { opacity: 0 }
              : { opacity: 0, y: 40, scale: 0.85 }
          }
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={
            shouldReduceMotion
              ? { opacity: 0 }
              : { opacity: 0, y: 25, scale: 0.75 }
          }
          transition={
            shouldReduceMotion
              ? { duration: 0.2 }
              : { type: "spring", stiffness: 360, damping: 22 }
          }
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="fixed bottom-20 right-6 z-30 hidden sm:flex flex-col items-center select-none"
        >
          {/* Subtle Ambient Floor Shadow */}
          <motion.div
            animate={
              shouldReduceMotion
                ? {}
                : {
                    scale: [1, 0.88, 1],
                    opacity: [0.35, 0.2, 0.35],
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
            className="w-12 h-2.5 rounded-full bg-black/60 blur-[3px] mt-1 -mb-1"
          />

          {/* Floating Robot Body with Natural Idle Breathing */}
          <motion.div
            animate={
              shouldReduceMotion
                ? {}
                : {
                    y: [0, -3.5, 0],
                    rotate: isHoveringProject ? -4 : isNearCursor ? 3 : 0,
                  }
            }
            transition={
              shouldReduceMotion
                ? {}
                : {
                    y: {
                      repeat: Infinity,
                      duration: 3.6,
                      ease: "easeInOut",
                    },
                    rotate: {
                      type: "spring",
                      stiffness: 300,
                      damping: 18,
                    },
                  }
            }
            className="relative flex flex-col items-center group cursor-default"
          >
            {/* Dismiss Button (Discreet X) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                dismissMascot();
              }}
              title="Dismiss companion"
              aria-label="Dismiss mascot companion"
              className={`absolute -top-2 -right-2 z-20 p-1 rounded-full bg-[#121217] border border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all duration-200 shadow-md ${
                isHovered ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"
              }`}
            >
              <X className="w-2.5 h-2.5" />
            </button>

            {/* Telemetry Antenna with Glowing LED Tip */}
            <div className="flex flex-col items-center mb-[-2px] relative z-0">
              <motion.div
                animate={
                  shouldReduceMotion
                    ? {}
                    : {
                        scale: isHoveringProject ? [1, 1.4, 1] : [1, 1.15, 1],
                        opacity: isHoveringProject ? [0.8, 1, 0.8] : [0.6, 0.9, 0.6],
                      }
                }
                transition={
                  shouldReduceMotion
                    ? {}
                    : {
                        repeat: Infinity,
                        duration: isHoveringProject ? 0.9 : 2.2,
                        ease: "easeInOut",
                      }
                }
                className="w-2 h-2 rounded-full bg-[#38bdf8] shadow-[0_0_8px_#38bdf8]"
              />
              <div className="w-[1.5px] h-3 bg-zinc-600 rounded-full" />
            </div>

            {/* Robot Head & Chassis */}
            <div className="relative w-[54px] h-[58px] rounded-[18px] bg-gradient-to-b from-[#1b1c24] via-[#121319] to-[#09090d] border border-white/[0.14] shadow-[0_8px_24px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.2)] flex flex-col items-center justify-between p-2 overflow-hidden">
              {/* Subtle metallic bevel highlight */}
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

              {/* Obsidian Visor Screen */}
              <div className="relative w-full h-[28px] rounded-[12px] bg-[#040407] border border-white/[0.08] flex items-center justify-center gap-2 px-1.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] overflow-hidden">
                {/* Diagonal Glass Reflection */}
                <div className="absolute -top-3 -left-2 w-14 h-8 bg-gradient-to-br from-white/[0.08] to-transparent rotate-[-25deg] pointer-events-none" />

                {/* Left Eye */}
                <div className="relative w-3.5 h-4 rounded-full bg-black/70 flex items-center justify-center overflow-hidden">
                  <motion.div
                    style={{
                      x: pupilTargetX,
                      y: pupilTargetY,
                    }}
                    animate={{
                      scaleY: isBlinking ? 0.08 : 1,
                      scale: isHoveringProject ? 1.15 : 1,
                    }}
                    transition={{
                      scaleY: { duration: 0.1 },
                      scale: { duration: 0.2 },
                    }}
                    className="w-2.5 h-3 rounded-full bg-[#38bdf8] shadow-[0_0_8px_#38bdf8] flex items-center justify-center"
                  >
                    {/* Inner Pupil Glimmer */}
                    <div className="w-1 h-1 rounded-full bg-white/90" />
                  </motion.div>
                </div>

                {/* Right Eye */}
                <div className="relative w-3.5 h-4 rounded-full bg-black/70 flex items-center justify-center overflow-hidden">
                  <motion.div
                    style={{
                      x: pupilTargetX,
                      y: pupilTargetY,
                    }}
                    animate={{
                      scaleY: isBlinking ? 0.08 : 1,
                      scale: isHoveringProject ? 1.15 : 1,
                    }}
                    transition={{
                      scaleY: { duration: 0.1 },
                      scale: { duration: 0.2 },
                    }}
                    className="w-2.5 h-3 rounded-full bg-[#38bdf8] shadow-[0_0_8px_#38bdf8] flex items-center justify-center"
                  >
                    {/* Inner Pupil Glimmer */}
                    <div className="w-1 h-1 rounded-full bg-white/90" />
                  </motion.div>
                </div>
              </div>

              {/* Lower Body Micro Telemetry Decal */}
              <div className="w-full flex items-center justify-between px-1 pt-1 opacity-70">
                <div className="flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-blue-400/80 animate-pulse" />
                  <span className="text-[7px] font-mono tracking-wider text-zinc-400 uppercase font-semibold">
                    {isHoveringProject ? "REC" : "SYS"}
                  </span>
                </div>
                <div className="w-4 h-[1.5px] rounded bg-white/10" />
              </div>
            </div>

            {/* Flanking Ear Sensor Dials */}
            <div className="absolute top-[22px] -left-1.5 w-1.5 h-4 rounded-l-md bg-[#161720] border-l border-y border-white/10 shadow-sm" />
            <div className="absolute top-[22px] -right-1.5 w-1.5 h-4 rounded-r-md bg-[#161720] border-r border-y border-white/10 shadow-sm" />
          </motion.div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
