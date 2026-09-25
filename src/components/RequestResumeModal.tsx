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
  ShieldAlert,
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
  const [roleType, setRoleType] = useState("Risk Analytics / Data Analyst");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Trigger visual confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // Ignore if canvas-confetti is not loaded
    }

    // Construct pre-filled mailto
    const subject = encodeURIComponent(
      `Resume Request: ${roleType} - ${organization || "Direct Opportunity"}`
    );
    const body = encodeURIComponent(
      `Hello Kumar,\n\nI would like to request your comprehensive resume for the following opportunity:\n\n` +
        `• Name: ${name}\n` +
        `• Organization: ${organization}\n` +
        `• Contact Email: ${email}\n` +
        `• Focus Role: ${roleType}\n` +
        `• Additional Context: ${message || "N/A"}\n\n` +
        `Best regards,\n${name}`
    );

    // Open mailto link
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
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl rounded-2xl glass-panel bg-navy-950 border border-slate-700/80 shadow-2xl p-6 sm:p-8 z-10 my-8 overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 text-cyan-400 border border-cyan-500/30 shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Request Official Resume
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Direct request for tailored credentials, project technical appendices, and references.
              </p>
            </div>
          </div>

          {/* Policy Note: Why resume is on-request */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 mb-6 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              <strong>Professional Notice:</strong> To ensure recruiters and hiring leaders receive
              up-to-date versions aligned with their exact domain (Risk Modeling, Data Engineering, or BI),
              I share resumes directly via verified request.
            </span>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Your Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900/90 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Company / Organization *
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="e.g. Fintech Corp / Bank"
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900/90 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  Your Work Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sarah@company.com"
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900/90 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  Target Domain / Role Type
                </label>
                <select
                  value={roleType}
                  onChange={(e) => setRoleType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900/90 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Risk Analytics / Credit Risk Analyst">
                    Risk Analytics & Default Modeling
                  </option>
                  <option value="Data Engineering / Pipeline Ops">
                    Data Engineering & SQL / AWS Pipelines
                  </option>
                  <option value="Business Intelligence & Reporting">
                    Business Intelligence (Tableau / Power BI)
                  </option>
                  <option value="Research / Hardware & Signal Systems">
                    Hardware / Signal Systems / R&D
                  </option>
                  <option value="Other Inquiries">Other Exploration / Consulting</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  Message / Role Context (Optional)
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share job requisition ID, timeline, or team details..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-900/90 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="submit"
                  className="w-full sm:flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 transition-all shadow-md shadow-cyan-500/20 active:scale-98"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Resume Request (Pre-filled Mailto)</span>
                </button>
              </div>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6 space-y-4"
            >
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-white">Request Dispatched!</h4>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Your email client should have opened with the formatted request. You can also write
                to me directly at any time:
              </p>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleCopyEmail}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-300 hover:bg-slate-700 transition-colors"
                >
                  {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedEmail ? "Email Copied!" : PERSONAL_INFO.contact.email}</span>
                </button>
              </div>

              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="mt-4 px-5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 rounded-lg border border-slate-800"
              >
                Close Window
              </button>
            </motion.div>
          )}

          {/* Quick Mailto Fallback */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Direct Email:</span>
            <button
              onClick={handleCopyEmail}
              className="text-cyan-400 hover:underline font-mono flex items-center gap-1"
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
