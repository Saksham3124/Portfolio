"use client";

import React from "react";
import { motion } from "framer-motion";
import { Trophy, Calendar, Sparkles } from "lucide-react";
import { ACHIEVEMENTS } from "@/data/portfolioData";

export const Achievements: React.FC = () => {
  return (
    <section id="achievements" className="py-24 relative border-t border-white/[0.06]">
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
            Competitive Honors
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "100px 0px 0px 0px" }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-4"
          >
            Notable Achievements
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "100px 0px 0px 0px" }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="text-zinc-400 text-base max-w-xl mx-auto leading-relaxed"
          >
            Selective competitive milestones demonstrating analytical execution under scrutiny.
          </motion.p>
        </div>

        {/* Selective Achievement Cards */}
        <div className="max-w-2xl mx-auto">
          {ACHIEVEMENTS.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "100px 0px 0px 0px" }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
              className="clean-card p-7 sm:p-8 rounded-2xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-lg bg-white/[0.05] border border-white/10 text-zinc-200">
                    <Trophy className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{item.year}</span>
                  </div>
                </div>

                <div className="inline-block px-2.5 py-0.5 rounded-full bg-white/[0.03] text-zinc-400 text-[11px] font-mono border border-white/5 mb-2.5">
                  {item.badge}
                </div>

                <h3 className="text-lg font-semibold text-white tracking-tight mb-1.5">
                  {item.title}
                </h3>
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
    </section>
  );
};
