"use client";

import React from "react";
import { ArrowUp, FileText } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/BrandIcons";
import { usePortfolio } from "@/context/PortfolioContext";

interface FooterProps {
  onRequestResume: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onRequestResume }) => {
  const { data } = usePortfolio();
  const personalInfo = data.personalInfo;
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-white/[0.06] pt-14 pb-12 bg-[#030304]">
      <div className="max-w-5xl mx-auto px-6">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-10 border-b border-white/[0.06]">
          <div>
            <div className="text-base font-semibold text-white tracking-tight">
              Kumar Saksham<span className="text-zinc-500">.</span>
            </div>
            <p className="text-xs text-zinc-400 font-mono tracking-wider mt-1 uppercase">
              DATA · ANALYTICS · RISK · PRODUCT
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href={personalInfo.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="pill-button text-xs py-1.5 px-3.5 bg-white/[0.02]"
              title="GitHub Profile"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>

            <a
              href={personalInfo.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="pill-button text-xs py-1.5 px-3.5 bg-white/[0.02]"
              title="LinkedIn Profile"
            >
              <LinkedinIcon className="w-3.5 h-3.5" />
              <span>LinkedIn</span>
            </a>

            <button
              onClick={onRequestResume}
              className="pill-button text-xs py-1.5 px-3.5 bg-white/[0.02]"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Request Résumé</span>
            </button>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div>
            © {new Date().getFullYear()} Kumar Saksham. Defensible decisions driven by data.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
