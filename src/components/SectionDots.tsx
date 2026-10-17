"use client";

import React, { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface SectionItem {
  id: string;
  num: string;
  name: string;
}

const SECTIONS: SectionItem[] = [
  { id: "about", num: "01", name: "About" },
  { id: "experience", num: "02", name: "Experience" },
  { id: "work", num: "03", name: "Projects" },
  { id: "education", num: "04", name: "Education" },
  { id: "skills", num: "05", name: "Skills" },
  { id: "credentials", num: "06", name: "Credentials" },
  { id: "contact", num: "07", name: "Contact" },
];

export const SectionDots: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("");
  const [isVisible, setIsVisible] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      // Hide rail when hero section is visible; reveal once hero section begins exiting (>= 70% of viewport height)
      const heroCoveredThreshold = window.innerHeight * 0.70;
      if (window.scrollY < heroCoveredThreshold) {
        setIsVisible(false);
        setActiveSection("");
        return;
      }

      setIsVisible(true);

      // If scrolled to bottom of page, activate contact
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 80
      ) {
        setActiveSection("contact");
        return;
      }

      // Check section bounding rects for highest active accuracy
      let currentActive = "about";
      for (const sec of SECTIONS) {
        const el = document.getElementById(sec.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (
            rect.top <= window.innerHeight * 0.42 &&
            rect.bottom >= window.innerHeight * 0.18
          ) {
            currentActive = sec.id;
            break;
          }
        }
      }
      setActiveSection(currentActive);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      const targetPath = id === "work" ? "/projects" : `/${id}`;
      window.history.pushState(null, "", targetPath);
    }
  };

  return (
    <motion.nav
      aria-label="Section navigation rail"
      initial={false}
      animate={
        isVisible
          ? { opacity: 1, x: 0, pointerEvents: "auto" }
          : { opacity: 0, x: 44, pointerEvents: "none" }
      }
      transition={
        shouldReduceMotion
          ? { duration: 0.2 }
          : {
              type: "spring",
              stiffness: 340,
              damping: 24,
              mass: 0.8,
            }
      }
      className="fixed right-6 sm:right-8 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-end select-none"
    >
      {/* 
        Open Vertical Rail:
        - Continuous thin muted line running through the center of all markers
        - No bulky background container pill
      */}
      <div className="relative flex flex-col items-end py-1">
        {/* Continuous thin vertical line in muted grey */}
        <div
          aria-hidden="true"
          className="absolute right-[5px] top-2 bottom-2 w-[1px] bg-white/10 pointer-events-none"
        />

        {SECTIONS.map((sec) => {
          const isActive = activeSection === sec.id;
          return (
            <motion.a
              key={sec.id}
              href={`#${sec.id}`}
              onClick={(e) => scrollToSection(sec.id, e)}
              whileHover={shouldReduceMotion ? {} : { x: -2 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.94 }}
              transition={{ type: "spring", stiffness: 450, damping: 20 }}
              className="group relative flex items-center justify-end py-3 pr-0 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-400 focus-visible:rounded"
              aria-label={`Jump to section ${sec.num}: ${sec.name}`}
              aria-current={isActive ? "true" : undefined}
            >
              {/* Persistent Number and Name Label to the left of the rail on desktop */}
              <div className="flex items-center gap-1.5 mr-3 whitespace-nowrap transition-all duration-200 pointer-events-none">
                <span
                  className={`font-mono text-[9px] tracking-wider transition-colors duration-200 ${
                    isActive
                      ? "text-blue-400 font-semibold"
                      : "text-zinc-600 group-hover:text-zinc-400"
                  }`}
                >
                  {sec.num}
                </span>
                <span
                  className={`font-mono text-[9.5px] tracking-widest uppercase transition-colors duration-200 ${
                    isActive
                      ? "text-white font-semibold drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                      : "text-zinc-500 group-hover:text-zinc-300"
                  }`}
                >
                  {sec.name}
                </span>
              </div>

              {/* Circular Rail Marker Centered on the Line */}
              <div className="w-[11px] h-[11px] flex items-center justify-center relative z-10">
                <span
                  className={`rounded-full transition-all duration-200 ${
                    isActive
                      ? "w-2.5 h-2.5 bg-blue-400 shadow-[0_0_10px_rgba(56,189,248,0.85)] ring-4 ring-blue-500/25 scale-100"
                      : "w-1.5 h-1.5 bg-zinc-600 group-hover:bg-zinc-300 group-hover:scale-125"
                  }`}
                />
              </div>
            </motion.a>
          );
        })}
      </div>
    </motion.nav>
  );
};
