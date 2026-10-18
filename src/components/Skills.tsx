"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SKILL_GROUPS, AREAS_OF_INTEREST } from "@/data/portfolioData";
import { usePortfolio } from "@/context/PortfolioContext";

export const Skills: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const { data } = usePortfolio();
  const skillGroups = data?.skillGroups || SKILL_GROUPS;
  const areasOfInterest =
    data?.areasOfInterest &&
    data.areasOfInterest.length > 0 &&
    !data.areasOfInterest.includes("Customer & Product Analytics")
      ? data.areasOfInterest
      : AREAS_OF_INTEREST;

  const fadeUp = (delay = 0) => ({
    initial: shouldReduceMotion ? false : { opacity: 0, y: 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "20px" },
    transition: { duration: 0.45, delay, ease: "easeOut" as const },
  });

  return (
    <div className="py-6 sm:py-8 lg:py-10 px-4 sm:px-8 lg:px-12 flex flex-col justify-center min-h-[calc(100vh-140px)] w-full">
      <div className="max-w-5xl mx-auto w-full">
        
        {/* Section Pill & Header */}
        <motion.div {...fadeUp(0)} className="text-center mb-6 sm:mb-8">
          <div className="inline-block px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-medium text-zinc-400 mb-3 font-mono">
            Technical Tooling
          </div>

          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-4">
            Skills & Capabilities
          </h2>

          <p className="text-zinc-400 text-base max-w-xl mx-auto leading-relaxed">
            Focused toolchain built around analytics, statistical modeling, data workflows, and decision support.
          </p>
        </motion.div>

        {/* 4 Skill Categories Grid with Staggered Subtle Reveal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skillGroups.map((group, idx) => (
            <motion.div
              key={group.name}
              {...fadeUp(0.08 + idx * 0.04)}
              whileHover={shouldReduceMotion ? {} : { y: -5, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="clean-card p-7 sm:p-8 rounded-2xl flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold text-white mb-1.5">{group.name}</h3>
                <p className="text-xs text-zinc-400 mb-6">{group.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <motion.span
                      key={skill}
                      whileHover={shouldReduceMotion ? {} : { scale: 1.08, y: -1.5 }}
                      whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 450, damping: 16 }}
                      className="px-3 py-1.5 rounded-full text-xs font-medium text-zinc-200 bg-white/[0.04] border border-white/10 hover:border-white/30 hover:text-white transition-colors font-mono cursor-default inline-block"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Areas of Interest Card */}
        <motion.div
          {...fadeUp(0.38)}
          whileHover={shouldReduceMotion ? {} : { y: -3, scale: 1.006 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="mt-6 clean-card p-7 sm:p-8 rounded-2xl border border-white/[0.08]"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400 mb-1">
                DOMAIN ALIGNMENT
              </div>
              <h3 className="text-lg font-semibold text-white">Areas of Interest</h3>
            </div>
            <p className="text-xs text-zinc-400 max-w-md">
              Focus areas spanning product execution, analytical problem-solving, risk evaluation, and operational improvement.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {areasOfInterest.map((interest) => (
              <motion.span
                key={interest}
                whileHover={shouldReduceMotion ? {} : { scale: 1.07, y: -1.5 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                transition={{ type: "spring", stiffness: 450, damping: 16 }}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium text-zinc-200 bg-white/[0.04] border border-white/10 hover:border-white/30 hover:text-white transition-colors cursor-default inline-block"
              >
                {interest}
              </motion.span>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
};
