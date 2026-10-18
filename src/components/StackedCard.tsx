"use client";

import React, { useRef, useState, useEffect } from "react";

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
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [calculatedTop, setCalculatedTop] = useState<number>(76 + index * 8);

  useEffect(() => {
    const updateDimensions = () => {
      if (typeof window === "undefined") return;
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);

      if (!desktop) return;

      const vh = window.innerHeight;
      const cardEl = cardRef.current;
      if (!cardEl) return;

      const cardHeight = cardEl.offsetHeight;
      const nominalTop = 76 + index * 8;
      const availableHeight = vh - nominalTop - 24;

      // If card is taller than the available viewport height below nominalTop,
      // allow card to scroll through naturally so user sees 100% of the content
      // before it pins and the next card slides over it.
      let targetTop = nominalTop;
      if (cardHeight > availableHeight) {
        targetTop = vh - cardHeight - 24;
      }

      setCalculatedTop((prev) => (Math.abs(prev - targetTop) > 1 ? targetTop : prev));
    };

    updateDimensions();

    let resizeObserver: ResizeObserver | null = null;
    if (cardRef.current && typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        updateDimensions();
      });
      resizeObserver.observe(cardRef.current);
    }

    window.addEventListener("resize", updateDimensions, { passive: true });
    return () => {
      window.removeEventListener("resize", updateDimensions);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [index]);

  const stickyStyle: React.CSSProperties = isDesktop
    ? {
        position: "sticky",
        top: `${calculatedTop}px`,
        zIndex: zIndex,
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
      className={`scroll-mt-24 transform-gpu will-change-[transform] ${className}`}
    >
      <div className="relative min-h-[calc(100vh-100px)] sm:min-h-[calc(100svh-90px)] rounded-2xl sm:rounded-3xl lg:rounded-[32px] bg-[#07090e] border border-white/[0.08] border-t-white/[0.16] shadow-[0_-18px_45px_rgba(0,0,0,0.85),0_12px_35px_rgba(0,0,0,0.65)] flex flex-col justify-between overflow-hidden">
        {/* Subtle architectural top notch accent */}
        <div
          aria-hidden="true"
          className="w-12 h-1 rounded-full bg-white/20 mx-auto mb-3 sm:mb-4 mt-3 pointer-events-none shrink-0"
        />
        <div className="flex-1 flex flex-col justify-center">
          {children}
        </div>
      </div>
    </div>
  );
};
