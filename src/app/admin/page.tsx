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
} from "lucide-react";
import {
  PortfolioContentData,
  DEFAULT_PORTFOLIO_CONTENT,
} from "@/lib/portfolioModel";
import { Project } from "@/data/portfolioData";

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
        // Notify other tabs / live preview
        window.dispatchEvent(new Event("portfolio-data-updated"));
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
                { id: "education", label: "Education (BIT Mesra)", icon: GraduationCap },
                { id: "skills", label: "Skills & Interests", icon: Sparkles },
                { id: "credentials", label: "Credentials & Honors", icon: Award },
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#08080c] border border-white/[0.06] rounded-2xl p-6">
                  <div>
                    <h2 className="text-lg font-semibold text-white tracking-tight">
                      Supporting Analytical Projects
                    </h2>
                    <p className="text-xs text-zinc-400 mt-1">
                      Secondary systems and analytical pipelines (e.g. Credit Risk Scorecard Engine).
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
              <div className="bg-[#08080c] border border-white/[0.06] rounded-2xl p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-white tracking-tight">Work & Research Experience</h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    LNMIIT Research Fellowship details, technical highlights, and research areas.
                  </p>
                </div>

                {data.experience.map((exp, eIdx) => (
                  <div key={exp.id} className="space-y-4 pt-4 border-t border-white/[0.06] first:border-0 first:pt-0">
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
                          Program
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
                        Core Highlights (One per line)
                      </label>
                      <textarea
                        rows={3}
                        value={exp.highlights.join("\n")}
                        onChange={(e) => {
                          const updated = [...data.experience];
                          updated[eIdx].highlights = e.target.value.split("\n").filter(Boolean);
                          setData({ ...data, experience: updated });
                          setIsDirty(true);
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/10 text-xs text-white focus:outline-none leading-relaxed"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 7. EDUCATION TAB */}
            {activeTab === "education" && (
              <div className="bg-[#08080c] border border-white/[0.06] rounded-2xl p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-white tracking-tight">Academic Education</h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Formal degree training at Birla Institute of Technology, Mesra.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-mono text-zinc-400 uppercase block mb-1">
                      Degree
                    </label>
                    <input
                      type="text"
                      value={data.education.degree}
                      onChange={(e) => {
                        setData({
                          ...data,
                          education: { ...data.education, degree: e.target.value },
                        });
                        setIsDirty(true);
                      }}
                      className="w-full px-3.5 py-2 rounded-xl bg-white/[0.02] border border-white/10 text-sm text-white focus:outline-none font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-zinc-400 uppercase block mb-1">
                      Institution
                    </label>
                    <input
                      type="text"
                      value={data.education.institution}
                      onChange={(e) => {
                        setData({
                          ...data,
                          education: { ...data.education, institution: e.target.value },
                        });
                        setIsDirty(true);
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
                      value={data.education.period}
                      onChange={(e) => {
                        setData({
                          ...data,
                          education: { ...data.education, period: e.target.value },
                        });
                        setIsDirty(true);
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
                      value={data.education.location}
                      onChange={(e) => {
                        setData({
                          ...data,
                          education: { ...data.education, location: e.target.value },
                        });
                        setIsDirty(true);
                      }}
                      className="w-full px-3.5 py-2 rounded-xl bg-white/[0.02] border border-white/10 text-xs text-white focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-zinc-400 uppercase block mb-1">
                    Academic Framing & Context
                  </label>
                  <textarea
                    rows={4}
                    value={data.education.framing}
                    onChange={(e) => {
                      setData({
                        ...data,
                        education: { ...data.education, framing: e.target.value },
                      });
                      setIsDirty(true);
                    }}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/[0.02] border border-white/10 text-sm text-white focus:outline-none leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* 8. SKILLS & INTERESTS TAB */}
            {activeTab === "skills" && (
              <div className="bg-[#08080c] border border-white/[0.06] rounded-2xl p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-white tracking-tight">Skills & Domains of Interest</h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Manage the 4 categorized technical skill groups and areas of interest chips.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-mono uppercase text-zinc-400 tracking-wider">
                    Core Technical Skill Categories
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {data.skillGroups.map((grp, gIdx) => (
                      <div
                        key={gIdx}
                        className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-2.5"
                      >
                        <div>
                          <label className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">
                            Group Name
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

                <div className="pt-4 border-t border-white/[0.06]">
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
                    className="w-full px-3.5 py-2 rounded-xl bg-white/[0.02] border border-white/10 text-sm text-white focus:outline-none leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* 9. CREDENTIALS & ACHIEVEMENTS TAB */}
            {activeTab === "credentials" && (
              <div className="bg-[#08080c] border border-white/[0.06] rounded-2xl p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-white tracking-tight">Credentials & Honors</h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Industry certifications and competitive hackathon milestones.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-mono uppercase text-zinc-400 tracking-wider">
                    Certifications & Professional Credentials
                  </h3>
                  {data.certifications.map((cat, cIdx) => (
                    <div
                      key={cIdx}
                      className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-3"
                    >
                      <div className="text-xs font-mono font-semibold text-blue-400 uppercase">
                        {cat.category}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {cat.items.map((it, itIdx) => (
                          <div
                            key={itIdx}
                            className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] space-y-2"
                          >
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
                              className="w-full px-2.5 py-1 rounded bg-white/[0.03] border border-white/10 text-xs font-semibold text-white focus:outline-none"
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
                                className="w-full px-2 py-1 rounded bg-white/[0.03] border border-white/10 text-[11px] text-zinc-300 focus:outline-none"
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
                                className="w-full px-2 py-1 rounded bg-white/[0.03] border border-white/10 text-[11px] text-zinc-300 focus:outline-none font-mono"
                              />
                            </div>
                            <input
                              type="text"
                              value={it.highlight || ""}
                              placeholder="Highlight note"
                              onChange={(e) => {
                                const updated = [...data.certifications];
                                updated[cIdx].items[itIdx].highlight = e.target.value;
                                setData({ ...data, certifications: updated });
                                setIsDirty(true);
                              }}
                              className="w-full px-2 py-1 rounded bg-white/[0.03] border border-white/10 text-[10px] text-zinc-400 focus:outline-none"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/[0.06] space-y-4">
                  <h3 className="text-xs font-mono uppercase text-zinc-400 tracking-wider">
                    Competitive Achievements & Hackathons
                  </h3>
                  <div className="space-y-4">
                    {data.achievements.map((ach, aIdx) => (
                      <div
                        key={ach.id}
                        className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-3"
                      >
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
                            className="w-full px-2.5 py-1.5 rounded bg-white/[0.03] border border-white/10 text-xs font-semibold text-white focus:outline-none"
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
                            className="w-full px-2.5 py-1.5 rounded bg-white/[0.03] border border-white/10 text-xs text-amber-300 focus:outline-none font-mono"
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
                            className="w-full px-2.5 py-1.5 rounded bg-white/[0.03] border border-white/10 text-xs text-zinc-400 focus:outline-none font-mono"
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
                          className="w-full px-2.5 py-1.5 rounded bg-white/[0.03] border border-white/10 text-xs text-zinc-300 focus:outline-none"
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
                          className="w-full px-2.5 py-1.5 rounded bg-white/[0.03] border border-white/10 text-xs text-zinc-400 focus:outline-none font-mono"
                        />
                      </div>
                    ))}
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
