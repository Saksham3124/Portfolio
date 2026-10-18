"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { GraduationCap, Calendar, MapPin } from "lucide-react";
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
    viewport: { once: true, margin: "-40px" },
    transition: { duration: 0.45, delay, ease: "easeOut" as const },
  });

  return (
    <div className="pt-2 sm:pt-4 pb-14 sm:pb-16 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Section Header */}
        <motion.div {...fadeUp(0)} className="text-center mb-14">
          <div className="inline-block px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-medium text-zinc-400 mb-3 font-mono">
            Academic Foundation
          </div>

          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-4">
            Education
          </h2>

          <p className="text-zinc-400 text-base max-w-xl mx-auto leading-relaxed">
            Formal training in signals, systems, mathematical modeling, and engineering discipline.
          </p>
        </motion.div>

        {/* Education Cards List */}
        <div className="space-y-6">
          {educationList.map((education, idx) => (
            <motion.div
              key={idx}
              {...fadeUp(0.08 + idx * 0.06)}
              whileHover={shouldReduceMotion ? {} : { y: -4, scale: 1.008 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="clean-card p-8 sm:p-10 rounded-2xl cursor-default"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-6 pb-6 border-b border-white/[0.08]">
                <div className="flex items-start gap-4">
                  <motion.div
                    whileHover={shouldReduceMotion ? {} : { scale: 1.12, rotate: -4 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    className="p-3 rounded-xl bg-white/[0.05] border border-white/10 text-zinc-200 shrink-0"
                  >
                    <GraduationCap className="w-6 h-6" />
                  </motion.div>
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

              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                {education.framing}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};
