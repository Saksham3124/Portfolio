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
import { StackedCard } from "@/components/StackedCard";

interface PortfolioViewProps {
  targetSection?: string;
}

export const PortfolioView: React.FC<PortfolioViewProps> = () => {
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [heroOpacity, setHeroOpacity] = useState(1);

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

  // Graceful hero fade-out as stacked content ascends on desktop
  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === "undefined") return;
      if (window.innerWidth < 640) {
        setHeroOpacity(1);
        return;
      }

      const vh = window.innerHeight;
      const scrollY = window.scrollY;
      const fadeStart = vh * 0.35;
      const fadeEnd = vh * 0.85;

      if (scrollY <= fadeStart) {
        setHeroOpacity(1);
      } else if (scrollY >= fadeEnd) {
        setHeroOpacity(0);
      } else {
        setHeroOpacity(1 - (scrollY - fadeStart) / (fadeEnd - fadeStart));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
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

        {/* Sparse Interactive Particle Field along the Left Viewport Edge (Stationary behind central cards) */}
        <DataWaveform />

        {/* Fixed Right-side Vertical Section Navigation Rail */}
        <SectionDots />

        {/* Top sticky navigation bar */}
        <Navbar onRequestResume={handleOpenResumeModal} />

        {/* Main page content flow */}
        <main className="relative">
          {/* 1. Fixed Hero Section Container: Pinned in viewport on desktop, natural full-screen flow on mobile */}
          <div
            style={{
              opacity: heroOpacity,
              pointerEvents: heroOpacity < 0.1 ? "none" : "auto",
              transition: "opacity 0.15s ease-out",
            }}
            className="relative sm:sticky sm:top-0 min-h-[100svh] sm:h-screen w-full z-0 sm:overflow-hidden"
          >
            <Hero onRequestResume={handleOpenResumeModal} />
          </div>

          {/* 2. Central Content Column: Distinct Fixed-Frame Stacked Cards */}
          <div className="relative z-20 w-full max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 xl:pr-24 pt-6 pb-20 space-y-10 sm:space-y-14 lg:space-y-20">
            {/* Card 1: About Me & Evidence Telemetry */}
            <StackedCard id="about" index={0} zIndex={10} nextCardId="experience">
              <About />
              <Highlights />
            </StackedCard>

            {/* Card 2: Research & Industry Experience */}
            <StackedCard id="experience" index={1} zIndex={12} nextCardId="work">
              <Experience />
            </StackedCard>

            {/* Card 3: Selected Flagship & Supporting Engineering Projects */}
            <StackedCard id="work" index={2} zIndex={14} nextCardId="education">
              <Projects />
            </StackedCard>

            {/* Card 4: Academic Foundation & Coursework */}
            <StackedCard id="education" index={3} zIndex={16} nextCardId="skills">
              <Education />
            </StackedCard>

            {/* Card 5: Technical Tooling & Capabilities */}
            <StackedCard id="skills" index={4} zIndex={18} nextCardId="credentials">
              <Skills />
            </StackedCard>

            {/* Card 6: Verified Credentials & Honors */}
            <StackedCard id="credentials" index={5} zIndex={20} nextCardId="contact">
              <Credentials />
            </StackedCard>

            {/* Card 7: Direct Contact & Closing Deck Footer */}
            <StackedCard id="contact" index={6} zIndex={22}>
              <Contact onRequestResume={handleOpenResumeModal} />
              <Footer onRequestResume={handleOpenResumeModal} />
            </StackedCard>
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
