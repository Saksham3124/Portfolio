"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ArrowRight, ArrowDown } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { PERSONAL_INFO } from "@/data/portfolioData";
import { usePortfolio } from "@/context/PortfolioContext";

interface HeroProps {
  onRequestResume: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onRequestResume }) => {
  const { data } = usePortfolio();
  const personalInfo = data?.personalInfo || PERSONAL_INFO;

  const [videoError, setVideoError] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const videoUrl =
    (personalInfo as { heroVideoUrl?: string }).heroVideoUrl ||
    "/videos/hero-background.mp4";
  const videoEnabled =
    (personalInfo as { heroVideoEnabled?: boolean }).heroVideoEnabled !== false;

  useEffect(() => {
    setVideoError(false);
  }, [videoUrl]);

  // Rotating Typewriter State
  const [displayedText, setDisplayedText] = useState("");
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  const rotatingHeadlines = useMemo(
    () => {
      if (
        personalInfo.heroRotatingHeadlines &&
        personalInfo.heroRotatingHeadlines.length > 0
      ) {
        return personalInfo.heroRotatingHeadlines;
      }
      return [
        personalInfo.heroHeadline || "Turning Complex Data into Clear, Defensible Decisions.",
        "Investigating Data. Validating the Signal. Driving Action.",
        "Engineering Data Systems for Better Decisions.",
      ];
    },
    [personalInfo.heroRotatingHeadlines, personalInfo.heroHeadline]
  );

  useEffect(() => {
    // Respect prefers-reduced-motion: render Headline 1 immediately and keep static
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setIsReducedMotion(true);
      setDisplayedText(rotatingHeadlines[0]);
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
      const currentHeadline = rotatingHeadlines[headlineIdx];

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
          headlineIdx = (headlineIdx + 1) % rotatingHeadlines.length;
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
  }, [rotatingHeadlines]);

  return (
    <section
      id="hero"
      className="relative w-full h-full flex flex-col justify-between pt-20 sm:pt-28 pb-6 sm:pb-10 overflow-hidden bg-[#030304]"
    >
      {/* Background Video Layer */}
      {videoEnabled && !videoError && (
        <video
          key={videoUrl}
          autoPlay
          loop
          muted
          playsInline
          onError={() => setVideoError(true)}
          className="absolute inset-0 w-full h-full object-cover opacity-45 pointer-events-none transition-opacity duration-1000"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      )}

      {/* Atmospheric Radial Depth & Soft Vignette Overlays - Softened for Video Clarity */}
      <div className="absolute inset-0 pointer-events-none bg-ambient-radial opacity-45" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#030304] via-transparent to-[#030304]/60" />
      <div className="absolute inset-0 pointer-events-none bg-[#030304]/25" />

      {/* Central Content Container - Generous Spacing */}
      <div className="max-w-4xl mx-auto px-6 text-center w-full relative z-10 flex-1 flex flex-col justify-center items-center">
        
        {/* Eyebrow & Positioning: DATA · ANALYTICS · RISK · PRODUCT */}
        <div className="flex flex-col items-center gap-2 mb-4 sm:mb-6">
          <span className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.28em] text-zinc-400">
            {personalInfo.name}
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.22em] text-zinc-400">
            {personalInfo.roleTitle.split("·").map((part, i, arr) => (
              <React.Fragment key={i}>
                <span>{part.trim()}</span>
                {i < arr.length - 1 && <span className="text-zinc-600">·</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Dominant Headline with Stable Height to Eliminate Layout Shifts */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-bold tracking-tight text-white leading-[1.1] max-w-4xl mx-auto mb-4 sm:mb-6 min-h-[100px] sm:min-h-[140px] md:min-h-[170px] lg:min-h-[190px] flex items-center justify-center text-center">
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
        <p className="text-sm sm:text-base md:text-lg text-zinc-400 font-normal leading-relaxed max-w-xl mx-auto mb-6 sm:mb-8">
          {personalInfo.heroSupporting}
        </p>

        {/* Understated Action Controls with Bouncy Spring Physics */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-6">
          <motion.a
            href="#work"
            whileHover={shouldReduceMotion ? {} : { scale: 1.04, y: -2 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
            transition={{ type: "spring", stiffness: 450, damping: 20 }}
            className="hero-btn hero-btn-primary"
          >
            <span>View Selected Work</span>
            <motion.span
              whileHover={shouldReduceMotion ? {} : { x: 3 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="inline-flex"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.span>
          </motion.a>

          <motion.button
            onClick={onRequestResume}
            whileHover={shouldReduceMotion ? {} : { scale: 1.04, y: -2 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
            transition={{ type: "spring", stiffness: 450, damping: 20 }}
            className="hero-btn hero-btn-secondary"
          >
            <span>Download Resume</span>
            <ArrowDown className="w-3.5 h-3.5 text-zinc-400" />
          </motion.button>
        </div>

        {/* Understated Social Links Strip with Bouncy Hover */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-xs font-mono text-zinc-400 mb-4 sm:mb-6">
          <motion.a
            href={personalInfo.contact.github}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="view"
            whileHover={shouldReduceMotion ? {} : { scale: 1.08, y: -1 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
            transition={{ type: "spring", stiffness: 450, damping: 18 }}
            className="hover:text-white transition-colors cursor-pointer"
          >
            GitHub
          </motion.a>
          <span className="text-zinc-600">·</span>
          <motion.a
            href={personalInfo.contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="view"
            whileHover={shouldReduceMotion ? {} : { scale: 1.08, y: -1 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
            transition={{ type: "spring", stiffness: 450, damping: 18 }}
            className="hover:text-white transition-colors cursor-pointer"
          >
            LinkedIn
          </motion.a>
          <span className="text-zinc-600">·</span>
          <motion.a
            href={`mailto:${personalInfo.contact.email}`}
            whileHover={shouldReduceMotion ? {} : { scale: 1.04, y: -1 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
            transition={{ type: "spring", stiffness: 450, damping: 18 }}
            className="hover:text-white transition-colors underline decoration-white/20 underline-offset-4 cursor-pointer"
            title={`Send email to ${personalInfo.contact.email}`}
          >
            {personalInfo.contact.email}
          </motion.a>
        </div>

      </div>

      {/* Hero Scroll Indicator - Organic buoyant float */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center pt-4 pb-2">
        <motion.a
          href="#about"
          onClick={(e) => {
            e.preventDefault();
            const el = document.getElementById("about");
            if (el) {
              el.scrollIntoView({ behavior: "smooth" });
              window.history.pushState(null, "", "/about");
            }
          }}
          whileHover={shouldReduceMotion ? {} : { scale: 1.08, y: -1 }}
          transition={{ type: "spring", stiffness: 400, damping: 18 }}
          className="flex flex-col items-center gap-1.5 text-zinc-400 hover:text-white transition-colors group cursor-pointer"
          aria-label="Scroll to About section"
        >
          <span className="text-[9px] font-mono tracking-[0.25em] uppercase text-zinc-500 group-hover:text-zinc-300 transition-colors">
            Scroll
          </span>
          <motion.div
            animate={shouldReduceMotion ? {} : { y: [0, 5, 0] }}
            transition={
              shouldReduceMotion
                ? {}
                : {
                    repeat: Infinity,
                    duration: 1.8,
                    ease: "easeInOut",
                  }
            }
          >
            <ArrowDown className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white" />
          </motion.div>
        </motion.a>
      </div>
    </section>
  );
};
