"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Database, LineChart, Cpu } from "lucide-react";
import { PERSONAL_INFO } from "@/data/portfolioData";

export const About: React.FC = () => {
  const pillars = [
    {
      icon: <ShieldCheck className="w-5 h-5 text-zinc-300" />,
      title: "Quantitative Reasoning",
      description:
        "Applying probability distributions, statistical anomaly thresholds, and hypothesis-driven stress testing to evaluate financial default and compliance risks.",
    },
    {
      icon: <Database className="w-5 h-5 text-zinc-300" />,
      title: "Data Engineering & Integrity",
      description:
        "Designing relational PostgreSQL schemas, high-performance SQL window calculations, and automated scheduling pipelines that guarantee verifiable data lineage.",
    },
    {
      icon: <LineChart className="w-5 h-5 text-zinc-300" />,
      title: "Decision Support & Reporting",
      description:
        "Translating high-dimensional datasets into intuitive, evidence-cited executive dashboards in Tableau and Power BI for defensible decision-making.",
    },
    {
      icon: <Cpu className="w-5 h-5 text-zinc-300" />,
      title: "Systems Thinking & Discipline",
      description:
        "Formed through low-level signals, microcontrollers, and algorithmic research at BIT Mesra and LNMIIT, prioritizing deterministic precision and constraint awareness.",
    },
  ];

  return (
    <section id="about" className="py-24 relative border-t border-white/[0.06]">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Section Pill */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-medium text-zinc-400 mb-3"
          >
            About & Positioning
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-4"
          >
            Engineering Rigor in Service of Defensible Decisions
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-zinc-400 text-base max-w-2xl mx-auto leading-relaxed"
          >
            {PERSONAL_INFO.coreNarrative}
          </motion.p>
        </div>

        {/* Narrative Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="clean-card p-8 sm:p-10 rounded-2xl mb-12"
        >
          <div className="space-y-5 text-zinc-300 text-sm sm:text-base leading-relaxed">
            <p>
              My academic trajectory is grounded in <strong className="text-white font-medium">Electronics and Communication Engineering (ECE)</strong> at{" "}
              <strong className="text-white font-medium">Birla Institute of Technology, Mesra</strong>. 
              Working with signal processing, stochastic processes, and circuit architectures instilled a first-principles respect 
              for system constraints, deterministic behavior, and mathematical precision.
            </p>

            <p>
              I strategically channel this engineering foundation into <strong className="text-white font-medium">Risk Analytics, Data Engineering, and Operational Reporting</strong>. 
              Rather than treating data as passive numbers, I approach it as critical infrastructure: auditing 307K+ loan records to stratify default vulnerabilities, 
              authoring 3-tier SQL window functions to catch circular GST fraud patterns, and engineering automated pipelines with dual-sink storage.
            </p>

            <p>
              My objective across every analysis is defensibility: ensuring that whether reviewing credit risk cohorts or promotional category elasticity, 
              every conclusion is backed by auditable data lineage, robust SQL modeling, and clear decision-support dashboards.
            </p>
          </div>
        </motion.div>

        {/* 4 Analytical Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pillars.map((pillar, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="clean-card p-6 rounded-xl flex flex-col justify-between"
            >
              <div>
                <div className="p-2.5 rounded-lg bg-white/[0.05] border border-white/10 w-fit mb-4">
                  {pillar.icon}
                </div>
                <h3 className="text-sm font-semibold text-white mb-2">{pillar.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{pillar.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
