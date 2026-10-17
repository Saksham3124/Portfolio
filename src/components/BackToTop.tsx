"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled down 350px or more
      if (window.scrollY > 350) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ duration: 0.2 }}
          onClick={scrollToTop}
          aria-label="Scroll back to top"
          title="Back to top"
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-[#0a0a0e]/85 hover:bg-white text-zinc-300 hover:text-zinc-950 border border-white/10 hover:border-white shadow-2xl backdrop-blur-md transition-all duration-200 group flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          <ArrowUp className="w-4 h-4 transition-transform duration-200 group-hover:-translate-y-0.5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
