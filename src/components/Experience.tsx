"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Calendar, MapPin, TrendingUp } from "lucide-react";
import { EXPERIENCE } from "@/data/portfolioData";

interface OutcomeItem {
  value: string;
  label: string;
  sub: string;
}

const ResearchOutcomeMetrics: React.FC<{ outcomes: OutcomeItem[] }> = ({ outcomes }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-40px" });
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
        <div
          key={oIdx}
          className="p-4 sm:p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]"
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
        </div>
      ))}
    </div>
  );
};

export const Experience: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  const fadeUp = (delay = 0) => ({
    initial: shouldReduceMotion ? false : { opacity: 0, y: 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-40px" },
    transition: { duration: 0.45, delay, ease: "easeOut" as const },
  });

  return (
    <section id="experience" className="py-24 relative border-t border-white/[0.06] bg-[#030304]">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Section Header */}
        <motion.div {...fadeUp(0)} className="text-center mb-14">
          <div className="inline-block px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-medium text-zinc-400 mb-3 font-mono">
            Professional Experience
          </div>

          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-4">
            Research & Industry Experience
          </h2>

          <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Rigorous hands-on algorithmic problem solving, electromagnetic simulation, and quantitative research.
          </p>
        </motion.div>

        {/* Experience Cards */}
        <div className="space-y-8">
          {EXPERIENCE.map((exp, idx) => (
            <motion.div
              key={exp.id}
              {...fadeUp(0.08 + idx * 0.05)}
              className="clean-card p-6 sm:p-9 rounded-2xl border border-white/[0.08]"
            >
              {/* Header: Role, Organization, Program, Dates & Location */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6 pb-6 border-b border-white/[0.08]">
                <div>
                  <div className="inline-flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono text-zinc-300 px-2.5 py-0.5 rounded bg-white/[0.06] border border-white/10 font-medium">
                      {exp.program}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
                    {exp.role}
                  </h3>
                  <div className="text-sm sm:text-base font-medium text-zinc-300 mt-1">
                    {exp.organization}
                  </div>
                </div>

                <div className="flex flex-col sm:items-end text-xs text-zinc-400 font-mono gap-1.5 shrink-0">
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
              <div className="p-4 sm:p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] mb-8 text-sm sm:text-[15px] text-zinc-300 leading-relaxed">
                {exp.summary}
              </div>

              {/* Three Research Areas: Data Processing → Configuration Analysis → Validation */}
              <div className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {exp.researchAreas.map((area, aIdx) => (
                    <div
                      key={area.id || aIdx}
                      className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="text-[11px] font-mono font-semibold tracking-wider text-zinc-400 uppercase">
                            {area.title}
                          </span>
                          <span className="text-xs font-mono text-zinc-500">
                            0{aIdx + 1}
                          </span>
                        </div>
                        <div className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                          {area.id === "data-processing" ? (
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
                    </div>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-white/[0.08] my-8" />

              {/* Research Outcome Section */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="text-xs font-mono font-semibold tracking-wider text-zinc-400 uppercase">
                    RESEARCH OUTCOME
                  </span>
                </div>

                <ResearchOutcomeMetrics outcomes={exp.outcomes} />
              </div>

              {/* Divider */}
              <div className="border-t border-white/[0.08] my-8" />

              {/* Technologies for LNMIIT */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono text-zinc-500 mr-1">
                  Technologies:
                </span>
                {exp.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`text-xs font-mono px-3 py-1 rounded-md border ${
                      tag === "CST Studio Suite" || tag === "MATLAB"
                        ? "bg-white/[0.06] text-zinc-200 border-white/20 font-medium"
                        : "bg-white/[0.03] text-zinc-400 border-white/10"
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
