"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, ShieldCheck, Cloud, LineChart, Cpu, Trophy, Calendar, Sparkles } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";

export const Credentials: React.FC = () => {
  const { data } = usePortfolio();
  const certifications = data.certifications;
  const achievements = data.achievements;
  const shouldReduceMotion = useReducedMotion();

  const fadeUp = (delay = 0) => ({
    initial: shouldReduceMotion ? false : { opacity: 0, y: 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "20px" },
    transition: { duration: 0.45, delay, ease: "easeOut" as const },
  });

  const categoryIcons: Record<string, React.ReactNode> = {
    "Data & Cloud": <Cloud className="w-4 h-4 text-zinc-300" />,
    "Analytics": <LineChart className="w-4 h-4 text-zinc-300" />,
    "Engineering & Electronics": <Cpu className="w-4 h-4 text-zinc-300" />,
  };

  return (
    <div className="py-6 sm:py-8 lg:py-10 px-4 sm:px-8 lg:px-12 flex flex-col justify-center min-h-[calc(100vh-140px)] w-full">
      <div className="max-w-5xl mx-auto w-full">
        
        {/* Section Header */}
        <motion.div {...fadeUp(0)} className="text-center mb-8 sm:mb-10">
          <div className="inline-block px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-medium text-zinc-400 mb-2 font-mono">
            Verified Qualifications & Honors
          </div>

          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-3">
            Credentials & Achievements
          </h2>

          <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Selective industry credentials reinforcing cloud architectures, relational querying, and competitive engineering milestones.
          </p>
        </motion.div>

        {/* Part 1: Certifications & Credentials */}
        <div className="mb-10 sm:mb-12">
          <motion.div {...fadeUp(0.04)} className="flex items-center gap-2 mb-5 pb-3 border-b border-white/[0.08]">
            <ShieldCheck className="w-4 h-4 text-zinc-400" />
            <h3 className="text-lg font-semibold text-white tracking-tight">
              Certifications & Credentials
            </h3>
          </motion.div>

          <div className="space-y-6">
            {(certifications || []).map((cat, catIdx) => (
              <motion.div
                key={cat.category}
                {...fadeUp(0.08 + catIdx * 0.06)}
                whileHover={shouldReduceMotion ? {} : { y: -4, scale: 1.006 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="clean-card p-6 sm:p-8 rounded-2xl"
              >
                <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-white/[0.06]">
                  <motion.div
                    whileHover={shouldReduceMotion ? {} : { scale: 1.12, rotate: -4 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    className="p-2 rounded-lg bg-white/[0.05] border border-white/10 cursor-default"
                  >
                    {categoryIcons[cat.category] || <ShieldCheck className="w-4 h-4 text-zinc-300" />}
                  </motion.div>
                  <h4 className="text-sm font-semibold text-white tracking-tight uppercase font-mono">
                    {cat.category}
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cat.items.map((item, itemIdx) => (
                    <motion.div
                      key={itemIdx}
                      whileHover={shouldReduceMotion ? {} : { y: -3, scale: 1.015 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/20 hover:bg-white/[0.035] transition-colors flex flex-col justify-between cursor-default"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <h5 className="text-sm font-semibold text-zinc-200">
                            {item.name}
                          </h5>
                          <span className="text-[10px] font-mono text-zinc-400 px-2 py-0.5 rounded bg-white/[0.04] border border-white/5 shrink-0">
                            {item.year}
                          </span>
                        </div>
                        <div className="text-xs font-medium text-zinc-400 mb-2">
                          {item.issuer}
                        </div>
                        {item.highlight && (
                          <p className="text-xs text-zinc-400 leading-relaxed">
                            {item.highlight}
                          </p>
                        )}
                      </div>

                      <div className="pt-3 mt-3 border-t border-white/[0.04] flex items-center justify-between text-[11px] font-mono text-zinc-400">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400" />
                          Verified Qualification
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Part 2: Competitive Achievements */}
        <div>
          <motion.div {...fadeUp(0.18)} className="flex items-center gap-2 mb-8 pb-3 border-b border-white/[0.08]">
            <Trophy className="w-4 h-4 text-amber-400" />
            <h3 className="text-lg font-semibold text-white tracking-tight">
              Competitive Achievements
            </h3>
          </motion.div>

          <div className="space-y-4">
            {(achievements || []).map((item, aIdx) => (
              <motion.div
                key={item.id}
                {...fadeUp(0.22 + aIdx * 0.06)}
                whileHover={shouldReduceMotion ? {} : { y: -4, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="clean-card p-6 sm:p-8 rounded-2xl flex flex-col justify-between cursor-default"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <motion.div
                      whileHover={shouldReduceMotion ? {} : { scale: 1.15, rotate: 6 }}
                      transition={{ type: "spring", stiffness: 500, damping: 15 }}
                      className="p-2.5 rounded-lg bg-white/[0.05] border border-white/10 text-zinc-200"
                    >
                      <Trophy className="w-5 h-5 text-amber-400" />
                    </motion.div>
                    <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{item.year}</span>
                    </div>
                  </div>

                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-white/[0.03] text-zinc-400 text-[11px] font-mono border border-white/5 mb-2.5">
                    {item.badge}
                  </div>

                  <h4 className="text-lg sm:text-xl font-semibold text-white tracking-tight mb-1.5">
                    {item.title}
                  </h4>
                  <div className="text-xs font-medium text-zinc-400 mb-4">
                    {item.context}
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-5">
                    {item.description}
                  </p>
                </div>

                {item.impactMetrics && (
                  <div className="pt-3 border-t border-white/[0.06] flex items-center gap-1.5 text-xs font-mono text-zinc-400">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{item.impactMetrics}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
