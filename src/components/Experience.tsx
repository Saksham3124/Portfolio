"use client";

import React from "react";
import { Calendar, MapPin, CheckCircle2 } from "lucide-react";
import { EXPERIENCE } from "@/data/portfolioData";

export const Experience: React.FC = () => {
  return (
    <section id="experience" className="py-24 relative border-t border-white/[0.06] bg-[#030304]">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-block px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-medium text-zinc-400 mb-3 font-mono">
            Professional Experience
          </div>

          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-4">
            Research & Industry Experience
          </h2>

          <p className="text-zinc-400 text-base max-w-xl mx-auto leading-relaxed">
            Rigorous hands-on algorithmic problem solving and quantitative research.
          </p>
        </div>

        {/* Experience Cards */}
        <div className="space-y-6">
          {EXPERIENCE.map((exp) => (
            <div
              key={exp.id}
              className="clean-card p-7 sm:p-8 rounded-2xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4 pb-4 border-b border-white/[0.07]">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-zinc-400 px-2 py-0.5 rounded bg-white/[0.05] border border-white/10">
                      {exp.program}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-white tracking-tight">
                    {exp.role}
                  </h3>
                  <div className="text-sm font-medium text-zinc-300 mt-0.5">
                    {exp.organization}
                  </div>
                </div>

                <div className="flex flex-col sm:items-end text-xs text-zinc-400 font-mono gap-1">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                    {exp.period}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                    {exp.location}
                  </span>
                </div>
              </div>

              {/* Summary */}
              <p className="text-sm text-zinc-300 leading-relaxed mb-5">
                {exp.summary}
              </p>

              {/* Bullet points */}
              <div className="space-y-2 mb-6">
                {exp.highlights.map((highlight, hIdx) => (
                  <div key={hIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/[0.06]">
                {exp.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-white/[0.03] text-zinc-400 border border-white/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
