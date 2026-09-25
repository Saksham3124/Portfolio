"use client";

import React from "react";
import { motion } from "framer-motion";
import { SKILL_GROUPS } from "@/data/portfolioData";

export const Skills: React.FC = () => {
  return (
    <section id="skills" className="py-24 relative border-t border-white/[0.06]">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Section Pill */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-medium text-zinc-400 mb-3"
          >
            Technical Tooling
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-4"
          >
            Skills & Capabilities
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-zinc-400 text-base max-w-xl mx-auto leading-relaxed"
          >
            Focused toolchain built around risk modeling, relational data engineering, and business reporting.
          </motion.p>
        </div>

        {/* 4 Skill Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SKILL_GROUPS.map((group, idx) => (
            <motion.div
              key={group.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="clean-card p-7 sm:p-8 rounded-2xl flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold text-white mb-1.5">{group.name}</h3>
                <p className="text-xs text-zinc-400 mb-6">{group.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-full text-xs font-medium text-zinc-200 bg-white/[0.04] border border-white/10 hover:border-white/20 transition-colors"
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
