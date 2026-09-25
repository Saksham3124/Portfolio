"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

interface MetricCounterProps {
  end: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
  sub: string;
  borderRight?: boolean;
  borderLeft?: boolean;
}

const MetricCounter: React.FC<MetricCounterProps> = ({
  end,
  decimals = 0,
  prefix = "",
  suffix = "",
  label,
  sub,
  borderRight = false,
  borderLeft = false,
}) => {
  const [currentVal, setCurrentVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) {
      setCurrentVal(end);
      return;
    }

    if (!isInView) return;

    let startTime: number | null = null;
    let animFrame: number;
    const duration = 1300; // 1.3 seconds

    // Ease-out quad function for smooth deceleration
    const easeOutQuad = (t: number) => t * (2 - t);

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuad(progress);

      setCurrentVal(eased * end);

      if (progress < 1) {
        animFrame = requestAnimationFrame(step);
      } else {
        setCurrentVal(end);
      }
    };

    animFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animFrame);
  }, [isInView, end, shouldReduceMotion]);

  const displayString = shouldReduceMotion
    ? `${prefix}${end.toFixed(decimals)}${suffix}`
    : `${prefix}${currentVal.toFixed(decimals)}${suffix}`;

  return (
    <div
      ref={ref}
      className={`pt-6 md:pt-0 ${borderLeft ? "md:pl-8" : ""} ${borderRight ? "md:pr-8" : ""}`}
    >
      {/* Animated Number */}
      <div className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-2 font-mono tabular-nums">
        {displayString}
      </div>
      {/* Static Label */}
      <div className="text-sm font-medium text-zinc-300">
        {label}
      </div>
      {/* Static Sub-label */}
      <div className="text-xs font-mono text-zinc-400 mt-1">
        {sub}
      </div>
    </div>
  );
};

export const Highlights: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="highlights" className="py-20 relative border-t border-white/[0.06] bg-[#030304]">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Section Context Header */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45 }}
          className="mb-12"
        >
          <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-zinc-400 mb-2">
            Evidence & Scale
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
            Audited Portfolio Telemetry & Impact
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-xl">
            Real dataset scale analyzed across forensic invoice audit, credit default stratification, and multi-million transaction retail lakes.
          </p>
        </motion.div>

        {/* Editorial Information Strip - Generous Spacing, Subtle Hairline Separators */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-white/[0.08] py-8 border-y border-white/[0.08]"
        >
          <MetricCounter
            end={50}
            decimals={0}
            suffix="K+"
            label="Invoice Records"
            sub="GST Forensic Audit"
            borderRight
          />
          <MetricCounter
            end={307}
            decimals={0}
            suffix="K+"
            label="Loan Applications"
            sub="Default Stratification"
            borderLeft
            borderRight
          />
          <MetricCounter
            end={2.6}
            decimals={1}
            suffix="M+"
            label="Transactions"
            sub="Customer Segmentation"
            borderLeft
            borderRight
          />
          <MetricCounter
            end={8.06}
            decimals={2}
            prefix="$"
            suffix="M"
            label="Transaction Value"
            sub="Promotional Uplift"
            borderLeft
          />
        </motion.div>

      </div>
    </section>
  );
};
