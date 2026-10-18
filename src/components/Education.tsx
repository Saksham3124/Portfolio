"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { GraduationCap, Calendar, MapPin, BookOpen } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";

export const Education: React.FC = () => {
  const { data } = usePortfolio();
  const educationList =
    data.educationList && data.educationList.length > 0
      ? data.educationList
      : [data.education];
  const shouldReduceMotion = useReducedMotion();

  const fadeUp = (delay = 0) => ({
    initial: shouldReduceMotion ? false : { opacity: 0, y: 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "20px" },
    transition: { duration: 0.45, delay, ease: "easeOut" as const },
  });

  const courseworkList = [
    "Signals & Systems",
    "Probability & Stochastic Processes",
    "Data Structures & Algorithms",
    "Digital Signal Processing",
    "Linear Algebra & Optimization",
    "Microcontrollers & Embedded Systems",
  ];

  const focusAreas = [
    {
      title: "Signals & Stochastic Systems",
      desc: "Mathematical modeling of noise, stochastic processes, and probabilistic signal behavior.",
    },
    {
      title: "Algorithmic Analysis & Optimization",
      desc: "Computational complexity, data structures, and deterministic algorithmic problem-solving.",
    },
    {
      title: "Quantitative Problem-Solving",
      desc: "Rigorous analytical engineering mindset applied to high-throughput data operations.",
    },
  ];

  return (
    <div className="py-8 sm:py-12 lg:py-16 px-4 sm:px-8 lg:px-12 flex flex-col justify-center min-h-[calc(100vh-140px)] w-full">
      <div className="max-w-4xl mx-auto w-full">
        {/* Section Header */}
        <motion.div {...fadeUp(0)} className="text-center mb-8 sm:mb-10">
          <div className="inline-block px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-medium text-zinc-400 mb-3 font-mono">
            Academic Foundation
          </div>

          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-3">
            Education & Academic Discipline
          </h2>

          <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Formal training in signals, stochastic systems, mathematical modeling, and engineering discipline.
          </p>
        </motion.div>

        {/* Education Main Card */}
        <div className="space-y-6">
          {educationList.map((education, idx) => (
            <motion.div
              key={idx}
              {...fadeUp(0.08 + idx * 0.06)}
              className="clean-card p-6 sm:p-9 rounded-2xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6 pb-6 border-b border-white/[0.08]">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-white/[0.05] border border-white/10 text-cyan-300 shrink-0">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
                      {education.degree}
                    </h3>
                    <div className="text-sm font-medium text-zinc-300 mt-1">
                      {education.institution}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end text-xs text-zinc-400 font-mono gap-1.5 shrink-0">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                    {education.period}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                    {education.location}
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-6">
                {education.framing}
              </p>

              {/* Core Relevant Coursework Chips */}
              <div className="mb-6">
                <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-2.5 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Core Quantitative & Engineering Coursework</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {courseworkList.map((course, cIdx) => (
                    <span
                      key={cIdx}
                      className="px-2.5 py-1 rounded-md text-xs font-mono bg-white/[0.04] border border-white/[0.08] text-zinc-300"
                    >
                      {course}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Foundation Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5 border-t border-white/[0.06]">
                {focusAreas.map((area, fIdx) => (
                  <div
                    key={fIdx}
                    className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05]"
                  >
                    <div className="text-xs font-semibold text-white mb-1">
                      {area.title}
                    </div>
                    <div className="text-[11px] text-zinc-400 leading-snug">
                      {area.desc}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
