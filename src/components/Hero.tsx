"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowDown, ArrowUpRight, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/BrandIcons";
import { PERSONAL_INFO } from "@/data/portfolioData";

interface HeroProps {
  onRequestResume: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onRequestResume }) => {
  return (
    <section id="hero" className="relative min-h-[90vh] flex items-center justify-center pt-28 pb-16 bg-ambient-radial">
      <div className="max-w-4xl mx-auto px-6 text-center w-full">
        
        {/* Subtle Pre-headline Pill */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-medium text-zinc-300 mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>Data · Risk · Engineering</span>
        </motion.div>

        {/* Clean, Impactful Display Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.08] mb-6"
        >
          <span>Turning complex data into </span>
          <span className="text-gradient-subtle block sm:inline">
            clear, defensible decisions.
          </span>
        </motion.h1>

        {/* Supporting Copy */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto max-w-2xl text-base sm:text-lg text-zinc-400 font-normal leading-relaxed mb-10"
        >
          {PERSONAL_INFO.heroSupporting}
        </motion.p>

        {/* Primary Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3.5 mb-12"
        >
          <a
            href="#work"
            className="pill-button pill-button-primary"
          >
            <span>View Work</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <button
            onClick={onRequestResume}
            className="pill-button"
          >
            <span>Request Résumé</span>
            <ArrowDown className="w-3.5 h-3.5 text-zinc-400" />
          </button>
        </motion.div>

        {/* Prominent Direct Links Strip: GitHub ↗, LinkedIn ↗, Email ↗ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="flex flex-wrap items-center justify-center gap-3 pt-6 border-t border-white/[0.06]"
        >
          {/* Prominent GitHub Button in Hero */}
          <a
            href={PERSONAL_INFO.contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="pill-button text-xs py-2 px-4 bg-white/[0.02]"
            title="Visit GitHub (@Saksham3124)"
          >
            <GithubIcon className="w-3.5 h-3.5 text-zinc-300" />
            <span>GitHub (Saksham3124)</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500" />
          </a>

          {/* LinkedIn Link */}
          <a
            href={PERSONAL_INFO.contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="pill-button text-xs py-2 px-4 bg-white/[0.02]"
            title="LinkedIn Profile"
          >
            <LinkedinIcon className="w-3.5 h-3.5 text-zinc-300" />
            <span>LinkedIn</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500" />
          </a>

          {/* Direct Email Link */}
          <a
            href={`mailto:${PERSONAL_INFO.contact.email}`}
            className="pill-button text-xs py-2 px-4 bg-white/[0.02]"
            title="Send Email"
          >
            <Mail className="w-3.5 h-3.5 text-zinc-300" />
            <span>Email</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500" />
          </a>
        </motion.div>

        {/* Key Metrics / Impact Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {PERSONAL_INFO.keyMetrics.map((metric, i) => (
            <div
              key={i}
              className="clean-card p-5 rounded-xl text-left"
            >
              <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mb-1">
                {metric.value}
              </div>
              <div className="text-xs font-medium text-zinc-300">{metric.label}</div>
              <div className="text-[11px] text-zinc-500 mt-1">{metric.detail}</div>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};
