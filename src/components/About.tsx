"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ShieldCheck, Database, LineChart, Cpu } from "lucide-react";

export const About: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  const fadeUp = (delay = 0) => ({
    initial: shouldReduceMotion ? false : { opacity: 0, y: 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-40px" },
    transition: { duration: 0.45, delay, ease: "easeOut" as const },
  });

  const pillars = [
    {
      icon: <LineChart className="w-4 h-4 text-zinc-300" />,
      title: "Customer & Product Analytics",
      description:
        "Customer behavior, segmentation, opportunity modeling, and decision support.",
    },
    {
      icon: <ShieldCheck className="w-4 h-4 text-zinc-300" />,
      title: "Risk & Statistical Analysis",
      description:
        "Risk scoring, anomaly detection, statistical validation, and evidence-based analysis.",
    },
    {
      icon: <Cpu className="w-4 h-4 text-zinc-300" />,
      title: "AI-Assisted Analytics",
      description:
        "LLM APIs, structured AI outputs, risk narratives, and AI-assisted analytical workflows.",
    },
    {
      icon: <Database className="w-4 h-4 text-zinc-300" />,
      title: "Data & Analytical Systems",
      description:
        "SQL, data quality, reliable workflows, dashboards, and analytical implementation.",
    },
  ];

  return (
    <section id="about" className="py-24 relative border-t border-white/[0.06] bg-[#030304]">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Section Pill & Heading */}
        <motion.div {...fadeUp(0)} className="text-center mb-12">
          <div className="inline-block px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-medium text-zinc-400 mb-3 font-mono">
            Analytical Foundation · Decision Focus
          </div>

          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-3">
            Analytics in Service of Better Decisions
          </h2>

          <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            I combine structured analysis, statistical methods, and reliable data workflows to solve customer, risk, and data-quality problems and support better decisions.
          </p>
        </motion.div>

        {/* Shortened, Authoritative Narrative Card */}
        <motion.div {...fadeUp(0.08)} className="clean-card p-7 sm:p-9 rounded-2xl mb-8 border border-white/[0.08]">
          <div className="space-y-4 text-zinc-300 text-sm sm:text-base leading-relaxed">
            <p>
              My academic foundation is in <strong className="text-white font-medium">Electronics and Communication Engineering at BIT Mesra</strong>, complemented by research at <strong className="text-white font-medium">LNMIIT</strong>. Working across electromagnetic simulation, signal processing, and numerical optimization taught me to approach complex technical problems from first principles.
            </p>

            <p>
              I now apply that structured mindset to <strong className="text-white font-medium">Customer Analytics, Risk Modeling, and Data Systems</strong>. My work focuses on evaluating real data scale, uncovering verifiable signals, and building reliable decision-support systems.
            </p>
          </div>
        </motion.div>

        {/* 4 Analytical Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pillars.map((pillar, i) => (
            <motion.div
              key={i}
              {...fadeUp(0.12 + i * 0.05)}
              className="clean-card p-5 rounded-xl flex flex-col justify-between"
            >
              <div>
                <div className="p-2 rounded-lg bg-white/[0.05] border border-white/10 w-fit mb-3">
                  {pillar.icon}
                </div>
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
