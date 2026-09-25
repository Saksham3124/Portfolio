"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowDown } from "lucide-react";
import { PERSONAL_INFO, HERO_METRICS } from "@/data/portfolioData";
import { AnalyticalField } from "@/components/AnalyticalField";

interface HeroProps {
  onRequestResume: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onRequestResume }) => {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-between pt-32 sm:pt-40 pb-0 overflow-hidden bg-ambient-radial"
    >
      {/* Central Content Container with Generous Negative Space */}
      <div className="max-w-4xl mx-auto px-6 text-center w-full relative z-10 flex-1 flex flex-col justify-center">
        
        {/* Step 2: Small Identity Eyebrow & Positioning */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col items-center gap-2 mb-6 sm:mb-8"
        >
          <span className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.26em] text-zinc-400">
            {PERSONAL_INFO.name}
          </span>
          <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400">
            <span>Data</span>
            <span className="text-zinc-600">·</span>
            <span>Risk</span>
            <span className="text-zinc-600">·</span>
            <span>Engineering</span>
          </div>
        </motion.div>

        {/* Step 3: Dominant Multi-line Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-[4.65rem] font-bold tracking-tight text-white leading-[1.08] max-w-4xl mx-auto mb-6 sm:mb-8"
        >
          <span>Turning Complex Data into</span>
          <br className="hidden sm:inline" />
          <span className="text-zinc-100 sm:ml-2">Clear, Defensible Decisions.</span>
        </motion.h1>

        {/* Step 4: Short, Deliberate Supporting Text */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2, ease: "easeOut" }}
          className="text-sm sm:text-base md:text-lg text-zinc-400 font-normal leading-relaxed max-w-xl mx-auto mb-8 sm:mb-10"
        >
          {PERSONAL_INFO.heroSupporting}
        </motion.p>

        {/* Step 5: Understated Hero CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.28, ease: "easeOut" }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-6"
        >
          <a
            href="#work"
            className="hero-btn hero-btn-primary"
          >
            <span>View Selected Work</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onRequestResume}
            className="hero-btn hero-btn-secondary"
          >
            <span>Download Resume</span>
            <ArrowDown className="w-3.5 h-3.5 text-zinc-400" />
          </button>
        </motion.div>

        {/* Understated Social Links Strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.36, ease: "easeOut" }}
          className="flex items-center justify-center gap-3 text-xs font-mono text-zinc-400 mb-6 sm:mb-8"
        >
          <a
            href={PERSONAL_INFO.contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            GitHub
          </a>
          <span className="text-zinc-600">·</span>
          <a
            href={PERSONAL_INFO.contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            LinkedIn
          </a>
          <span className="text-zinc-600">·</span>
          <a
            href={`mailto:${PERSONAL_INFO.contact.email}`}
            className="hover:text-white transition-colors"
          >
            Email
          </a>
        </motion.div>

      </div>

      {/* Step 6: The "Analytical Field" Interactive 3D Visual */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.45, ease: "easeOut" }}
        className="w-full relative z-0 mt-[-40px] sm:mt-[-50px] mb-[-20px]"
      >
        <AnalyticalField />

        {/* Subtle Minimalist Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none opacity-60">
          <span className="text-[9px] font-mono tracking-[0.25em] text-zinc-400 uppercase">
            Scroll
          </span>
          <div className="w-[1px] h-6 bg-gradient-to-b from-zinc-500 via-zinc-400 to-transparent" />
        </div>
      </motion.div>

      {/* Step 11: Editorial Impact Metrics Strip (Horizontal information strip) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.55, ease: "easeOut" }}
        className="relative z-10 w-full border-t border-white/[0.07] bg-[#030304]/80 backdrop-blur-md"
      >
        <div className="max-w-5xl mx-auto px-6 py-6 sm:py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-white/[0.07]">
            {HERO_METRICS.map((metric, i) => (
              <div
                key={i}
                className={`pt-4 md:pt-0 ${i === 0 ? "" : "md:pl-8"} ${i === HERO_METRICS.length - 1 ? "" : "md:pr-8"}`}
              >
                <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mb-1">
                  {metric.value}
                </div>
                <div className="text-xs font-medium text-zinc-300">
                  {metric.label}
                </div>
                <div className="text-[10px] font-mono text-zinc-400 mt-1">
                  {metric.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};
