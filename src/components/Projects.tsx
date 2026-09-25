"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

  return (
    <section id="work" className="py-24 relative border-t border-white/[0.06]">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Section Pill */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "100px 0px 0px 0px" }}
            transition={{ duration: 0.35 }}
            className="inline-block px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-medium text-zinc-400 mb-3"
          >
            Featured Case Studies
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "100px 0px 0px 0px" }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="text-3xl sm:text-5xl font-semibold tracking-tight text-white mb-4"
          >
            Flagship Analytics & Pipelines
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "100px 0px 0px 0px" }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="text-zinc-400 text-base max-w-xl mx-auto leading-relaxed"
          >
            Three core evidence-based projects supporting risk analytics, forensic anomaly detection, 
            and customer/promotional decision modeling.
          </motion.p>
        </div>

        {/* 3 Primary Projects in Front */}
        <div className="space-y-12">
          {FEATURED_PROJECTS.map((project, idx) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "100px 0px 0px 0px" }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="clean-card rounded-2xl p-7 sm:p-10 border border-white/[0.08]"
            >
              {/* Category & Relevance Badge */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <span className="text-xs font-mono font-medium px-3 py-1 rounded-full bg-white/[0.05] text-zinc-300 border border-white/10">
                  {project.category}
                </span>

                <div className="flex flex-wrap items-center gap-1.5">
                  {project.targetRoleRelevance.map((role) => (
                    <span
                      key={role}
                      className="text-[11px] font-mono text-zinc-400 px-2.5 py-0.5 rounded-full bg-white/[0.02] border border-white/5"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              {/* Title & Tagline */}
              <h3 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight mb-2">
                {project.title}
              </h3>
              <p className="text-sm font-medium text-zinc-400 mb-6 leading-relaxed">
                {project.tagline}
              </p>

              {/* Description */}
              <p className="text-sm text-zinc-300 leading-relaxed mb-6">
                {project.description}
              </p>

              {/* Architecture & Methodology */}
              <div className="mb-6 p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Technical & Decision-Support Highlights</span>
                </div>
                <ul className="space-y-2">
                  {project.architectureHighlights.map((highlight, hIdx) => (
                    <li
                      key={hIdx}
                      className="text-xs sm:text-sm text-zinc-300 flex items-start gap-2.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Metrics Strip */}
              {project.metrics && (
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {project.metrics.map((m, mIdx) => (
                    <div
                      key={mIdx}
                      className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] text-center"
                    >
                      <div className="text-xs text-zinc-500">{m.label}</div>
                      <div className="text-sm sm:text-base font-semibold text-zinc-200 mt-0.5">
                        {m.value}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-8">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-white/[0.03] text-zinc-400 border border-white/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action Buttons: Tableau & GitHub */}
              <div className="pt-5 border-t border-white/[0.07] flex flex-wrap items-center gap-3">
                {project.tableauUrl && (
                  <a
                    href={project.tableauUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pill-button pill-button-primary text-xs"
                    title="Open live Tableau dashboard"
                  >
                    <TableauIcon className="w-4 h-4" />
                    <span>View Tableau Dashboard</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}

                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pill-button text-xs"
                    title="View GitHub repository"
                  >
                    <GithubIcon className="w-3.5 h-3.5 text-zinc-300" />
                    <span>GitHub Codebase</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500" />
                  </a>
                )}
              </div>
            </motion.article>
          ))}
        </div>

        {/* Collapsible Secondary Technical Work */}
        <div className="mt-14 text-center">
          <button
            onClick={() => setShowSupporting(!showSupporting)}
            className="pill-button text-xs py-2 px-5 text-zinc-400 hover:text-white"
          >
            <span>{showSupporting ? "Hide Supporting Pipelines" : "Inspect Supporting Pipelines (Rail Telemetry, Finance)"}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showSupporting ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {showSupporting && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden mt-8 text-left space-y-6"
              >
                {SUPPORTING_PROJECTS.map((sp) => (
                  <div key={sp.id} className="clean-card p-6 rounded-xl border border-white/[0.06]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <h4 className="text-lg font-semibold text-white">{sp.title}</h4>
                      <div className="flex flex-wrap gap-1">
                        {sp.targetRoleRelevance.map((r) => (
                          <span key={r} className="text-[10px] font-mono text-zinc-400 bg-white/[0.03] px-2 py-0.5 rounded border border-white/5">
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-zinc-400 mb-4">{sp.description}</p>
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
                      {sp.tableauUrl && (
                        <a
                          href={sp.tableauUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white"
                        >
                          <TableauIcon className="w-3.5 h-3.5" />
                          <span>Tableau Dashboard ↗</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};
