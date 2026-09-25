"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  ArrowRight,
  FileText,
  ArrowUpRight,
  ShieldAlert,
  Database,
  LineChart,
  Terminal,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/BrandIcons";
import { PERSONAL_INFO } from "@/data/portfolioData";

const ROLES = [
  "Credit & Operational Risk Modeling",
  "Forensic Anomaly Detection Systems",
  "Scalable PostgreSQL & AWS Pipelines",
  "Executive BI Dashboards (Tableau & Power BI)",
];

interface HeroProps {
  onRequestResume: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onRequestResume }) => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentFullText = ROLES[roleIndex];
    const typingSpeed = isDeleting ? 30 : 65;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (displayedText.length < currentFullText.length) {
          setDisplayedText(currentFullText.slice(0, displayedText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2200);
        }
      } else {
        if (displayedText.length > 0) {
          setDisplayedText(currentFullText.slice(0, displayedText.length - 1));
        } else {
          setIsDeleting(false);
          setRoleIndex((prev) => (prev + 1) % ROLES.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, roleIndex]);

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden bg-grid-pattern">
      {/* Background ambient gradient orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse-slow" />
      <div className="absolute top-1/3 left-1/4 w-[380px] h-[380px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-1/4 w-[420px] h-[420px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Hero Column */}
          <div className="lg:col-span-8 flex flex-col items-start text-left">
            
            {/* Status Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-mono text-cyan-300 shadow-sm mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span>B.Tech ECE, BIT Mesra (2022–2026) • Quantitative Analyst</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-2"
            >
              KUMAR SAKSHAM
            </motion.h1>

            {/* Sub-headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-2xl font-mono font-medium tracking-wide text-cyan-400 mb-4 flex items-center gap-2"
            >
              <span>Data</span>
              <span className="text-slate-600">·</span>
              <span>Risk</span>
              <span className="text-slate-600">·</span>
              <span>Engineering</span>
              <span className="text-slate-600">·</span>
              <span>Operations</span>
            </motion.div>

            {/* Tagline with Animated Typing */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-100 mb-5 leading-tight"
            >
              &ldquo;{PERSONAL_INFO.tagline}&rdquo;
            </motion.div>

            {/* Kinetic Active Focus Ticker */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex items-center gap-2 text-sm sm:text-base font-mono text-slate-300 mb-6 bg-slate-900/60 px-3.5 py-2 rounded-lg border border-slate-800"
            >
              <Terminal className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="text-slate-400">Focus:</span>
              <span className="text-emerald-300 font-semibold">{displayedText}</span>
              <span className="w-2 h-4 bg-cyan-400 animate-pulse inline-block" />
            </motion.div>

            {/* Bio Blurb */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed mb-8"
            >
              {PERSONAL_INFO.bio}
            </motion.p>

            {/* Primary Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center gap-4 mb-8"
            >
              <a
                href="#projects"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-all hover:scale-102 active:scale-98"
              >
                <span>View My Work</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                onClick={onRequestResume}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-slate-100 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/60 shadow-md transition-all hover:scale-102 active:scale-98 group"
              >
                <FileText className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                <span>Request Resume</span>
                <span className="text-xs text-slate-400 group-hover:text-slate-300">↓</span>
              </button>
            </motion.div>

            {/* Prominent Social Links Strip: GitHub ↗, LinkedIn ↗, Email ↗ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-800/80 w-full"
            >
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 mr-2">
                Connect Directly:
              </span>

              {/* GitHub Prominent Hero Link */}
              <a
                href={PERSONAL_INFO.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-200 bg-slate-800/90 hover:bg-slate-700 hover:text-white border border-slate-700/80 hover:border-cyan-500/60 transition-all hover:shadow-md"
              >
                <GithubIcon className="w-4 h-4 text-cyan-400" />
                <span>GitHub (Saksham3124)</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
              </a>

              {/* LinkedIn Hero Link */}
              <a
                href={PERSONAL_INFO.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-200 bg-slate-800/90 hover:bg-slate-700 hover:text-white border border-slate-700/80 hover:border-indigo-500/60 transition-all hover:shadow-md"
              >
                <LinkedinIcon className="w-4 h-4 text-indigo-400" />
                <span>LinkedIn</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
              </a>

              {/* Email Hero Link */}
              <a
                href={`mailto:${PERSONAL_INFO.contact.email}`}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-200 bg-slate-800/90 hover:bg-slate-700 hover:text-white border border-slate-700/80 hover:border-emerald-500/60 transition-all hover:shadow-md"
              >
                <Mail className="w-4 h-4 text-emerald-400" />
                <span>Email</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </motion.div>
          </div>

          {/* Right Visual Dashboard Widget Column */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative rounded-2xl glass-panel p-6 shadow-2xl border border-slate-800/90 overflow-hidden"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs font-mono text-slate-400 ml-2">risk_matrix.live</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
                  <Activity className="w-3 h-3 animate-spin" />
                  <span>ONLINE</span>
                </div>
              </div>

              {/* Metric Highlights */}
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-colors">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="flex items-center gap-1.5 font-medium">
                      <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
                      Credit Risk Pipeline
                    </span>
                    <span className="text-emerald-400 font-mono font-semibold">Tableau Live</span>
                  </div>
                  <div className="text-2xl font-mono font-bold text-white">307K+ Applicants</div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Delinquency probability & debt-to-income default stratification
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-colors">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Database className="w-3.5 h-3.5 text-indigo-400" />
                      GST Anomaly Engine
                    </span>
                    <span className="text-cyan-400 font-mono font-semibold">Postgres SQL</span>
                  </div>
                  <div className="text-2xl font-mono font-bold text-white">3-Tier Heuristic</div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Window functions detecting circular flow & volume spike fraud
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-colors">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="flex items-center gap-1.5 font-medium">
                      <LineChart className="w-3.5 h-3.5 text-emerald-400" />
                      Operational Delay Tracker
                    </span>
                    <span className="text-amber-400 font-mono font-semibold">Power BI</span>
                  </div>
                  <div className="text-2xl font-mono font-bold text-white">Real-Time Ingest</div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    APScheduler automated pipeline with risk classification
                  </div>
                </div>
              </div>

              {/* Hardware / ECE Badge */}
              <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  BIT Mesra ECE Rigor
                </span>
                <span className="text-slate-300">2022–2026</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Global Statistics Strip */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-16 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {PERSONAL_INFO.keyMetrics.map((metric, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 hover:border-slate-700 transition-colors"
            >
              <div className="text-2xl sm:text-3xl font-mono font-bold text-gradient-cyan mb-1">
                {metric.value}
              </div>
              <div className="text-sm font-semibold text-slate-200">{metric.label}</div>
              <div className="text-xs text-slate-400 mt-1">{metric.detail}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
