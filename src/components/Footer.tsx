"use client";

import React from "react";
import { Mail, Phone, FileText, ArrowUp } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/BrandIcons";
import { PERSONAL_INFO } from "@/data/portfolioData";

interface FooterProps {
  onRequestResume: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onRequestResume }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-navy-950 border-t border-slate-800/80 pt-16 pb-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800/70">
          
          {/* Brand & Mission Column */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-mono font-bold text-sm">
                KS
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Kumar Saksham
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              Data, Risk, Engineering & Operations professional. Transforming high-dimensional datasets
              into defensible risk models, automated pipelines, and executive intelligence dashboards.
            </p>

            <div className="pt-2 flex items-center gap-3">
              {/* Prominent GitHub in Footer */}
              <a
                href={PERSONAL_INFO.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-cyan-500/50 transition-colors"
                title="GitHub Profile"
              >
                <GithubIcon className="w-4 h-4 text-cyan-400" />
              </a>

              <a
                href={PERSONAL_INFO.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-indigo-500/50 transition-colors"
                title="LinkedIn Profile"
              >
                <LinkedinIcon className="w-4 h-4 text-indigo-400" />
              </a>

              <a
                href={`mailto:${PERSONAL_INFO.contact.email}`}
                className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-emerald-500/50 transition-colors"
                title="Send Email"
              >
                <Mail className="w-4 h-4 text-emerald-400" />
              </a>

              <button
                onClick={onRequestResume}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/60 transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span>Request Resume</span>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li>
                <a href="#about" className="hover:text-cyan-400 transition-colors">
                  About & Background
                </a>
              </li>
              <li>
                <a href="#skills" className="hover:text-cyan-400 transition-colors">
                  Skills & Tooling
                </a>
              </li>
              <li>
                <a href="#projects" className="hover:text-cyan-400 transition-colors">
                  Featured Projects & Tableau
                </a>
              </li>
              <li>
                <a href="#achievements" className="hover:text-cyan-400 transition-colors">
                  Honors & Certifications
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-cyan-400 transition-colors">
                  Contact Form
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Direct Strip */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
              Contact & Direct Inquiries
            </h4>
            <div className="space-y-2 text-xs sm:text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <a
                  href={`mailto:${PERSONAL_INFO.contact.email}`}
                  className="hover:text-cyan-300 transition-colors font-mono"
                >
                  {PERSONAL_INFO.contact.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={`tel:${PERSONAL_INFO.contact.phone}`}
                  className="hover:text-emerald-300 transition-colors font-mono"
                >
                  {PERSONAL_INFO.contact.phone}
                </a>
              </div>
              <div className="pt-2 text-xs text-slate-400">
                Education: <strong className="text-slate-200">BIT Mesra (2022–2026)</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} Kumar Saksham. Built with Next.js, TypeScript & Tailwind CSS.
          </div>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Open to Opportunities
            </span>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
