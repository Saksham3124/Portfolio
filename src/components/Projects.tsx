"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  Layers,
} from "lucide-react";
import { GithubIcon, TableauIcon } from "@/components/BrandIcons";
import { FEATURED_PROJECTS, SUPPORTING_PROJECTS } from "@/data/portfolioData";
import { usePortfolio } from "@/context/PortfolioContext";

interface MetricItem {
  label: string;
  value: string;
}

const ProjectMetrics: React.FC<{ metrics: MetricItem[] }> = ({ metrics }) => {
  const isFourMetrics = metrics.length === 4;
  const shouldReduceMotion = useReducedMotion();

  const renderLabel = (label: string) => {
    if (label === "Corrupted Rows Promoted") {
      return (
        <span className="block leading-tight">
          <span className="block">Corrupted Rows</span>
          <span className="block">Promoted</span>
        </span>
      );
    }
    if (isFourMetrics) {
      const parts = label.split(" ");
      if (parts.length === 2) {
        return (
          <span className="block leading-tight">
            <span className="block">{parts[0]}</span>
            <span className="block">{parts[1]}</span>
          </span>
        );
      }
    }
    return <span className="block leading-tight">{label}</span>;
  };

  return (
    <div
      className={`grid ${
        isFourMetrics ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3"
      } gap-y-3 gap-x-1.5 sm:gap-x-2 px-2.5 py-3 sm:px-3 rounded-xl bg-white/[0.02] border border-white/[0.06] mb-6`}
    >
      {metrics.map((m, mIdx) => (
        <motion.div
          key={mIdx}
          whileHover={shouldReduceMotion ? {} : { scale: 1.05, y: -1.5 }}
          transition={{ type: "spring", stiffness: 450, damping: 18 }}
          className="flex flex-col items-center justify-between text-center min-w-0 p-1 rounded-lg hover:bg-white/[0.03] transition-colors cursor-default"
        >
          {/* Label Container: consistent min-height for uniform baseline alignment */}
          <div className="w-full min-h-[28px] sm:min-h-[30px] flex items-center justify-center text-center">
            <div
              className={`${
                isFourMetrics
                  ? "text-[8.5px] sm:text-[9.5px] xl:text-[10px]"
                  : "text-[9.5px] sm:text-[10px]"
              } text-zinc-400 font-mono tracking-tight text-center`}
            >
              {renderLabel(m.label)}
            </div>
          </div>

          {/* Value Container: bold, prominent, identical vertical baseline */}
          <div className="w-full flex items-center justify-center pt-1">
            <div className="text-xs sm:text-sm font-bold text-white tracking-tight">
              {m.value}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export const Projects: React.FC = () => {
  const [showSupporting, setShowSupporting] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const { data } = usePortfolio();
  const featuredProjects = data?.featuredProjects || FEATURED_PROJECTS;
  const supportingProjects = data?.supportingProjects || SUPPORTING_PROJECTS;

  const featuredHeading = data?.featuredProjectsHeading || "Work & Flagship Projects";
  const featuredSubtitle =
    data?.featuredProjectsSubtitle ||
    "Evidence-based projects supporting customer opportunity modeling, forensic anomaly detection, regulatory data reliability, and payment uncertainty recovery.";
  const supportingHeading = data?.supportingProjectsHeading || "Supporting Analytical Projects";
  const supportingSubtitle =
    data?.supportingProjectsSubtitle ||
    "Secondary systems and analytical pipelines (e.g. Credit Risk Scorecard Engine).";
  const supportingBtnText =
    data?.supportingProjectsButtonText ||
    "Inspect Supporting Pipelines (Credit Risk, Rail Telemetry, Financial Modeling)";

  const fadeUp = (delay = 0) => ({
    initial: shouldReduceMotion ? false : { opacity: 0, y: 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "20px" },
    transition: { duration: 0.45, delay, ease: "easeOut" as const },
  });

  return (
    <div className="py-6 sm:py-8 lg:py-10 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <motion.div {...fadeUp(0)} className="text-center mb-8 sm:mb-10">
          <div className="inline-block px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-medium text-zinc-400 mb-3 font-mono">
            {data?.featuredProjectsPill || "Flagship Projects"}
          </div>

          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white mb-4">
            {featuredHeading}
          </h2>

          <p className="text-zinc-400 text-base max-w-xl mx-auto leading-relaxed">
            {featuredSubtitle}
          </p>
        </motion.div>

        {/* Flagship Projects Grid (Balanced 2x2 on Desktop, Clean Stacking on Mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {featuredProjects.map((project, idx) => (
            <motion.article
              key={project.id}
              {...fadeUp(0.08 + idx * 0.08)}
              whileHover={shouldReduceMotion ? {} : { y: -6, scale: 1.008 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="clean-card rounded-2xl p-6 sm:p-7 border border-white/[0.08] flex flex-col justify-between"
            >
              <div>
                {/* Category & Badge */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <motion.span
                    whileHover={shouldReduceMotion ? {} : { scale: 1.05, y: -1 }}
                    transition={{ type: "spring", stiffness: 450, damping: 18 }}
                    className="text-[11px] font-mono font-medium px-2.5 py-1 rounded-full bg-white/[0.05] text-zinc-300 border border-white/10 inline-block cursor-default"
                  >
                    {project.category}
                  </motion.span>
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
                <ProjectMetrics metrics={project.metrics} />

                {/* Architecture Highlights */}
                <div className="mb-6">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-2.5 flex items-center gap-1.5">
                    <Layers className="w-3 h-3 text-zinc-400" />
                    <span>Technical Highlights</span>
                  </div>
                  <ul className="space-y-1.5">
                    {project.architectureHighlights.slice(0, 4).map((h, hIdx) => (
                      <li key={hIdx} className="text-xs text-zinc-400 flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technology Tags with Bouncy Hover Pop */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.tags.map((tag) => (
                    <motion.span
                      key={tag}
                      whileHover={shouldReduceMotion ? {} : { scale: 1.08, y: -1.5 }}
                      transition={{ type: "spring", stiffness: 450, damping: 16 }}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.03] text-zinc-400 border border-white/10 hover:border-white/30 hover:text-zinc-200 transition-colors inline-block cursor-default"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Only show links that actually exist */}
              <div className="pt-4 border-t border-white/[0.07] flex flex-wrap items-center gap-2 mt-auto">
                {project.liveUrl && (
                  <motion.a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="project"
                    whileHover={shouldReduceMotion ? {} : { scale: 1.04, y: -1.5 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
                    transition={{ type: "spring", stiffness: 450, damping: 20 }}
                    className="pill-button pill-button-primary text-xs py-1.5 px-3"
                    title="View Live Demo"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Live Demo</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </motion.a>
                )}

                {project.tableauUrl && (
                  <motion.a
                    href={project.tableauUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="project"
                    whileHover={shouldReduceMotion ? {} : { scale: 1.04, y: -1.5 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
                    transition={{ type: "spring", stiffness: 450, damping: 20 }}
                    className="pill-button pill-button-primary text-xs py-1.5 px-3"
                    title="View live Tableau Dashboard"
                  >
                    <TableauIcon className="w-3.5 h-3.5" />
                    <span>Tableau Dashboard</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </motion.a>
                )}

                {project.githubUrl && (
                  <motion.a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="project"
                    whileHover={shouldReduceMotion ? {} : { scale: 1.04, y: -1.5 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
                    transition={{ type: "spring", stiffness: 450, damping: 20 }}
                    className="pill-button text-xs py-1.5 px-3"
                    title="View GitHub Codebase"
                  >
                    <GithubIcon className="w-3.5 h-3.5 text-zinc-300" />
                    <span>GitHub Codebase</span>
                    <ArrowUpRight className="w-3 h-3 text-zinc-400" />
                  </motion.a>
                )}
              </div>
            </motion.article>
          ))}
        </div>

        {/* Collapsible Secondary Technical Pipelines */}
        <motion.div {...fadeUp(0.24)} className="mt-14 text-center">
          <motion.button
            type="button"
            onClick={() => setShowSupporting(!showSupporting)}
            aria-expanded={showSupporting}
            whileHover={shouldReduceMotion ? {} : { scale: 1.03, y: -1.5 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
            transition={{ type: "spring", stiffness: 450, damping: 20 }}
            className="group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-xs font-mono font-medium text-zinc-300 bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-white/20 hover:text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-white/30 focus-visible:border-white/30 active:bg-white/[0.05] transition-all duration-200 cursor-pointer backdrop-blur-md"
          >
            <span>{showSupporting ? "Hide Supporting Pipelines" : supportingBtnText}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-200 transition-transform duration-200 ${showSupporting ? "rotate-180" : ""}`} />
          </motion.button>

          {showSupporting && (
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="overflow-hidden mt-8 text-left space-y-4"
            >
              <div className="mb-4 pb-3 border-b border-white/[0.06]">
                <h4 className="text-sm font-semibold text-white tracking-tight">{supportingHeading}</h4>
                <p className="text-xs text-zinc-400 mt-0.5">{supportingSubtitle}</p>
              </div>
              {supportingProjects.map((sp) => (
                <motion.div
                  key={sp.id}
                  whileHover={shouldReduceMotion ? {} : { y: -3, scale: 1.008 }}
                  transition={{ type: "spring", stiffness: 350, damping: 22 }}
                  className="clean-card p-6 rounded-xl border border-white/[0.06]"
                >
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
                  <div className="flex items-center gap-4">
                    {sp.tableauUrl && (
                      <motion.a
                        href={sp.tableauUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor="project"
                        whileHover={shouldReduceMotion ? {} : { scale: 1.05, x: 2 }}
                        whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
                        transition={{ type: "spring", stiffness: 450, damping: 18 }}
                        className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                      >
                        <TableauIcon className="w-3.5 h-3.5" />
                        <span>View Dashboard ↗</span>
                      </motion.a>
                    )}
                    {sp.githubUrl && (
                      <motion.a
                        href={sp.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor="project"
                        whileHover={shouldReduceMotion ? {} : { scale: 1.05, x: 2 }}
                        whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
                        transition={{ type: "spring", stiffness: 450, damping: 18 }}
                        className="inline-flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white transition-colors cursor-pointer"
                      >
                        <GithubIcon className="w-3.5 h-3.5" />
                        <span>View Codebase ↗</span>
                      </motion.a>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>

      </div>
    </div>
  );
};
