"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  Send,
  Copy,
  Check,
  FileText,
  ArrowUpRight,
  MessageSquare,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/BrandIcons";
import { PERSONAL_INFO } from "@/data/portfolioData";

interface ContactProps {
  onRequestResume: () => void;
}

export const Contact: React.FC<ContactProps> = ({ onRequestResume }) => {
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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoSubject = encodeURIComponent(
      subject || `Inquiry from ${senderName} regarding Data/Risk Analytics`
    );
    const mailtoBody = encodeURIComponent(
      `Hello Kumar,\n\n${message}\n\nFrom: ${senderName}\nContact: ${senderEmail}`
    );
    window.location.href = `mailto:${PERSONAL_INFO.contact.email}?subject=${mailtoSubject}&body=${mailtoBody}`;
    setSentSuccess(true);
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-navy-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-400 mb-3"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>START A CONVERSATION</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4"
          >
            Let&apos;s Build <span className="text-gradient-cyan">Defensible Solutions</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-400 text-base sm:text-lg leading-relaxed"
          >
            Whether discussing credit risk models, high-throughput PostgreSQL pipelines,
            or full-time quantitative / data engineering opportunities.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Direct Contact Details & Links */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Dedicated Request Resume Banner */}
            <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-indigo-950/80 via-slate-900 to-navy-950 border border-indigo-700/50 shadow-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Need My Official Resume?</h3>
              </div>
              <p className="text-xs text-slate-300 mb-5 leading-relaxed">
                I do not host a direct public download to protect version accuracy.
                Click below to trigger a structured, pre-filled request.
              </p>
              <button
                onClick={onRequestResume}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 shadow-md shadow-indigo-500/25 transition-all hover:scale-102"
              >
                <FileText className="w-4 h-4" />
                <span>Open Request Resume Form</span>
              </button>
            </div>

            {/* Email Card with 1-Click Copy */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-slate-900 text-cyan-400 border border-slate-800">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-mono text-slate-400">Direct Email</div>
                  <a
                    href={`mailto:${PERSONAL_INFO.contact.email}`}
                    className="text-sm sm:text-base font-semibold text-white hover:text-cyan-400 transition-colors font-mono"
                  >
                    {PERSONAL_INFO.contact.email}
                  </a>
                </div>
              </div>

              <button
                onClick={() => copyToClipboard(PERSONAL_INFO.contact.email, "email")}
                className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                title="Copy email to clipboard"
              >
                {copiedEmail ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Phone Card with 1-Click Copy */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-slate-900 text-emerald-400 border border-slate-800">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-mono text-slate-400">Phone / WhatsApp</div>
                  <a
                    href={`tel:${PERSONAL_INFO.contact.phone}`}
                    className="text-sm sm:text-base font-semibold text-white hover:text-emerald-400 transition-colors font-mono"
                  >
                    {PERSONAL_INFO.contact.phone}
                  </a>
                </div>
              </div>

              <button
                onClick={() => copyToClipboard(PERSONAL_INFO.contact.phone, "phone")}
                className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                title="Copy phone number to clipboard"
              >
                {copiedPhone ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Social Link Badges */}
            <div className="grid grid-cols-2 gap-3">
              <a
                href={PERSONAL_INFO.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl glass-panel border border-slate-800 hover:border-cyan-500/50 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <GithubIcon className="w-5 h-5 text-cyan-400" />
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-white">
                    GitHub Profile
                  </span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-400" />
              </a>

              <a
                href={PERSONAL_INFO.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl glass-panel border border-slate-800 hover:border-indigo-500/50 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <LinkedinIcon className="w-5 h-5 text-indigo-400" />
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-white">
                    LinkedIn Profile
                  </span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-400" />
              </a>
            </div>
          </motion.div>

          {/* Right Column: Clean Reach-Out Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 glass-panel p-8 sm:p-10 rounded-2xl border border-slate-800"
          >
            <h3 className="text-2xl font-bold text-white mb-2">Send a Direct Message</h3>
            <p className="text-xs sm:text-sm text-slate-400 mb-6">
              Fill out this quick form to send a formatted inquiry directly to my inbox.
            </p>

            {sentSuccess ? (
              <div className="p-6 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-center space-y-3">
                <Check className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold text-white">Opening Email Client...</h4>
                <p className="text-xs text-slate-300">
                  Your mail app should have launched. If not, feel free to write to{" "}
                  <strong className="text-cyan-300 font-mono">{PERSONAL_INFO.contact.email}</strong>.
                </p>
                <button
                  onClick={() => setSentSuccess(false)}
                  className="text-xs text-cyan-400 underline pt-2"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="e.g. Alex Morgan"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      placeholder="alex@company.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Credit Risk Analyst Role / Quantitative Discussion"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe the opportunity, technical challenge, or project..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 transition-all shadow-md shadow-cyan-500/20 active:scale-98"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message via Email</span>
                </button>
              </form>
            )}
          </motion.div>
        </div>

      </div>
    </section>
  );
};
