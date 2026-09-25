"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  FileText,
  Mail,
  Send,
  Building2,
  User,
  CheckCircle,
  Copy,
  Check,
  ShieldCheck,
} from "lucide-react";
import confetti from "canvas-confetti";
import { PERSONAL_INFO } from "@/data/portfolioData";

interface RequestResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RequestResumeModal: React.FC<RequestResumeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [email, setEmail] = useState("");
  const [roleType, setRoleType] = useState("Risk Analyst / Risk Analytics");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const sanitizeInput = (input: string) => input.replace(/[<>]/g, "").trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // Ignore if canvas-confetti is not loaded
    }

    const cleanName = sanitizeInput(name);
    const cleanOrg = sanitizeInput(organization);
    const cleanEmail = sanitizeInput(email);
    const cleanMsg = sanitizeInput(message);

    const subject = encodeURIComponent(
      `Résumé Request: ${roleType} - ${cleanOrg || "Direct Inquiry"}`
    );
    const body = encodeURIComponent(
      `Hello Kumar,\n\nI would like to request your official résumé for the following target opportunity:\n\n` +
        `• Name: ${cleanName}\n` +
        `• Organization / Team: ${cleanOrg}\n` +
        `• Contact Email: ${cleanEmail}\n` +
        `• Target Role: ${roleType}\n` +
        `• Additional Context: ${cleanMsg || "N/A"}\n\n` +
        `Best regards,\n${cleanName}`
    );

    window.location.href = `mailto:${PERSONAL_INFO.contact.email}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.contact.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          className="relative w-full max-w-lg rounded-2xl clean-card bg-[#0e0e12] border border-white/10 shadow-2xl p-6 sm:p-8 z-10 my-8 overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Modal Header */}
          <div className="flex items-start gap-3.5 mb-6">
            <div className="p-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-zinc-200 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white tracking-tight">
                Request Official Résumé
              </h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Direct request for tailored credentials, project appendices, and references.
              </p>
            </div>
          </div>

          {/* Policy Notice */}
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs text-zinc-400 mb-6 flex items-start gap-2.5 leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-zinc-300 shrink-0 mt-0.5" />
            <span>
              To ensure hiring managers receive an up-to-date version tailored to their specific domain 
              (Risk Analytics, Data Engineering, or Reporting), résumés are provided via verified request.
            </span>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                    Your Name *
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full pl-8 pr-3 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-xs text-zinc-200 focus:outline-none focus:border-white/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                    Company / Team *
                  </label>
                  <div className="relative">
                    <Building2 className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="e.g. FinTech / Risk Group"
                      className="w-full pl-8 pr-3 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-xs text-zinc-200 focus:outline-none focus:border-white/30"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                  Your Work Email *
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sarah@company.com"
                    className="w-full pl-8 pr-3 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-xs text-zinc-200 focus:outline-none focus:border-white/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                  Target Role Category
                </label>
                <select
                  value={roleType}
                  onChange={(e) => setRoleType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#141418] border border-white/10 text-xs text-zinc-200 focus:outline-none focus:border-white/30"
                >
                  <option value="Risk Analyst / Risk Analytics">Risk Analyst / Risk Analytics</option>
                  <option value="Reporting Analyst / Operations Analyst">Reporting Analyst / Operations Analyst</option>
                  <option value="Data Science Analyst / Decision Support">Data Science Analyst / Decision Support</option>
                  <option value="Junior / Graduate Data Engineer">Junior / Graduate Data Engineer</option>
                  <option value="Risk Consultant">Risk Consultant</option>
                  <option value="General Technical Inquiry">Other Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                  Context / Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Requisition link, team focus, or timeline..."
                  className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-xs text-zinc-200 focus:outline-none focus:border-white/30 resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="pill-button pill-button-primary w-full text-xs py-2.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Résumé Request (Pre-filled Mailto)</span>
                </button>
              </div>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6 space-y-4"
            >
              <div className="w-12 h-12 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h4 className="text-base font-semibold text-white">Request Initialized</h4>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                Your email client should have opened with the formatted request. You can also write 
                directly at any time:
              </p>

              <button
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-zinc-200 hover:bg-white/[0.08] transition-colors"
              >
                {copiedEmail ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedEmail ? "Copied!" : PERSONAL_INFO.contact.email}</span>
              </button>

              <div>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    onClose();
                  }}
                  className="pill-button text-xs py-1 px-4 mt-2"
                >
                  Close
                </button>
              </div>
            </motion.div>
          )}

          {/* Quick Direct Email Line */}
          <div className="mt-5 pt-3.5 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-500">
            <span>Direct Email:</span>
            <button
              onClick={handleCopyEmail}
              className="text-zinc-300 hover:text-white font-mono flex items-center gap-1"
            >
              <span>{PERSONAL_INFO.contact.email}</span>
              {copiedEmail && <span className="text-emerald-400 text-[10px]">✓</span>}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
