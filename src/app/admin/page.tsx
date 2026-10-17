"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Download,
  Upload,
  Shield,
  Check,
  AlertCircle,
  Sparkles,
  ChevronRight,
  Layers,
  Briefcase,
  GraduationCap,
  Award,
  Sliders,
  User,
  Compass,
  RotateCcw,
  X,
  LogOut,
  FolderKanban,
  CheckCircle2,
  Mail,
  Video,
} from "lucide-react";
import {
  PortfolioContentData,
  DEFAULT_PORTFOLIO_CONTENT,
} from "@/lib/portfolioModel";
import { Project, HERO_VIDEO_PRESETS } from "@/data/portfolioData";

export default function AdminPage() {
  // Auth state
  const [authChecking, setAuthChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // CMS state
  const [activeTab, setActiveTab] = useState<
    | "profile"
    | "flagship"
    | "supporting"
    | "about"
    | "telemetry"
    | "experience"
    | "education"
    | "skills"
    | "credentials"
    | "contact"
    | "settings"
  >("profile");

  const [data, setData] = useState<PortfolioContentData>(DEFAULT_PORTFOLIO_CONTENT);
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Modals
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwModalError, setPwModalError] = useState("");
  const [pwModalSuccess, setPwModalSuccess] = useState("");
  const [pwSubmitting, setPwSubmitting] = useState(false);

  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);
  const [resetting, setResetting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper for toasts
  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch live portfolio content
  const loadPortfolioContent = useCallback(async () => {
    setLoadingData(true);
    try {
      const res = await fetch("/api/portfolio-data", { cache: "no-store" });
      if (res.ok) {
        const fetched = await res.json();
        setData(fetched);
        setIsDirty(false);
      }
    } catch {
      showToast("Failed to load portfolio content from server", "error");
    } finally {
      setLoadingData(false);
    }
  }, []);

  // Check auth on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/admin/check", { cache: "no-store" });
        const resData = await res.json();
        if (res.ok && resData.authenticated) {
          setIsAuthenticated(true);
          loadPortfolioContent();
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        setIsAuthenticated(false);
      } finally {
        setAuthChecking(false);
      }
    }
    checkAuth();
  }, [loadPortfolioContent]);

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: loginPassword }),
      });

      const resData = await res.json();
      if (!res.ok) {
        setLoginError(resData.error || "Authentication failed");
      } else {
        setIsAuthenticated(true);
        setLoginPassword("");
        loadPortfolioContent();
      }
    } catch {
      setLoginError("Network connection error");
    } finally {
      setLoginLoading(false);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      setIsAuthenticated(false);
    } catch {
      setIsAuthenticated(false);
    }
  };

  // Save all changes
  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/portfolio-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const resData = await res.json();
      if (!res.ok) {
        showToast(resData.error || "Failed to save portfolio data", "error");
      } else {
        setIsDirty(false);
        showToast("Portfolio changes successfully saved and applied to live site!");
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("portfolio_cached_data", JSON.stringify(data));
          } catch {
            // Ignore
          }
          window.dispatchEvent(
            new CustomEvent("portfolio_data_updated", { detail: data })
          );
        }
      }
    } catch {
      showToast("Network error while saving changes", "error");
    } finally {
      setSaving(false);
    }
  };

  // Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwModalError("");
    setPwModalSuccess("");

    if (newPw !== confirmPw) {
      setPwModalError("New passwords do not match.");
      return;
    }

    if (newPw.length < 6) {
      setPwModalError("Password must be at least 6 characters.");
      return;
    }

    setPwSubmitting(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
      });

      const resData = await res.json();
      if (!res.ok) {
        setPwModalError(resData.error || "Failed to update password");
      } else {
        setPwModalSuccess("Password changed and encrypted successfully!");
        setCurrentPw("");
        setNewPw("");
        setConfirmPw("");
        setTimeout(() => {
          setShowPasswordModal(false);
          setPwModalSuccess("");
        }, 1500);
      }
    } catch {
      setPwModalError("Error changing password.");
    } finally {
      setPwSubmitting(false);
    }
  };

  // Reset to default
  const handleResetToDefault = async () => {
    setResetting(true);
    try {
      const res = await fetch("/api/admin/reset", { method: "POST" });
      const resData = await res.json();
      if (!res.ok) {
        showToast(resData.error || "Failed to reset content", "error");
      } else {
        setData(resData.data || DEFAULT_PORTFOLIO_CONTENT);
        setIsDirty(false);
        setShowResetConfirmModal(false);
        showToast("Portfolio content restored to original defaults.");
        window.dispatchEvent(new Event("portfolio-data-updated"));
      }
    } catch {
      showToast("Error resetting portfolio content", "error");
    } finally {
      setResetting(false);
    }
  };

  // Export JSON backup
  const handleExportBackup = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `portfolio_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Portfolio backup JSON downloaded.");
  };

  // Import JSON backup
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.personalInfo && parsed.featuredProjects) {
          setData(parsed);
          setIsDirty(true);
          showToast("Backup JSON loaded into editor. Click Save All Changes to apply.");
        } else {
          showToast("Invalid backup file structure.", "error");
        }
      } catch {
        showToast("Error parsing JSON file.", "error");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Rotating Headline helpers
  const getHeadlines = (): string[] => {
    if (
      data.personalInfo.heroRotatingHeadlines &&
      data.personalInfo.heroRotatingHeadlines.length > 0
    ) {
      return data.personalInfo.heroRotatingHeadlines;
    }
    return [
      data.personalInfo.heroHeadline || "Turning Complex Data into Clear, Defensible Decisions.",
      "Investigating Data. Validating the Signal. Driving Action.",
      "Engineering Data Systems for Better Decisions.",
    ];
  };

  const updateHeadline = (index: number, value: string) => {
    const list = [...getHeadlines()];
    list[index] = value;
    setData({
      ...data,
      personalInfo: {
        ...data.personalInfo,
        heroRotatingHeadlines: list,
        heroHeadline: list[0] || value,
      },
    });
    setIsDirty(true);
  };

  const moveHeadline = (index: number, direction: "up" | "down") => {
    const list = [...getHeadlines()];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;
    setData({
      ...data,
      personalInfo: {
        ...data.personalInfo,
        heroRotatingHeadlines: list,
        heroHeadline: list[0],
      },
    });
    setIsDirty(true);
  };

  const addHeadline = () => {
    const list = [...getHeadlines(), "New high-impact rotating headline sentence."];
    setData({
      ...data,
      personalInfo: {
        ...data.personalInfo,
        heroRotatingHeadlines: list,
        heroHeadline: list[0],
      },
    });
    setIsDirty(true);
  };

  const deleteHeadline = (index: number) => {
    const current = getHeadlines();
    if (current.length <= 1) return;
    const list = current.filter((_, i) => i !== index);
    setData({
      ...data,
      personalInfo: {
        ...data.personalInfo,
        heroRotatingHeadlines: list,
        heroHeadline: list[0] || "",
      },
    });
    setIsDirty(true);
  };

  // Project helpers
  const moveProject = (index: number, direction: "up" | "down", isFeatured: boolean) => {
    const listKey = isFeatured ? "featuredProjects" : "supportingProjects";
    const list = [...data[listKey]];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;

    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;

    setData({ ...data, [listKey]: list });
    setIsDirty(true);
  };

  const deleteProject = (index: number, isFeatured: boolean) => {
    const listKey = isFeatured ? "featuredProjects" : "supportingProjects";
    const list = data[listKey].filter((_, i) => i !== index);
    setData({ ...data, [listKey]: list });
    setIsDirty(true);
  };

  const addProject = (isFeatured: boolean) => {
    const listKey = isFeatured ? "featuredProjects" : "supportingProjects";
    const newProj: Project = {
      id: `custom-project-${Date.now()}`,
      title: "New Project Title",
      category: "Analytics & Product",
      targetRoleRelevance: ["Analytics", "Decision Systems"],
      tagline: "High-impact analytical engine or product framework",
      description: "Comprehensive description of the project problem, methodology, and outcome.",
      architectureHighlights: [
        "Structured ingestion and data transformation pipeline",
        "Deterministic validation rules and uncertainty resolution",
      ],
      metrics: [
        { label: "Metric 1", value: "99.8%" },
        { label: "Metric 2", value: "50K+" },
      ],
      tags: ["Python", "SQL", "Analytics"],
      githubUrl: "https://github.com/Saksham3124",
      featured: isFeatured,
    };

    setData({ ...data, [listKey]: [...data[listKey], newProj] });
    setIsDirty(true);
  };

  // Experience helpers
  const addExperience = () => {
    const newExp = {
      id: `exp-${Date.now()}`,
      role: "Research / Analytics Fellow",
      organization: "Institution / Organization",
      period: "2024 – Present",
      location: "Location",
      program: "Research Program / Fellowship",
      type: "Research",
      summary: "Executive summary of analytical problem, methodologies, and outcomes delivered.",
      researchAreas: [
        {
          id: `ra-${Date.now()}-1`,
          title: "DATA PROCESSING",
          highlight: "Simulation outputs into structured analytical datasets",
          description: "Processed quantitative datasets through modular workflows, converting outputs into structured data for analysis.",
        },
        {
          id: `ra-${Date.now()}-2`,
          title: "CONFIGURATION ANALYSIS",
          highlight: "Configuration modeling and comparative evaluation",
          description: "Compared multi-parameter configurations to identify patterns associated with improved performance.",
        },
        {
          id: `ra-${Date.now()}-3`,
          title: "VALIDATION",
          highlight: "Verification against simulated benchmarks",
          description: "Cross-checked experimental findings against analytical benchmarks and refined reproducible workflows.",
        },
      ],
      outcomes: [
        {
          value: "20K+",
          label: "Signatures Evaluated",
          sub: "Automated Pipeline",
        },
        {
          value: "66% → 80%",
          label: "Performance Optimization",
          sub: "Empirical Gain",
        },
        {
          value: "4",
          label: "Configurations Tested",
          sub: "Comparative Study",
        },
      ],
      highlights: [
        "Formulated mathematical and computational framework for high-dimensional data evaluation.",
        "Delivered reproducible workflows with verifiable performance metrics.",
      ],
      tags: ["Python", "MATLAB", "Simulation", "Algorithms"],
    };
    setData({ ...data, experience: [...data.experience, newExp] });
    setIsDirty(true);
  };

  const moveExperience = (index: number, direction: "up" | "down") => {
    const list = [...data.experience];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;
    setData({ ...data, experience: list });
    setIsDirty(true);
  };

  const deleteExperience = (index: number) => {
    if (data.experience.length <= 1) return;
    const list = data.experience.filter((_, i) => i !== index);
    setData({ ...data, experience: list });
    setIsDirty(true);
  };

  // Education helpers
  const getEducationList = () => {
    if (data.educationList && data.educationList.length > 0) return data.educationList;
    return [data.education];
  };

  const updateEducationList = (newList: typeof data.education[]) => {
    setData({
      ...data,
      educationList: newList,
      education: newList[0] || data.education,
    });
    setIsDirty(true);
  };

  const addEducationItem = () => {
    const list = getEducationList();
    const newItem = {
      degree: "Bachelor of Technology / Master of Science",
      institution: "University / Institute Name",
      period: "2020 – 2024",
      location: "City, Country",
      framing: "Comprehensive academic foundation emphasizing quantitative analysis and engineering rigor.",
      coursework: ["Systems & Modeling", "Algorithms", "Statistical Methods", "Linear Algebra"],
    };
    updateEducationList([...list, newItem]);
  };

  const moveEducationItem = (index: number, direction: "up" | "down") => {
    const list = [...getEducationList()];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;
    updateEducationList(list);
  };

  const deleteEducationItem = (index: number) => {
    const list = getEducationList();
    if (list.length <= 1) return;
    const filtered = list.filter((_, i) => i !== index);
    updateEducationList(filtered);
  };

  // Skill Group helpers
  const addSkillGroup = () => {
    const newGroup = {
      name: "New Technical Skill Domain",
      description: "Functional scope and operational capabilities",
      skills: ["Core Tool 1", "Framework 2", "Methodology 3"],
    };
    setData({ ...data, skillGroups: [...data.skillGroups, newGroup] });
    setIsDirty(true);
  };

  const moveSkillGroup = (index: number, direction: "up" | "down") => {
    const list = [...data.skillGroups];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;
    setData({ ...data, skillGroups: list });
    setIsDirty(true);
  };

  const deleteSkillGroup = (index: number) => {
    if (data.skillGroups.length <= 1) return;
    const list = data.skillGroups.filter((_, i) => i !== index);
    setData({ ...data, skillGroups: list });
    setIsDirty(true);
  };

  // Certification Category helpers
  const addCertCategory = () => {
    const newCat = {
      category: "New Credential Category",
      items: [
        {
          name: "Certified Specialist / Practitioner",
          issuer: "Issuing Body (e.g. AWS, Stanford, Google)",
          year: new Date().getFullYear().toString(),
          highlight: "Professional Credential",
          verifyUrl: "https://",
        },
      ],
    };
    setData({ ...data, certifications: [...data.certifications, newCat] });
    setIsDirty(true);
  };

  const moveCertCategory = (index: number, direction: "up" | "down") => {
    const list = [...data.certifications];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;
    setData({ ...data, certifications: list });
    setIsDirty(true);
  };

  const deleteCertCategory = (index: number) => {
    if (data.certifications.length <= 1) return;
    const list = data.certifications.filter((_, i) => i !== index);
    setData({ ...data, certifications: list });
    setIsDirty(true);
  };

  const addCertItem = (catIdx: number) => {
    const updated = [...data.certifications];
    updated[catIdx].items = [
      ...updated[catIdx].items,
      {
        name: "New Certificate",
        issuer: "Issuing Organization",
        year: new Date().getFullYear().toString(),
        highlight: "Verified",
        verifyUrl: "https://",
      },
    ];
    setData({ ...data, certifications: updated });
    setIsDirty(true);
  };

  const deleteCertItem = (catIdx: number, itemIdx: number) => {
    const updated = [...data.certifications];
    if (updated[catIdx].items.length <= 1) return;
    updated[catIdx].items = updated[catIdx].items.filter((_, i) => i !== itemIdx);
    setData({ ...data, certifications: updated });
    setIsDirty(true);
  };

  // Achievement helpers
  const addAchievement = () => {
    const newAch = {
      id: `ach-${Date.now()}`,
      title: "New Hackathon / Competition Distinction",
      context: "Competitive Engineering / Analytics Hackathon",
      badge: "Winner / Top Finalist",
      year: new Date().getFullYear().toString(),
      description: "Description of the challenge, engineering or analytical solution, and competitive outcome.",
      impactMetrics: "Competitive Distinction",
    };
    setData({ ...data, achievements: [...data.achievements, newAch] });
    setIsDirty(true);
  };

  const moveAchievement = (index: number, direction: "up" | "down") => {
    const list = [...data.achievements];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;
    setData({ ...data, achievements: list });
    setIsDirty(true);
  };

  const deleteAchievement = (index: number) => {
    if (data.achievements.length <= 1) return;
    const list = data.achievements.filter((_, i) => i !== index);
    setData({ ...data, achievements: list });
    setIsDirty(true);
  };

  // LOADING SCREEN
  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#030304] text-zinc-100 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-6 h-6 text-zinc-400 animate-spin" />
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
            Verifying Admin Session...
          </span>
        </div>
      </div>
    );
  }

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#030304] text-zinc-100 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-[#0a0a0e] border border-white/[0.08] rounded-2xl p-8 shadow-2xl relative z-10 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white">
              <Lock className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white tracking-tight">Portfolio Admin Studio</h1>
              <p className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                Encrypted CMS Portal
              </p>
            </div>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed mb-6">
            Enter your admin password to edit, add, or configure portfolio projects, narrative copy, and credentials directly.
          </p>

          {loginError && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 tracking-wider mb-2">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter administrator password..."
                  required
                  autoFocus
                  className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-400/60 focus:ring-1 focus:ring-blue-400/30 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading || !loginPassword}
              className="w-full py-2.5 px-4 rounded-xl bg-white text-zinc-950 font-semibold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {loginLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Verifying Encrypted PBKDF2 Hash...</span>
                </>
              ) : (
                <>
                  <Shield className="w-3.5 h-3.5" />
                  <span>Unlock Studio</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-zinc-500 font-mono">
            <span>Default key: admin123</span>
            <Link href="/" className="hover:text-zinc-300 transition-colors flex items-center gap-1">
              <span>View Live Site</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // AUTHENTICATED CMS DASHBOARD
  return (
    <div className="min-h-screen bg-[#030304] text-zinc-100 font-sans selection:bg-blue-500/20 selection:text-white">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl border shadow-2xl flex items-center gap-2.5 text-xs font-medium backdrop-blur-md animate-fade-in ${
            toast.type === "error"
              ? "bg-red-950/80 border-red-500/30 text-red-200"
              : "bg-emerald-950/80 border-emerald-500/30 text-emerald-200"
          }`}
        >
          {toast.type === "error" ? (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* TOP HEADER BAR */}
      <header className="sticky top-0 z-40 bg-[#07070a]/90 backdrop-blur-md border-b border-white/[0.08] px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm tracking-tight text-white">
                  Kumar Saksham
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.05] text-zinc-400 border border-white/5">
                  Studio CMS
                </span>
                {loadingData && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                    <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                    Syncing...
                  </span>
                )}
                {isDirty && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    Unsaved edits
                  </span>
                )}
              </div>
              <p className="text-[11px] text-zinc-400 font-mono">
                Real-time dynamic content configuration
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-300 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 transition-colors"
              title="Preview Live Portfolio"
            >
              <span>View Site</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
            </Link>

            <button
              onClick={() => setShowPasswordModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-300 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 transition-colors"
              title="Change Admin Password"
            >
              <KeyRound className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden md:inline">Password</span>
            </button>

            <button
              onClick={handleSaveAll}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold bg-white text-zinc-950 hover:bg-zinc-200 transition-all shadow-md disabled:opacity-50"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save All Changes</span>
                </>
              )}
            </button>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-colors"
              title="Logout from Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* NAVIGATION TABS (SIDEBAR) */}
          <aside className="lg:col-span-3">
            <div className="sticky top-24 space-y-1.5 bg-[#08080c] border border-white/[0.06] rounded-2xl p-3">
              <div className="px-3 py-2 text-[11px] font-mono uppercase tracking-wider text-zinc-500">
                Studio Sections
              </div>

              {[
                { id: "profile", label: "Profile & Hero", icon: User },
                { id: "flagship", label: "Flagship Projects", icon: FolderKanban },
                { id: "supporting", label: "Supporting Projects", icon: Layers },
                { id: "about", label: "About & Narrative", icon: Compass },
                { id: "telemetry", label: "Telemetry & Scale", icon: Sliders },
                { id: "experience", label: "Experience & LNMIIT", icon: Briefcase },
                { id: "education", label: "Education & Degrees", icon: GraduationCap },
                { id: "skills", label: "Skills & Interests", icon: Sparkles },
                { id: "credentials", label: "Credentials & Honors", icon: Award },
                { id: "contact", label: "Contact & Inquiries", icon: Mail },
                { id: "settings", label: "Settings & Backups", icon: Shield },
              ].map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? "bg-white/10 text-white font-semibold border border-white/15 shadow-sm"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <IconComponent className={`w-4 h-4 ${isActive ? "text-blue-400" : "text-zinc-500"}`} />
                      <span>{tab.label}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* MAIN EDITING WORKSPACE */}
          <main className="lg:col-span-9 space-y-6">
            {/* 1. PROFILE & HERO TAB */}
            {activeTab === "profile" && (
              <div className="bg-[#08080c] border border-white/[0.06] rounded-2xl p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-white tracking-tight">Profile & Hero Section</h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Configure your primary hero headline, professional positioning, narrative bio, and public contact coordinates.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-1.5">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={data.personalInfo.name}
                      onChange={(e) => {
                        setData({
                          ...data,
                          personalInfo: { ...data.personalInfo, name: e.target.value },
                        });
                        setIsDirty(true);
                      }}
                      className="w-full px-3.5 py-2 rounded-xl bg-white/[0.02] border border-white/10 text-sm text-white focus:outline-none focus:border-white/30"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-1.5">
                      Hero Primary Positioning
                    </label>
                    <input
                      type="text"
                      value={data.personalInfo.roleTitle}
                      onChange={(e) => {
                        setData({
                          ...data,
                          personalInfo: { ...data.personalInfo, roleTitle: e.target.value },
                        });
                        setIsDirty(true);
                      }}
                      className="w-full px-3.5 py-2 rounded-xl bg-white/[0.02] border border-white/10 text-sm text-white focus:outline-none focus:border-white/30 font-mono text-xs"
                      placeholder="e.g. DATA · ANALYTICS · RISK · PRODUCT"
                    />
                  </div>
                </div>

                {/* Hero Rotating Headlines (Typewriter Sequence) */}
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
                    <div>
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-mono uppercase text-zinc-300 tracking-wider font-semibold">
                          Rotating Typewriter Headlines
                        </label>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                          {getHeadlines().length} Sentences
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1">
                        These sentences type out and rotate automatically on the live portfolio hero section. You can edit any sentence, change their rotation order, or add/delete lines.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={addHeadline}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-semibold text-white transition-all shrink-0 self-start sm:self-auto"
                    >
                      <Plus className="w-3.5 h-3.5 text-blue-400" />
                      <span>Add Headline</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {getHeadlines().map((hl, hlIdx) => (
                      <div
                        key={hlIdx}
                        className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/10 transition-colors"
                      >
                        <span className="text-[11px] font-mono text-zinc-400 px-2.5 py-1 rounded bg-white/[0.04] border border-white/5 shrink-0">
                          #{hlIdx + 1}
                        </span>
                        <input
                          type="text"
                          value={hl}
                          onChange={(e) => updateHeadline(hlIdx, e.target.value)}
                          placeholder={`Headline sentence #${hlIdx + 1}`}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/10 text-sm text-white focus:outline-none focus:border-white/30"
                        />
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => moveHeadline(hlIdx, "up")}
                            disabled={hlIdx === 0}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.05] disabled:opacity-30 disabled:hover:bg-transparent"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveHeadline(hlIdx, "down")}
                            disabled={hlIdx === getHeadlines().length - 1}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.05] disabled:opacity-30 disabled:hover:bg-transparent"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteHeadline(hlIdx)}
                            disabled={getHeadlines().length <= 1}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-20 disabled:hover:bg-transparent"
                            title="Delete Headline"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-1.5">
                    Hero Supporting Subtitle
                  </label>
                  <textarea
                    rows={2}
                    value={data.personalInfo.heroSupporting}
                    onChange={(e) => {
                      setData({
                        ...data,
                        personalInfo: { ...data.personalInfo, heroSupporting: e.target.value },
                      });
                      setIsDirty(true);
                    }}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/[0.02] border border-white/10 text-sm text-white focus:outline-none focus:border-white/30"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-1.5">
                    Core Professional Narrative (Editorial Summary)
                  </label>
                  <textarea
                    rows={3}
                    value={data.personalInfo.coreNarrative}
                    onChange={(e) => {
                      setData({
                        ...data,
                        personalInfo: { ...data.personalInfo, coreNarrative: e.target.value },
                      });
                      setIsDirty(true);
                    }}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/[0.02] border border-white/10 text-sm text-white focus:outline-none focus:border-white/30 leading-relaxed"
                  />
                </div>

                {/* Hero Background Video Settings & Switcher */}
                <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                        <Video className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <label className="text-xs font-mono uppercase text-zinc-200 tracking-wider font-semibold">
                            Hero Background Ambient Video
                          </label>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
                            {data.personalInfo.heroVideoEnabled !== false ? "Enabled" : "Disabled"}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          Select from 5 curated ambient video loops or specify a custom video URL.
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={data.personalInfo.heroVideoEnabled !== false}
                        onChange={(e) => {
                          setData({
                            ...data,
                            personalInfo: {
                              ...data.personalInfo,
                              heroVideoEnabled: e.target.checked,
                            },
                          });
                          setIsDirty(true);
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {/* Preset Video Cards Grid */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-300 font-semibold">
                        Choose a Video Preset
                      </label>
                      <span className="text-[11px] font-mono text-zinc-500">
                        Click any card to switch
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                      {HERO_VIDEO_PRESETS.map((preset) => {
                        const isSelected =
                          (data.personalInfo.heroVideoUrl || "/videos/hero-background.mp4") ===
                          preset.url;
                        return (
                          <div
                            key={preset.id}
                            onClick={() => {
                              setData({
                                ...data,
                                personalInfo: {
                                  ...data.personalInfo,
                                  heroVideoUrl: preset.url,
                                  heroVideoEnabled: true,
                                },
                              });
                              setIsDirty(true);
                            }}
                            className={`p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                              isSelected
                                ? "bg-blue-500/[0.08] border-blue-500/50 shadow-lg ring-1 ring-blue-500/30"
                                : "bg-white/[0.02] border-white/[0.08] hover:border-white/20 hover:bg-white/[0.04]"
                            }`}
                          >
                            <div>
                              {/* Video Mini Preview Thumbnail */}
                              <div className="relative w-full h-24 rounded-lg overflow-hidden bg-black/60 border border-white/10 mb-3">
                                <video
                                  src={preset.url}
                                  autoPlay
                                  loop
                                  muted
                                  playsInline
                                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity pointer-events-none"
                                />
                                {isSelected && (
                                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-mono font-semibold flex items-center gap-1 shadow-md">
                                    <Check className="w-3 h-3" />
                                    <span>Active</span>
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center gap-1.5 mb-1.5">
                                <span className="text-[10px] font-mono text-zinc-400 px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/5">
                                  {preset.category}
                                </span>
                              </div>

                              <h4 className="text-xs font-semibold text-white tracking-tight group-hover:text-blue-300 transition-colors">
                                {preset.title}
                              </h4>
                              <p className="text-[11px] text-zinc-400 mt-1 leading-snug line-clamp-2">
                                {preset.description}
                              </p>
                            </div>

                            <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono">
                              <span className="text-zinc-500 truncate max-w-[140px]">{preset.url}</span>
                              <span
                                className={
                                  isSelected
                                    ? "text-blue-400 font-semibold"
                                    : "text-zinc-400 group-hover:text-zinc-200"
                                }
                              >
                                {isSelected ? "Selected ✓" : "Select →"}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom URL Input */}
                  <div className="pt-3 border-t border-white/[0.06]">
                    <label className="text-[11px] font-mono text-zinc-400 uppercase block mb-1.5 font-semibold">
                      Custom Video URL or Local File Path
                    </label>
                    <input
                      type="text"
                      value={data.personalInfo.heroVideoUrl || "/videos/hero-background.mp4"}
                      onChange={(e) => {
                        setData({
                          ...data,
                          personalInfo: {
                            ...data.personalInfo,
                            heroVideoUrl: e.target.value,
                          },
                        });
                        setIsDirty(true);
                      }}
                      placeholder="/videos/hero-background.mp4 or https://your-cdn.com/video.mp4"
                      className="w-full px-3 py-2 rounded-lg bg-white/[0.02] border border-white/10 text-xs text-white focus:outline-none focus:border-white/30 font-mono"
                    />
                    <p className="text-[11px] text-zinc-500 mt-1.5 font-mono">
                      Current Active Source: <code className="text-zinc-300 font-bold">{data.personalInfo.heroVideoUrl || "/videos/hero-background.mp4"}</code>
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/[0.06]">
                  <h3 className="text-xs font-mono uppercase text-zinc-400 tracking-wider mb-4">
                    Public Contact Coordinates & Links
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-mono text-zinc-500 uppercase block mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={data.personalInfo.contact.email}
                        onChange={(e) => {
                          setData({
                            ...data,
                            personalInfo: {
                              ...data.personalInfo,
                              contact: { ...data.personalInfo.contact, email: e.target.value },
                            },
                          });
                          setIsDirty(true);
                        }}
                        className="w-full px-3.5 py-2 rounded-xl bg-white/[0.02] border border-white/10 text-sm text-white focus:outline-none focus:border-white/30"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-mono text-zinc-500 uppercase block mb-1">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="text"
                        value={data.personalInfo.contact.phone}
                        onChange={(e) => {
                          setData({
                            ...data,
                            personalInfo: {
                              ...data.personalInfo,
                              contact: { ...data.personalInfo.contact, phone: e.target.value },
                            },
                          });
                          setIsDirty(true);
                        }}
                        className="w-full px-3.5 py-2 rounded-xl bg-white/[0.02] border border-white/10 text-sm text-white focus:outline-none focus:border-white/30"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-mono text-zinc-500 uppercase block mb-1">
                        GitHub Profile URL
                      </label>
                      <input
                        type="url"
                        value={data.personalInfo.contact.github}
                        onChange={(e) => {
                          setData({
                            ...data,
                            personalInfo: {
                              ...data.personalInfo,
                              contact: { ...data.personalInfo.contact, github: e.target.value },
                            },
                          });
                          setIsDirty(true);
                        }}
                        className="w-full px-3.5 py-2 rounded-xl bg-white/[0.02] border border-white/10 text-sm text-white focus:outline-none focus:border-white/30"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-mono text-zinc-500 uppercase block mb-1">
                        LinkedIn Profile URL
                      </label>
                      <input
                        type="url"
                        value={data.personalInfo.contact.linkedin}
                        onChange={(e) => {
                          setData({
                            ...data,
                            personalInfo: {
                              ...data.personalInfo,
                              contact: { ...data.personalInfo.contact, linkedin: e.target.value },
                            },
                          });
                          setIsDirty(true);
                        }}
                        className="w-full px-3.5 py-2 rounded-xl bg-white/[0.02] border border-white/10 text-sm text-white focus:outline-none focus:border-white/30"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. FLAGSHIP PROJECTS TAB */}
            {activeTab === "flagship" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#08080c] border border-white/[0.06] rounded-2xl p-6">
                  <div>
                    <h2 className="text-lg font-semibold text-white tracking-tight">Flagship Projects</h2>
                    <p className="text-xs text-zinc-400 mt-1">
                      Prominently featured deep-dive projects showcased in the primary 2-column grid.
                    </p>
                  </div>
                  <button
                    onClick={() => addProject(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-zinc-950 text-xs font-semibold hover:bg-zinc-200 transition-all shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Flagship Project</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {data.featuredProjects.map((proj, pIdx) => (
                    <div
                      key={proj.id}
                      className="bg-[#08080c] border border-white/[0.06] rounded-2xl p-6 space-y-4 relative"
                    >
                      <div className="flex items-start justify-between gap-4 pb-3 border-b border-white/[0.06]">
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-full bg-white/[0.05] border border-white/10 text-zinc-400 font-mono text-xs flex items-center justify-center shrink-0">
                            {pIdx + 1}
                          </span>
                          <div>
                            <h3 className="text-base font-semibold text-white">{proj.title}</h3>
                            <span className="text-[11px] font-mono text-zinc-400">{proj.category}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => moveProject(pIdx, "up", true)}
                            disabled={pIdx === 0}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.05] disabled:opacity-30 disabled:hover:bg-transparent"
                            title="Move Up"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => moveProject(pIdx, "down", true)}
                            disabled={pIdx === data.featuredProjects.length - 1}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.05] disabled:opacity-30 disabled:hover:bg-transparent"
                            title="Move Down"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteProject(pIdx, true)}
                            className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 ml-1"
                            title="Delete Project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[11px] font-mono text-zinc-400 uppercase block mb-1">
                            Project Title
                          </label>
                          <input
                            type="text"
                            value={proj.title}
                            onChange={(e) => {
                              const updated = [...data.featuredProjects];
                              updated[pIdx].title = e.target.value;
                              setData({ ...data, featuredProjects: updated });
                              setIsDirty(true);
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/10 text-sm text-white focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-mono text-zinc-400 uppercase block mb-1">
                            Category / Subtitle Tagline
                          </label>
                          <input
                            type="text"
                            value={proj.category}
                            onChange={(e) => {
                              const updated = [...data.featuredProjects];
                              updated[pIdx].category = e.target.value;
                              setData({ ...data, featuredProjects: updated });
                              setIsDirty(true);
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/10 text-sm text-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-mono text-zinc-400 uppercase block mb-1">
                          Subtitle / Core Hook
                        </label>
                        <input
                          type="text"
                          value={proj.tagline}
                          onChange={(e) => {
                            const updated = [...data.featuredProjects];
                            updated[pIdx].tagline = e.target.value;
                            setData({ ...data, featuredProjects: updated });
                            setIsDirty(true);
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/10 text-sm text-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-mono text-zinc-400 uppercase block mb-1">
                          Description Narrative
                        </label>
                        <textarea
                          rows={3}
                          value={proj.description}
                          onChange={(e) => {
                            const updated = [...data.featuredProjects];
                            updated[pIdx].description = e.target.value;
                            setData({ ...data, featuredProjects: updated });
                            setIsDirty(true);
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/10 text-sm text-white focus:outline-none leading-relaxed"
                        />
                      </div>

                      {/* Technical highlights */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-[11px] font-mono text-zinc-400 uppercase">
                            Technical / Architecture Highlights (Bullets)
                          </label>
                          <button
                            onClick={() => {
                              const updated = [...data.featuredProjects];
                              updated[pIdx].architectureHighlights = [
                                ...updated[pIdx].architectureHighlights,
                                "New technical bullet point",
                              ];
                              setData({ ...data, featuredProjects: updated });
                              setIsDirty(true);
                            }}
                            className="text-[10px] font-mono text-blue-400 hover:text-blue-300 flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" /> Add Bullet
                          </button>
                        </div>
                        <div className="space-y-2">
                          {proj.architectureHighlights.map((hl, hlIdx) => (
                            <div key={hlIdx} className="flex items-center gap-2">
                              <span className="text-zinc-600 text-xs">•</span>
                              <input
                                type="text"
                                value={hl}
                                onChange={(e) => {
                                  const updated = [...data.featuredProjects];
                                  updated[pIdx].architectureHighlights[hlIdx] = e.target.value;
                                  setData({ ...data, featuredProjects: updated });
                                  setIsDirty(true);
                                }}
                                className="flex-1 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/10 text-xs text-white focus:outline-none"
                              />
                              <button
                                onClick={() => {
                                  const updated = [...data.featuredProjects];
                                  updated[pIdx].architectureHighlights = updated[
                                    pIdx
                                  ].architectureHighlights.filter((_, i) => i !== hlIdx);
                                  setData({ ...data, featuredProjects: updated });
                                  setIsDirty(true);
                                }}
                                className="p-1 text-zinc-500 hover:text-red-400"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Metrics Boxes */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-[11px] font-mono text-zinc-400 uppercase">
                            Metric Statistics Boxes
                          </label>
                          <button
                            onClick={() => {
                              const updated = [...data.featuredProjects];
                              updated[pIdx].metrics = [
                                ...updated[pIdx].metrics,
                                { label: "New Metric", value: "100%" },
                              ];
                              setData({ ...data, featuredProjects: updated });
                              setIsDirty(true);
                            }}
                            className="text-[10px] font-mono text-blue-400 hover:text-blue-300 flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" /> Add Metric
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {proj.metrics.map((met, mIdx) => (
                            <div
                              key={mIdx}
                              className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.08] relative group"
                            >
                              <button
                                onClick={() => {
                                  const updated = [...data.featuredProjects];
                                  updated[pIdx].metrics = updated[pIdx].metrics.filter(
                                    (_, i) => i !== mIdx
                                  );
                                  setData({ ...data, featuredProjects: updated });
                                  setIsDirty(true);
                                }}
                                className="absolute top-2 right-2 text-zinc-600 hover:text-red-400"
                              >
                                <X className="w-3 h-3" />
                              </button>
                              <div className="space-y-1.5">
                                <input
                                  type="text"
                                  value={met.value}
                                  placeholder="Value (e.g. 50K+)"
                                  onChange={(e) => {
                                    const updated = [...data.featuredProjects];
                                    updated[pIdx].metrics[mIdx].value = e.target.value;
                                    setData({ ...data, featuredProjects: updated });
                                    setIsDirty(true);
                                  }}
                                  className="w-full px-2 py-1 rounded bg-white/[0.03] border border-white/10 text-xs font-semibold text-white focus:outline-none"
                                />
                                <input
                                  type="text"
                                  value={met.label}
                                  placeholder="Label description"
                                  onChange={(e) => {
                                    const updated = [...data.featuredProjects];
                                    updated[pIdx].metrics[mIdx].label = e.target.value;
                                    setData({ ...data, featuredProjects: updated });
                                    setIsDirty(true);
                                  }}
                                  className="w-full px-2 py-1 rounded bg-white/[0.03] border border-white/10 text-[11px] text-zinc-400 focus:outline-none"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Tags and URLs */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/[0.04]">
                        <div>
                          <label className="text-[11px] font-mono text-zinc-400 uppercase block mb-1">
                            Technology Tags (Comma Separated)
                          </label>
                          <input
                            type="text"
                            value={proj.tags.join(", ")}
                            onChange={(e) => {
                              const updated = [...data.featuredProjects];
                              updated[pIdx].tags = e.target.value
                                .split(",")
                                .map((t) => t.trim())
                                .filter(Boolean);
                              setData({ ...data, featuredProjects: updated });
                              setIsDirty(true);
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/10 text-xs text-white focus:outline-none font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-mono text-zinc-400 uppercase block mb-1">
                            GitHub Repository Link
                          </label>
                          <input
                            type="url"
                            value={proj.githubUrl || ""}
                            onChange={(e) => {
                              const updated = [...data.featuredProjects];
                              updated[pIdx].githubUrl = e.target.value;
                              setData({ ...data, featuredProjects: updated });
                              setIsDirty(true);
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/10 text-xs text-white focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. SUPPORTING PROJECTS TAB */}
            {activeTab === "supporting" && (
              <div className="space-y-6">
                <div className="bg-[#08080c] border border-white/[0.06] rounded-2xl p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold text-white tracking-tight">
                        Supporting Analytical Projects
                      </h2>
                      <p className="text-xs text-zinc-400 mt-1">
                        Configure the section heading, subtitle note, expandable button text, and project entries.
                      </p>
                    </div>
                    <button
                      onClick={() => addProject(false)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-zinc-950 text-xs font-semibold hover:bg-zinc-200 transition-all shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Supporting Project</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-white/[0.06]">
                    <div>
                      <label className="text-[11px] font-mono text-zinc-400 uppercase block mb-1">
                        Section Heading
                      </label>
                      <input
                        type="text"
                        value={data.supportingProjectsHeading ?? "Supporting Analytical Projects"}
                        onChange={(e) => {
                          setData({ ...data, supportingProjectsHeading: e.target.value });
                          setIsDirty(true);
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/10 text-xs text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-mono text-zinc-400 uppercase block mb-1">
                        Expandable Button / Pill Text
                      </label>
                      <input
                        type="text"
                        value={data.supportingProjectsButtonText ?? "Inspect Supporting Pipelines (Credit Risk, Rail Telemetry, Financial Modeling)"}
                        onChange={(e) => {
                          setData({ ...data, supportingProjectsButtonText: e.target.value });
                          setIsDirty(true);
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/10 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-zinc-400 uppercase block mb-1">
                      Supporting Projects Subtitle / Context Note (e.g. Credit Risk Scorecard Engine note)
                    </label>
                    <textarea
                      rows={2}
                      value={data.supportingProjectsSubtitle ?? "Secondary systems and analytical pipelines (e.g. Credit Risk Scorecard Engine)."}
                      onChange={(e) => {
                        setData({ ...data, supportingProjectsSubtitle: e.target.value });
                        setIsDirty(true);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/10 text-xs text-white focus:outline-none leading-relaxed"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {data.supportingProjects.map((proj, pIdx) => (
                    <div
                      key={proj.id}
                      className="bg-[#08080c] border border-white/[0.06] rounded-2xl p-6 space-y-4"
                    >
                      <div className="flex items-start justify-between gap-4 pb-3 border-b border-white/[0.06]">
                        <div>
                          <h3 className="text-base font-semibold text-white">{proj.title}</h3>
                          <span className="text-[11px] font-mono text-zinc-400">{proj.category}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => moveProject(pIdx, "up", false)}
                            disabled={pIdx === 0}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.05] disabled:opacity-30"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => moveProject(pIdx, "down", false)}
                            disabled={pIdx === data.supportingProjects.length - 1}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.05] disabled:opacity-30"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteProject(pIdx, false)}
                            className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 ml-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[11px] font-mono text-zinc-400 uppercase block mb-1">
                            Title
                          </label>
                          <input
                            type="text"
                            value={proj.title}
                            onChange={(e) => {
                              const updated = [...data.supportingProjects];
                              updated[pIdx].title = e.target.value;
                              setData({ ...data, supportingProjects: updated });
                              setIsDirty(true);
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/10 text-sm text-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-mono text-zinc-400 uppercase block mb-1">
                            Category
                          </label>
                          <input
                            type="text"
                            value={proj.category}
                            onChange={(e) => {
                              const updated = [...data.supportingProjects];
                              updated[pIdx].category = e.target.value;
                              setData({ ...data, supportingProjects: updated });
                              setIsDirty(true);
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/10 text-sm text-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-mono text-zinc-400 uppercase block mb-1">
                          Description
                        </label>
                        <textarea
                          rows={3}
                          value={proj.description}
                          onChange={(e) => {
                            const updated = [...data.supportingProjects];
                            updated[pIdx].description = e.target.value;
                            setData({ ...data, supportingProjects: updated });
                            setIsDirty(true);
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/10 text-sm text-white focus:outline-none leading-relaxed"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[11px] font-mono text-zinc-400 uppercase block mb-1">
                            Tags (Comma separated)
                          </label>
                          <input
                            type="text"
                            value={proj.tags.join(", ")}
                            onChange={(e) => {
                              const updated = [...data.supportingProjects];
                              updated[pIdx].tags = e.target.value
                                .split(",")
                                .map((t) => t.trim())
                                .filter(Boolean);
                              setData({ ...data, supportingProjects: updated });
                              setIsDirty(true);
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/10 text-xs text-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-mono text-zinc-400 uppercase block mb-1">
                            GitHub Repository
                          </label>
                          <input
                            type="url"
                            value={proj.githubUrl || ""}
                            onChange={(e) => {
                              const updated = [...data.supportingProjects];
                              updated[pIdx].githubUrl = e.target.value;
                              setData({ ...data, supportingProjects: updated });
                              setIsDirty(true);
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/10 text-xs text-white focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. ABOUT & NARRATIVE TAB */}
            {activeTab === "about" && (
              <div className="bg-[#08080c] border border-white/[0.06] rounded-2xl p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-white tracking-tight">About & Narrative</h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Editorial positioning paragraphs and the 4 core analytical pillars.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-mono text-zinc-400 uppercase block mb-1">
                      Section Header Pill
                    </label>
                    <input
                      type="text"
                      value={data.about.pill}
                      onChange={(e) => {
                        setData({ ...data, about: { ...data.about, pill: e.target.value } });
                        setIsDirty(true);
                      }}
                      className="w-full px-3.5 py-2 rounded-xl bg-white/[0.02] border border-white/10 text-sm text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-zinc-400 uppercase block mb-1">
                      Section Heading
                    </label>
                    <input
                      type="text"
                      value={data.about.heading}
                      onChange={(e) => {
                        setData({ ...data, about: { ...data.about, heading: e.target.value } });
                        setIsDirty(true);
                      }}
                      className="w-full px-3.5 py-2 rounded-xl bg-white/[0.02] border border-white/10 text-sm text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-zinc-400 uppercase block mb-1">
                    Narrative Paragraph 1
                  </label>
                  <textarea
                    rows={4}
                    value={data.about.narrativeParagraph1}
                    onChange={(e) => {
                      setData({
                        ...data,
                        about: { ...data.about, narrativeParagraph1: e.target.value },
                      });
                      setIsDirty(true);
                    }}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/[0.02] border border-white/10 text-sm text-white focus:outline-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-zinc-400 uppercase block mb-1">
                    Narrative Paragraph 2
                  </label>
                  <textarea
                    rows={4}
                    value={data.about.narrativeParagraph2}
                    onChange={(e) => {
                      setData({
                        ...data,
                        about: { ...data.about, narrativeParagraph2: e.target.value },
                      });
                      setIsDirty(true);
                    }}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/[0.02] border border-white/10 text-sm text-white focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="pt-4 border-t border-white/[0.06]">
                  <h3 className="text-xs font-mono uppercase text-zinc-400 tracking-wider mb-4">
                    4 Core Analytical Pillars
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {data.about.pillars.map((pillar, pilIdx) => (
                      <div
                        key={pilIdx}
                        className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-2.5"
                      >
                        <div>
                          <label className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">
                            Pillar {pilIdx + 1} Title
                          </label>
                          <input
                            type="text"
                            value={pillar.title}
                            onChange={(e) => {
                              const updated = [...data.about.pillars];
                              updated[pilIdx].title = e.target.value;
                              setData({ ...data, about: { ...data.about, pillars: updated } });
                              setIsDirty(true);
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-xs font-semibold text-white focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">
                            Description
                          </label>
                          <textarea
                            rows={3}
                            value={pillar.description}
                            onChange={(e) => {
                              const updated = [...data.about.pillars];
                              updated[pilIdx].description = e.target.value;
                              setData({ ...data, about: { ...data.about, pillars: updated } });
                              setIsDirty(true);
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-xs text-zinc-300 focus:outline-none leading-relaxed"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 5. TELEMETRY & SCALE TAB */}
            {activeTab === "telemetry" && (
              <div className="bg-[#08080c] border border-white/[0.06] rounded-2xl p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-white tracking-tight">Evidence & Scale Telemetry</h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    The 4 quantified evidence counter cards rendered in the Evidence & Scale section.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {data.telemetry.map((tel, tIdx) => (
                    <div
                      key={tIdx}
                      className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-3"
                    >
                      <div className="text-xs font-mono text-blue-400 uppercase">Metric #{tIdx + 1}</div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">
                            End Number
                          </label>
                          <input
                            type="number"
                            step="any"
                            value={tel.end}
                            onChange={(e) => {
                              const updated = [...data.telemetry];
                              updated[tIdx].end = parseFloat(e.target.value) || 0;
                              setData({ ...data, telemetry: updated });
                              setIsDirty(true);
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-xs text-white focus:outline-none font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">
                            Suffix (e.g. M+, +, hrs)
                          </label>
                          <input
                            type="text"
                            value={tel.suffix || ""}
                            onChange={(e) => {
                              const updated = [...data.telemetry];
                              updated[tIdx].suffix = e.target.value;
                              setData({ ...data, telemetry: updated });
                              setIsDirty(true);
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-xs text-white focus:outline-none font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">
                          Label
                        </label>
                        <input
                          type="text"
                          value={tel.label}
                          onChange={(e) => {
                            const updated = [...data.telemetry];
                            updated[tIdx].label = e.target.value;
                            setData({ ...data, telemetry: updated });
                            setIsDirty(true);
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-xs font-semibold text-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">
                          Supporting Context
                        </label>
                        <input
                          type="text"
                          value={tel.sub}
                          onChange={(e) => {
                            const updated = [...data.telemetry];
                            updated[tIdx].sub = e.target.value;
                            setData({ ...data, telemetry: updated });
                            setIsDirty(true);
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-xs text-zinc-400 focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. EXPERIENCE TAB */}
            {activeTab === "experience" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#08080c] border border-white/[0.06] rounded-2xl p-6">
                  <div>
                    <h2 className="text-lg font-semibold text-white tracking-tight">Work & Research Experience</h2>
                    <p className="text-xs text-zinc-400 mt-1">
                      Manage fellowship positions, roles, institutional research, summary, domains, and achievements.
                    </p>
                  </div>
                  <button
                    onClick={addExperience}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-zinc-950 text-xs font-semibold hover:bg-zinc-200 transition-all shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Experience Item</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {data.experience.map((exp, eIdx) => (
                    <div
                      key={exp.id}
                      className="bg-[#08080c] border border-white/[0.06] rounded-2xl p-6 space-y-4"
                    >
                      <div className="flex items-start justify-between gap-4 pb-3 border-b border-white/[0.06]">
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-full bg-white/[0.05] border border-white/10 text-zinc-400 font-mono text-xs flex items-center justify-center shrink-0">
                            {eIdx + 1}
                          </span>
                          <div>
                            <h3 className="text-sm font-semibold text-white">{exp.role || "Untitled Role"}</h3>
                            <span className="text-[11px] font-mono text-zinc-400">{exp.organization}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => moveExperience(eIdx, "up")}
                            disabled={eIdx === 0}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.05] disabled:opacity-30"
                            title="Move Up"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveExperience(eIdx, "down")}
                            disabled={eIdx === data.experience.length - 1}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.05] disabled:opacity-30"
                            title="Move Down"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteExperience(eIdx)}
                            disabled={data.experience.length <= 1}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-20"
                            title="Delete Experience"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[11px] font-mono text-zinc-400 uppercase block mb-1">
                            Role Title
                          </label>
                          <input
                            type="text"
                            value={exp.role}
                            onChange={(e) => {
                              const updated = [...data.experience];
                              updated[eIdx].role = e.target.value;
                              setData({ ...data, experience: updated });
                              setIsDirty(true);
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/10 text-sm text-white focus:outline-none font-semibold"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-mono text-zinc-400 uppercase block mb-1">
                            Organization / Institution
                          </label>
                          <input
                            type="text"
                            value={exp.organization}
                            onChange={(e) => {
                              const updated = [...data.experience];
                              updated[eIdx].organization = e.target.value;
                              setData({ ...data, experience: updated });
                              setIsDirty(true);
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/10 text-sm text-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">
                            Period
                          </label>
                          <input
                            type="text"
                            value={exp.period}
                            onChange={(e) => {
                              const updated = [...data.experience];
                              updated[eIdx].period = e.target.value;
                              setData({ ...data, experience: updated });
                              setIsDirty(true);
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/10 text-xs text-white focus:outline-none font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">
                            Location
                          </label>
                          <input
                            type="text"
                            value={exp.location}
                            onChange={(e) => {
                              const updated = [...data.experience];
                              updated[eIdx].location = e.target.value;
                              setData({ ...data, experience: updated });
                              setIsDirty(true);
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/10 text-xs text-white focus:outline-none font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">
                            Program / Track
                          </label>
                          <input
                            type="text"
                            value={exp.program}
                            onChange={(e) => {
                              const updated = [...data.experience];
                              updated[eIdx].program = e.target.value;
                              setData({ ...data, experience: updated });
                              setIsDirty(true);
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/10 text-xs text-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-mono text-zinc-400 uppercase block mb-1">
                          Executive Summary
                        </label>
                        <textarea
                          rows={3}
                          value={exp.summary}
                          onChange={(e) => {
                            const updated = [...data.experience];
                            updated[eIdx].summary = e.target.value;
                            setData({ ...data, experience: updated });
                            setIsDirty(true);
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/10 text-xs text-white focus:outline-none leading-relaxed"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-mono text-zinc-400 uppercase block mb-1">
                          Technologies & Tools (Comma-separated)
                        </label>
                        <input
                          type="text"
                          value={(exp.tags || []).join(", ")}
                          onChange={(e) => {
                            const updated = [...data.experience];
                            updated[eIdx].tags = e.target.value
                              .split(",")
                              .map((s) => s.trim())
                              .filter(Boolean);
                            setData({ ...data, experience: updated });
                            setIsDirty(true);
                          }}
                          placeholder="e.g. MATLAB, CST Studio Suite, Signal Processing"
                          className="w-full px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/10 text-xs text-white focus:outline-none font-mono"
                        />
                      </div>

                      {/* Research Areas / Focus Blocks */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-[11px] font-mono text-zinc-400 uppercase">
                            Research Areas & Focus Blocks (Cards)
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...data.experience];
                              updated[eIdx].researchAreas = [
                                ...(updated[eIdx].researchAreas || []),
                                {
                                  id: `ra-${Date.now()}`,
                                  title: "NEW RESEARCH FOCUS",
                                  highlight: "Key Focus Area",
                                  description: "Detailed description of research methods and deliverables.",
                                },
                              ];
                              setData({ ...data, experience: updated });
                              setIsDirty(true);
                            }}
                            className="text-[10px] font-mono text-blue-400 hover:text-blue-300 flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" /> Add Research Area
                          </button>
                        </div>
                        <div className="space-y-3">
                          {(exp.researchAreas || []).map((area, raIdx) => (
                            <div
                              key={area.id || raIdx}
                              className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2 relative"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[10px] font-mono text-zinc-500">Area 0{raIdx + 1}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...data.experience];
                                    updated[eIdx].researchAreas = updated[eIdx].researchAreas.filter((_, i) => i !== raIdx);
                                    setData({ ...data, experience: updated });
                                    setIsDirty(true);
                                  }}
                                  disabled={exp.researchAreas.length <= 1}
                                  className="p-1 text-zinc-500 hover:text-red-400 disabled:opacity-20"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <input
                                type="text"
                                value={area.title}
                                placeholder="Area Title"
                                onChange={(e) => {
                                  const updated = [...data.experience];
                                  updated[eIdx].researchAreas[raIdx].title = e.target.value;
                                  setData({ ...data, experience: updated });
                                  setIsDirty(true);
                                }}
                                className="w-full px-2.5 py-1 rounded bg-white/[0.03] border border-white/10 text-xs font-semibold text-white focus:outline-none uppercase font-mono"
                              />
                              <textarea
                                rows={2}
                                value={area.description}
                                placeholder="Detailed description of research methodology and outcomes"
                                onChange={(e) => {
                                  const updated = [...data.experience];
                                  updated[eIdx].researchAreas[raIdx].description = e.target.value;
                                  setData({ ...data, experience: updated });
                                  setIsDirty(true);
                                }}
                                className="w-full px-2.5 py-1 rounded bg-white/[0.03] border border-white/10 text-xs text-zinc-300 focus:outline-none"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-[11px] font-mono text-zinc-400 uppercase">
                            Key Highlights & Achievements (Bullets)
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...data.experience];
                              updated[eIdx].highlights = [
                                ...(updated[eIdx].highlights || []),
                                "New research or technical milestone",
                              ];
                              setData({ ...data, experience: updated });
                              setIsDirty(true);
                            }}
                            className="text-[10px] font-mono text-blue-400 hover:text-blue-300 flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" /> Add Highlight Bullet
                          </button>
                        </div>
                        <div className="space-y-2">
                          {(exp.highlights || []).map((hl, hlIdx) => (
                            <div key={hlIdx} className="flex items-center gap-2">
                              <span className="text-zinc-600 text-xs">•</span>
                              <input
                                type="text"
                                value={hl}
                                onChange={(e) => {
                                  const updated = [...data.experience];
                                  updated[eIdx].highlights[hlIdx] = e.target.value;
                                  setData({ ...data, experience: updated });
                                  setIsDirty(true);
                                }}
                                className="flex-1 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/10 text-xs text-white focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...data.experience];
                                  updated[eIdx].highlights = updated[eIdx].highlights.filter(
                                    (_, i) => i !== hlIdx
                                  );
                                  setData({ ...data, experience: updated });
                                  setIsDirty(true);
                                }}
                                className="p-1 text-zinc-500 hover:text-red-400"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. EDUCATION TAB */}
            {activeTab === "education" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#08080c] border border-white/[0.06] rounded-2xl p-6">
                  <div>
                    <h2 className="text-lg font-semibold text-white tracking-tight">Academic Education & Degrees</h2>
                    <p className="text-xs text-zinc-400 mt-1">
                      Manage university degree credentials, graduation periods, locations, and academic context narratives.
                    </p>
                  </div>
                  <button
                    onClick={addEducationItem}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-zinc-950 text-xs font-semibold hover:bg-zinc-200 transition-all shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Degree / Program</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {getEducationList().map((edu, edIdx) => (
                    <div
                      key={edIdx}
                      className="bg-[#08080c] border border-white/[0.06] rounded-2xl p-6 space-y-4"
                    >
                      <div className="flex items-start justify-between gap-4 pb-3 border-b border-white/[0.06]">
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-full bg-white/[0.05] border border-white/10 text-zinc-400 font-mono text-xs flex items-center justify-center shrink-0">
                            {edIdx + 1}
                          </span>
                          <div>
                            <h3 className="text-sm font-semibold text-white">{edu.degree || "Untitled Degree"}</h3>
                            <span className="text-[11px] font-mono text-zinc-400">{edu.institution}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => moveEducationItem(edIdx, "up")}
                            disabled={edIdx === 0}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.05] disabled:opacity-30"
                            title="Move Up"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveEducationItem(edIdx, "down")}
                            disabled={edIdx === getEducationList().length - 1}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.05] disabled:opacity-30"
                            title="Move Down"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteEducationItem(edIdx)}
                            disabled={getEducationList().length <= 1}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-20"
                            title="Delete Degree"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[11px] font-mono text-zinc-400 uppercase block mb-1">
                            Degree Title
                          </label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => {
                              const updated = [...getEducationList()];
                              updated[edIdx] = { ...updated[edIdx], degree: e.target.value };
                              updateEducationList(updated);
                            }}
                            className="w-full px-3.5 py-2 rounded-xl bg-white/[0.02] border border-white/10 text-sm text-white focus:outline-none font-semibold"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-mono text-zinc-400 uppercase block mb-1">
                            Institution / University
                          </label>
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) => {
                              const updated = [...getEducationList()];
                              updated[edIdx] = { ...updated[edIdx], institution: e.target.value };
                              updateEducationList(updated);
                            }}
                            className="w-full px-3.5 py-2 rounded-xl bg-white/[0.02] border border-white/10 text-sm text-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">
                            Graduation Period
                          </label>
                          <input
                            type="text"
                            value={edu.period}
                            onChange={(e) => {
                              const updated = [...getEducationList()];
                              updated[edIdx] = { ...updated[edIdx], period: e.target.value };
                              updateEducationList(updated);
                            }}
                            className="w-full px-3.5 py-2 rounded-xl bg-white/[0.02] border border-white/10 text-xs text-white focus:outline-none font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">
                            Campus Location
                          </label>
                          <input
                            type="text"
                            value={edu.location}
                            onChange={(e) => {
                              const updated = [...getEducationList()];
                              updated[edIdx] = { ...updated[edIdx], location: e.target.value };
                              updateEducationList(updated);
                            }}
                            className="w-full px-3.5 py-2 rounded-xl bg-white/[0.02] border border-white/10 text-xs text-white focus:outline-none font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-mono text-zinc-400 uppercase block mb-1">
                          Academic Framing & Technical Context
                        </label>
                        <textarea
                          rows={3}
                          value={edu.framing}
                          onChange={(e) => {
                            const updated = [...getEducationList()];
                            updated[edIdx] = { ...updated[edIdx], framing: e.target.value };
                            updateEducationList(updated);
                          }}
                          className="w-full px-3.5 py-2 rounded-xl bg-white/[0.02] border border-white/10 text-sm text-white focus:outline-none leading-relaxed"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 8. SKILLS & INTERESTS TAB */}
            {activeTab === "skills" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#08080c] border border-white/[0.06] rounded-2xl p-6">
                  <div>
                    <h2 className="text-lg font-semibold text-white tracking-tight">Skills & Domains of Interest</h2>
                    <p className="text-xs text-zinc-400 mt-1">
                      Manage technical skill categories, specialized tooling, and areas of interest chips.
                    </p>
                  </div>
                  <button
                    onClick={addSkillGroup}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-zinc-950 text-xs font-semibold hover:bg-zinc-200 transition-all shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Skill Category</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-mono uppercase text-zinc-400 tracking-wider">
                    Core Technical Skill Categories
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {data.skillGroups.map((grp, gIdx) => (
                      <div
                        key={gIdx}
                        className="p-5 rounded-2xl bg-[#08080c] border border-white/[0.08] space-y-3"
                      >
                        <div className="flex items-center justify-between gap-3 pb-2 border-b border-white/[0.06]">
                          <span className="text-xs font-mono font-semibold text-blue-400 uppercase">
                            Category #{gIdx + 1}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => moveSkillGroup(gIdx, "up")}
                              disabled={gIdx === 0}
                              className="p-1 rounded text-zinc-400 hover:text-white hover:bg-white/[0.05] disabled:opacity-30"
                              title="Move Up"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveSkillGroup(gIdx, "down")}
                              disabled={gIdx === data.skillGroups.length - 1}
                              className="p-1 rounded text-zinc-400 hover:text-white hover:bg-white/[0.05] disabled:opacity-30"
                              title="Move Down"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteSkillGroup(gIdx)}
                              disabled={data.skillGroups.length <= 1}
                              className="p-1 rounded text-zinc-500 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-20"
                              title="Delete Category"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">
                            Category Name
                          </label>
                          <input
                            type="text"
                            value={grp.name}
                            onChange={(e) => {
                              const updated = [...data.skillGroups];
                              updated[gIdx].name = e.target.value;
                              setData({ ...data, skillGroups: updated });
                              setIsDirty(true);
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-xs font-semibold text-white focus:outline-none font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">
                            Description
                          </label>
                          <input
                            type="text"
                            value={grp.description}
                            onChange={(e) => {
                              const updated = [...data.skillGroups];
                              updated[gIdx].description = e.target.value;
                              setData({ ...data, skillGroups: updated });
                              setIsDirty(true);
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-xs text-zinc-300 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">
                            Skills List (Comma-separated)
                          </label>
                          <textarea
                            rows={3}
                            value={grp.skills.join(", ")}
                            onChange={(e) => {
                              const updated = [...data.skillGroups];
                              updated[gIdx].skills = e.target.value
                                .split(",")
                                .map((s) => s.trim())
                                .filter(Boolean);
                              setData({ ...data, skillGroups: updated });
                              setIsDirty(true);
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-xs text-zinc-300 focus:outline-none leading-relaxed"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#08080c] border border-white/[0.06] rounded-2xl p-6">
                  <label className="text-xs font-mono uppercase text-zinc-400 tracking-wider block mb-2">
                    Areas of Interest & Domain Focus (Comma-separated)
                  </label>
                  <textarea
                    rows={3}
                    value={data.areasOfInterest.join(", ")}
                    onChange={(e) => {
                      setData({
                        ...data,
                        areasOfInterest: e.target.value
                          .split(",")
                          .map((a) => a.trim())
                          .filter(Boolean),
                      });
                      setIsDirty(true);
                    }}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/[0.02] border border-white/10 text-sm text-white focus:outline-none leading-relaxed font-mono text-xs"
                  />
                </div>
              </div>
            )}

            {/* 9. CREDENTIALS & ACHIEVEMENTS TAB */}
            {activeTab === "credentials" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#08080c] border border-white/[0.06] rounded-2xl p-6">
                  <div>
                    <h2 className="text-lg font-semibold text-white tracking-tight">Credentials & Honors</h2>
                    <p className="text-xs text-zinc-400 mt-1">
                      Manage industry certifications, tracks, credentials, and competitive hackathon milestones.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={addCertCategory}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-zinc-950 text-xs font-semibold hover:bg-zinc-200 transition-all shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Cert Category</span>
                    </button>
                    <button
                      onClick={addAchievement}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-semibold text-white transition-all shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5 text-amber-400" />
                      <span>Add Achievement</span>
                    </button>
                  </div>
                </div>

                {/* Certifications Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-mono uppercase text-zinc-400 tracking-wider">
                      Certifications & Professional Credentials
                    </h3>
                  </div>

                  {data.certifications.map((cat, cIdx) => (
                    <div
                      key={cIdx}
                      className="p-5 rounded-2xl bg-[#08080c] border border-white/[0.08] space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
                        <div className="flex-1 max-w-md">
                          <label className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">
                            Track Category Title
                          </label>
                          <input
                            type="text"
                            value={cat.category}
                            onChange={(e) => {
                              const updated = [...data.certifications];
                              updated[cIdx].category = e.target.value;
                              setData({ ...data, certifications: updated });
                              setIsDirty(true);
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-xs font-semibold text-blue-400 focus:outline-none font-mono"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => addCertItem(cIdx)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/20 text-xs font-medium transition-all"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add Cert</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => moveCertCategory(cIdx, "up")}
                            disabled={cIdx === 0}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.05] disabled:opacity-30"
                            title="Move Category Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveCertCategory(cIdx, "down")}
                            disabled={cIdx === data.certifications.length - 1}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.05] disabled:opacity-30"
                            title="Move Category Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteCertCategory(cIdx)}
                            disabled={data.certifications.length <= 1}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-20"
                            title="Delete Category"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {cat.items.map((it, itIdx) => (
                          <div
                            key={itIdx}
                            className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2.5 relative group"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] font-mono text-zinc-500">#{itIdx + 1}</span>
                              <button
                                type="button"
                                onClick={() => deleteCertItem(cIdx, itIdx)}
                                disabled={cat.items.length <= 1}
                                className="p-1 text-zinc-500 hover:text-red-400 disabled:opacity-20"
                                title="Delete Certificate"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <input
                              type="text"
                              value={it.name}
                              placeholder="Certificate name"
                              onChange={(e) => {
                                const updated = [...data.certifications];
                                updated[cIdx].items[itIdx].name = e.target.value;
                                setData({ ...data, certifications: updated });
                                setIsDirty(true);
                              }}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-xs font-semibold text-white focus:outline-none"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={it.issuer}
                                placeholder="Issuer (e.g. AWS)"
                                onChange={(e) => {
                                  const updated = [...data.certifications];
                                  updated[cIdx].items[itIdx].issuer = e.target.value;
                                  setData({ ...data, certifications: updated });
                                  setIsDirty(true);
                                }}
                                className="w-full px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/10 text-[11px] text-zinc-300 focus:outline-none"
                              />
                              <input
                                type="text"
                                value={it.year}
                                placeholder="Year"
                                onChange={(e) => {
                                  const updated = [...data.certifications];
                                  updated[cIdx].items[itIdx].year = e.target.value;
                                  setData({ ...data, certifications: updated });
                                  setIsDirty(true);
                                }}
                                className="w-full px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/10 text-[11px] text-zinc-300 focus:outline-none font-mono"
                              />
                            </div>
                            <input
                              type="text"
                              value={it.highlight || ""}
                              placeholder="Highlight note (e.g. Top Percentile)"
                              onChange={(e) => {
                                const updated = [...data.certifications];
                                updated[cIdx].items[itIdx].highlight = e.target.value;
                                setData({ ...data, certifications: updated });
                                setIsDirty(true);
                              }}
                              className="w-full px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/10 text-[10px] text-zinc-400 focus:outline-none"
                            />
                            <input
                              type="url"
                              value={it.verifyUrl || ""}
                              placeholder="Verification URL (optional)"
                              onChange={(e) => {
                                const updated = [...data.certifications];
                                updated[cIdx].items[itIdx].verifyUrl = e.target.value;
                                setData({ ...data, certifications: updated });
                                setIsDirty(true);
                              }}
                              className="w-full px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/10 text-[10px] text-zinc-500 focus:outline-none font-mono"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Achievements Section */}
                <div className="space-y-4 pt-4 border-t border-white/[0.06]">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-mono uppercase text-zinc-400 tracking-wider">
                      Competitive Achievements & Hackathons
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {data.achievements.map((ach, aIdx) => (
                      <div
                        key={ach.id}
                        className="p-5 rounded-2xl bg-[#08080c] border border-white/[0.08] space-y-3"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                          <span className="text-xs font-mono font-semibold text-amber-400">
                            Milestone #{aIdx + 1}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => moveAchievement(aIdx, "up")}
                              disabled={aIdx === 0}
                              className="p-1 rounded text-zinc-400 hover:text-white hover:bg-white/[0.05] disabled:opacity-30"
                              title="Move Up"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveAchievement(aIdx, "down")}
                              disabled={aIdx === data.achievements.length - 1}
                              className="p-1 rounded text-zinc-400 hover:text-white hover:bg-white/[0.05] disabled:opacity-30"
                              title="Move Down"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteAchievement(aIdx)}
                              disabled={data.achievements.length <= 1}
                              className="p-1 rounded text-zinc-500 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-20"
                              title="Delete Achievement"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <input
                            type="text"
                            value={ach.title}
                            placeholder="Title"
                            onChange={(e) => {
                              const updated = [...data.achievements];
                              updated[aIdx].title = e.target.value;
                              setData({ ...data, achievements: updated });
                              setIsDirty(true);
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-xs font-semibold text-white focus:outline-none"
                          />
                          <input
                            type="text"
                            value={ach.badge}
                            placeholder="Badge label"
                            onChange={(e) => {
                              const updated = [...data.achievements];
                              updated[aIdx].badge = e.target.value;
                              setData({ ...data, achievements: updated });
                              setIsDirty(true);
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-xs text-amber-300 focus:outline-none font-mono"
                          />
                          <input
                            type="text"
                            value={ach.year}
                            placeholder="Year"
                            onChange={(e) => {
                              const updated = [...data.achievements];
                              updated[aIdx].year = e.target.value;
                              setData({ ...data, achievements: updated });
                              setIsDirty(true);
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-xs text-zinc-400 focus:outline-none font-mono"
                          />
                        </div>

                        <textarea
                          rows={2}
                          value={ach.description}
                          placeholder="Description narrative"
                          onChange={(e) => {
                            const updated = [...data.achievements];
                            updated[aIdx].description = e.target.value;
                            setData({ ...data, achievements: updated });
                            setIsDirty(true);
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-xs text-zinc-300 focus:outline-none"
                        />

                        <input
                          type="text"
                          value={ach.impactMetrics || ""}
                          placeholder="Impact metrics (e.g. 50+ Global Teams)"
                          onChange={(e) => {
                            const updated = [...data.achievements];
                            updated[aIdx].impactMetrics = e.target.value;
                            setData({ ...data, achievements: updated });
                            setIsDirty(true);
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-xs text-zinc-400 focus:outline-none font-mono"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 10. CONTACT & INQUIRIES TAB */}
            {activeTab === "contact" && (
              <div className="bg-[#08080c] border border-white/[0.06] rounded-2xl p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-white tracking-tight">Contact & Inquiries Section</h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Configure the public contact call-to-action, section heading, supporting copy, and resume request card.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-1.5">
                      Section Pill Label
                    </label>
                    <input
                      type="text"
                      value={data.contactSection?.pill ?? "Get in Touch"}
                      onChange={(e) => {
                        setData({
                          ...data,
                          contactSection: {
                            pill: e.target.value,
                            heading: data.contactSection?.heading ?? "Start a Conversation",
                            subheading: data.contactSection?.subheading ?? "",
                            resumeCardTitle: data.contactSection?.resumeCardTitle ?? "",
                            resumeCardDescription: data.contactSection?.resumeCardDescription ?? "",
                            resumeButtonText: data.contactSection?.resumeButtonText ?? "",
                          },
                        });
                        setIsDirty(true);
                      }}
                      className="w-full px-3.5 py-2 rounded-xl bg-white/[0.02] border border-white/10 text-sm text-white focus:outline-none font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-1.5">
                      Section Main Heading
                    </label>
                    <input
                      type="text"
                      value={data.contactSection?.heading ?? "Start a Conversation"}
                      onChange={(e) => {
                        setData({
                          ...data,
                          contactSection: {
                            pill: data.contactSection?.pill ?? "Get in Touch",
                            heading: e.target.value,
                            subheading: data.contactSection?.subheading ?? "",
                            resumeCardTitle: data.contactSection?.resumeCardTitle ?? "",
                            resumeCardDescription: data.contactSection?.resumeCardDescription ?? "",
                            resumeButtonText: data.contactSection?.resumeButtonText ?? "",
                          },
                        });
                        setIsDirty(true);
                      }}
                      className="w-full px-3.5 py-2 rounded-xl bg-white/[0.02] border border-white/10 text-sm text-white focus:outline-none font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-1.5">
                    Supporting Subheading / Callout Narrative
                  </label>
                  <textarea
                    rows={2}
                    value={
                      data.contactSection?.subheading ??
                      "Open to analytics, risk, product, operations, and data-focused opportunities. Reach out directly or send a message."
                    }
                    onChange={(e) => {
                      setData({
                        ...data,
                        contactSection: {
                          pill: data.contactSection?.pill ?? "Get in Touch",
                          heading: data.contactSection?.heading ?? "Start a Conversation",
                          subheading: e.target.value,
                          resumeCardTitle: data.contactSection?.resumeCardTitle ?? "",
                          resumeCardDescription: data.contactSection?.resumeCardDescription ?? "",
                          resumeButtonText: data.contactSection?.resumeButtonText ?? "",
                        },
                      });
                      setIsDirty(true);
                    }}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/[0.02] border border-white/10 text-sm text-white focus:outline-none leading-relaxed"
                  />
                </div>

                {/* Resume Request Card Configuration */}
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono uppercase text-zinc-300 tracking-wider font-semibold">
                      Official Résumé Request Card
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-mono text-zinc-400 uppercase block mb-1">
                        Card Title
                      </label>
                      <input
                        type="text"
                        value={data.contactSection?.resumeCardTitle ?? "Need an Official Résumé?"}
                        onChange={(e) => {
                          setData({
                            ...data,
                            contactSection: {
                              pill: data.contactSection?.pill ?? "Get in Touch",
                              heading: data.contactSection?.heading ?? "Start a Conversation",
                              subheading: data.contactSection?.subheading ?? "",
                              resumeCardTitle: e.target.value,
                              resumeCardDescription: data.contactSection?.resumeCardDescription ?? "",
                              resumeButtonText: data.contactSection?.resumeButtonText ?? "",
                            },
                          });
                          setIsDirty(true);
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/10 text-xs text-white focus:outline-none font-semibold"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-mono text-zinc-400 uppercase block mb-1">
                        Button Action Label
                      </label>
                      <input
                        type="text"
                        value={data.contactSection?.resumeButtonText ?? "Request Résumé Form"}
                        onChange={(e) => {
                          setData({
                            ...data,
                            contactSection: {
                              pill: data.contactSection?.pill ?? "Get in Touch",
                              heading: data.contactSection?.heading ?? "Start a Conversation",
                              subheading: data.contactSection?.subheading ?? "",
                              resumeCardTitle: data.contactSection?.resumeCardTitle ?? "",
                              resumeCardDescription: data.contactSection?.resumeCardDescription ?? "",
                              resumeButtonText: e.target.value,
                            },
                          });
                          setIsDirty(true);
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/10 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-zinc-400 uppercase block mb-1">
                      Card Explanatory Description
                    </label>
                    <textarea
                      rows={2}
                      value={
                        data.contactSection?.resumeCardDescription ??
                        "To provide tailored versions aligned with specific role requirements, resumes are shared directly upon verified request."
                      }
                      onChange={(e) => {
                        setData({
                          ...data,
                          contactSection: {
                            pill: data.contactSection?.pill ?? "Get in Touch",
                            heading: data.contactSection?.heading ?? "Start a Conversation",
                            subheading: data.contactSection?.subheading ?? "",
                            resumeCardTitle: data.contactSection?.resumeCardTitle ?? "",
                            resumeCardDescription: e.target.value,
                            resumeButtonText: data.contactSection?.resumeButtonText ?? "",
                          },
                        });
                        setIsDirty(true);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/10 text-xs text-white focus:outline-none leading-relaxed"
                    />
                  </div>
                </div>

                {/* Direct Contact Coordinates */}
                <div className="pt-4 border-t border-white/[0.06]">
                  <h3 className="text-xs font-mono uppercase text-zinc-400 tracking-wider mb-4">
                    Direct Contact Coordinates (Syncs with Global Profile)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-mono text-zinc-500 uppercase block mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={data.personalInfo.contact.email}
                        onChange={(e) => {
                          setData({
                            ...data,
                            personalInfo: {
                              ...data.personalInfo,
                              contact: { ...data.personalInfo.contact, email: e.target.value },
                            },
                          });
                          setIsDirty(true);
                        }}
                        className="w-full px-3.5 py-2 rounded-xl bg-white/[0.02] border border-white/10 text-sm text-white focus:outline-none font-mono text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-mono text-zinc-500 uppercase block mb-1">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="text"
                        value={data.personalInfo.contact.phone}
                        onChange={(e) => {
                          setData({
                            ...data,
                            personalInfo: {
                              ...data.personalInfo,
                              contact: { ...data.personalInfo.contact, phone: e.target.value },
                            },
                          });
                          setIsDirty(true);
                        }}
                        className="w-full px-3.5 py-2 rounded-xl bg-white/[0.02] border border-white/10 text-sm text-white focus:outline-none font-mono text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-mono text-zinc-500 uppercase block mb-1">
                        Location / Timezone
                      </label>
                      <input
                        type="text"
                        value={data.personalInfo.contact.location}
                        onChange={(e) => {
                          setData({
                            ...data,
                            personalInfo: {
                              ...data.personalInfo,
                              contact: { ...data.personalInfo.contact, location: e.target.value },
                            },
                          });
                          setIsDirty(true);
                        }}
                        className="w-full px-3.5 py-2 rounded-xl bg-white/[0.02] border border-white/10 text-sm text-white focus:outline-none font-mono text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-mono text-zinc-500 uppercase block mb-1">
                        LinkedIn Profile
                      </label>
                      <input
                        type="url"
                        value={data.personalInfo.contact.linkedin}
                        onChange={(e) => {
                          setData({
                            ...data,
                            personalInfo: {
                              ...data.personalInfo,
                              contact: { ...data.personalInfo.contact, linkedin: e.target.value },
                            },
                          });
                          setIsDirty(true);
                        }}
                        className="w-full px-3.5 py-2 rounded-xl bg-white/[0.02] border border-white/10 text-sm text-white focus:outline-none font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 10. SETTINGS & BACKUPS TAB */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                {/* Security Card */}
                <div className="bg-[#08080c] border border-white/[0.06] rounded-2xl p-6 sm:p-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                      <KeyRound className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-white">Password & Security</h2>
                      <p className="text-xs text-zinc-400">
                        Admin sessions are protected with PBKDF2 salting and timing-safe authentication.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-white transition-all"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-blue-400" />
                    <span>Change Admin Password</span>
                  </button>
                </div>

                {/* Backups & Persistence Card */}
                <div className="bg-[#08080c] border border-white/[0.06] rounded-2xl p-6 sm:p-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <Download className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-white">Backup & Portability</h2>
                      <p className="text-xs text-zinc-400">
                        Download full portfolio JSON backups or restore a previous snapshot at any time.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={handleExportBackup}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-zinc-950 text-xs font-semibold hover:bg-zinc-200 transition-all shadow-md"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download JSON Backup</span>
                    </button>

                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-white transition-all"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Import JSON Backup</span>
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImportBackup}
                      accept=".json"
                      className="hidden"
                    />
                  </div>
                </div>

                {/* GitHub Sync Info Card */}
                <div className="bg-[#08080c] border border-white/[0.06] rounded-2xl p-6 sm:p-8 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase text-zinc-400 tracking-wider">
                    <FolderKanban className="w-4 h-4 text-zinc-300" />
                    <span>Optional Permanent GitHub Repository Sync</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    By default, changes are instantly saved to persistent local / serverless storage and active in-memory cache. If you want changes made from the admin panel to also create git commits in your GitHub repository automatically, you can set these environment variables on Vercel:
                  </p>
                  <div className="p-3 rounded-xl bg-black/60 border border-white/10 font-mono text-[11px] text-zinc-300 space-y-1">
                    <div>GITHUB_TOKEN=ghp_yourPersonalAccessToken</div>
                    <div>GITHUB_REPO=Saksham3124/Portfolio</div>
                    <div>GITHUB_BRANCH=main</div>
                  </div>
                </div>

                {/* Danger Zone: Reset to Factory Defaults */}
                <div className="bg-[#08080c] border border-red-500/20 rounded-2xl p-6 sm:p-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                      <RotateCcw className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-red-400">Danger Zone</h2>
                      <p className="text-xs text-zinc-400">
                        Reset all portfolio data back to the clean, original hardcoded defaults.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowResetConfirmModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-xs font-semibold text-red-300 transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset All Data to Original State</span>
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* CHANGE PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0a0a0e] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => {
                setShowPasswordModal(false);
                setPwModalError("");
                setPwModalSuccess("");
              }}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Change Admin Password</h3>
                <p className="text-xs text-zinc-400">Encrypted with salted PBKDF2</p>
              </div>
            </div>

            {pwModalError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{pwModalError}</span>
              </div>
            )}

            {pwModalSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>{pwModalSuccess}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="text-xs font-mono uppercase text-zinc-400 tracking-wider block mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-white focus:outline-none focus:border-blue-400/50"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-zinc-400 tracking-wider block mb-1.5">
                  New Password (min 6 characters)
                </label>
                <input
                  type="password"
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-white focus:outline-none focus:border-blue-400/50"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-zinc-400 tracking-wider block mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-white focus:outline-none focus:border-blue-400/50"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-xs font-medium text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={pwSubmitting}
                  className="px-4 py-2 rounded-xl bg-white text-zinc-950 font-semibold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all flex items-center gap-1.5"
                >
                  {pwSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Encrypting...</span>
                    </>
                  ) : (
                    <span>Update Password</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM RESET MODAL */}
      {showResetConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0a0a0e] border border-red-500/20 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Reset All Portfolio Data?</h3>
                <p className="text-xs text-zinc-400">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              Are you sure you want to restore the entire portfolio content back to the original hardcoded template? Any customized project metrics, narrative changes, or highlights will be replaced.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setShowResetConfirmModal(false)}
                className="px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-xs font-medium text-zinc-300"
              >
                Cancel
              </button>
              <button
                onClick={handleResetToDefault}
                disabled={resetting}
                className="px-4 py-2 rounded-xl bg-red-500 text-white font-semibold text-xs uppercase tracking-wider hover:bg-red-600 transition-all flex items-center gap-1.5"
              >
                {resetting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Resetting...</span>
                  </>
                ) : (
                  <span>Yes, Reset to Default</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
