"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  FolderGit2,
  Layers,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";
import { GithubIcon, TableauIcon } from "@/components/BrandIcons";
import { PROJECTS } from "@/data/portfolioData";

export const Projects: React.FC = () => {
  const [filter, setFilter] = useState<string>("All");

  const categories = [
    "All",
    "Risk Analytics",
    "Data Engineering",
    "BI & Reporting",
    "Full-Stack & Hardware",
  ];

  const filteredProjects =
    filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);

  return (
    <section id="projects" className="py-24 relative overflow-hidden bg-navy-950">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-400 mb-3"
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>PORTFOLIO CODEBASES & LIVE VISUALIZATIONS</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4"
          >
            Featured Projects & <span className="text-gradient-cyan">Live Deployments</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-400 text-base sm:text-lg leading-relaxed"
          >
            Real-world risk intelligence engines, automated data engineering pipelines,
            and interactive Tableau & Power BI dashboards. Complete with direct GitHub repository links.
          </motion.p>
        </div>

        {/* Filter Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                filter === cat
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25"
                  : "bg-slate-900/80 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence>
            {filteredProjects.map((project, idx) => (
              <motion.article
                key={project.id}
                layout
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="group rounded-2xl glass-panel p-6 sm:p-8 flex flex-col justify-between border border-slate-800 hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-950/20 transition-all duration-300"
              >
                <div>
                  {/* Top Bar: Category & Status Badge */}
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                    <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-md bg-slate-900 text-cyan-400 border border-slate-800">
                      {project.category}
                    </span>

                    {project.statusBadge && (
                      <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-indigo-400" />
                        {project.statusBadge}
                      </span>
                    )}
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {project.title}
                  </h3>
                  <div className="text-sm font-medium text-cyan-400/90 mb-4 font-mono">
                    {project.tagline}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-300 leading-relaxed mb-6">
                    {project.description}
                  </p>

                  {/* Architecture Highlights */}
                  <div className="mb-6 bg-slate-900/60 p-4 rounded-xl border border-slate-850">
                    <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-cyan-400" />
                      Technical & Algorithmic Highlights
                    </div>
                    <ul className="space-y-1.5">
                      {project.architectureHighlights.map((highlight, hIdx) => (
                        <li
                          key={hIdx}
                          className="text-xs text-slate-300 flex items-start gap-2"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Key Metrics Chips */}
                  {project.metrics && project.metrics.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mb-6">
                      {project.metrics.map((metric, mIdx) => (
                        <div
                          key={mIdx}
                          className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 text-center"
                        >
                          <div className="text-xs text-slate-400">{metric.label}</div>
                          <div className="text-xs sm:text-sm font-bold font-mono text-cyan-300 mt-0.5">
                            {metric.value}
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
                        className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900/80 text-slate-300 border border-slate-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Links / Buttons */}
                <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-3">
                  {/* Tableau Live Dashboard Link */}
                  {project.tableauUrl && (
                    <a
                      href={project.tableauUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-950 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 shadow-md transition-all hover:scale-102"
                      title="Open interactive Tableau Dashboard in new tab"
                    >
                      <TableauIcon className="w-4 h-4 text-slate-950" />
                      <span>Live Tableau Dashboard</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {/* GitHub Repository Link */}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/60 transition-all hover:scale-102"
                      title="View source code on GitHub"
                    >
                      <GithubIcon className="w-4 h-4 text-cyan-400" />
                      <span>GitHub Codebase</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                    </a>
                  )}

                  {/* Generic Live Demo link */}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all hover:scale-102"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Live App Demo</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {/* GitHub Repositories Banner */}
        <div className="mt-16 p-8 rounded-2xl glass-panel border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-cyan-400 shrink-0">
              <GithubIcon className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">
                Explore All 11+ Repositories & ETL Pipelines on GitHub
              </h4>
              <p className="text-xs sm:text-sm text-slate-400">
                Detailed SQL scripts, Jupyter notebooks, ETL scripts, and simulation pipelines are open for review.
              </p>
            </div>
          </div>

          <a
            href="https://github.com/Saksham3124"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold text-white bg-slate-850 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500 transition-all shadow-md group"
          >
            <span>Visit @Saksham3124 on GitHub</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

      </div>
    </section>
  );
};
