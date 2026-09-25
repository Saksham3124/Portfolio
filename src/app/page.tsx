"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { Achievements } from "@/components/Achievements";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { RequestResumeModal } from "@/components/RequestResumeModal";

export default function Home() {
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  const handleOpenResumeModal = () => {
    setIsResumeModalOpen(true);
  };

  const handleCloseResumeModal = () => {
    setIsResumeModalOpen(false);
  };

  return (
    <div className="relative min-h-screen bg-[#060913] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top sticky navigation bar */}
      <Navbar onRequestResume={handleOpenResumeModal} />

      {/* Main page content */}
      <main>
        {/* 1. Hero Section */}
        <Hero onRequestResume={handleOpenResumeModal} />

        {/* 2. About Me Section */}
        <About />

        {/* 3. Skills Matrix Section */}
        <Skills />

        {/* 4. Projects & Live Visualizations */}
        <Projects />

        {/* 5. Achievements & Certifications */}
        <Achievements />

        {/* 6. Contact & Reach Out Section */}
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
