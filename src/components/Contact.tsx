"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Mail,
  Phone,
  Send,
  Copy,
  Check,
  FileText,
  ArrowUpRight,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/BrandIcons";
import { usePortfolio } from "@/context/PortfolioContext";

interface ContactProps {
  onRequestResume: () => void;
}

export const Contact: React.FC<ContactProps> = ({ onRequestResume }) => {
  const { data } = usePortfolio();
  const personalInfo = data.personalInfo;
  const contactSection = data.contactSection || {
    pill: "Get in Touch",
    heading: "Start a Conversation",
    subheading:
      "Open to analytics, risk, product, operations, and data-focused opportunities. Reach out directly or send a message.",
    resumeCardTitle: "Need an Official Résumé?",
    resumeCardDescription:
      "To provide tailored versions aligned with specific role requirements, resumes are shared directly upon verified request.",
    resumeButtonText: "Request Résumé Form",
  };
  const shouldReduceMotion = useReducedMotion();

  const fadeUp = (delay = 0) => ({
    initial: shouldReduceMotion ? false : { opacity: 0, y: 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-40px" },
    transition: { duration: 0.45, delay, ease: "easeOut" as const },
  });

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sentSuccess, setSentSuccess] = useState(false);

  const copyToClipboard = (text: string, type: "email" | "phone") => {
    navigator.clipboard.writeText(text);
    if (type === "email") {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    } else {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2500);
    }
  };

  // Input Sanitization helper
  const sanitizeInput = (input: string) => {
    return input.replace(/[<>]/g, "").trim();
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanName = sanitizeInput(senderName);
    const cleanEmail = sanitizeInput(senderEmail);
    const cleanSubject = sanitizeInput(subject);
    const cleanMessage = sanitizeInput(message);

    const mailtoSubject = encodeURIComponent(
      cleanSubject || `Inquiry from ${cleanName} regarding Analytics / Risk / Product`
    );
    const mailtoBody = encodeURIComponent(
      `Hello Kumar,\n\n${cleanMessage}\n\nFrom: ${cleanName}\nContact Email: ${cleanEmail}`
    );
    window.location.href = `mailto:${personalInfo.contact.email}?subject=${mailtoSubject}&body=${mailtoBody}`;
    setSentSuccess(true);
  };

  return (
    <section id="contact" className="py-24 relative border-t border-white/[0.06] bg-[#030304]">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Section Pill */}
        <motion.div {...fadeUp(0)} className="text-center mb-14">
          <div className="inline-block px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-medium text-zinc-400 mb-3 font-mono">
            {contactSection.pill}
          </div>

          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-4">
            {contactSection.heading}
          </h2>

          <p className="text-zinc-400 text-base max-w-xl mx-auto leading-relaxed">
            {contactSection.subheading}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Column: Direct Contact & Resume Request Trigger */}
          <motion.div {...fadeUp(0.08)} className="md:col-span-5 space-y-4">
            {/* Request Resume Banner Card */}
            <motion.div
              whileHover={shouldReduceMotion ? {} : { y: -3, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="clean-card p-6 rounded-2xl border border-white/10"
            >
              <div className="flex items-center gap-3 mb-2.5">
                <div className="p-2 rounded-lg bg-white/[0.05] border border-white/10 text-zinc-200">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-semibold text-white">{contactSection.resumeCardTitle}</h3>
              </div>
              <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
                {contactSection.resumeCardDescription}
              </p>
              <motion.button
                onClick={onRequestResume}
                whileHover={shouldReduceMotion ? {} : { scale: 1.03, y: -1 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
                transition={{ type: "spring", stiffness: 450, damping: 20 }}
                className="pill-button pill-button-primary w-full text-xs py-2 cursor-pointer"
              >
                <span>{contactSection.resumeButtonText}</span>
              </motion.button>
            </motion.div>

            {/* Direct Email Card */}
            <motion.div
              whileHover={shouldReduceMotion ? {} : { y: -2, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="clean-card p-4 rounded-xl flex items-center justify-between"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="p-2 rounded-lg bg-white/[0.04] text-zinc-300">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="text-[11px] text-zinc-500 font-mono">Email Address</div>
                  <a
                    href={`mailto:${personalInfo.contact.email}`}
                    className="text-xs sm:text-sm font-medium text-zinc-200 hover:text-white transition-colors truncate block"
                  >
                    {personalInfo.contact.email}
                  </a>
                </div>
              </div>
              <motion.button
                whileHover={shouldReduceMotion ? {} : { scale: 1.15 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.88 }}
                transition={{ type: "spring", stiffness: 500, damping: 18 }}
                onClick={() => copyToClipboard(personalInfo.contact.email, "email")}
                className="p-2 rounded-lg hover:bg-white/[0.05] text-zinc-400 hover:text-white transition-colors shrink-0 cursor-pointer"
                title="Copy email"
              >
                {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </motion.button>
            </motion.div>

            {/* Direct Phone Card */}
            <motion.div
              whileHover={shouldReduceMotion ? {} : { y: -2, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="clean-card p-4 rounded-xl flex items-center justify-between"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="p-2 rounded-lg bg-white/[0.04] text-zinc-300">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-zinc-500 font-mono">Phone / WhatsApp</div>
                  <a
                    href={`tel:${personalInfo.contact.phone}`}
                    className="text-xs sm:text-sm font-medium text-zinc-200 hover:text-white transition-colors block font-mono"
                  >
                    {personalInfo.contact.phone}
                  </a>
                </div>
              </div>
              <motion.button
                whileHover={shouldReduceMotion ? {} : { scale: 1.15 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.88 }}
                transition={{ type: "spring", stiffness: 500, damping: 18 }}
                onClick={() => copyToClipboard(personalInfo.contact.phone, "phone")}
                className="p-2 rounded-lg hover:bg-white/[0.05] text-zinc-400 hover:text-white transition-colors shrink-0 cursor-pointer"
                title="Copy phone number"
              >
                {copiedPhone ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </motion.button>
            </motion.div>

            {/* Social Links */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <motion.a
                href={personalInfo.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="view"
                whileHover={shouldReduceMotion ? {} : { scale: 1.03, y: -1.5 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
                transition={{ type: "spring", stiffness: 450, damping: 20 }}
                className="clean-card p-3 rounded-xl flex items-center justify-between text-xs font-medium text-zinc-300 hover:text-white group cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <GithubIcon className="w-4 h-4" />
                  <span>GitHub</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white" />
              </motion.a>

              <motion.a
                href={personalInfo.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="view"
                whileHover={shouldReduceMotion ? {} : { scale: 1.03, y: -1.5 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
                transition={{ type: "spring", stiffness: 450, damping: 20 }}
                className="clean-card p-3 rounded-xl flex items-center justify-between text-xs font-medium text-zinc-300 hover:text-white group cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <LinkedinIcon className="w-4 h-4" />
                  <span>LinkedIn</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white" />
              </motion.a>
            </div>
          </motion.div>

          {/* Right Column: Clean Message Form */}
          <motion.div
            {...fadeUp(0.14)}
            whileHover={shouldReduceMotion ? {} : { y: -3, scale: 1.006 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="md:col-span-7 clean-card p-7 sm:p-8 rounded-2xl"
          >
            <h3 className="text-lg font-semibold text-white mb-1.5">Direct Message</h3>
            <p className="text-xs text-zinc-400 mb-6">
              Send a note directly to my email regarding an opportunity or technical discussion.
            </p>

            {sentSuccess ? (
              <div className="p-6 rounded-xl bg-white/[0.02] border border-white/10 text-center space-y-3">
                <Check className="w-7 h-7 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-semibold text-white">Opening Email Client...</h4>
                <p className="text-xs text-zinc-400">
                  Your mail app has been launched. Alternatively, email directly at{" "}
                  <strong className="text-zinc-200 font-mono">{personalInfo.contact.email}</strong>.
                </p>
                <button
                  onClick={() => setSentSuccess(false)}
                  className="text-xs text-zinc-400 underline pt-2 hover:text-white"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="e.g. Alex Morgan"
                      className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-xs text-zinc-200 focus:outline-none focus:border-white/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      placeholder="alex@company.com"
                      className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-xs text-zinc-200 focus:outline-none focus:border-white/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Risk Analyst Role / Quantitative Discussion"
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-xs text-zinc-200 focus:outline-none focus:border-white/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                    Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Please share role details, timeline, or inquiries..."
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-xs text-zinc-200 focus:outline-none focus:border-white/30 resize-none"
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={shouldReduceMotion ? {} : { scale: 1.02, y: -1 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 450, damping: 20 }}
                  className="pill-button pill-button-primary w-full text-xs py-2.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>

      </div>
    </section>
  );
};
