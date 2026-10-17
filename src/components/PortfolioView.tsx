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
import { DataWaveform } from "@/components/DataWaveform";

interface PortfolioViewProps {
  targetSection?: string;
}

export const PortfolioView: React.FC<PortfolioViewProps> = () => {
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }

      // Detect any incoming section hash, strip it from the URL without creating a history entry, and start at top
      const recognizedHashes = [
        "#about",
        "#experience",
        "#work",
        "#projects",
        "#education",
        "#skills",
        "#credentials",
        "#contact",
        "#highlights",
      ];
      const hash = (window.location.hash || "").toLowerCase();
      if (hash && recognizedHashes.includes(hash)) {
        window.history.replaceState(null, "", window.location.pathname);
      }
      window.scrollTo(0, 0);
    }
  }, []);

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

        {/* Sparse Interactive Particle Field along the Left Viewport Edge */}
        <DataWaveform />

        {/* Fixed Right-side Vertical Section Navigation Rail */}
        <SectionDots />

        {/* Top sticky navigation bar */}
        <Navbar onRequestResume={handleOpenResumeModal} />

        {/* Main page content flow */}
        <main className="relative">
          {/* 1. Fixed Hero Section Container: Pinned in viewport on desktop, natural full-screen flow on mobile */}
          <div className="relative sm:sticky sm:top-0 min-h-[100svh] sm:h-screen w-full z-0 sm:overflow-hidden">
            <Hero onRequestResume={handleOpenResumeModal} />
          </div>

          {/* 2. Sliding Bottom Content: Climbs smoothly over the fixed Hero */}
          <div className="relative z-20 bg-[#030304]">
            {/* 2. About Me Section - Styled as an elevated card with rounded top shoulders */}
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

            {/* Global Footer */}
            <Footer onRequestResume={handleOpenResumeModal} />
          </div>
        </main>

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
