"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, ArrowDown } from "lucide-react";
import { PERSONAL_INFO } from "@/data/portfolioData";

interface HeroProps {
  onRequestResume: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onRequestResume }) => {
  const [videoError, setVideoError] = useState(false);

  // Subtle single-run headline typing effect
  const fullHeadline = "Turning Complex Data into Clear, Defensible Decisions.";
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingDone, setIsTypingDone] = useState(false);

  useEffect(() => {
    // Respect prefers-reduced-motion
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setDisplayedText(fullHeadline);
      setIsTypingDone(true);
      return;
    }

    let i = 0;
    const speed = 25; // 25ms per character: completes in ~1.35s
    const timer = setInterval(() => {
      i++;
      setDisplayedText(fullHeadline.slice(0, i));
      if (i >= fullHeadline.length) {
        clearInterval(timer);
        setIsTypingDone(true);
      }
    }, speed);

    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-[92vh] sm:min-h-screen flex flex-col justify-between pt-32 sm:pt-40 pb-12 overflow-hidden bg-[#030304]"
    >
      {/* Background Video Layer */}
      {!videoError && (
        <video
          autoPlay
          loop
          muted
          playsInline
          onError={() => setVideoError(true)}
          className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none transition-opacity duration-1000"
        >
          <source src="/videos/hero-background.mp4" type="video/mp4" />
        </video>
      )}

      {/* Atmospheric Radial Depth & Soft Vignette Overlays */}
      <div className="absolute inset-0 pointer-events-none bg-ambient-radial opacity-70" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#030304] via-transparent to-[#030304]/80" />
      <div className="absolute inset-0 pointer-events-none bg-[#030304]/50" />

      {/* Central Content Container - Generous Spacing */}
      <div className="max-w-4xl mx-auto px-6 text-center w-full relative z-10 flex-1 flex flex-col justify-center items-center">
        
        {/* Eyebrow & Positioning: DATA · RISK · ENGINEERING · OPERATIONS */}
        <div className="flex flex-col items-center gap-2 mb-6 sm:mb-8">
          <span className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.28em] text-zinc-400">
            {PERSONAL_INFO.name}
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.22em] text-zinc-400">
            <span>Data</span>
            <span className="text-zinc-600">·</span>
            <span>Risk</span>
            <span className="text-zinc-600">·</span>
            <span>Engineering</span>
            <span className="text-zinc-600">·</span>
            <span>Operations</span>
          </div>
        </div>

        {/* Dominant Headline with Single-Run Typing Reveal */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[4.65rem] font-bold tracking-tight text-white leading-[1.08] max-w-4xl mx-auto mb-6 sm:mb-8 min-h-[2.2em] sm:min-h-[2.16em] flex items-center justify-center">
          <span>
            {displayedText}
            {!isTypingDone && (
              <span
                className="inline-block w-[3px] h-[0.8em] bg-zinc-300 ml-1.5 align-middle animate-pulse"
                aria-hidden="true"
              />
            )}
          </span>
        </h1>

        {/* Static Supporting Text */}
        <p className="text-sm sm:text-base md:text-lg text-zinc-400 font-normal leading-relaxed max-w-xl mx-auto mb-8 sm:mb-10">
          {PERSONAL_INFO.heroSupporting}
        </p>

        {/* Understated Action Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-6">
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
        </div>

        {/* Understated Social Links Strip with Full Actual Email */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-xs font-mono text-zinc-400 mb-4 sm:mb-6">
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
            className="hover:text-white transition-colors underline decoration-white/20 underline-offset-4"
            title={`Send email to ${PERSONAL_INFO.contact.email}`}
          >
            {PERSONAL_INFO.contact.email}
          </a>
        </div>

      </div>

      {/* Hero Scroll Indicator - Only moving element in the Hero */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center pt-4 pb-2">
        <a
          href="#about"
          className="flex flex-col items-center gap-1.5 text-zinc-400 hover:text-white transition-colors group"
          aria-label="Scroll to About section"
        >
          <span className="text-[9px] font-mono tracking-[0.25em] uppercase text-zinc-500 group-hover:text-zinc-300 transition-colors">
            Scroll
          </span>
          <ArrowDown className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white animate-gentle-bob" />
        </a>
      </div>
    </section>
  );
};
