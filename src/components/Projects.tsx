"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  Layers,
} from "lucide-react";
import { GithubIcon, TableauIcon } from "@/components/BrandIcons";
import { FEATURED_PROJECTS, SUPPORTING_PROJECTS } from "@/data/portfolioData";

export const Projects: React.FC = () => {
  const [showSupporting, setShowSupporting] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const fadeUp = (delay = 0) => ({
    initial: shouldReduceMotion ? false : { opacity: 0, y: 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-40px" },
    transition: { duration: 0.45, delay, ease: "easeOut" as const },
  });

  return (
    <section id="work" className="py-24 relative border-t border-white/[0.06] bg-[#030304]">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <motion.div {...fadeUp(0)} className="text-center mb-16">
          <div className="inline-block px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-medium text-zinc-400 mb-3 font-mono">
            Flagship Projects
          </div>

          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white mb-4">
            Work & Flagship Projects
          </h2>

          <p className="text-zinc-400 text-base max-w-xl mx-auto leading-relaxed">
            Three core evidence-based projects supporting customer opportunity modeling, credit risk stratification, and forensic anomaly detection.
          </p>
        </motion.div>

        {/* 3 Primary Flagship Projects in an Evenly Balanced 3-Column Grid with Equal Visual Weight */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {FEATURED_PROJECTS.map((project, idx) => (
            <motion.article
              key={project.id}
              {...fadeUp(0.08 + idx * 0.08)}
              className="clean-card rounded-2xl p-6 sm:p-7 border border-white/[0.08] flex flex-col justify-between"
            >
              <div>
                {/* Category & Badge */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-[11px] font-mono font-medium px-2.5 py-1 rounded-full bg-white/[0.05] text-zinc-300 border border-white/10">
                    {project.category}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">
                    {project.targetRoleRelevance[0]}
                  </span>
                </div>

                {/* Title & Tagline */}
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2">
                  {project.title}
                </h3>
                <p className="text-xs font-medium text-zinc-400 mb-4 leading-relaxed">
                  {project.tagline}
                </p>

                {/* Description */}
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-6">
                  {project.description}
                </p>

                {/* Metrics Strip */}
                <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] mb-6">
                  {project.metrics.map((m, mIdx) => (
                    <div key={mIdx} className="text-center">
                      <div className="text-[10px] text-zinc-400 font-mono truncate">{m.label}</div>
                      <div className="text-xs sm:text-sm font-bold text-white mt-0.5 truncate">
                        {m.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Architecture Highlights */}
                <div className="mb-6">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-2.5 flex items-center gap-1.5">
                    <Layers className="w-3 h-3 text-zinc-400" />
                    <span>Technical Highlights</span>
                  </div>
                  <ul className="space-y-1.5">
                    {project.architectureHighlights.slice(0, 3).map((h, hIdx) => (
                      <li key={hIdx} className="text-xs text-zinc-400 flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technology Tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.03] text-zinc-400 border border-white/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Only show links that actually exist */}
              <div className="pt-4 border-t border-white/[0.07] flex flex-wrap items-center gap-2 mt-auto">
                {project.tableauUrl && (
                  <a
                    href={project.tableauUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pill-button pill-button-primary text-xs py-1.5 px-3"
                    title="View live Tableau Dashboard"
                  >
                    <TableauIcon className="w-3.5 h-3.5" />
                    <span>Tableau Dashboard</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                )}

                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pill-button text-xs py-1.5 px-3"
                    title="View GitHub Codebase"
                  >
                    <GithubIcon className="w-3.5 h-3.5 text-zinc-300" />
                    <span>GitHub Codebase</span>
                    <ArrowUpRight className="w-3 h-3 text-zinc-400" />
                  </a>
                )}
              </div>
            </motion.article>
          ))}
        </div>

        {/* Collapsible Secondary Technical Pipelines */}
        <motion.div {...fadeUp(0.24)} className="mt-14 text-center">
          <button
            onClick={() => setShowSupporting(!showSupporting)}
            className="pill-button text-xs py-2 px-5 text-zinc-400 hover:text-white"
          >
            <span>{showSupporting ? "Hide Supporting Pipelines" : "Inspect Supporting Pipelines (Rail Telemetry, Financial Modeling)"}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showSupporting ? "rotate-180" : ""}`} />
          </button>

          {showSupporting && (
            <div className="overflow-hidden mt-8 text-left space-y-4">
              {SUPPORTING_PROJECTS.map((sp) => (
                <div key={sp.id} className="clean-card p-6 rounded-xl border border-white/[0.06]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <h4 className="text-base font-semibold text-white">{sp.title}</h4>
                    <div className="flex flex-wrap gap-1">
                      {sp.targetRoleRelevance.map((r) => (
                        <span key={r} className="text-[10px] font-mono text-zinc-400 bg-white/[0.03] px-2 py-0.5 rounded border border-white/5">
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-zinc-400 mb-3">{sp.description}</p>
                  <div className="flex items-center gap-3">
                    {sp.githubUrl && (
                      <a
                        href={sp.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white"
                      >
                        <GithubIcon className="w-3.5 h-3.5" />
                        <span>View Codebase ↗</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

      </div>
    </section>
  );
};
