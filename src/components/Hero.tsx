"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, ArrowDown } from "lucide-react";
import { PERSONAL_INFO } from "@/data/portfolioData";

interface HeroProps {
  onRequestResume: () => void;
}

const ROTATING_HEADLINES = [
  "Turning Complex Data into Clear, Defensible Decisions.",
  "Investigating Data. Validating the Signal. Driving Action.",
  "Engineering Data Systems for Better Decisions.",
];

export const Hero: React.FC<HeroProps> = ({ onRequestResume }) => {
  const [videoError, setVideoError] = useState(false);

  // Rotating Typewriter State
  const [displayedText, setDisplayedText] = useState("");
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    // Respect prefers-reduced-motion: render Headline 1 immediately and keep static
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setIsReducedMotion(true);
      setDisplayedText(ROTATING_HEADLINES[0]);
      return;
    }

    let headlineIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let timerId: NodeJS.Timeout;

    // Strict editorial timings as requested
    const typeSpeed = 50;        // 45–60ms per character
    const holdCompleted = 3500;  // 3–4 seconds pause on completed sentence
    const backspaceSpeed = 28;   // 25–35ms per character
    const pauseTransition = 500; // ~500ms pause before typing next headline

    const step = () => {
      const currentHeadline = ROTATING_HEADLINES[headlineIdx];

      if (!isDeleting) {
        // Typing forward
        charIdx++;
        setDisplayedText(currentHeadline.slice(0, charIdx));

        if (charIdx >= currentHeadline.length) {
          // Finished typing: pause for 3.5s so user can read comfortably
          isDeleting = true;
          timerId = setTimeout(step, holdCompleted);
          return;
        }

        timerId = setTimeout(step, typeSpeed);
      } else {
        // Backspacing
        charIdx--;
        setDisplayedText(currentHeadline.slice(0, charIdx));

        if (charIdx <= 0) {
          // Finished deleting: transition to next headline after 500ms pause
          isDeleting = false;
          headlineIdx = (headlineIdx + 1) % ROTATING_HEADLINES.length;
          timerId = setTimeout(step, pauseTransition);
          return;
        }

        timerId = setTimeout(step, backspaceSpeed);
      }
    };

    // Initiate first typing after brief mount delay
    timerId = setTimeout(step, 120);

    return () => {
      clearTimeout(timerId);
    };
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
        
        {/* Eyebrow & Positioning: DATA · RISK · ENGINEERING · OPERATIONS (Completely Static) */}
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

        {/* Dominant Headline with Stable Height to Eliminate Layout Shifts */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[4.65rem] font-bold tracking-tight text-white leading-[1.08] max-w-4xl mx-auto mb-6 sm:mb-8 min-h-[140px] sm:min-h-[180px] md:min-h-[220px] lg:min-h-[240px] flex items-center justify-center text-center">
          <span>
            {displayedText}
            {!isReducedMotion && (
              <span
                className="inline-block w-[2px] sm:w-[3px] h-[0.82em] bg-zinc-300 ml-1.5 align-middle animate-pulse"
                aria-hidden="true"
              />
            )}
          </span>
        </h1>

        {/* Static Supporting Text (Completely Static) */}
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
