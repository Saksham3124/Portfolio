"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ShieldCheck, Database, LineChart, Cpu } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";
import { DOMAIN_PINS } from "@/components/Hero";

export const About: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const { data } = usePortfolio();
  const about = data.about;

  const fadeUp = (delay = 0) => ({
    initial: shouldReduceMotion ? false : { opacity: 0, y: 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "20px" },
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
    <div className="pt-2 sm:pt-4 pb-12 sm:pb-16 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Mobile Domain Focus Cards: Analytics, Data, Risk, Product (Visible only on mobile screens < sm, revealing naturally on vertical scroll) */}
        <motion.div {...fadeUp(0)} className="block sm:hidden mb-12">
          <div className="text-center mb-4">
            <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-cyan-400/90 inline-block px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-800/40">
              CORE DOMAINS
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight mt-2">
              Analytics · Data · Risk · Product
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {DOMAIN_PINS.map((pin) => {
              const Icon = pin.icon;
              return (
                <div
                  key={pin.id}
                  className="clean-card flex flex-col gap-2 p-3.5 rounded-xl border border-white/[0.08] bg-[#070b14]/90 backdrop-blur-sm select-none"
                >
                  <div className="w-8 h-8 rounded-full bg-[#0b1728] border border-cyan-500/40 text-cyan-300 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-white tracking-tight block">
                      {pin.title}
                    </span>
                    <span className="text-[10px] text-zinc-400 leading-snug mt-1 block">
                      {pin.subtitle}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

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
    </div>
  );
};
