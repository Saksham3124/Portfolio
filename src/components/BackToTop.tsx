"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const shouldReduceMotion = useReducedMotion();

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
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.6, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.6, y: 16 }}
          whileHover={shouldReduceMotion ? {} : { scale: 1.15, rotate: -4, y: -2 }}
          whileTap={shouldReduceMotion ? {} : { scale: 0.88 }}
          transition={
            shouldReduceMotion
              ? { duration: 0.2 }
              : { type: "spring", stiffness: 420, damping: 18 }
          }
          onClick={scrollToTop}
          aria-label="Scroll back to top"
          title="Back to top"
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-[#0a0a0e]/90 hover:bg-white text-zinc-300 hover:text-zinc-950 border border-white/10 hover:border-white shadow-2xl backdrop-blur-md group flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 cursor-pointer"
        >
          <motion.div
            whileHover={shouldReduceMotion ? {} : { y: -2 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            <ArrowUp className="w-4 h-4" />
          </motion.div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};
