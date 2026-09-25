"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SKILL_GROUPS } from "@/data/portfolioData";

export const Skills: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  const fadeUp = (delay = 0) => ({
    initial: shouldReduceMotion ? false : { opacity: 0, y: 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-40px" },
    transition: { duration: 0.45, delay, ease: "easeOut" as const },
  });

  return (
    <section id="skills" className="py-24 relative border-t border-white/[0.06] bg-[#030304]">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Section Pill & Header */}
        <motion.div {...fadeUp(0)} className="text-center mb-14">
          <div className="inline-block px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-medium text-zinc-400 mb-3 font-mono">
            Technical Tooling
          </div>

          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-4">
            Skills & Capabilities
          </h2>

          <p className="text-zinc-400 text-base max-w-xl mx-auto leading-relaxed">
            Focused toolchain built around risk modeling, relational data engineering, and business reporting.
          </p>
        </motion.div>

        {/* 4 Skill Categories Grid with Staggered Subtle Reveal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SKILL_GROUPS.map((group, idx) => (
            <motion.div
              key={group.name}
              {...fadeUp(0.08 + idx * 0.06)}
              className="clean-card p-7 sm:p-8 rounded-2xl flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold text-white mb-1.5">{group.name}</h3>
                <p className="text-xs text-zinc-400 mb-6">{group.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-full text-xs font-medium text-zinc-200 bg-white/[0.04] border border-white/10 hover:border-white/20 transition-colors font-mono"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
