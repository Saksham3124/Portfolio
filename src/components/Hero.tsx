"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowUpRight, Mail, BarChart3, Database, ShieldCheck, Box } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { PERSONAL_INFO } from "@/data/portfolioData";
import { usePortfolio } from "@/context/PortfolioContext";
import { HeroCanvas } from "@/components/HeroCanvas";

interface HeroProps {
  onRequestResume: () => void;
}

interface DomainPin {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  targetId: string;
  nodeX: number;
  nodeY: number;
  pinX: number;
  pinY: number;
  controlX: number;
  controlY: number;
  style: React.CSSProperties;
}

const DOMAIN_PINS: DomainPin[] = [
  {
    id: "analytics",
    title: "Analytics",
    subtitle: "Customer insights, segmentation and statistical analysis.",
    icon: BarChart3,
    targetId: "about",
    nodeX: 50,
    nodeY: 50,
    pinX: 64,
    pinY: 26,
    controlX: 60,
    controlY: 38,
    style: { top: "14%", left: "52%" },
  },
  {
    id: "data",
    title: "Data",
    subtitle: "Reliable pipelines, SQL and data quality.",
    icon: Database,
    targetId: "work",
    nodeX: 50,
    nodeY: 50,
    pinX: 24,
    pinY: 48,
    controlX: 36,
    controlY: 50,
    style: { top: "40%", left: "10%" },
  },
  {
    id: "risk",
    title: "Risk",
    subtitle: "Anomaly detection, scoring and validation.",
    icon: ShieldCheck,
    targetId: "experience",
    nodeX: 50,
    nodeY: 50,
    pinX: 48,
    pinY: 82,
    controlX: 49,
    controlY: 68,
    style: { top: "76%", left: "32%" },
  },
  {
    id: "product",
    title: "Product",
    subtitle: "Problem framing, prioritization and decision support.",
    icon: Box,
    targetId: "work",
    nodeX: 50,
    nodeY: 50,
    pinX: 80,
    pinY: 58,
    controlX: 68,
    controlY: 54,
    style: { top: "50%", left: "65%" },
  },
];

interface TypingSentence {
  text: string;
  highlightStart: number;
}

const TYPING_SENTENCES: TypingSentence[] = [
  {
    text: "Turning Complex Data into Clear, Defensible Decisions.",
    highlightStart: 27, // "Turning Complex Data into "
  },
  {
    text: "Investigating Data. Validating Signals. Driving Action.",
    highlightStart: 40, // "Investigating Data. Validating Signals. "
  },
  {
    text: "Engineering Data Systems for Better Decisions.",
    highlightStart: 29, // "Engineering Data Systems for "
  },
];

export const Hero: React.FC<HeroProps> = ({ onRequestResume }) => {
  const containerRef = useRef<HTMLElement | null>(null);
  const { data } = usePortfolio();
  const personalInfo = data?.personalInfo || PERSONAL_INFO;
  const shouldReduceMotion = useReducedMotion();

  const [hoveredPin, setHoveredPin] = useState<string | null>(null);
  const [videoError, setVideoError] = useState(false);
  const [sentenceIdx, setSentenceIdx] = useState(0);
  const [charCount, setCharCount] = useState(TYPING_SENTENCES[0].text.length);

  const videoUrl =
    (personalInfo as { heroVideoUrl?: string }).heroVideoUrl ||
    "/videos/hero-background.mp4";
  const videoEnabled =
    (personalInfo as { heroVideoEnabled?: boolean }).heroVideoEnabled !== false;

  useEffect(() => {
    setVideoError(false);
  }, [videoUrl]);

  // Progressive full-sentence typewriter animation
  useEffect(() => {
    if (shouldReduceMotion) {
      setSentenceIdx(0);
      setCharCount(TYPING_SENTENCES[0].text.length);
      return;
    }

    let currentIdx = 0;
    let chars = 0;
    let isDeleting = false;
    let timerId: NodeJS.Timeout;

    const typeSpeed = 44;        // 40-48ms per character
    const holdCompleted = 2600;  // 2.6s hold on completed sentence
    const backspaceSpeed = 22;   // 20-24ms per character backspacing
    const pauseTransition = 350; // brief pause before typing next sentence

    const step = () => {
      const sentence = TYPING_SENTENCES[currentIdx];

      if (!isDeleting) {
        chars++;
        setCharCount(chars);
        setSentenceIdx(currentIdx);

        if (chars >= sentence.text.length) {
          isDeleting = true;
          timerId = setTimeout(step, holdCompleted);
          return;
        }

        timerId = setTimeout(step, typeSpeed);
      } else {
        chars--;
        setCharCount(chars);
        setSentenceIdx(currentIdx);

        if (chars <= 0) {
          isDeleting = false;
          currentIdx = (currentIdx + 1) % TYPING_SENTENCES.length;
          setSentenceIdx(currentIdx);
          timerId = setTimeout(step, pauseTransition);
          return;
        }

        timerId = setTimeout(step, backspaceSpeed);
      }
    };

    setCharCount(0);
    timerId = setTimeout(step, 400);

    return () => {
      clearTimeout(timerId);
    };
  }, [shouldReduceMotion]);

  const currentSentence = TYPING_SENTENCES[sentenceIdx];
  const whiteText = currentSentence.text.slice(
    0,
    Math.min(charCount, currentSentence.highlightStart)
  );
  const highlightText =
    charCount > currentSentence.highlightStart
      ? currentSentence.text.slice(currentSentence.highlightStart, charCount)
      : "";

  const handlePinClick = (e: React.MouseEvent, targetId: string) => {
    e.preventDefault();
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      const targetPath = targetId === "work" ? "/projects" : `/${targetId}`;
      window.history.pushState(null, "", targetPath);
    }
  };

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative w-full h-screen min-h-[680px] flex flex-col justify-between overflow-hidden bg-[#030304] select-none"
    >
      {/* 1. Ambient Background Video (Toned-down opacity so headline is primary) */}
      {videoEnabled && !videoError && (
        <video
          key={videoUrl}
          autoPlay
          loop
          muted
          playsInline
          onError={() => setVideoError(true)}
          className="absolute inset-0 w-full h-full object-cover opacity-18 pointer-events-none transition-opacity duration-1000 z-0"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      )}

      {/* 2. Deep Tonal Overlays to keep headline dominant and cohesive */}
      <div className="absolute inset-0 pointer-events-none bg-[#030304]/60 z-0" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#030304] via-[#030304]/85 to-transparent z-0" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#030304] via-transparent to-[#030304]/70 z-0" />
      <div className="absolute inset-0 pointer-events-none bg-ambient-radial opacity-30 z-0" />

      {/* 3. Interactive Cursor-Reactive Particle Network & Data Wave Stream Canvas */}
      <HeroCanvas containerRef={containerRef} />

      {/* 4. Main Two-Column Hero Composition */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex-1 flex flex-col lg:flex-row items-center justify-between pt-20 sm:pt-24 lg:pt-0 pb-2 sm:pb-4">
        
        {/* LEFT COLUMN: Left-Aligned Headline, Positioning & Action CTAs */}
        <div className="w-full lg:w-[46%] xl:w-[44%] flex flex-col items-start text-left shrink-0 z-20">
          
          {/* Eyebrow Positioning: DATA · RISK · ENGINEERING · PRODUCT */}
          <div className="inline-flex items-center gap-2 mb-4 sm:mb-5">
            <span className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.28em] text-zinc-400">
              DATA · RISK · ENGINEERING · PRODUCT
            </span>
          </div>

          {/* Dominant Left-Aligned Headline with Full-Sentence Typewriter Animation */}
          <h1
            className="text-2xl sm:text-4xl md:text-[2.65rem] lg:text-[2.9rem] xl:text-[3.25rem] font-bold tracking-tight text-white leading-[1.15] mb-5 sm:mb-6 min-h-[140px] sm:min-h-[175px] md:min-h-[195px] lg:min-h-[210px] xl:min-h-[225px] flex flex-col justify-start items-start max-w-full"
            aria-label={TYPING_SENTENCES[sentenceIdx].text}
          >
            {/* Screen reader static announcement */}
            <span className="sr-only">
              {TYPING_SENTENCES[sentenceIdx].text}
            </span>

            {/* Visual animated typing text with graceful multi-line wrapping */}
            <span className="w-full break-words" aria-hidden="true">
              <span>{whiteText}</span>
              {highlightText && (
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-400 to-cyan-300">
                  {highlightText}
                </span>
              )}
              {!shouldReduceMotion && (
                <span
                  className="inline-block w-[2px] sm:w-[3px] h-[0.82em] bg-cyan-400 ml-1.5 align-middle animate-pulse shrink-0"
                  aria-hidden="true"
                />
              )}
            </span>
          </h1>

          {/* Supporting Narrative Text */}
          <p className="text-sm sm:text-base md:text-lg text-zinc-400 font-normal leading-relaxed max-w-lg mb-7 sm:mb-8">
            I build data-driven solutions that combine analytics, risk modeling, and reliable systems to solve real-world problems.
          </p>

          {/* Action Control Buttons Matching Mockup */}
          <div className="flex flex-wrap items-center gap-3.5 sm:gap-4">
            <motion.a
              href="#work"
              onClick={(e) => handlePinClick(e, "work")}
              whileHover={shouldReduceMotion ? {} : { scale: 1.04, y: -2 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
              transition={{ type: "spring", stiffness: 450, damping: 20 }}
              className="inline-flex items-center gap-2 px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold bg-white text-[#030304] hover:bg-zinc-200 transition-all shadow-[0_0_25px_rgba(255,255,255,0.22)] cursor-pointer"
            >
              <span>View My Work</span>
              <ArrowUpRight className="w-4 h-4" />
            </motion.a>

            <motion.button
              onClick={onRequestResume}
              whileHover={shouldReduceMotion ? {} : { scale: 1.04, y: -2 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
              transition={{ type: "spring", stiffness: 450, damping: 20 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-medium text-zinc-300 bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 hover:border-white/25 transition-all shadow-sm cursor-pointer"
            >
              <Mail className="w-4 h-4 text-zinc-400" />
              <span>Get In Touch</span>
            </motion.button>
          </div>

          {/* Compact Understated Social Links Row */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs sm:text-[13px] font-mono text-zinc-400 mt-5 sm:mt-6">
            <motion.a
              href={personalInfo.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="view"
              whileHover={shouldReduceMotion ? {} : { y: -1 }}
              transition={{ type: "spring", stiffness: 450, damping: 20 }}
              className="hover:text-white transition-colors cursor-pointer"
              aria-label="GitHub Profile"
            >
              GitHub
            </motion.a>

            <span className="text-zinc-600 select-none" aria-hidden="true">·</span>

            <motion.a
              href={personalInfo.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="view"
              whileHover={shouldReduceMotion ? {} : { y: -1 }}
              transition={{ type: "spring", stiffness: 450, damping: 20 }}
              className="hover:text-white transition-colors cursor-pointer"
              aria-label="LinkedIn Profile"
            >
              LinkedIn
            </motion.a>

            <span className="text-zinc-600 select-none" aria-hidden="true">·</span>

            <motion.a
              href={`mailto:${personalInfo.contact.email}`}
              whileHover={shouldReduceMotion ? {} : { y: -1 }}
              transition={{ type: "spring", stiffness: 450, damping: 20 }}
              className="hover:text-white transition-colors underline decoration-white/20 underline-offset-4 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400/60 rounded-sm"
              aria-label={`Send email to ${personalInfo.contact.email}`}
            >
              {personalInfo.contact.email}
            </motion.a>
          </div>

        </div>

        {/* RIGHT COLUMN: Integrated Domain Visualization (4 Domain Pins & Central Nexus) */}
        <div className="w-full lg:w-[54%] xl:w-[56%] flex items-center justify-center relative mt-6 lg:mt-0 h-[400px] sm:h-[480px] lg:h-[540px] xl:h-[560px] lg:pl-6 xl:pl-10">
          
          {/* Desktop Floating Constellation Visualization */}
          <div className="relative w-full h-full max-w-[540px] max-h-[500px] flex items-center justify-center">
            
            {/* Curved Connecting SVG Lines Layer */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-10 hidden sm:block"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="1.2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {DOMAIN_PINS.map((pin) => {
                const isHovered = hoveredPin === pin.id;
                const pathD = `M ${pin.nodeX} ${pin.nodeY} Q ${pin.controlX} ${pin.controlY} ${pin.pinX} ${pin.pinY}`;

                return (
                  <g key={pin.id}>
                    {/* Background faint path line */}
                    <path
                      d={pathD}
                      fill="none"
                      stroke={isHovered ? "#38bdf8" : "rgba(56, 189, 248, 0.28)"}
                      strokeWidth={isHovered ? "0.6" : "0.32"}
                      filter={isHovered ? "url(#lineGlow)" : undefined}
                      className="transition-all duration-300"
                    />

                    {/* Luminous data pulse line on active hover */}
                    {isHovered && (
                      <path
                        d={pathD}
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="0.8"
                        strokeDasharray="2, 5"
                        className="animate-pulse"
                      />
                    )}

                    {/* Pin junction node marker */}
                    <circle
                      cx={pin.pinX}
                      cy={pin.pinY}
                      r={isHovered ? "1.3" : "0.85"}
                      fill={isHovered ? "#ffffff" : "#38bdf8"}
                      filter={isHovered ? "url(#lineGlow)" : undefined}
                      className="transition-all duration-300"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Central Network Node Nexus Point */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20 hidden sm:flex items-center justify-center">
              <div className="w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_20px_#38bdf8,0_0_40px_#06b6d4] animate-pulse" />
              <div className="absolute -inset-2.5 rounded-full border border-cyan-400/40 animate-ping opacity-60 pointer-events-none" />
            </div>

            {/* Desktop: 4 Floating Domain Pins positioned around nexus */}
            <div className="relative w-full h-full hidden sm:block">
              {DOMAIN_PINS.map((pin) => {
                const isHovered = hoveredPin === pin.id;
                const isOtherHovered = hoveredPin !== null && !isHovered;
                const Icon = pin.icon;

                return (
                  <motion.a
                    key={pin.id}
                    href={`#${pin.targetId}`}
                    onClick={(e) => handlePinClick(e, pin.targetId)}
                    onMouseEnter={() => setHoveredPin(pin.id)}
                    onMouseLeave={() => setHoveredPin(null)}
                    style={pin.style}
                    whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
                    transition={{ type: "spring", stiffness: 400, damping: 22 }}
                    className={`absolute z-20 flex items-center gap-3 p-2.5 lg:p-3 rounded-2xl bg-[#070b14]/85 backdrop-blur-md border transition-all duration-300 cursor-pointer max-w-[215px] sm:max-w-[235px] ${
                      isHovered
                        ? "border-cyan-400/70 shadow-[0_0_30px_rgba(6,182,212,0.4)] opacity-100 z-30"
                        : isOtherHovered
                        ? "border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.6)] opacity-60"
                        : "border-white/[0.12] shadow-[0_8px_32px_rgba(0,0,0,0.6)] opacity-95 hover:border-cyan-500/40"
                    }`}
                  >
                    {/* Circular Icon Accent Badge */}
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                        isHovered
                          ? "bg-cyan-500/20 border border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                          : "bg-[#0b1728]/90 border border-cyan-500/30 text-cyan-400"
                      }`}
                    >
                      <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    </div>

                    {/* Text Details */}
                    <div className="flex flex-col text-left">
                      <span className="text-xs sm:text-sm font-semibold text-white tracking-tight">
                        {pin.title}
                      </span>
                      <span className="text-[10px] sm:text-[11px] text-zinc-400 leading-snug mt-0.5">
                        {pin.subtitle}
                      </span>
                    </div>
                  </motion.a>
                );
              })}
            </div>

            {/* Mobile / Small Screens: Clean 2x2 Grid Layout */}
            <div className="grid grid-cols-2 gap-2.5 w-full sm:hidden z-20">
              {DOMAIN_PINS.map((pin) => {
                const Icon = pin.icon;
                return (
                  <motion.a
                    key={pin.id}
                    href={`#${pin.targetId}`}
                    onClick={(e) => handlePinClick(e, pin.targetId)}
                    whileTap={{ scale: 0.96 }}
                    className="flex flex-col gap-1.5 p-3 rounded-xl bg-[#070b14]/90 backdrop-blur-md border border-white/10 active:border-cyan-400 cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#0b1728] border border-cyan-500/40 text-cyan-300 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-white">{pin.title}</span>
                    <span className="text-[10px] text-zinc-400 leading-tight line-clamp-2">
                      {pin.subtitle}
                    </span>
                  </motion.a>
                );
              })}
            </div>

          </div>
        </div>

      </div>

      {/* 5. Bottom-Left Scroll Indicator Matching Reference Mockup */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-4 sm:pb-6 flex items-center justify-start">
        <motion.a
          href="#about"
          onClick={(e) => handlePinClick(e, "about")}
          whileHover={{ opacity: 1 }}
          className="flex items-center gap-3 text-zinc-500 hover:text-zinc-300 transition-colors group cursor-pointer"
        >
          {/* Vertical Track Line with Animated Sliding Dot */}
          <div className="relative w-[1px] h-9 bg-white/15 overflow-hidden flex flex-col justify-start items-center">
            <motion.div
              animate={shouldReduceMotion ? {} : { y: [0, 24, 0] }}
              transition={
                shouldReduceMotion
                  ? {}
                  : { repeat: Infinity, duration: 2.2, ease: "easeInOut" }
              }
              className="w-1.5 h-1.5 -ml-[2px] rounded-full bg-cyan-300 shadow-[0_0_8px_#38bdf8]"
            />
          </div>

          <span className="text-[9px] font-mono tracking-[0.25em] uppercase text-zinc-500 group-hover:text-zinc-300 transition-colors">
            SCROLL TO EXPLORE
          </span>
        </motion.a>
      </div>

    </section>
  );
};
