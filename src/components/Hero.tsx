"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
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
  nodeX: number;
  nodeY: number;
  pinX: number;
  pinY: number;
  controlX: number;
  controlY: number;
  style: React.CSSProperties;
}

/**
 * Domain Pins: Hover-only interactive visualization
 * Symmetrically balanced around the central nexus at (50, 50).
 * Constrained dimensions to prevent right-edge clipping and header overlap.
 * Wide open Data corridor with clear, unobstructed branch connection.
 */
const DOMAIN_PINS: DomainPin[] = [
  {
    id: "analytics",
    title: "Analytics",
    subtitle: "Customer insights, segmentation and statistical analysis.",
    icon: BarChart3,
    nodeX: 50,
    nodeY: 50,
    pinX: 47,
    pinY: 20,
    controlX: 48,
    controlY: 34,
    style: { top: "6%", left: "26%" },
  },
  {
    id: "data",
    title: "Data",
    subtitle: "Reliable pipelines, SQL and data quality.",
    icon: Database,
    nodeX: 50,
    nodeY: 50,
    pinX: 42,
    pinY: 50,
    controlX: 46,
    controlY: 50,
    style: { top: "41%", left: "0%" },
  },
  {
    id: "risk",
    title: "Risk",
    subtitle: "Anomaly detection, scoring and validation.",
    icon: ShieldCheck,
    nodeX: 50,
    nodeY: 50,
    pinX: 47,
    pinY: 76,
    controlX: 48,
    controlY: 64,
    style: { top: "76%", left: "26%" },
  },
  {
    id: "product",
    title: "Product",
    subtitle: "Problem framing, prioritization and decision support.",
    icon: Box,
    nodeX: 50,
    nodeY: 50,
    pinX: 58,
    pinY: 50,
    controlX: 54,
    controlY: 50,
    style: { top: "41%", left: "58%" },
  },
];

interface TypingSentence {
  text: string;
  prefix: string;
  highlight: string;
  suffix: string;
}

/**
 * Standardized blue-to-cyan gradient rule for headline emphasis
 * Matches exact specified palette: #42B6FF to #63D9E8 with clone box-decoration for clean line wraps
 */
const HIGHLIGHT_GRADIENT_CLASS =
  "text-transparent bg-clip-text bg-gradient-to-r from-[#42B6FF] to-[#63D9E8] [box-decoration-break:clone] [-webkit-box-decoration-break:clone]";

const DEFAULT_ROTATING_HEADLINES: string[] = [
  "Turning Complex Data into Clear, Defensible Decisions.",
  "Connecting Customer Insights, Product Strategy, and Execution.",
  "Building Reliable Data Systems for Better Decisions.",
];

export function parseHeadline(rawText: string): TypingSentence {
  const text = (rawText || "").trim();
  if (!text) {
    return {
      text: "Turning Complex Data into Clear, Defensible Decisions.",
      prefix: "Turning Complex Data into ",
      highlight: "Clear, Defensible Decisions",
      suffix: ".",
    };
  }

  // Exact known matches for precision
  if (text === "Turning Complex Data into Clear, Defensible Decisions.") {
    return {
      text,
      prefix: "Turning Complex Data into ",
      highlight: "Clear, Defensible Decisions",
      suffix: ".",
    };
  }
  if (text === "Connecting Customer Insights, Product Strategy, and Execution.") {
    return {
      text,
      prefix: "Connecting Customer Insights, ",
      highlight: "Product Strategy, and Execution",
      suffix: ".",
    };
  }
  if (text === "Building Reliable Data Systems for Better Decisions.") {
    return {
      text,
      prefix: "Building Reliable Data Systems for ",
      highlight: "Better Decisions",
      suffix: ".",
    };
  }
  if (text === "Engineering Data Systems for Better Decisions.") {
    return {
      text,
      prefix: "Engineering Data Systems for ",
      highlight: "Better Decisions",
      suffix: ".",
    };
  }
  if (text === "Investigating Data. Validating Signals. Driving Action.") {
    return {
      text,
      prefix: "Investigating Data. Validating Signals. ",
      highlight: "Driving Action",
      suffix: ".",
    };
  }
  if (text === "Investigating Data. Validating the Signal. Driving Action.") {
    return {
      text,
      prefix: "Investigating Data. Validating the Signal. ",
      highlight: "Driving Action",
      suffix: ".",
    };
  }

  // Robust general parser for dynamic entries saved via Admin
  let mainBody = text;
  let suffix = "";
  const matchPunct = text.match(/[.!?]+$/);
  if (matchPunct) {
    suffix = matchPunct[0];
    mainBody = text.slice(0, -suffix.length);
  }

  const lastPeriod = mainBody.lastIndexOf(". ");
  if (lastPeriod !== -1) {
    return {
      text,
      prefix: mainBody.slice(0, lastPeriod + 2),
      highlight: mainBody.slice(lastPeriod + 2),
      suffix,
    };
  }

  const intoIndex = mainBody.lastIndexOf(" into ");
  if (intoIndex !== -1) {
    return {
      text,
      prefix: mainBody.slice(0, intoIndex + 6),
      highlight: mainBody.slice(intoIndex + 6),
      suffix,
    };
  }

  const forIndex = mainBody.lastIndexOf(" for ");
  if (forIndex !== -1) {
    return {
      text,
      prefix: mainBody.slice(0, forIndex + 5),
      highlight: mainBody.slice(forIndex + 5),
      suffix,
    };
  }

  const lastComma = mainBody.lastIndexOf(", ");
  if (lastComma !== -1 && lastComma > mainBody.length * 0.3) {
    return {
      text,
      prefix: mainBody.slice(0, lastComma + 2),
      highlight: mainBody.slice(lastComma + 2),
      suffix,
    };
  }

  const words = mainBody.split(/\s+/);
  if (words.length <= 2) {
    return {
      text,
      prefix: "",
      highlight: mainBody,
      suffix,
    };
  }

  const splitPoint = Math.max(1, Math.floor(words.length * 0.6));
  const prefix = words.slice(0, splitPoint).join(" ") + " ";
  const highlight = words.slice(splitPoint).join(" ");

  return {
    text,
    prefix,
    highlight,
    suffix,
  };
}

export const Hero: React.FC<HeroProps> = ({ onRequestResume }) => {
  const containerRef = useRef<HTMLElement | null>(null);
  const { data } = usePortfolio();
  const personalInfo = data?.personalInfo || PERSONAL_INFO;
  const shouldReduceMotion = useReducedMotion();

  const rotatingHeadlines: string[] = useMemo(() => {
    const list = (personalInfo as { heroRotatingHeadlines?: string[] })?.heroRotatingHeadlines;
    if (Array.isArray(list) && list.length > 0) {
      const valid = list.filter((h) => typeof h === "string" && h.trim().length > 0);
      if (valid.length > 0) return valid;
    }
    return DEFAULT_ROTATING_HEADLINES;
  }, [personalInfo]);

  const typingSentences: TypingSentence[] = useMemo(() => {
    return rotatingHeadlines.map(parseHeadline);
  }, [rotatingHeadlines]);

  const [hoveredPin, setHoveredPin] = useState<string | null>(null);
  const [videoError, setVideoError] = useState(false);
  const [sentenceIdx, setSentenceIdx] = useState(0);
  const [charCount, setCharCount] = useState(() => {
    const initialText = typingSentences[0]?.text || DEFAULT_ROTATING_HEADLINES[0];
    return initialText.length;
  });

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
    const count = typingSentences.length;
    if (count === 0) return;

    if (shouldReduceMotion) {
      setSentenceIdx(0);
      setCharCount(typingSentences[0].text.length);
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
      const numSentences = typingSentences.length;
      if (numSentences === 0) return;
      const sentence = typingSentences[currentIdx % numSentences];

      if (!isDeleting) {
        chars++;
        setCharCount(chars);
        setSentenceIdx(currentIdx % numSentences);

        if (chars >= sentence.text.length) {
          isDeleting = true;
          timerId = setTimeout(step, holdCompleted);
          return;
        }

        timerId = setTimeout(step, typeSpeed);
      } else {
        chars--;
        setCharCount(chars);
        setSentenceIdx(currentIdx % numSentences);

        if (chars <= 0) {
          isDeleting = false;
          currentIdx = (currentIdx + 1) % numSentences;
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
  }, [typingSentences, shouldReduceMotion]);

  const safeSentenceIdx = typingSentences.length > 0 ? sentenceIdx % typingSentences.length : 0;
  const currentSentence = typingSentences[safeSentenceIdx] || parseHeadline(DEFAULT_ROTATING_HEADLINES[0]);
  const prefixLen = currentSentence.prefix.length;
  const highlightLen = currentSentence.highlight.length;

  let prefixText = "";
  let highlightText = "";
  let suffixText = "";

  if (charCount <= prefixLen) {
    prefixText = currentSentence.prefix.slice(0, charCount);
  } else if (charCount <= prefixLen + highlightLen) {
    prefixText = currentSentence.prefix;
    highlightText = currentSentence.highlight.slice(0, charCount - prefixLen);
  } else {
    prefixText = currentSentence.prefix;
    highlightText = currentSentence.highlight;
    suffixText = currentSentence.suffix.slice(0, charCount - prefixLen - highlightLen);
  }

  const handleScrollToWork = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("work");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScrollToAbout = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("about");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative w-full h-screen min-h-[700px] flex flex-col justify-between overflow-hidden bg-[#030304] select-none"
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

      {/* 4. Main Two-Column Hero Composition (Consistent Top Inset & Decoupled Grid) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex-1 flex flex-col justify-center pt-24 sm:pt-28 lg:pt-32 xl:pt-36 pb-6 sm:pb-8">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-10">
          
          {/* LEFT COLUMN: Left-Aligned Headline, Positioning & Action CTAs */}
          <div className="w-full lg:col-span-6 xl:col-span-6 flex flex-col items-start text-left z-20 max-w-2xl">
            
            {/* Eyebrow Positioning: DATA · RISK · ENGINEERING · PRODUCT */}
            <div className="inline-flex items-center gap-2 mb-4 sm:mb-5">
              <span className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.28em] text-zinc-400">
                DATA · RISK · ENGINEERING · PRODUCT
              </span>
            </div>

            {/* Dominant Left-Aligned Headline with Full-Sentence Typewriter Animation */}
            {/* Dedicated CSS Grid wrapper: All sentences occupy the same cell to establish natural max height and prevent layout shift */}
            <div className="w-full mb-6 sm:mb-8">
              <div className="grid grid-cols-1 grid-rows-1 items-start w-full">
                {/* Phantom Invisible Sizers: All complete sentences rendered invisibly in the same cell */}
                {typingSentences.map((s, idx) => (
                  <div
                    key={`sizer-${idx}-${s.text}`}
                    aria-hidden="true"
                    className="col-start-1 row-start-1 w-full invisible select-none pointer-events-none"
                  >
                    <div className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] xl:text-[3.75rem] font-bold tracking-tight text-transparent leading-[1.05] max-w-full">
                      <span className="w-full break-words inline">
                        <span>{s.prefix}</span>
                        <span>{s.highlight}</span>
                        <span>{s.suffix}</span>
                        <span className="inline-block w-[3px] h-[0.82em] ml-1.5 align-middle" />
                      </span>
                    </div>
                  </div>
                ))}

                {/* Visible Typing Headline in the same grid cell */}
                <h1
                  className="col-start-1 row-start-1 w-full text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] xl:text-[3.75rem] font-bold tracking-tight text-white leading-[1.05] max-w-full"
                  aria-label={currentSentence.text}
                >
                  {/* Screen reader static announcement */}
                  <span className="sr-only">
                    {currentSentence.text}
                  </span>

                  {/* Visual animated typing text with graceful multi-line wrapping */}
                  <span className="w-full break-words inline" aria-hidden="true">
                    <span className="text-white">{prefixText}</span>
                    {highlightText && (
                      <span className={HIGHLIGHT_GRADIENT_CLASS}>
                        {highlightText}
                      </span>
                    )}
                    {suffixText && <span className="text-white">{suffixText}</span>}
                    {!shouldReduceMotion && (
                      <span
                        className="inline-block w-[3px] h-[0.82em] bg-[#63D9E8] ml-1.5 align-middle animate-pulse shrink-0 shadow-[0_0_8px_rgba(99,217,232,0.6)]"
                        aria-hidden="true"
                      />
                    )}
                  </span>
                </h1>
              </div>
            </div>

            {/* Supporting Narrative Text (Dynamically loaded from Admin CMS Studio) */}
            <p className="text-base sm:text-lg md:text-xl text-zinc-400 font-normal leading-relaxed max-w-xl mb-7 sm:mb-9">
              {personalInfo.heroSupporting || "Engineering graduate focused on analytics, risk, customer insights, and AI-assisted decision systems."}
            </p>

            {/* Action Control Buttons Matching Mockup */}
            <div className="flex flex-wrap items-center gap-4 mb-6 sm:mb-8">
              <motion.a
                href="#projects"
                onClick={handleScrollToWork}
                whileHover={shouldReduceMotion ? {} : { scale: 1.04, y: -2 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
                transition={{ type: "spring", stiffness: 450, damping: 20 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold bg-white text-[#030304] hover:bg-zinc-200 transition-all shadow-[0_0_25px_rgba(255,255,255,0.22)] cursor-pointer"
              >
                <span>View My Work</span>
                <ArrowUpRight className="w-4 h-4" />
              </motion.a>

              <motion.button
                onClick={onRequestResume}
                whileHover={shouldReduceMotion ? {} : { scale: 1.04, y: -2 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
                transition={{ type: "spring", stiffness: 450, damping: 20 }}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs sm:text-sm font-medium text-zinc-300 bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 hover:border-white/25 transition-all shadow-sm cursor-pointer"
              >
                <Mail className="w-4 h-4 text-zinc-400" />
                <span>Get In Touch</span>
              </motion.button>
            </div>

            {/* Compact Understated Social Links Row */}
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-[13px] font-mono text-zinc-400">
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

          {/* RIGHT COLUMN: Dedicated Vertically-Centered Domain Visualization */}
          <div className="w-full lg:col-span-6 xl:col-span-6 flex items-center justify-center relative pointer-events-auto h-auto sm:h-[460px] lg:h-[490px] xl:h-[530px]">
            
            {/* Desktop Floating Constellation Visualization Container */}
            <div className="relative w-full max-w-[480px] sm:max-w-[500px] xl:max-w-[540px] h-auto sm:h-full flex items-center justify-center">
              
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

              {/* Desktop: 4 Floating Domain Pins positioned around nexus (Hover-only, not clickable) */}
              <div className="relative w-full h-full hidden sm:block">
                {DOMAIN_PINS.map((pin) => {
                  const isHovered = hoveredPin === pin.id;
                  const isOtherHovered = hoveredPin !== null && !isHovered;
                  const Icon = pin.icon;

                  return (
                    <motion.div
                      key={pin.id}
                      onMouseEnter={() => setHoveredPin(pin.id)}
                      onMouseLeave={() => setHoveredPin(null)}
                      style={pin.style}
                      whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
                      transition={{ type: "spring", stiffness: 400, damping: 22 }}
                      className={`absolute z-20 flex items-center gap-3 p-2.5 lg:p-3 rounded-2xl bg-[#070b14]/85 backdrop-blur-md border transition-all duration-300 cursor-default select-none w-[200px] sm:w-[210px] max-w-[210px] ${
                        isHovered
                          ? "border-cyan-400/70 shadow-[0_0_25px_rgba(6,182,212,0.35)] opacity-100 z-30"
                          : isOtherHovered
                          ? "border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.6)] opacity-70"
                          : "border-white/[0.12] shadow-[0_8px_32px_rgba(0,0,0,0.6)] opacity-95 hover:border-cyan-500/40"
                      }`}
                    >
                      {/* Circular Icon Accent Badge */}
                      <div
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                          isHovered
                            ? "bg-cyan-500/20 border border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
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
                    </motion.div>
                  );
                })}
              </div>

              {/* Mobile / Small Screens: Clean 2x2 Grid Layout (Hover-only / visual cards) */}
              <div className="grid grid-cols-2 gap-2.5 w-full sm:hidden z-20">
                {DOMAIN_PINS.map((pin) => {
                  const Icon = pin.icon;
                  return (
                    <div
                      key={pin.id}
                      className="flex flex-col gap-1.5 p-3 rounded-xl bg-[#070b14]/90 backdrop-blur-md border border-white/10 select-none cursor-default"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#0b1728] border border-cyan-500/40 text-cyan-300 flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-white">{pin.title}</span>
                      <span className="text-[10px] text-zinc-400 leading-tight line-clamp-2">
                        {pin.subtitle}
                      </span>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* 5. Bottom-Left Scroll Indicator Matching Reference Mockup */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-4 sm:pb-6 flex items-center justify-start shrink-0">
        <motion.a
          href="#about"
          onClick={handleScrollToAbout}
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
