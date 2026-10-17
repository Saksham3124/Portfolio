"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Highlights } from "@/components/Highlights";
import { Experience } from "@/components/Experience";
import { Projects } from "@/components/Projects";
import { Education } from "@/components/Education";
import { Skills } from "@/components/Skills";
import { Credentials } from "@/components/Credentials";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { RequestResumeModal } from "@/components/RequestResumeModal";
import { SectionDots } from "@/components/SectionDots";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { BackToTop } from "@/components/BackToTop";
import { PointerProvider } from "@/context/PointerContext";
import { CustomCursor } from "@/components/CustomCursor";
import { InteractiveMascot } from "@/components/InteractiveMascot";

interface PortfolioViewProps {
  targetSection?: string;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({ targetSection }) => {
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }

      if (targetSection) {
        // Allow DOM to settle before scrolling directly to target section
        const timer = setTimeout(() => {
          const el = document.getElementById(targetSection);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 120);
        return () => clearTimeout(timer);
      } else if (!window.location.hash) {
        window.scrollTo(0, 0);
      }
    }
  }, [targetSection]);

  const handleOpenResumeModal = () => {
    setIsResumeModalOpen(true);
  };

  const handleCloseResumeModal = () => {
    setIsResumeModalOpen(false);
  };

  return (
    <PointerProvider>
      <div className="relative min-h-screen bg-[#030304] text-[#fafafa] selection:bg-white/20 selection:text-white">
        {/* Custom Interactive Desktop Cursor */}
        <CustomCursor />

        {/* Dynamic Animated Ambient Background */}
        <AnimatedBackground />

        {/* Fixed Right-side Vertical Section Dots for Desktop */}
        <SectionDots />

        {/* Top sticky navigation bar */}
        <Navbar onRequestResume={handleOpenResumeModal} />

        {/* Main page content flow */}
        <main className="relative z-10">
          {/* 1. Hero Section */}
          <Hero onRequestResume={handleOpenResumeModal} />

          {/* 2. About Me Section */}
          <About />

          {/* 3. Evidence & Scale Counter Telemetry Section */}
          <Highlights />

          {/* 4. Experience & Research Section */}
          <Experience />

          {/* 5. Selected Flagship & Supporting Engineering Projects */}
          <Projects />

          {/* 6. Academic Background Section */}
          <Education />

          {/* 7. Technical Skills & Tools Matrix */}
          <Skills />

          {/* 8. Verified Credentials & Honors */}
          <Credentials />

          {/* 9. Direct Contact & Communication Form */}
          <Contact onRequestResume={handleOpenResumeModal} />
        </main>

        {/* Global Footer */}
        <Footer onRequestResume={handleOpenResumeModal} />

        {/* Interactive 3D Mechanical Mascot (appears after hero, fixed at left vertical midpoint) */}
        <InteractiveMascot />

        {/* Sticky Bottom-Right Quick Back to Top Bubble */}
        <BackToTop />

        {/* Global Tailored Resume Request Form Modal */}
        <RequestResumeModal
          isOpen={isResumeModalOpen}
          onClose={handleCloseResumeModal}
        />
      </div>
    </PointerProvider>
  );
};
