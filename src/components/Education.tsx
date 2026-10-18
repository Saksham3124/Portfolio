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

  const academicFoundations = [
    "Probability & Stochastic Processes",
    "Mathematical Modeling & Optimization",
    "Statistical Analysis",
    "Systems Thinking",
    "Research & Experimental Validation",
  ];

  const focusAreas = [
    {
      title: "Quantitative Reasoning",
      desc: "Applying mathematical and statistical thinking to evaluate problems and interpret results.",
    },
    {
      title: "Analytical Problem-Solving",
      desc: "Breaking complex problems into structured steps and evaluating possible solutions.",
    },
    {
      title: "Research & Validation",
      desc: "Testing assumptions, comparing results, and investigating discrepancies to improve analytical reliability.",
    },
  ];

  return (
    <div className="py-8 sm:py-12 lg:py-16 px-4 sm:px-8 lg:px-12 flex flex-col justify-center min-h-[calc(100vh-140px)] w-full">
      <div className="max-w-4xl mx-auto w-full">
        {/* Section Header */}
        <motion.div {...fadeUp(0)} className="text-center mb-8 sm:mb-10">
          <div className="inline-block px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-medium text-zinc-400 mb-3 font-mono">
            {data.educationSection?.pill || "Academic Foundation"}
          </div>

          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-3">
            {data.educationSection?.heading || "Education"}
          </h2>

          <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            {data.educationSection?.subheading || "Quantitative grounding in mathematical analysis, systems thinking, and structured problem-solving."}
          </p>
        </motion.div>

        {/* Education Main Card */}
        <div className="space-y-6">
          {educationList.map((education, idx) => {
            const educationDescription =
              education.framing &&
              !education.framing.includes("signal integrity") &&
              !education.framing.includes("high-throughput data operations")
                ? education.framing
                : "Developed a foundation in quantitative reasoning, mathematical analysis, and structured problem-solving, with experience applying analytical methods to complex technical problems.";

            const activeCoursework =
              education.coursework && education.coursework.length > 0
                ? education.coursework
                : academicFoundations;

            const activeFocusAreas =
              education.focusAreas && education.focusAreas.length > 0
                ? education.focusAreas
                : focusAreas;

            return (
              <motion.div
                key={idx}
                {...fadeUp(0.08 + idx * 0.06)}
                whileHover={shouldReduceMotion ? {} : { y: -4, scale: 1.006 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="clean-card p-6 sm:p-9 rounded-2xl"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6 pb-6 border-b border-white/[0.08]">
                  <div className="flex items-start gap-4">
                    <motion.div
                      whileHover={shouldReduceMotion ? {} : { scale: 1.12, rotate: -4 }}
                      transition={{ type: "spring", stiffness: 450, damping: 16 }}
                      className="p-3 rounded-xl bg-white/[0.05] border border-white/10 text-cyan-300 shrink-0 cursor-default"
                    >
                      <GraduationCap className="w-6 h-6" />
                    </motion.div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
                        {education.degree || "B.Tech in Electronics and Communication Engineering"}
                      </h3>
                      <div className="text-sm font-medium text-zinc-300 mt-1">
                        {education.institution || "Birla Institute of Technology (BIT), Mesra"}
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
                  {educationDescription}
                </p>

                {/* Academic Foundations Chips with Pop Animation */}
                <div className="mb-6">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-2.5 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Academic Foundations</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeCoursework.map((course, cIdx) => (
                      <motion.span
                        key={cIdx}
                        whileHover={shouldReduceMotion ? {} : { scale: 1.08, y: -1.5 }}
                        whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 450, damping: 16 }}
                        className="px-2.5 py-1 rounded-md text-xs font-mono bg-white/[0.04] border border-white/[0.08] hover:border-white/25 hover:text-white hover:bg-white/[0.07] text-zinc-300 transition-colors inline-block cursor-default"
                      >
                        {course}
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* Key Transferable Skill Pillars with Pop Animation */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5 border-t border-white/[0.06]">
                  {activeFocusAreas.map((area, fIdx) => (
                    <motion.div
                      key={fIdx}
                      whileHover={shouldReduceMotion ? {} : { y: -3, scale: 1.02 }}
                      whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 450, damping: 20 }}
                      className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/20 hover:bg-white/[0.04] transition-colors cursor-default"
                    >
                      <div className="text-xs font-semibold text-white mb-1">
                        {area.title}
                      </div>
                      <div className="text-[11px] text-zinc-400 leading-snug">
                        {area.desc}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
