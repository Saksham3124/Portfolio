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
    { name: "Experience", href: "#experience" },
    { name: "Work", href: "#work" },
    { name: "Education", href: "#education" },
    { name: "Skills", href: "#skills" },
    { name: "Credentials", href: "#credentials" },
    { name: "Achievements", href: "#achievements" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#09090b]/85 backdrop-blur-md border-b border-white/[0.08] shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand */}
          <a
            href="#"
            className="flex items-center gap-2 text-zinc-100 hover:text-white transition-colors group"
          >
            <span className="font-semibold tracking-tight text-base sm:text-lg">
              Kumar Saksham<span className="text-zinc-500">.</span>
            </span>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs sm:text-[13px] font-medium text-zinc-400 hover:text-white transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Prominent External Links & CTA */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Prominent GitHub Button in Sticky Top Bar */}
            <a
              href={PERSONAL_INFO.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-zinc-300 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 transition-all"
              title="Visit GitHub (@Saksham3124)"
            >
              <GithubIcon className="w-3.5 h-3.5 text-zinc-200" />
              <span>GitHub</span>
              <ArrowUpRight className="w-3 h-3 text-zinc-500" />
            </a>

            {/* LinkedIn Icon Button */}
            <a
              href={PERSONAL_INFO.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-full text-zinc-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 transition-all"
              title="LinkedIn Profile"
              aria-label="LinkedIn Profile"
            >
              <LinkedinIcon className="w-3.5 h-3.5" />
            </a>

            {/* Request Resume Button */}
            <button
              onClick={onRequestResume}
              className="pill-button text-xs py-1.5 px-4 bg-white text-zinc-950 font-medium hover:bg-zinc-200 border-white"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Request Résumé</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onRequestResume}
              className="px-3 py-1.5 rounded-full text-xs font-medium text-zinc-950 bg-white hover:bg-zinc-200 flex items-center gap-1"
            >
              <FileText className="w-3 h-3" />
              <span>Résumé</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="lg:hidden bg-[#09090b]/95 border-b border-zinc-800 px-6 py-5 shadow-2xl backdrop-blur-2xl"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium text-zinc-300 hover:text-white py-1"
                >
                  {link.name}
                </a>
              ))}

              <div className="pt-4 border-t border-zinc-800 flex flex-col gap-2.5">
                <a
                  href={PERSONAL_INFO.contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-3.5 py-2 rounded-lg bg-zinc-900 text-zinc-200 text-xs font-medium border border-zinc-800"
                >
                  <div className="flex items-center gap-2">
                    <GithubIcon className="w-4 h-4 text-zinc-300" />
                    <span>GitHub (@Saksham3124)</span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500" />
                </a>

                <a
                  href={PERSONAL_INFO.contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-3.5 py-2 rounded-lg bg-zinc-900 text-zinc-200 text-xs font-medium border border-zinc-800"
                >
                  <div className="flex items-center gap-2">
                    <LinkedinIcon className="w-4 h-4 text-zinc-300" />
                    <span>LinkedIn</span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500" />
                </a>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onRequestResume();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold text-zinc-950 bg-white hover:bg-zinc-200"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Request Official Résumé</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
