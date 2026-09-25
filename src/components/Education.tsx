"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { GraduationCap, Calendar, MapPin } from "lucide-react";
import { EDUCATION } from "@/data/portfolioData";

export const Education: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  const fadeUp = (delay = 0) => ({
    initial: shouldReduceMotion ? false : { opacity: 0, y: 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-40px" },
    transition: { duration: 0.45, delay, ease: "easeOut" as const },
  });

  return (
    <section id="education" className="py-24 relative border-t border-white/[0.06] bg-[#030304]">
      <div className="max-w-4xl mx-auto px-6">
        
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

        {/* Education Card */}
        <motion.div {...fadeUp(0.08)} className="clean-card p-8 sm:p-10 rounded-2xl">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-6 pb-6 border-b border-white/[0.08]">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-white/[0.05] border border-white/10 text-zinc-200 shrink-0">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
                  {EDUCATION.degree}
                </h3>
                <div className="text-sm font-medium text-zinc-300 mt-1">
                  {EDUCATION.institution}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:items-end text-xs text-zinc-400 font-mono gap-1.5 shrink-0">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                {EDUCATION.period}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                {EDUCATION.location}
              </span>
            </div>
          </div>

          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
            {EDUCATION.framing}
          </p>
        </motion.div>

      </div>
    </section>
  );
};
