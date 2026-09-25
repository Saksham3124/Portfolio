"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, Cloud, LineChart, Cpu } from "lucide-react";
import { CERTIFICATIONS } from "@/data/portfolioData";

export const Certifications: React.FC = () => {
  const categoryIcons: Record<string, React.ReactNode> = {
    "Data & Cloud": <Cloud className="w-4 h-4 text-zinc-300" />,
    "Analytics": <LineChart className="w-4 h-4 text-zinc-300" />,
    "Engineering & Electronics": <Cpu className="w-4 h-4 text-zinc-300" />,
    "Engineering & AI": <Cpu className="w-4 h-4 text-zinc-300" />,
  };

  return (
    <section id="credentials" className="py-24 relative border-t border-white/[0.06]">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Section Pill */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-medium text-zinc-400 mb-3"
          >
            Verified Learning & Qualifications
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-4"
          >
            Certifications & Credentials
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-zinc-400 text-base max-w-xl mx-auto leading-relaxed"
          >
            Selective industry credentials reinforcing cloud architectures, relational querying, and risk analytics.
          </motion.p>
        </div>

        {/* Categorized Grid */}
        <div className="space-y-8">
          {CERTIFICATIONS.map((cat, catIdx) => (
            <motion.div
              key={cat.category}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: catIdx * 0.08 }}
              className="clean-card p-7 sm:p-8 rounded-2xl"
            >
              <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-white/[0.06]">
                <div className="p-2 rounded-lg bg-white/[0.05] border border-white/10">
                  {categoryIcons[cat.category] || <ShieldCheck className="w-4 h-4 text-zinc-300" />}
                </div>
                <h3 className="text-base font-semibold text-white tracking-tight">
                  {cat.category}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cat.items.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h4 className="text-sm font-semibold text-zinc-200">
                          {item.name}
                        </h4>
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
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
