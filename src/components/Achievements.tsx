"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Award,
  Sparkles,
  Calendar,
  Building2,
  FileCheck2,
} from "lucide-react";
import { ACHIEVEMENTS } from "@/data/portfolioData";

export const Achievements: React.FC = () => {
  return (
    <section id="achievements" className="py-24 relative overflow-hidden bg-navy-900/60">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-400 mb-3"
          >
            <Award className="w-3.5 h-3.5" />
            <span>HONORS, RESEARCH & MILESTONES</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4"
          >
            Achievements & <span className="text-gradient-cyan">Milestones</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-400 text-base sm:text-lg leading-relaxed"
          >
            A track record of competitive research selection, engineering excellence at BIT Mesra,
            and large-scale quantitative data pipeline implementations.
          </motion.p>
        </div>

        {/* Timeline / Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {ACHIEVEMENTS.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col justify-between group hover:shadow-xl"
            >
              <div>
                {/* Header row: Year & Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-cyan-950/70 text-cyan-300 border border-cyan-800/60">
                    <Calendar className="w-3.5 h-3.5" />
                    {item.year}
                  </span>

                  <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-md bg-slate-900 text-slate-300 border border-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    {item.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-1.5 group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </h3>

                {/* Issuer */}
                <div className="text-xs font-mono text-cyan-400 mb-4 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{item.issuer}</span>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  {item.description}
                </p>
              </div>

              {/* Skills/Tags Footnote */}
              <div className="pt-4 border-t border-slate-800/80 flex flex-wrap gap-2">
                {item.skills.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900/90 text-slate-400 border border-slate-800"
                  >
                    #{skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Certifications & Quantitative Rigor Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-14 p-8 rounded-2xl bg-gradient-to-r from-navy-950 via-slate-900 to-navy-950 border border-slate-800"
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
                <FileCheck2 className="w-4 h-4" />
                <span>CONTINUOUS QUANTITATIVE MASTERY</span>
              </div>
              <h4 className="text-xl font-bold text-white mb-2">
                Certifications, Specializations & Practical Tooling
              </h4>
              <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
                Dedicated practitioner staying ahead of modern enterprise stacks across PostgreSQL windowing,
                AWS cloud analytics (S3 + Athena), Power BI DAX modeling, and statistical inference.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3.5 py-2 rounded-xl bg-slate-800 text-xs font-mono font-medium text-slate-200 border border-slate-700">
                SQL & Relational DBs
              </span>
              <span className="px-3.5 py-2 rounded-xl bg-slate-800 text-xs font-mono font-medium text-slate-200 border border-slate-700">
                Power BI & DAX
              </span>
              <span className="px-3.5 py-2 rounded-xl bg-slate-800 text-xs font-mono font-medium text-slate-200 border border-slate-700">
                Tableau Desktop
              </span>
              <span className="px-3.5 py-2 rounded-xl bg-slate-800 text-xs font-mono font-medium text-slate-200 border border-slate-700">
                Python Data Science
              </span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
