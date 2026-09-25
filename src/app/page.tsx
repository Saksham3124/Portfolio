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

export default function Home() {
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  // Fix scroll position on browser refresh: always start at the top unless an anchor hash is explicitly targeted
  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      if (!window.location.hash) {
        window.scrollTo(0, 0);
      }
    }
  }, []);

  const handleOpenResumeModal = () => {
    setIsResumeModalOpen(true);
  };

  const handleCloseResumeModal = () => {
    setIsResumeModalOpen(false);
  };

  return (
    <div className="relative min-h-screen bg-[#030304] text-[#fafafa] selection:bg-white/20 selection:text-white">
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

        {/* 3. Evidence & Scale (Impact Metrics) */}
        <Highlights />

        {/* 4. Professional Experience (LNMIIT LUSIP 2025) */}
        <Experience />

        {/* 5. Featured Work (Strictly 3 Flagship Projects) */}
        <Projects />

        {/* 6. Education (B.Tech in ECE, BIT Mesra) */}
        <Education />

        {/* 7. Skills Matrix */}
        <Skills />

        {/* 8. Credentials & Achievements (Unified) */}
        <Credentials />

        {/* 9. Contact & Inquiries */}
        <Contact onRequestResume={handleOpenResumeModal} />
      </main>

      {/* Footer */}
      <Footer onRequestResume={handleOpenResumeModal} />

      {/* Dedicated Request Resume Modal */}
      <RequestResumeModal
        isOpen={isResumeModalOpen}
        onClose={handleCloseResumeModal}
      />
    </div>
  );
}
