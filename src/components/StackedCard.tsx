"use client";

import React, { useRef, useState, useEffect } from "react";
import { useReducedMotion } from "framer-motion";

interface StackedCardProps {
  id: string;
  index?: number;
  totalCards?: number;
  zIndex: number;
  children: React.ReactNode;
  className?: string;
  nextCardId?: string;
}

export const StackedCard: React.FC<StackedCardProps> = ({
  id,
  index = 0,
  zIndex,
  children,
  className = "",
  nextCardId,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);
  const [isCovered, setIsCovered] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(typeof window !== "undefined" && window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Track if next card has stacked over this card for subtle depth styling
  useEffect(() => {
    if (!nextCardId || !isDesktop || shouldReduceMotion) {
      setIsCovered(false);
      return;
    }

    const handleScroll = () => {
      const nextEl = document.getElementById(nextCardId);
      if (!nextEl) return;

      const nextRect = nextEl.getBoundingClientRect();
      const targetThreshold = 76 + (index + 1) * 12 + 60;
      if (nextRect.top <= targetThreshold) {
        setIsCovered(true);
      } else {
        setIsCovered(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [nextCardId, index, isDesktop, shouldReduceMotion]);

  // Staggered top offset for classic stacked-card deck shoulders
  const stickyTopPx = 76 + index * 12;

  const stickyStyle: React.CSSProperties = isDesktop
    ? {
        position: "sticky",
        top: `${stickyTopPx}px`,
        zIndex: zIndex,
        willChange: "transform, opacity",
      }
    : {
        position: "relative",
      };

  return (
    <div
      ref={cardRef}
      id={id}
      data-card-index={index}
      style={stickyStyle}
      className={`scroll-mt-24 transition-all duration-300 ${
        isCovered && isDesktop && !shouldReduceMotion
          ? "scale-[0.985] opacity-70"
          : "scale-100 opacity-100"
      } ${className}`}
    >
      <div className="relative rounded-2xl sm:rounded-3xl lg:rounded-[32px] bg-[#07090e] border border-white/[0.08] border-t-white/[0.16] shadow-[0_-18px_45px_rgba(0,0,0,0.85),0_12px_35px_rgba(0,0,0,0.65)]">
        {/* Subtle architectural top notch accent */}
        <div
          aria-hidden="true"
          className="w-12 h-1 rounded-full bg-white/20 mx-auto mb-3 sm:mb-4 mt-3 pointer-events-none"
        />
        {children}
      </div>
    </div>
  );
};
