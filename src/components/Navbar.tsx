"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Menu, X, FileText, ArrowUpRight } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/BrandIcons";
import { usePortfolio } from "@/context/PortfolioContext";

interface NavbarProps {
  onRequestResume: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onRequestResume }) => {
  const { data } = usePortfolio();
  const personalInfo = data.personalInfo;
  const shouldReduceMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("hero");

  const navLinks = [
    { name: "About", href: "/about", id: "about" },
    { name: "Experience", href: "/experience", id: "experience" },
    { name: "Work", href: "/work", id: "work" },
    { name: "Education", href: "/education", id: "education" },
    { name: "Skills", href: "/skills", id: "skills" },
    { name: "Credentials", href: "/credentials", id: "credentials" },
    { name: "Contact", href: "/contact", id: "contact" },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", href);
    } else {
      window.location.href = href;
    }
  };

  // Active section scroll spy
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // If near very top, default to hero
      if (window.scrollY < 180) {
        setActiveSection("hero");
        return;
      }

      // If scrolled to the bottom of the page, highlight contact
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 70) {
        setActiveSection("contact");
        return;
      }

      const sections = [
        { id: "about", navId: "about" },
        { id: "highlights", navId: "about" },
        { id: "experience", navId: "experience" },
        { id: "work", navId: "work" },
        { id: "education", navId: "education" },
        { id: "skills", navId: "skills" },
        { id: "credentials", navId: "credentials" },
        { id: "contact", navId: "contact" },
      ];

      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 260 && rect.bottom >= 140) {
            setActiveSection(section.navId);
            return;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#030304]/85 backdrop-blur-md border-b border-white/[0.08] shadow-sm py-2.5"
          : "bg-transparent py-4 sm:py-5"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand */}
          <a
            href="/"
            onClick={(e) => {
              if (window.location.pathname === "/" || window.location.pathname === "") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
                window.history.pushState(null, "", "/");
              }
            }}
            className="flex items-center gap-2 text-zinc-100 hover:text-white transition-colors group"
          >
            <span className="font-semibold tracking-tight text-base sm:text-lg">
              Kumar Saksham<span className="text-zinc-500">.</span>
            </span>
          </a>

          {/* Desktop Nav Links with Active Section Spy Highlight */}
          <nav className="hidden lg:flex items-center gap-1.5 p-1 rounded-full bg-white/[0.02] border border-white/[0.06]">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href, link.id)}
                  whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 450, damping: 18 }}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors duration-200 relative cursor-pointer ${
                    isActive
                      ? "text-white bg-white/10 shadow-sm border border-white/15"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
                  }`}
                >
                  {link.name}
                </motion.a>
              );
            })}
          </nav>

          {/* Prominent External Links & CTA */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Prominent GitHub Button in Sticky Top Bar */}
            <motion.a
              href={personalInfo.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="view"
              whileHover={shouldReduceMotion ? {} : { scale: 1.05, y: -1 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
              transition={{ type: "spring", stiffness: 450, damping: 18 }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-zinc-300 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 transition-colors cursor-pointer"
              title="Visit GitHub"
            >
              <GithubIcon className="w-3.5 h-3.5 text-zinc-200" />
              <span>GitHub</span>
              <ArrowUpRight className="w-3 h-3 text-zinc-500" />
            </motion.a>

            {/* LinkedIn Icon Button */}
            <motion.a
              href={personalInfo.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="view"
              whileHover={shouldReduceMotion ? {} : { scale: 1.12, rotate: -4 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.9 }}
              transition={{ type: "spring", stiffness: 500, damping: 16 }}
              className="p-1.5 rounded-full text-zinc-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 transition-colors cursor-pointer"
              title="LinkedIn Profile"
              aria-label="LinkedIn Profile"
            >
              <LinkedinIcon className="w-3.5 h-3.5" />
            </motion.a>

            {/* Request Resume Button */}
            <motion.button
              onClick={onRequestResume}
              whileHover={shouldReduceMotion ? {} : { scale: 1.05, y: -1 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
              transition={{ type: "spring", stiffness: 450, damping: 20 }}
              className="inline-flex items-center gap-1.5 text-xs py-1.5 px-4 rounded-full bg-white text-zinc-950 hover:text-black font-semibold hover:bg-zinc-200 border border-white cursor-pointer shadow-sm transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Request Résumé</span>
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <motion.button
              onClick={onRequestResume}
              whileHover={shouldReduceMotion ? {} : { scale: 1.04 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-zinc-950 hover:text-black bg-white hover:bg-zinc-200 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <FileText className="w-3 h-3" />
              <span>Résumé</span>
            </motion.button>
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileTap={shouldReduceMotion ? {} : { scale: 0.92 }}
              className="p-2 rounded-lg text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </motion.button>
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
            className="lg:hidden bg-[#030304]/95 border-b border-zinc-800 px-6 py-5 shadow-2xl backdrop-blur-2xl"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => {
                      setMobileMenuOpen(false);
                      handleNavClick(e, link.href, link.id);
                    }}
                    className={`text-sm font-medium py-1.5 px-3 rounded-lg transition-colors flex items-center justify-between ${
                      isActive
                        ? "text-white bg-white/10 font-semibold"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <span>{link.name}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                  </a>
                );
              })}

              <div className="pt-4 border-t border-zinc-800 flex flex-col gap-2.5">
                <a
                  href={personalInfo.contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="view"
                  className="flex items-center justify-between px-3.5 py-2 rounded-lg bg-zinc-900 text-zinc-200 text-xs font-medium border border-zinc-800"
                >
                  <div className="flex items-center gap-2">
                    <GithubIcon className="w-4 h-4 text-zinc-300" />
                    <span>GitHub</span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500" />
                </a>

                <a
                  href={personalInfo.contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="view"
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
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold text-zinc-950 hover:text-black bg-white hover:bg-zinc-200 transition-colors"
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
