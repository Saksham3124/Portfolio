"use client";

import React, { useState, useEffect } from "react";

interface SectionItem {
  id: string;
  name: string;
}

const SECTIONS: SectionItem[] = [
  { id: "about", name: "About" },
  { id: "highlights", name: "Highlights" },
  { id: "experience", name: "Experience" },
  { id: "work", name: "Projects" },
  { id: "education", name: "Education" },
  { id: "skills", name: "Skills" },
  { id: "credentials", name: "Credentials" },
  { id: "contact", name: "Contact" },
];

export const SectionDots: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Hide dots when in the hero section (< 300px from top)
      if (window.scrollY < 260) {
        setIsVisible(false);
        setActiveSection("");
        return;
      }

      setIsVisible(true);

      // If scrolled to very bottom of page, highlight contact
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 80) {
        setActiveSection("contact");
        return;
      }

      // Check section bounding rects
      for (const sec of SECTIONS) {
        const el = document.getElementById(sec.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.4 && rect.bottom >= window.innerHeight * 0.2) {
            setActiveSection(sec.id);
            return;
          }
        }
      }
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
    }
  };

  return (
    <aside
      aria-label="Section Navigation"
      className={`fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-3 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="p-2 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md flex flex-col gap-2.5">
        {SECTIONS.map((sec) => {
          const isActive = activeSection === sec.id;
          return (
            <a
              key={sec.id}
              href={`#${sec.id}`}
              onClick={(e) => scrollToSection(sec.id, e)}
              className="group relative flex items-center justify-center p-1"
              aria-label={`Jump to ${sec.name}`}
            >
              {/* Tooltip Label */}
              <div className="absolute right-7 px-2 py-1 rounded bg-[#0e0e12] border border-white/10 text-[10px] font-mono text-zinc-200 tracking-wide whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none shadow-lg">
                {sec.name}
              </div>

              {/* Dot Indicator */}
              <span
                className={`transition-all duration-200 rounded-full ${
                  isActive
                    ? "w-2 h-2 bg-white ring-2 ring-white/30 scale-110"
                    : "w-1.5 h-1.5 bg-zinc-600 group-hover:bg-zinc-300 group-hover:scale-125"
                }`}
              />
            </a>
          );
        })}
      </div>
    </aside>
  );
};
