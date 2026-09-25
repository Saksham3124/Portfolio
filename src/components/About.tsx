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
      icon: <ShieldCheck className="w-4 h-4 text-zinc-300" />,
      title: "Quantitative Reasoning",
      description:
        "Credit scoring matrices, statistical variance tracking, and empirical data validation.",
    },
    {
      icon: <Database className="w-4 h-4 text-zinc-300" />,
      title: "Data Engineering & Integrity",
      description:
        "Relational PostgreSQL schemas, SQL window functions, and verifiable data lineage.",
    },
    {
      icon: <LineChart className="w-4 h-4 text-zinc-300" />,
      title: "Decision Support & Reporting",
      description:
        "Translating multi-million row datasets into clear executive dashboards in Tableau & Power BI.",
    },
    {
      icon: <Cpu className="w-4 h-4 text-zinc-300" />,
      title: "Systems Discipline",
      description:
        "Formed through low-level signal processing, research at LNMIIT, and hardware-software rigor at BIT Mesra.",
    },
  ];

  return (
    <section id="about" className="py-24 relative border-t border-white/[0.06] bg-[#030304]">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Section Pill & Heading */}
        <motion.div {...fadeUp(0)} className="text-center mb-12">
          <div className="inline-block px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-medium text-zinc-400 mb-3 font-mono">
            Engineering Foundation · Analytical Direction
          </div>

          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-3">
            Engineering Rigor in Service of Defensible Decisions
          </h2>

          <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Translating mathematical systems, research discipline, and data engineering into reliable business and risk intelligence.
          </p>
        </motion.div>

        {/* Shortened, High-Impact Narrative Card */}
        <motion.div {...fadeUp(0.08)} className="clean-card p-7 sm:p-9 rounded-2xl mb-8 border border-white/[0.08]">
          <div className="space-y-4 text-zinc-300 text-sm sm:text-base leading-relaxed">
            <p>
              My academic trajectory is grounded in <strong className="text-white font-medium">Electronics and Communication Engineering (ECE)</strong> at{" "}
              <strong className="text-white font-medium">BIT Mesra</strong>, coupled with national fellowship research at{" "}
              <strong className="text-white font-medium">LNMIIT</strong>. Working with stochastic systems, signal processing, and numerical optimization established a first-principles respect for deterministic constraints and mathematical precision.
            </p>

            <p>
              I apply that analytical and systems-oriented thinking to <strong className="text-white font-medium">Risk Analytics, Data Engineering, and Operational Reporting</strong>. Whether stratifying 307K+ loan applicants to isolate default risk, writing multi-layer SQL anomaly detection engines for 50K+ invoices, or partitioning multi-million transaction lakes in AWS S3 and Athena, I ensure every metric is backed by auditable data lineage and clear decision support.
            </p>
          </div>
        </motion.div>

        {/* 4 Concise Analytical Pillars */}
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
