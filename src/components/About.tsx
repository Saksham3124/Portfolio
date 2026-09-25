"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Cpu,
  Database,
  ShieldCheck,
  LineChart,
  Code2,
  Workflow,
  Sparkles,
} from "lucide-react";
import { PERSONAL_INFO } from "@/data/portfolioData";

export const About: React.FC = () => {
  const pillars = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-cyan-400" />,
      title: "Risk Analytics & Forensic Auditing",
      description:
        "Specialized in credit default risk stratification and multi-tier anomaly detection. I build quantitative models that uncover credit exposure vulnerabilities, circular tax flows, and operational bottlenecks.",
    },
    {
      icon: <Database className="w-6 h-6 text-indigo-400" />,
      title: "Data Engineering & Pipeline Ops",
      description:
        "Architecting resilient ETL/ELT pipelines using PostgreSQL, Python, SQL window functions, and AWS services (S3, Athena). Focused on transactional integrity, automated scheduling, and dual-sink storage.",
    },
    {
      icon: <LineChart className="w-6 h-6 text-emerald-400" />,
      title: "Business Intelligence & Reporting",
      description:
        "Designing executive-level Tableau and Power BI dashboards that translate complex, high-dimensional datasets into defensible, evidence-cited narratives for executive and credit committee review.",
    },
    {
      icon: <Cpu className="w-6 h-6 text-amber-400" />,
      title: "Hardware-Grade Engineering Rigor",
      description:
        "Trained in Electronics and Communication Engineering at BIT Mesra. This background in signals, systems, and microcontrollers provides first-principles analytical discipline and hardware-level precision.",
    },
  ];

  return (
    <section id="about" className="py-24 relative overflow-hidden bg-navy-950">
      {/* Decorative gradient lines */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-950/10 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-400 mb-3"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>BACKGROUND & TRAJECTORY</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4"
          >
            Engineering Rigor Meets{" "}
            <span className="text-gradient-cyan">Data & Risk Intelligence</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-400 text-base sm:text-lg leading-relaxed"
          >
            How an Electronics and Communication Engineering foundation at BIT Mesra translates into
            bulletproof analytical models, defensible decisions, and high-throughput data operations.
          </motion.p>
        </div>

        {/* Narrative & Education Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch mb-16">
          
          {/* Detailed Narrative */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 glass-panel p-8 sm:p-10 rounded-2xl flex flex-col justify-between"
          >
            <div className="space-y-5 text-slate-300 leading-relaxed text-base">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <Workflow className="w-6 h-6 text-cyan-400" />
                The Journey: From Circuits to Quantitative Systems
              </h3>
              
              <p>
                My analytical foundation began in <strong className="text-white">Electronics and Communication Engineering (ECE)</strong> at{" "}
                <strong className="text-cyan-300">Birla Institute of Technology, Mesra</strong>. Working with signal processing,
                stochastic processes, and microcontrollers taught me to respect noise, deterministic latency, and system constraints.
              </p>

              <p>
                Recognizing that real-world businesses operate on massive, imperfect data streams, I strategically
                channeled this hardware rigor into <strong className="text-white">Data Engineering, Risk Analytics, and Business Intelligence</strong>.
                Rather than treating data as passive spreadsheets, I treat data as high-velocity telemetry requiring forensic verification,
                systematic stress-testing, and automated risk scoring.
              </p>

              <p>
                Today, I engineer full-cycle solutions: whether querying 307K+ records to isolate loan delinquency cohorts,
                authoring 3-tier SQL window algorithms to detect GST fraud patterns, or deploying real-time automated scheduling
                pipelines connected to executive Tableau and Power BI dashboards.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-800 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <Code2 className="w-4 h-4" /> SQL Window Functions
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Database className="w-4 h-4" /> Dual-Storage Ingest
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-indigo-400">
                <LineChart className="w-4 h-4" /> Evidence-Cited BI
              </span>
            </div>
          </motion.div>

          {/* Education & Core Stats Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex flex-col justify-between space-y-6"
          >
            {/* Education Highlight Card */}
            <div className="glass-panel p-8 rounded-2xl border-slate-700/70 hover:border-cyan-500/50 transition-all flex-1">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300">
                  {PERSONAL_INFO.education.period}
                </span>
              </div>

              <h4 className="text-xl font-bold text-white mb-1">
                {PERSONAL_INFO.education.degree}
              </h4>
              <div className="text-cyan-400 font-medium text-sm mb-3">
                {PERSONAL_INFO.education.institution}
              </div>
              <div className="text-xs text-slate-400 mb-4 flex items-center gap-1 font-mono">
                <span>📍 {PERSONAL_INFO.education.location}</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <strong className="text-slate-200">Core Curriculum & Focus:</strong>{" "}
                {PERSONAL_INFO.education.focus}
              </p>
            </div>

            {/* Quick Analytical Philosophy Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-navy-900 border border-indigo-900/40">
              <div className="text-xs font-mono uppercase tracking-wider text-indigo-400 mb-1">
                Analytical Philosophy
              </div>
              <div className="text-lg font-bold text-slate-100 mb-2">
                Defensibility Over Assumption
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Every calculation, risk tier, or dashboard must trace back to verifiable data lineage.
                If an analytical metric cannot defend itself under audit or executive scrutiny, it isn&apos;t ready for production.
              </p>
            </div>
          </motion.div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 rounded-2xl glass-card-interactive"
            >
              <div className="mb-4 p-3 rounded-xl bg-slate-900/90 border border-slate-800 inline-block">
                {pillar.icon}
              </div>
              <h4 className="text-base font-bold text-white mb-2">{pillar.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{pillar.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
