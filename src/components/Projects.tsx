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
            Flagship Projects
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "100px 0px 0px 0px" }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="text-3xl sm:text-5xl font-semibold tracking-tight text-white mb-4"
          >
            Work & Flagship Projects
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

        {/* Bento Box Layout for 3 Flagship Projects */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Bento Card 1: Credit Risk Analytics (Full width span) */}
          {FEATURED_PROJECTS[0] && (
            <motion.article
              key={FEATURED_PROJECTS[0].id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "100px 0px 0px 0px" }}
              transition={{ duration: 0.35 }}
              className="lg:col-span-2 clean-card rounded-2xl p-7 sm:p-10 border border-white/[0.08] flex flex-col justify-between"
            >
              <div>
                {/* Category & Relevance Badge */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <span className="text-xs font-mono font-medium px-3 py-1 rounded-full bg-white/[0.05] text-zinc-300 border border-white/10">
                    {FEATURED_PROJECTS[0].category}
                  </span>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {FEATURED_PROJECTS[0].targetRoleRelevance.map((role) => (
                      <span
                        key={role}
                        className="text-[11px] font-mono text-zinc-400 px-2.5 py-0.5 rounded-full bg-white/[0.02] border border-white/5"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
                  {/* Left Column: Title, Tagline, Description */}
                  <div className="lg:col-span-7">
                    <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
                      {FEATURED_PROJECTS[0].title}
                    </h3>
                    <p className="text-sm font-medium text-zinc-400 mb-4 leading-relaxed">
                      {FEATURED_PROJECTS[0].tagline}
                    </p>
                    <p className="text-sm text-zinc-300 leading-relaxed mb-5">
                      {FEATURED_PROJECTS[0].description}
                    </p>

                    {/* Architecture & Methodology */}
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                      <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2.5 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Core Architecture & Modeling</span>
                      </div>
                      <ul className="space-y-1.5">
                        {FEATURED_PROJECTS[0].architectureHighlights.map((highlight, hIdx) => (
                          <li
                            key={hIdx}
                            className="text-xs sm:text-sm text-zinc-300 flex items-start gap-2"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-400/80 shrink-0 mt-0.5" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Right Column: Stats & Tags */}
                  <div className="lg:col-span-5 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        {FEATURED_PROJECTS[0].metrics.map((m, mIdx) => (
                          <div
                            key={mIdx}
                            className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]"
                          >
                            <div className="text-[11px] text-zinc-500 font-mono">{m.label}</div>
                            <div className="text-base sm:text-lg font-bold text-white mt-0.5">
                              {m.value}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Tags */}
                      <div>
                        <div className="text-[11px] text-zinc-500 font-mono mb-2">Stack & Capabilities</div>
                        <div className="flex flex-wrap gap-1.5">
                          {FEATURED_PROJECTS[0].tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-white/[0.03] text-zinc-400 border border-white/10"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Tableau & GitHub */}
              <div className="pt-5 border-t border-white/[0.07] flex flex-wrap items-center gap-3">
                <a
                  href={FEATURED_PROJECTS[0].tableauUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pill-button pill-button-primary text-xs"
                  title="Open live Tableau dashboard"
                >
                  <TableauIcon className="w-4 h-4" />
                  <span>View Tableau Dashboard</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>

                <a
                  href={FEATURED_PROJECTS[0].githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pill-button text-xs"
                  title="View GitHub repository"
                >
                  <GithubIcon className="w-3.5 h-3.5 text-zinc-300" />
                  <span>GitHub Codebase</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500" />
                </a>
              </div>
            </motion.article>
          )}

          {/* Bento Card 2: GST Invoice Anomaly Detection */}
          {FEATURED_PROJECTS[1] && (
            <motion.article
              key={FEATURED_PROJECTS[1].id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "100px 0px 0px 0px" }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="clean-card rounded-2xl p-7 sm:p-8 border border-white/[0.08] flex flex-col justify-between"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-mono font-medium px-3 py-1 rounded-full bg-white/[0.05] text-zinc-300 border border-white/10">
                    {FEATURED_PROJECTS[1].category}
                  </span>
                  <span className="text-[11px] font-mono text-zinc-400">
                    3-Layer Rules
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2">
                  {FEATURED_PROJECTS[1].title}
                </h3>
                <p className="text-xs sm:text-sm font-medium text-zinc-400 mb-4 leading-relaxed">
                  {FEATURED_PROJECTS[1].tagline}
                </p>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-5">
                  {FEATURED_PROJECTS[1].description}
                </p>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-2.5 mb-5">
                  {FEATURED_PROJECTS[1].metrics.map((m, mIdx) => (
                    <div
                      key={mIdx}
                      className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06] text-center"
                    >
                      <div className="text-[10px] text-zinc-500 font-mono truncate">{m.label}</div>
                      <div className="text-xs sm:text-sm font-semibold text-zinc-200 mt-0.5 truncate">
                        {m.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {FEATURED_PROJECTS[1].tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/[0.03] text-zinc-400 border border-white/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-white/[0.07] flex flex-wrap items-center gap-2.5">
                <a
                  href={FEATURED_PROJECTS[1].tableauUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pill-button pill-button-primary text-xs py-1.5 px-3"
                  title="Open live Tableau dashboard"
                >
                  <TableauIcon className="w-3.5 h-3.5" />
                  <span>View Tableau Dashboard</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>

                <a
                  href={FEATURED_PROJECTS[1].githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pill-button text-xs py-1.5 px-3"
                  title="View GitHub repository"
                >
                  <GithubIcon className="w-3.5 h-3.5 text-zinc-300" />
                  <span>GitHub Codebase</span>
                  <ArrowUpRight className="w-3 h-3 text-zinc-500" />
                </a>
              </div>
            </motion.article>
          )}

          {/* Bento Card 3: Promotional Opportunity & Customer Segmentation Analysis */}
          {FEATURED_PROJECTS[2] && (
            <motion.article
              key={FEATURED_PROJECTS[2].id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "100px 0px 0px 0px" }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="clean-card rounded-2xl p-7 sm:p-8 border border-white/[0.08] flex flex-col justify-between"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-mono font-medium px-3 py-1 rounded-full bg-white/[0.05] text-zinc-300 border border-white/10">
                    {FEATURED_PROJECTS[2].category}
                  </span>
                  <span className="text-[11px] font-mono text-zinc-400">
                    AWS Athena & S3
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2">
                  {FEATURED_PROJECTS[2].title}
                </h3>
                <p className="text-xs sm:text-sm font-medium text-zinc-400 mb-4 leading-relaxed">
                  {FEATURED_PROJECTS[2].tagline}
                </p>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-5">
                  {FEATURED_PROJECTS[2].description}
                </p>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-2.5 mb-5">
                  {FEATURED_PROJECTS[2].metrics.map((m, mIdx) => (
                    <div
                      key={mIdx}
                      className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06] text-center"
                    >
                      <div className="text-[10px] text-zinc-500 font-mono truncate">{m.label}</div>
                      <div className="text-xs sm:text-sm font-semibold text-zinc-200 mt-0.5 truncate">
                        {m.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {FEATURED_PROJECTS[2].tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/[0.03] text-zinc-400 border border-white/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-white/[0.07] flex flex-wrap items-center gap-2.5">
                <a
                  href={FEATURED_PROJECTS[2].tableauUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pill-button pill-button-primary text-xs py-1.5 px-3"
                  title="Open live Tableau dashboard"
                >
                  <TableauIcon className="w-3.5 h-3.5" />
                  <span>View Tableau Dashboard</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>

                <a
                  href={FEATURED_PROJECTS[2].githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pill-button text-xs py-1.5 px-3"
                  title="View GitHub repository"
                >
                  <GithubIcon className="w-3.5 h-3.5 text-zinc-300" />
                  <span>GitHub Codebase</span>
                  <ArrowUpRight className="w-3 h-3 text-zinc-500" />
                </a>
              </div>
            </motion.article>
          )}

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
