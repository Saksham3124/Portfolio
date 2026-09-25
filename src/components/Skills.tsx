"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  Brain,
  Database,
  BarChart3,
  Cpu,
  Layers,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { SKILL_CATEGORIES } from "@/data/portfolioData";

export const Skills: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categoryIcons: Record<string, React.ReactNode> = {
    "Programming & Automation": <Code2 className="w-4 h-4" />,
    "AI & APIs": <Brain className="w-4 h-4" />,
    "Data Engineering & Cloud": <Database className="w-4 h-4" />,
    "Analytics & Tools": <BarChart3 className="w-4 h-4" />,
    "Engineering & Hardware": <Cpu className="w-4 h-4" />,
  };

  const categories = ["All", ...SKILL_CATEGORIES.map((c) => c.name)];

  const displayedCategories =
    activeCategory === "All"
      ? SKILL_CATEGORIES
      : SKILL_CATEGORIES.filter((c) => c.name === activeCategory);

  return (
    <section id="skills" className="py-24 relative overflow-hidden bg-navy-900/50">
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
            <Layers className="w-3.5 h-3.5" />
            <span>TECHNICAL CAPABILITIES</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4"
          >
            Core Competencies & <span className="text-gradient-cyan">Tooling</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-400 text-base sm:text-lg leading-relaxed"
          >
            From low-level hardware verification and algorithmic optimization in MATLAB/C++
            to modern cloud data warehouses, SQL anomaly engines, and executive BI reporting.
          </motion.p>
        </div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeCategory === category
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/60 shadow-lg shadow-cyan-500/10"
                  : "bg-slate-900/60 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              {category !== "All" && categoryIcons[category]}
              <span>{category}</span>
            </button>
          ))}
        </motion.div>

        {/* Categorized Visual Grid */}
        <div className="space-y-10">
          <AnimatePresence mode="wait">
            {displayedCategories.map((categoryGroup, groupIdx) => (
              <motion.div
                key={categoryGroup.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: groupIdx * 0.05 }}
                className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800/80"
              >
                {/* Category Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-800/80 mb-6 gap-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-900 text-cyan-400 border border-slate-700">
                      {categoryIcons[categoryGroup.name]}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white tracking-tight">
                        {categoryGroup.name}
                      </h3>
                      <p className="text-xs text-slate-400">{categoryGroup.description}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded-md border border-slate-800 self-start sm:self-auto">
                    {categoryGroup.skills.length} Capabilities
                  </span>
                </div>

                {/* Skills Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                  {categoryGroup.skills.map((skill, skillIdx) => (
                    <div
                      key={skillIdx}
                      className="group relative p-3 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-850 transition-all hover:scale-102 flex flex-col justify-between"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
                          {skill.name}
                        </span>
                        <CheckCircle className="w-3.5 h-3.5 text-cyan-400/60 group-hover:text-cyan-400 group-hover:scale-110 transition-all" />
                      </div>
                      
                      {skill.level && (
                        <div className="flex items-center justify-between mt-1">
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                              skill.level === "Expert"
                                ? "bg-cyan-950 text-cyan-300 border border-cyan-800/60"
                                : skill.level === "Advanced"
                                ? "bg-indigo-950 text-indigo-300 border border-indigo-800/60"
                                : "bg-slate-800 text-slate-300 border border-slate-700"
                            }`}
                          >
                            {skill.level}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Quick Tools Callout Footer */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-navy-900 to-slate-900 border border-slate-800 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Full-Stack Data Stack In Practice</div>
              <div className="text-xs text-slate-400">
                Explore real projects leveraging these tools with live interactive dashboards.
              </div>
            </div>
          </div>
          <a
            href="#projects"
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-cyan-500 transition-colors"
          >
            Explore Projects Below ↓
          </a>
        </div>

      </div>
    </section>
  );
};
