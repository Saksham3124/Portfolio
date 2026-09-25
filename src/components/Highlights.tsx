"use client";

import React from "react";
import { IMPACT_METRICS } from "@/data/portfolioData";

export const Highlights: React.FC = () => {
  return (
    <section id="highlights" className="py-20 relative border-t border-white/[0.06] bg-[#030304]">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Section Context Header */}
        <div className="mb-12">
          <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-zinc-400 mb-2">
            Evidence & Scale
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
            Audited Portfolio Telemetry & Impact
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-xl">
            Real dataset volumes and financial scale analyzed across credit default, forensic anomaly detection, and customer segmentation systems.
          </p>
        </div>

        {/* Editorial Information Strip - Generous Spacing, Subtle Hairline Separators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-white/[0.08] py-8 border-y border-white/[0.08]">
          {IMPACT_METRICS.map((metric, i) => (
            <div
              key={i}
              className={`pt-6 md:pt-0 ${i === 0 ? "md:pr-8" : i === IMPACT_METRICS.length - 1 ? "md:pl-8" : "md:px-8"}`}
            >
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-2">
                {metric.value}
              </div>
              <div className="text-sm font-medium text-zinc-300">
                {metric.label}
              </div>
              <div className="text-xs font-mono text-zinc-400 mt-1">
                {metric.sub}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
