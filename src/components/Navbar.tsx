"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, FileText, ArrowUpRight } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/BrandIcons";
import { PERSONAL_INFO } from "@/data/portfolioData";

interface NavbarProps {
  onRequestResume: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onRequestResume }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Achievements", href: "#achievements" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-navy-950/85 backdrop-blur-md border-b border-slate-800/80 shadow-lg shadow-black/40 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo / Brand */}
          <a
            href="#"
            className="flex items-center gap-2.5 text-slate-100 hover:text-white transition-colors group"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-mono font-bold shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              KS
            </div>
            <div>
              <span className="font-semibold tracking-tight text-slate-100 text-base sm:text-lg block leading-tight">
                Kumar Saksham
              </span>
              <span className="text-[11px] font-mono text-cyan-400 tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                DATA & RISK ANALYST
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Prominent External Links & CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Prominent GitHub Button in Top Bar */}
            <a
              href={PERSONAL_INFO.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700/90 border border-slate-700/70 hover:border-slate-500 transition-all hover:scale-102"
              title="Visit GitHub Profile (@Saksham3124)"
            >
              <GithubIcon className="w-4 h-4 text-cyan-400" />
              <span>GitHub</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </a>

            {/* Prominent LinkedIn Button */}
            <a
              href={PERSONAL_INFO.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="p-1.5 rounded-lg text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700/70 hover:border-indigo-500/50 transition-all"
              title="LinkedIn Profile"
            >
              <LinkedinIcon className="w-4 h-4 text-indigo-400" />
            </a>

            {/* Dedicated Request Resume Button */}
            <button
              onClick={onRequestResume}
              className="relative inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 via-indigo-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 shadow-md shadow-indigo-500/25 hover:shadow-cyan-500/35 transition-all hover:scale-105 active:scale-95"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Request Resume</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onRequestResume}
              className="px-2.5 py-1.5 rounded-md text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 flex items-center gap-1"
            >
              <FileText className="w-3 h-3" />
              <span>Resume</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white bg-slate-800/80 border border-slate-700"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-navy-900/95 border-b border-slate-800 px-6 py-5 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-medium text-slate-200 hover:text-cyan-400 py-1"
                >
                  {link.name}
                </a>
              ))}

              <div className="pt-3 border-t border-slate-800 flex flex-col gap-3">
                <a
                  href={PERSONAL_INFO.contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800 text-slate-200 text-sm font-semibold"
                >
                  <div className="flex items-center gap-2">
                    <GithubIcon className="w-4 h-4 text-cyan-400" />
                    <span>GitHub Profile (Saksham3124)</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400" />
                </a>

                <a
                  href={PERSONAL_INFO.contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800 text-slate-200 text-sm font-semibold"
                >
                  <div className="flex items-center gap-2">
                    <LinkedinIcon className="w-4 h-4 text-indigo-400" />
                    <span>LinkedIn Profile</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400" />
                </a>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onRequestResume();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-indigo-600"
                >
                  <FileText className="w-4 h-4" />
                  <span>Request Full Resume</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
