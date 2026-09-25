"use client";

import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, Calendar, MapPin, BookOpen } from "lucide-react";
import { EDUCATION } from "@/data/portfolioData";

export const Education: React.FC = () => {
  return (
    <section id="education" className="py-24 relative border-t border-white/[0.06]">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Section Pill */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "100px 0px 0px 0px" }}
            transition={{ duration: 0.35 }}
            className="inline-block px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-medium text-zinc-400 mb-3"
          >
            Academic Foundation
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "100px 0px 0px 0px" }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-4"
          >
            Education
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "100px 0px 0px 0px" }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="text-zinc-400 text-base max-w-xl mx-auto leading-relaxed"
          >
            Formal training in signals, systems, mathematical modeling, and engineering discipline.
          </motion.p>
        </div>

        {/* Education Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "100px 0px 0px 0px" }}
          transition={{ duration: 0.35 }}
          className="clean-card p-8 sm:p-10 rounded-2xl"
        >
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

          <p className="text-sm text-zinc-300 leading-relaxed mb-6">
            {EDUCATION.framing}
          </p>

          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
              <span>Core Quantitative & Engineering Coursework</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {EDUCATION.coursework.map((course, idx) => (
                <div
                  key={idx}
                  className="px-3.5 py-2 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs text-zinc-300 font-medium"
                >
                  {course}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
