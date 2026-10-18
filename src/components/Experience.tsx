"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Calendar, MapPin, TrendingUp } from "lucide-react";
import { EXPERIENCE } from "@/data/portfolioData";
import { usePortfolio } from "@/context/PortfolioContext";

interface OutcomeItem {
  value: string;
  label: string;
  sub: string;
}

const ResearchOutcomeMetrics: React.FC<{ outcomes: OutcomeItem[] }> = ({ outcomes }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "20px" });
  const shouldReduceMotion = useReducedMotion();

  // Initial display states
  const [val1, setVal1] = useState(shouldReduceMotion ? "20K+" : "0");
  const [val2, setVal2] = useState(shouldReduceMotion ? "66% → 80%" : "66%");
  const [val3, setVal3] = useState(shouldReduceMotion ? "4" : "0");

  useEffect(() => {
    if (shouldReduceMotion) {
      setVal1("20K+");
      setVal2("66% → 80%");
      setVal3("4");
      return;
    }

    if (!isInView) return;

    let animFrame: number;
    let startTime: number | null = null;
    const duration = 1250; // 1.25 seconds

    // Smooth ease-out quad function
    const easeOutQuad = (t: number) => t * (2 - t);

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuad(progress);

      // 1. Metric 1: 0 -> 20K+ (abbreviated counter, no decimals)
      if (progress >= 1) {
        setVal1("20K+");
      } else {
        const kValue = Math.round(eased * 20);
        setVal1(kValue === 0 ? "0" : `${kValue}K`);
      }

      // 2. Metric 2: 66% → 80% (communicates starting value -> improved value, settling into 66% → 80%)
      if (progress >= 1) {
        setVal2("66% → 80%");
      } else if (elapsed < 350) {
        setVal2("66%");
      } else if (elapsed < 650) {
        setVal2("66% →");
      } else {
        const effProgress = (elapsed - 650) / (duration - 650);
        const currentEff = Math.round(66 + (80 - 66) * easeOutQuad(effProgress));
        setVal2(`66% → ${Math.min(currentEff, 80)}%`);
      }

      // 3. Metric 3: 0 -> 4
      if (progress >= 1) {
        setVal3("4");
      } else {
        const configCount = Math.round(eased * 4);
        setVal3(`${configCount}`);
      }

      if (progress < 1) {
        animFrame = requestAnimationFrame(step);
      }
    };

    animFrame = requestAnimationFrame(step);

    return () => {
      if (animFrame) cancelAnimationFrame(animFrame);
    };
  }, [isInView, shouldReduceMotion]);

  const displayValues = [val1, val2, val3];

  return (
    <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {outcomes.map((outcome, oIdx) => (
        <motion.div
          key={oIdx}
          whileHover={shouldReduceMotion ? {} : { scale: 1.04, y: -2 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="p-4 sm:p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-colors cursor-default"
        >
          <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mb-1.5 font-mono tabular-nums min-h-[36px] sm:min-h-[40px] flex items-center">
            {displayValues[oIdx] ?? outcome.value}
          </div>
          <div className="text-xs sm:text-sm font-medium text-zinc-300 mb-1">
            {outcome.label}
          </div>
          <div className="text-[11px] text-zinc-500 leading-snug">
            {outcome.sub}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export const Experience: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const { data } = usePortfolio();
  const experienceList = data?.experience || EXPERIENCE;

  const fadeUp = (delay = 0) => ({
    initial: shouldReduceMotion ? false : { opacity: 0, y: 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "20px" },
    transition: { duration: 0.45, delay, ease: "easeOut" as const },
  });

  return (
    <div className="py-6 sm:py-8 lg:py-10 px-4 sm:px-8 flex flex-col justify-center min-h-[calc(100vh-140px)] w-full">
      <div className="max-w-4xl mx-auto w-full">
        
        {/* Section Header */}
        <motion.div {...fadeUp(0)} className="text-center mb-6 sm:mb-8">
          <div className="inline-block px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-medium text-zinc-400 mb-2 font-mono">
            Professional Experience
          </div>

          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-3">
            Research & Industry Experience
          </h2>

          <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Rigorous hands-on algorithmic problem solving, electromagnetic simulation, and quantitative research.
          </p>
        </motion.div>

        {/* Experience Cards */}
        <div className="space-y-6">
          {experienceList.map((exp, idx) => (
            <motion.div
              key={exp.id}
              {...fadeUp(0.08 + idx * 0.05)}
              whileHover={shouldReduceMotion ? {} : { y: -3, scale: 1.004 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="clean-card p-5 sm:p-7 rounded-2xl border border-white/[0.08]"
            >
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

              {/* Three Research Areas: Data Processing → Configuration Analysis → Validation */}
              <div className="mb-5">
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

              {/* Divider */}
              <div className="border-t border-white/[0.08] my-5" />

              {/* Research Outcome Section */}
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="text-[11px] font-mono font-semibold tracking-wider text-zinc-400 uppercase">
                    RESEARCH OUTCOME
                  </span>
                </div>

                <ResearchOutcomeMetrics outcomes={exp.outcomes} />
              </div>

              {/* Divider */}
              <div className="border-t border-white/[0.08] my-5" />

              {/* Technologies for LNMIIT */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono text-zinc-500 mr-1">
                  Technologies:
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
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};
