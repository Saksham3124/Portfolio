"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ShieldCheck, Database, LineChart, Cpu } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";

export const About: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const { data } = usePortfolio();
  const about = data.about;

  const fadeUp = (delay = 0) => ({
    initial: shouldReduceMotion ? false : { opacity: 0, y: 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-40px" },
    transition: { duration: 0.45, delay, ease: "easeOut" as const },
  });

  const getPillarIcon = (iconName: string) => {
    switch (iconName) {
      case "LineChart":
        return <LineChart className="w-4 h-4 text-zinc-300" />;
      case "ShieldCheck":
        return <ShieldCheck className="w-4 h-4 text-zinc-300" />;
      case "Cpu":
        return <Cpu className="w-4 h-4 text-zinc-300" />;
      case "Database":
      default:
        return <Database className="w-4 h-4 text-zinc-300" />;
    }
  };

  return (
    <section id="about" className="py-24 relative border-t border-white/[0.06] bg-[#030304]">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Section Pill & Heading */}
        <motion.div {...fadeUp(0)} className="text-center mb-12">
          <div className="inline-block px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-medium text-zinc-400 mb-3 font-mono">
            {about.pill}
          </div>

          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-3">
            {about.heading}
          </h2>

          <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            {about.subheading}
          </p>
        </motion.div>

        {/* Narrative Card */}
        <motion.div
          {...fadeUp(0.08)}
          whileHover={shouldReduceMotion ? {} : { y: -3, scale: 1.006 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="clean-card p-7 sm:p-9 rounded-2xl mb-8 border border-white/[0.08]"
        >
          <div className="space-y-4 text-zinc-300 text-sm sm:text-base leading-relaxed">
            <p>{about.narrativeParagraph1}</p>
            {about.narrativeParagraph2 && <p>{about.narrativeParagraph2}</p>}
          </div>
        </motion.div>

        {/* Analytical Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {about.pillars.map((pillar, i) => (
            <motion.div
              key={i}
              {...fadeUp(0.12 + i * 0.05)}
              whileHover={shouldReduceMotion ? {} : { y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 380, damping: 20 }}
              className="clean-card p-5 rounded-xl flex flex-col justify-between cursor-default"
            >
              <div>
                <motion.div
                  whileHover={shouldReduceMotion ? {} : { scale: 1.12, rotate: -4 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  className="p-2 rounded-lg bg-white/[0.05] border border-white/10 w-fit mb-3 inline-block"
                >
                  {getPillarIcon(pillar.iconName)}
                </motion.div>
                <h3 className="text-xs font-semibold text-white mb-1.5">{pillar.title}</h3>
                <p className="text-[11px] text-zinc-400 leading-relaxed">{pillar.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
