"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Calendar, MapPin, TrendingUp } from "lucide-react";
import { EXPERIENCE } from "@/data/portfolioData";
import { usePortfolio } from "@/context/PortfolioContext";

interface OutcomeItem {
  value: string;
  label: string;
  sub: string;
}

const OutcomeCard: React.FC<{ outcome: OutcomeItem; isInView: boolean }> = ({
  outcome,
  isInView,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [displayVal, setDisplayVal] = useState(shouldReduceMotion ? outcome.value : "0");

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayVal(outcome.value);
      return;
    }
    if (!isInView) return;

    // Special LNMIIT arrow progression transition
    if (outcome.value === "66% → 80%") {
      let startTime: number | null = null;
      const duration = 1250;
      const easeOutQuad = (t: number) => t * (2 - t);
      let animFrame: number;
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        if (progress >= 1) {
          setDisplayVal("66% → 80%");
        } else if (elapsed < 350) {
          setDisplayVal("66%");
        } else if (elapsed < 650) {
          setDisplayVal("66% →");
        } else {
          const effProgress = (elapsed - 650) / (duration - 650);
          const currentEff = Math.round(66 + (80 - 66) * easeOutQuad(effProgress));
          setDisplayVal(`66% → ${Math.min(currentEff, 80)}%`);
        }
        if (progress < 1) animFrame = requestAnimationFrame(step);
      };
      animFrame = requestAnimationFrame(step);
      return () => cancelAnimationFrame(animFrame);
    }

    // Numbers with optional suffixes like "20K+", "18%", "3", "2"
    const match = outcome.value.match(/^(\d+(?:\.\d+)?)(.*)$/);
    if (match) {
      const targetNum = parseFloat(match[1]);
      const suffix = match[2] || "";
      let startTime: number | null = null;
      const duration = 1200;
      const easeOutQuad = (t: number) => t * (2 - t);
      let animFrame: number;
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentVal = Math.round(targetNum * easeOutQuad(progress));
        setDisplayVal(`${currentVal}${suffix}`);
        if (progress < 1) animFrame = requestAnimationFrame(step);
      };
      animFrame = requestAnimationFrame(step);
      return () => cancelAnimationFrame(animFrame);
    }

    setDisplayVal(outcome.value);
  }, [isInView, outcome.value, shouldReduceMotion]);

  return (
    <motion.div
      whileHover={shouldReduceMotion ? {} : { scale: 1.04, y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className="p-4 sm:p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-colors cursor-default"
    >
      <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mb-1.5 font-mono tabular-nums min-h-[36px] sm:min-h-[40px] flex items-center">
        {displayVal}
      </div>
      <div className="text-xs sm:text-sm font-medium text-zinc-300 mb-1">
        {outcome.label}
      </div>
      <div className="text-[11px] text-zinc-500 leading-snug">
        {outcome.sub}
      </div>
    </motion.div>
  );
};

const ResearchOutcomeMetrics: React.FC<{ outcomes: OutcomeItem[] }> = ({ outcomes }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "20px" });

  return (
    <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {outcomes.map((outcome, oIdx) => (
        <OutcomeCard key={oIdx} outcome={outcome} isInView={isInView} />
      ))}
    </div>
  );
};

/**
 * Common content renderer for an experience entry.
 * Purely renders the authentic role details, summary, contributions, metrics, and tags.
 * Contains no artificial implementation labels.
 */
const ExperienceCardContent: React.FC<{
  exp: (typeof EXPERIENCE)[0];
  isPlacedCard?: boolean;
  shouldReduceMotion: boolean | null;
}> = ({ exp, isPlacedCard = false, shouldReduceMotion }) => {
  return (
    <>
      {/* Subtle top architectural notch for the placed card */}
      {isPlacedCard && (
        <div
          aria-hidden="true"
          className="w-12 h-1 rounded-full bg-white/20 mx-auto mb-4 pointer-events-none shrink-0"
        />
      )}

      {/* Header: Role, Organization, Program, Dates & Location */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 mb-1.5">
            <motion.span
              whileHover={shouldReduceMotion ? {} : { scale: 1.06, y: -1 }}
              transition={{ type: "spring", stiffness: 450, damping: 18 }}
              className="text-xs font-mono text-zinc-300 px-2.5 py-0.5 rounded bg-white/[0.06] border border-white/10 font-medium inline-block cursor-default"
            >
              {exp.program}
            </motion.span>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
            {exp.role}
          </h3>
          <div className="text-xs sm:text-sm font-medium text-zinc-300 mt-0.5">
            {exp.organization}
          </div>
        </div>

        <div className="flex flex-col sm:items-end text-xs text-zinc-400 font-mono gap-1 shrink-0">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-zinc-500" />
            {exp.period}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-zinc-500" />
            {exp.location}
          </span>
        </div>
      </div>

      {/* Introductory Statement */}
      <div className="p-3 sm:p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] mb-5 text-xs sm:text-sm text-zinc-300 leading-relaxed">
        {exp.summary}
      </div>

      {/* Three Focus Areas / Key Contributions */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] font-mono font-semibold tracking-wider text-zinc-400 uppercase">
            {exp.type === "Research Internship"
              ? "Research Areas & Methodology"
              : "Key Contributions & Focus Areas"}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {exp.researchAreas.map((area, aIdx) => (
            <motion.div
              key={area.id || aIdx}
              whileHover={shouldReduceMotion ? {} : { y: -2, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="p-3.5 sm:p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/20 hover:bg-white/[0.035] transition-colors flex flex-col justify-between cursor-default"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono font-semibold tracking-wider text-zinc-400 uppercase">
                    {area.title}
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500">
                    0{aIdx + 1}
                  </span>
                </div>
                <div className="text-xs text-zinc-300 leading-relaxed">
                  {area.description ? (
                    area.description
                  ) : area.id === "data-processing" ? (
                    <>
                      Processed{" "}
                      <strong className="text-white font-semibold">
                        20K+ RFID signatures
                      </strong>{" "}
                      through a modular MATLAB workflow, converting simulation outputs
                      into structured data for analysis.
                    </>
                  ) : area.id === "configuration-analysis" ? (
                    <>
                      Compared{" "}
                      <strong className="text-white font-semibold">
                        four resonator configurations
                      </strong>{" "}
                      and multiple feed variations to identify patterns associated with
                      improved chipless RFID performance.
                    </>
                  ) : (
                    <>
                      Cross-checked experimental results against simulation outputs,
                      investigated discrepancies, and refined a reproducible analytical
                      workflow.
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Key Highlights & Achievements */}
      {exp.highlights && exp.highlights.length > 0 && (
        <>
          <div className="border-t border-white/[0.08] my-5" />
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[11px] font-mono font-semibold tracking-wider text-zinc-400 uppercase">
                Key Highlights & Achievements
              </span>
            </div>
            <ul className="space-y-2">
              {exp.highlights.map((h, hIdx) => (
                <li
                  key={hIdx}
                  className="text-xs text-zinc-300 leading-relaxed flex items-start gap-2.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80 mt-1.5 shrink-0" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {/* Divider */}
      <div className="border-t border-white/[0.08] my-5" />

      {/* Key Outcomes & Metrics Section */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-[11px] font-mono font-semibold tracking-wider text-zinc-400 uppercase">
            {exp.type === "Research Internship"
              ? "Research Outcomes & Metrics"
              : "Key Outcomes & Metrics"}
          </span>
        </div>

        <ResearchOutcomeMetrics outcomes={exp.outcomes} />
      </div>

      {/* Divider */}
      <div className="border-t border-white/[0.08] my-5" />

      {/* Technologies & Tools */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono text-zinc-500 mr-1">
          Technologies & Tools:
        </span>
        {exp.tags.map((tag) => (
          <motion.span
            key={tag}
            whileHover={shouldReduceMotion ? {} : { scale: 1.08, y: -1 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
            transition={{ type: "spring", stiffness: 450, damping: 16 }}
            className={`text-xs font-mono px-3 py-0.5 rounded-md border cursor-default inline-block ${
              tag === "CST Studio Suite" || tag === "MATLAB"
                ? "bg-white/[0.06] text-zinc-200 border-white/20 font-medium hover:border-white/40"
                : "bg-white/[0.03] text-zinc-400 border-white/10 hover:border-white/25 hover:text-zinc-200"
            }`}
          >
            {tag}
          </motion.span>
        ))}
      </div>
    </>
  );
};

export const Experience: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const { data } = usePortfolio();
  const experienceList = data?.experience || EXPERIENCE;

  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(typeof window !== "undefined" && window.innerWidth >= 1024);
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop, { passive: true });
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  // Stationary trigger element placed at the transition boundary between Card 1 and Card 2.
  const triggerRef = useRef<HTMLDivElement>(null);

  // Short, crisp trigger window:
  // "start 95%": Card 2's boundary enters near the bottom of the viewport
  // "start 55%": Card 2 settles in place directly on top
  const { scrollYProgress } = useScroll({
    target: triggerRef,
    offset: ["start 95%", "start 55%"],
  });

  // Pick-up-and-place animation values:
  // Position is nearly stationary: subtle settling drop of just 12px
  const card2Y = useTransform(scrollYProgress, [0, 1], [-12, 0]);
  // Subtle scale drop from slightly elevated (1.018) down to rested (1.0)
  const card2Scale = useTransform(scrollYProgress, [0, 1], [1.018, 1.0]);
  // Smooth, fast opacity fade-in
  const card2Opacity = useTransform(scrollYProgress, [0, 0.35, 1], [0.15, 0.65, 1]);

  // Underlying card (Card 1) subtly recedes in depth as Card 2 lands on top
  const card1Scale = useTransform(scrollYProgress, [0, 1], [1.0, 0.985]);
  const card1Opacity = useTransform(scrollYProgress, [0, 1], [1.0, 0.65]);

  const fadeUp = (delay = 0) => ({
    initial: shouldReduceMotion ? false : { opacity: 0, y: 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "20px" },
    transition: { duration: 0.45, delay, ease: "easeOut" as const },
  });

  const hasTwoOrMore = experienceList.length >= 2;
  const enablePlacementEffect = isDesktop && !shouldReduceMotion && hasTwoOrMore;

  return (
    <div className="py-6 sm:py-8 lg:py-10 px-4 sm:px-8 flex flex-col justify-center min-h-[calc(100vh-140px)] w-full">
      <div className="max-w-4xl mx-auto w-full">
        {/* Section Header */}
        <motion.div {...fadeUp(0)} className="text-center mb-6 sm:mb-8">
          <div className="inline-block px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-medium text-zinc-400 mb-2 font-mono">
            {data?.experienceSection?.pill || "Professional Experience"}
          </div>

          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-3">
            {data?.experienceSection?.heading || "Research & Industry Experience"}
          </h2>

          <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            {data?.experienceSection?.subheading ||
              "Rigorous hands-on algorithmic problem solving, electromagnetic simulation, and quantitative research."}
          </p>
        </motion.div>

        {/* Experience Cards */}
        {hasTwoOrMore ? (
          <div className="relative">
            {/* Card 1: Business Analyst Intern (Normal document flow, z-10) */}
            <motion.div
              style={
                enablePlacementEffect
                  ? { scale: card1Scale, opacity: card1Opacity }
                  : undefined
              }
              className="relative z-10 transform-gpu will-change-transform"
            >
              <div className="clean-card p-5 sm:p-7 rounded-2xl border border-white/[0.08] bg-[#07090e]">
                <ExperienceCardContent
                  exp={experienceList[0]}
                  shouldReduceMotion={shouldReduceMotion}
                />
              </div>
            </motion.div>

            {/* Stationary Trigger Element for scroll calculation (untransformed, zero scroll blocking) */}
            <div
              ref={triggerRef}
              className="h-px w-full -mt-px pointer-events-none"
            />

            {/* Card 2: LNMIIT Research Intern (Placed Directly on Top, z-20) */}
            <motion.div
              style={
                enablePlacementEffect
                  ? {
                      y: card2Y,
                      scale: card2Scale,
                      opacity: card2Opacity,
                    }
                  : undefined
              }
              className={`relative z-20 transform-gpu will-change-transform ${
                enablePlacementEffect ? "lg:-mt-20 mt-6" : "mt-6"
              }`}
            >
              <div className="clean-card p-5 sm:p-7 rounded-2xl border border-white/[0.14] border-t-white/[0.24] bg-[#080a12] shadow-[0_-25px_60px_rgba(0,0,0,0.95),0_15px_35px_rgba(0,0,0,0.85)]">
                <ExperienceCardContent
                  exp={experienceList[1]}
                  isPlacedCard={true}
                  shouldReduceMotion={shouldReduceMotion}
                />
              </div>
            </motion.div>

            {/* Any remaining experience cards (if added in the future) */}
            {experienceList.slice(2).map((exp, idx) => (
              <div key={exp.id || idx} className="mt-6 relative z-10">
                <div className="clean-card p-5 sm:p-7 rounded-2xl border border-white/[0.08] bg-[#07090e]">
                  <ExperienceCardContent
                    exp={exp}
                    shouldReduceMotion={shouldReduceMotion}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {experienceList.map((exp, idx) => (
              <motion.div
                key={exp.id || idx}
                {...fadeUp(0.08 + idx * 0.05)}
                whileHover={shouldReduceMotion ? {} : { y: -3, scale: 1.004 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="clean-card p-5 sm:p-7 rounded-2xl border border-white/[0.08] bg-[#07090e]"
              >
                <ExperienceCardContent
                  exp={exp}
                  shouldReduceMotion={shouldReduceMotion}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
