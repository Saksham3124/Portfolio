"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Experience } from "@/components/Experience";
import { Projects } from "@/components/Projects";
import { Education } from "@/components/Education";
import { Skills } from "@/components/Skills";
import { Certifications } from "@/components/Certifications";
import { Achievements } from "@/components/Achievements";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { RequestResumeModal } from "@/components/RequestResumeModal";
import { AnimatedBackground } from "@/components/AnimatedBackground";

export default function Home() {
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  const handleOpenResumeModal = () => {
    setIsResumeModalOpen(true);
  };

  const handleCloseResumeModal = () => {
    setIsResumeModalOpen(false);
  };

  return (
    <div className="relative min-h-screen bg-[#09090b] text-[#fafafa] selection:bg-white/20 selection:text-white">
      {/* Dynamic Animated Ambient Background */}
      <AnimatedBackground />

      {/* Top sticky navigation bar */}
      <Navbar onRequestResume={handleOpenResumeModal} />

      {/* Main page content flow */}
      <main className="relative z-10">
        {/* 1. Hero Section */}
        <Hero onRequestResume={handleOpenResumeModal} />

        {/* 2. About Me Section */}
        <About />

        {/* 3. Professional Experience (LNMIIT LUSIP 2025) */}
        <Experience />

        {/* 4. Featured Work (Strictly 3 Flagship Projects) */}
        <Projects />

        {/* 5. Education (B.Tech in ECE, BIT Mesra) */}
        <Education />

        {/* 6. Skills Matrix */}
        <Skills />

        {/* 7. Certifications & Credentials (Dedicated) */}
        <Certifications />

        {/* 8. Achievements (Selective Notable Milestones) */}
        <Achievements />

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
