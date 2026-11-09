"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useInView,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  Layers,
  Maximize2,
  X,
} from "lucide-react";
import { GithubIcon, TableauIcon } from "@/components/BrandIcons";
import { FEATURED_PROJECTS, SUPPORTING_PROJECTS, Project, ProjectPreviewItem } from "@/data/portfolioData";
import { usePortfolio } from "@/context/PortfolioContext";

interface MetricItem {
  label: string;
  value: string;
}

interface ModalItem {
  title: string;
  subtitle?: string;
  src: string;
  alt: string;
  isGif?: boolean;
}

const ProjectMetrics: React.FC<{ metrics: MetricItem[] }> = ({ metrics }) => {
  const isFourMetrics = metrics.length === 4;
  const shouldReduceMotion = useReducedMotion();

  const renderLabel = (label: string) => {
    if (label === "Corrupted Rows Promoted") {
      return (
        <span className="block leading-tight">
          <span className="block">Corrupted Rows</span>
          <span className="block">Promoted</span>
        </span>
      );
    }
    if (isFourMetrics) {
      const parts = label.split(" ");
      if (parts.length === 2) {
        return (
          <span className="block leading-tight">
            <span className="block">{parts[0]}</span>
            <span className="block">{parts[1]}</span>
          </span>
        );
      }
    }
    return <span className="block leading-tight">{label}</span>;
  };

  return (
    <div
      className={`grid ${
        isFourMetrics ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3"
      } gap-y-3 gap-x-1.5 sm:gap-x-2 px-2.5 py-3 sm:px-3 rounded-xl bg-white/[0.02] border border-white/[0.06] mb-6`}
    >
      {metrics.map((m, mIdx) => (
        <motion.div
          key={mIdx}
          whileHover={shouldReduceMotion ? {} : { scale: 1.05, y: -1.5 }}
          transition={{ type: "spring", stiffness: 450, damping: 18 }}
          className="flex flex-col items-center justify-between text-center min-w-0 p-1 rounded-lg hover:bg-white/[0.03] transition-colors cursor-default"
        >
          {/* Label Container: consistent min-height for uniform baseline alignment */}
          <div className="w-full min-h-[28px] sm:min-h-[30px] flex items-center justify-center text-center">
            <div
              className={`${
                isFourMetrics
                  ? "text-[8.5px] sm:text-[9.5px] xl:text-[10px]"
                  : "text-[9.5px] sm:text-[10px]"
              } text-zinc-400 font-mono tracking-tight text-center`}
            >
              {renderLabel(m.label)}
            </div>
          </div>

          {/* Value Container: bold, prominent, identical vertical baseline */}
          <div className="w-full flex items-center justify-center pt-1">
            <div className="text-xs sm:text-sm font-bold text-white tracking-tight">
              {m.value}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

/**
 * Subtle Cursor-Following Interactive Preview Frame
 * Uses lightweight motion values and spring physics (0 React state re-renders on mousemove)
 */
const InteractivePreviewFrame: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  title?: string;
  isExpandable?: boolean;
}> = ({ children, onClick, title, isExpandable = true }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 350, damping: 28 });
  const springY = useSpring(mouseY, { stiffness: 350, damping: 28 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || shouldReduceMotion) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.jump(e.clientX - rect.left);
    mouseY.jump(e.clientY - rect.top);
  };

  return (
    <div
      ref={containerRef}
      onClick={isExpandable ? onClick : undefined}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      className={`group relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-[#06080e] border transition-all duration-300 ${
        isExpandable
          ? "cursor-pointer border-white/[0.08] hover:border-cyan-500/40 hover:shadow-[0_0_25px_rgba(34,211,238,0.08)]"
          : "border-white/[0.08]"
      }`}
      title={isExpandable ? (title || "Click to expand preview") : undefined}
    >
      {/* Underlying Preview Content */}
      {children}

      {/* Cursor-Following Soft Radial Spotlight */}
      {isExpandable && !shouldReduceMotion && (
        <motion.div
          style={{
            x: springX,
            y: springY,
            translateX: "-50%",
            translateY: "-50%",
          }}
          className="pointer-events-none absolute z-10 w-64 h-64 rounded-full bg-cyan-400/[0.07] blur-2xl transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        />
      )}

      {/* Cursor-Following Contextual Pill Label */}
      {isExpandable && !shouldReduceMotion && (
        <motion.div
          style={{
            x: springX,
            y: springY,
            translateX: "-50%",
            translateY: "-50%",
          }}
          className="pointer-events-none absolute z-20 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/80 border border-white/20 text-[11px] font-mono text-zinc-200 backdrop-blur-md shadow-xl transition-opacity duration-200 opacity-0 group-hover:opacity-100"
        >
          <Maximize2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="font-medium">View Preview</span>
        </motion.div>
      )}

      {/* Static Fallback for Touch or Reduced Motion */}
      {isExpandable && shouldReduceMotion && (
        <div className="absolute inset-0 z-10 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/75 border border-white/20 text-[11px] font-mono text-zinc-200 backdrop-blur-sm shadow-lg">
            <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Click to expand</span>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Customer Segmentation Dashboard Carousel Component:
 * - 3 authentic views: Overview, Customer Segmentation, Promotional Analysis
 * - Auto-rotates every 3 seconds (paused on hover / interaction)
 * - 3 compact, clearly labelled selectors immediately below preview
 * - Clickable to open high-res modal
 * - Fixed aspect ratio & selector dimensions so switching never shifts card height
 */
const CustomerSegmentationCarousel: React.FC<{
  onOpenModal: (item: ModalItem) => void;
  customViews?: ProjectPreviewItem[];
}> = ({ onOpenModal, customViews }) => {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { margin: "100px" });

  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [allPreloaded, setAllPreloaded] = useState(false);
  const interactionTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const defaultViews = useMemo(
    () => [
      {
        id: "overview",
        label: "Overview",
        src: "/projects/customer-segmentation-overview.png",
        alt: "Dunnhumby Customer Segmentation — Executive Overview Dashboard",
        description:
          "Executive Overview Dashboard (Household sales, department volume, campaign reach)",
      },
      {
        id: "segmentation",
        label: "Customer Segmentation",
        src: "/projects/customer-segmentation-segmentation.png",
        alt: "Dunnhumby Customer Segmentation — Category & Segment Insights Dashboard",
        description:
          "Category & Household Segment Insights (Demographics, income brackets, basket sizes)",
      },
      {
        id: "promotional",
        label: "Promotional Analysis",
        src: "/projects/customer-segmentation-promotional.png",
        alt: "Dunnhumby Customer Segmentation — Promotional Opportunity & Affinity Diagnostic",
        description:
          "Promotional Opportunity Diagnostic (High-affinity uncampaigned households, lift models)",
      },
    ],
    []
  );

  const views = customViews && customViews.length > 0 ? customViews : defaultViews;

  // Preload all 3 dashboard images in the browser before auto-rotation commences
  useEffect(() => {
    let loadedCount = 0;
    const total = views.length;

    views.forEach((view) => {
      const img = new Image();
      img.src = view.src;
      const onDone = () => {
        loadedCount++;
        if (loadedCount >= total) {
          setAllPreloaded(true);
        }
      };

      if (img.complete) {
        onDone();
      } else {
        img.onload = onDone;
        img.onerror = onDone;
      }
    });
  }, [views]);

  // Handle interaction pause (e.g. touch or tab click)
  const triggerInteractionPause = () => {
    setIsInteracting(true);
    if (interactionTimerRef.current) {
      clearTimeout(interactionTimerRef.current);
    }
    interactionTimerRef.current = setTimeout(() => {
      setIsInteracting(false);
    }, 6000); // 6-second calm window while user is interacting
  };

  useEffect(() => {
    return () => {
      if (interactionTimerRef.current) clearTimeout(interactionTimerRef.current);
    };
  }, []);

  // Automatic rotation between dashboards every 3 seconds
  // Only runs when preloaded, in viewport, not hovered, not actively interacting, and not reduced motion
  useEffect(() => {
    if (!allPreloaded || !isInView || isHovered || isInteracting || shouldReduceMotion) {
      return;
    }

    const timer = setInterval(() => {
      setDirection(1); // strictly right-to-left
      setActiveIndex((prev) => (prev + 1) % views.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [allPreloaded, isInView, isHovered, isInteracting, shouldReduceMotion, views.length]);

  const activeView = views[activeIndex] || views[0];

  const slideVariants = {
    enter: (dir: number) => ({
      x: shouldReduceMotion ? "0%" : dir >= 0 ? "100%" : "-100%",
    }),
    center: {
      x: "0%",
    },
    exit: (dir: number) => ({
      x: shouldReduceMotion ? "0%" : dir >= 0 ? "-100%" : "100%",
    }),
  };

  const handleSelectTab = (idx: number) => {
    if (idx === activeIndex) return;
    setDirection(idx > activeIndex ? 1 : -1);
    setActiveIndex(idx);
    triggerInteractionPause();
  };

  return (
    <div
      ref={containerRef}
      className="mb-5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <InteractivePreviewFrame
        onClick={() => {
          triggerInteractionPause();
          onOpenModal({
            title: "Promotional Opportunity & Customer Segmentation Analysis",
            subtitle: activeView.description,
            src: activeView.src,
            alt: activeView.alt || activeView.label || "Customer Segmentation Dashboard",
          });
        }}
        title="Click to view full-size dashboard"
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={activeView.id}
            custom={direction}
            variants={slideVariants}
            initial={shouldReduceMotion ? false : "enter"}
            animate="center"
            exit={shouldReduceMotion ? undefined : "exit"}
            transition={{
              x: {
                type: "tween",
                ease: [0.25, 1, 0.5, 1],
                duration: shouldReduceMotion ? 0 : 0.4,
              },
            }}
            className="absolute inset-0 w-full h-full flex items-center justify-center bg-[#06080e] select-none"
          >
            <img
              src={activeView.src}
              alt={activeView.alt}
              className="w-full h-full object-contain pointer-events-none"
              draggable={false}
              loading="eager"
            />
          </motion.div>
        </AnimatePresence>
      </InteractivePreviewFrame>

      {/* 3 Compact Selectors Immediately Below Preview */}
      <div className="grid grid-cols-3 gap-1.5 mt-2.5 h-8">
        {views.map((view, idx) => {
          const isActive = idx === activeIndex;
          return (
            <button
              key={view.id}
              type="button"
              onClick={() => handleSelectTab(idx)}
              onFocus={() => setIsHovered(true)}
              onBlur={() => setIsHovered(false)}
              className={`px-2 py-1 rounded-lg text-[9.5px] sm:text-[10.5px] font-mono font-medium transition-all text-center truncate border ${
                isActive
                  ? "bg-white/[0.12] text-white border-cyan-400/40 shadow-[0_0_12px_rgba(34,211,238,0.15)]"
                  : "bg-white/[0.03] text-zinc-400 border-white/[0.06] hover:bg-white/[0.06] hover:text-zinc-200"
              }`}
              title={view.label}
            >
              {view.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

/**
 * Visual Preview Renderer for Project Cards:
 * Supports dynamic admin preview configurations and default fallbacks.
 */
const ProjectVisualPreview: React.FC<{
  project: Project;
  onOpenModal: (item: ModalItem) => void;
}> = ({ project, onOpenModal }) => {
  const preview = project.preview;

  // 1. Carousel View (e.g. Dunnhumby Customer Segmentation)
  if (preview?.type === "carousel" || project.id === "dunnhumby-promotional-analytics") {
    return (
      <CustomerSegmentationCarousel
        onOpenModal={onOpenModal}
        customViews={preview?.views}
      />
    );
  }

  // 2. Explicit preview object from Admin CMS
  if (preview?.src) {
    const isVideo = preview.type === "video";
    const isGif = preview.type === "gif";
    return (
      <div className="mb-5">
        <InteractivePreviewFrame
          onClick={() =>
            onOpenModal({
              title: project.title,
              subtitle: project.tagline,
              src: preview.src!,
              alt: preview.alt || project.title,
              isGif,
            })
          }
          isExpandable={preview.isExpandable !== false}
          title={`Click to view full-size ${project.title}`}
        >
          {isVideo ? (
            <video
              src={preview.src}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-contain"
            />
          ) : (
            <img
              src={preview.src}
              alt={preview.alt || project.title}
              className="w-full h-full object-contain"
              loading="lazy"
              decoding="async"
            />
          )}
        </InteractivePreviewFrame>
      </div>
    );
  }

  // 3. Fallbacks for original four projects if preview is omitted:
  if (project.id === "gst-anomaly-detection") {
    return (
      <div className="mb-5">
        <InteractivePreviewFrame
          onClick={() =>
            onOpenModal({
              title: "GST Invoice Anomaly Detection & Vendor Risk Scoring",
              subtitle: "Forensic Tableau Drill-Down Dashboard (50K+ Invoices, 32 High-Risk Vendors, AI Narratives)",
              src: "/projects/gst-invoice-anomaly-dashboard.png",
              alt: "GST Invoice Anomaly Detection Forensic Tableau Dashboard",
            })
          }
          title="Click to view full-size dashboard"
        >
          <img
            src="/projects/gst-invoice-anomaly-dashboard.png"
            alt="GST Invoice Anomaly Detection Forensic Tableau Dashboard"
            className="w-full h-full object-contain"
            loading="lazy"
            decoding="async"
          />
        </InteractivePreviewFrame>
      </div>
    );
  }

  if (project.id === "ewaybill-data-reliability") {
    return (
      <div className="mb-5">
        <InteractivePreviewFrame
          onClick={() =>
            onOpenModal({
              title: "E-Way Bill Data Reliability & Reconciliation Pipeline",
              subtitle: "End-to-end Architecture: Ingestion, Validation, Reconciliation, and Reliability Gate",
              src: "/projects/ewaybill-architecture-pipeline.jpg",
              alt: "E-Way Bill Data Reliability Pipeline Architecture Diagram",
            })
          }
          title="Click to view full-size architecture diagram"
        >
          <img
            src="/projects/ewaybill-architecture-pipeline.jpg"
            alt="E-Way Bill Data Reliability Pipeline Architecture Diagram"
            className="w-full h-full object-contain"
            loading="lazy"
            decoding="async"
          />
        </InteractivePreviewFrame>
      </div>
    );
  }

  if (project.id === "payment-status-recovery") {
    return (
      <div className="mb-5">
        <InteractivePreviewFrame
          onClick={() =>
            onOpenModal({
              title: "Payment Status Recovery",
              subtitle: "UPI Transaction Uncertainty Engine Walkthrough",
              src: "/Payment%20Status%20Recovery%20Walkthrough.gif",
              alt: "Payment Status Recovery Walkthrough Interface Animation",
              isGif: true,
            })
          }
          title="Click to view full-size walkthrough"
        >
          <img
            src="/Payment%20Status%20Recovery%20Walkthrough.gif"
            alt="Payment Status Recovery Walkthrough Interface Animation"
            className="w-full h-full object-contain"
            loading="lazy"
            decoding="async"
          />
        </InteractivePreviewFrame>
      </div>
    );
  }

  return null;
};

/**
 * Lightbox Modal for Full-Size Asset Viewing
 * Uses createPortal to escape transformed parent stacking contexts and center properly in viewport
 */
const ImageLightboxModal: React.FC<{
  item: ModalItem | null;
  onClose: () => void;
}> = ({ item, onClose }) => {
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!item) return;

    // Prevent background scrolling while modal is open, with scrollbar width compensation
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [item, onClose]);

  if (!mounted || typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {item && (
        <motion.div
          key="project-lightbox-backdrop"
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={shouldReduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[99999] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 lg:p-8 cursor-zoom-out overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label={item.title}
        >
          <motion.div
            key="project-lightbox-dialog"
            initial={shouldReduceMotion ? false : { scale: 0.95, opacity: 0, y: 8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { scale: 0.95, opacity: 0, y: 8 }}
            transition={{ type: "spring", stiffness: 420, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full max-h-[92vh] my-auto bg-[#090b12] border border-white/15 rounded-2xl overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.85)] flex flex-col cursor-default"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-white/[0.08] bg-white/[0.02] shrink-0">
              <div className="min-w-0 pr-4">
                <h3 className="text-sm sm:text-base font-semibold text-white tracking-tight truncate">
                  {item.title}
                </h3>
                {item.subtitle && (
                  <p className="text-xs text-zinc-400 font-mono truncate mt-0.5">
                    {item.subtitle}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
                aria-label="Close image preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image Viewport */}
            <div className="relative w-full flex-1 min-h-0 flex items-center justify-center p-2 sm:p-4 bg-black/75 overflow-auto">
              <img
                src={item.src}
                alt={item.alt}
                className="max-h-[74vh] w-auto max-w-full object-contain rounded-lg shadow-xl"
              />
            </div>

            {/* Modal Footer */}
            <div className="px-4 py-2 border-t border-white/[0.06] bg-white/[0.02] flex items-center justify-between text-[11px] text-zinc-400 font-mono shrink-0">
              <span>
                {item.isGif ? "Looping Walkthrough Preview" : "High-Resolution Preview"}
              </span>
              <span className="hidden sm:inline">Press Esc or click outside to dismiss</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export const Projects: React.FC = () => {
  const [showSupporting, setShowSupporting] = useState(false);
  const [modalItem, setModalItem] = useState<ModalItem | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const { data } = usePortfolio();
  const featuredProjects = data?.featuredProjects || FEATURED_PROJECTS;
  const supportingProjects = data?.supportingProjects || SUPPORTING_PROJECTS;

  const featuredHeading = data?.featuredProjectsHeading || "Work & Flagship Projects";
  const featuredSubtitle =
    data?.featuredProjectsSubtitle ||
    "Evidence-based projects supporting customer opportunity modeling, forensic anomaly detection, regulatory data reliability, and payment uncertainty recovery.";
  const supportingHeading = data?.supportingProjectsHeading || "Supporting Analytical Projects";
  const supportingSubtitle =
    data?.supportingProjectsSubtitle ||
    "Secondary systems and analytical pipelines (e.g. Credit Risk Scorecard Engine).";
  const supportingBtnText =
    data?.supportingProjectsButtonText ||
    "Inspect Supporting Pipelines (Credit Risk, Rail Telemetry, Financial Modeling)";

  const fadeUp = (delay = 0) => ({
    initial: shouldReduceMotion ? false : { opacity: 0, y: 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "20px" },
    transition: { duration: 0.45, delay, ease: "easeOut" as const },
  });

  return (
    <div className="py-6 sm:py-8 lg:py-10 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div {...fadeUp(0)} className="text-center mb-8 sm:mb-10">
          <div className="inline-block px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-medium text-zinc-400 mb-3 font-mono">
            {data?.featuredProjectsPill || "Flagship Projects"}
          </div>

          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white mb-4">
            {featuredHeading}
          </h2>

          <p className="text-zinc-400 text-base max-w-xl mx-auto leading-relaxed">
            {featuredSubtitle}
          </p>
        </motion.div>

        {/* Flagship Projects Grid (Balanced 2x2 on Desktop, Clean Stacking on Mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {featuredProjects.map((project, idx) => (
            <motion.article
              key={project.id}
              {...fadeUp(0.08 + idx * 0.08)}
              whileHover={shouldReduceMotion ? {} : { y: -6, scale: 1.008 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="clean-card rounded-2xl p-6 sm:p-7 border border-white/[0.08] flex flex-col justify-between"
            >
              <div>
                {/* Category & Badge */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <motion.span
                    whileHover={shouldReduceMotion ? {} : { scale: 1.05, y: -1 }}
                    transition={{ type: "spring", stiffness: 450, damping: 18 }}
                    className="text-[11px] font-mono font-medium px-2.5 py-1 rounded-full bg-white/[0.05] text-zinc-300 border border-white/10 inline-block cursor-default"
                  >
                    {project.category}
                  </motion.span>
                  <span className="text-[10px] font-mono text-zinc-400">
                    {project.targetRoleRelevance[0]}
                  </span>
                </div>

                {/* Title & Tagline */}
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2">
                  {project.title}
                </h3>
                <p className="text-xs font-medium text-zinc-400 mb-4 leading-relaxed">
                  {project.tagline}
                </p>

                {/* Visual Preview Area */}
                <ProjectVisualPreview
                  project={project}
                  onOpenModal={(item) => setModalItem(item)}
                />

                {/* Description */}
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-6">
                  {project.description}
                </p>

                {/* Metrics Strip */}
                <ProjectMetrics metrics={project.metrics} />

                {/* Architecture Highlights */}
                <div className="mb-6">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-2.5 flex items-center gap-1.5">
                    <Layers className="w-3 h-3 text-zinc-400" />
                    <span>Technical Highlights</span>
                  </div>
                  <ul className="space-y-1.5">
                    {project.architectureHighlights.slice(0, 4).map((h, hIdx) => (
                      <li key={hIdx} className="text-xs text-zinc-400 flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technology Tags with Bouncy Hover Pop */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.tags.map((tag) => (
                    <motion.span
                      key={tag}
                      whileHover={shouldReduceMotion ? {} : { scale: 1.08, y: -1.5 }}
                      transition={{ type: "spring", stiffness: 450, damping: 16 }}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.03] text-zinc-400 border border-white/10 hover:border-white/30 hover:text-zinc-200 transition-colors inline-block cursor-default"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Only show links that actually exist */}
              <div className="pt-4 border-t border-white/[0.07] flex flex-wrap items-center gap-2 mt-auto">
                {project.liveUrl && (
                  <motion.a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="project"
                    whileHover={shouldReduceMotion ? {} : { scale: 1.04, y: -1.5 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
                    transition={{ type: "spring", stiffness: 450, damping: 20 }}
                    className="pill-button pill-button-primary text-xs py-1.5 px-3"
                    title="View Live Demo"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Live Demo</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </motion.a>
                )}

                {project.tableauUrl && (
                  <motion.a
                    href={project.tableauUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="project"
                    whileHover={shouldReduceMotion ? {} : { scale: 1.04, y: -1.5 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
                    transition={{ type: "spring", stiffness: 450, damping: 20 }}
                    className="pill-button pill-button-primary text-xs py-1.5 px-3"
                    title="View live Tableau Dashboard"
                  >
                    <TableauIcon className="w-3.5 h-3.5" />
                    <span>Tableau Dashboard</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </motion.a>
                )}

                {project.githubUrl && (
                  <motion.a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="project"
                    whileHover={shouldReduceMotion ? {} : { scale: 1.04, y: -1.5 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
                    transition={{ type: "spring", stiffness: 450, damping: 20 }}
                    className="pill-button text-xs py-1.5 px-3"
                    title="View GitHub Codebase"
                  >
                    <GithubIcon className="w-3.5 h-3.5 text-zinc-300" />
                    <span>GitHub Codebase</span>
                    <ArrowUpRight className="w-3 h-3 text-zinc-400" />
                  </motion.a>
                )}
              </div>
            </motion.article>
          ))}
        </div>

        {/* Collapsible Secondary Technical Pipelines */}
        <motion.div {...fadeUp(0.24)} className="mt-14 text-center">
          <motion.button
            type="button"
            data-cursor="view"
            onClick={() => setShowSupporting(!showSupporting)}
            aria-expanded={showSupporting}
            whileHover={shouldReduceMotion ? {} : { scale: 1.03, y: -1.5 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
            transition={{ type: "spring", stiffness: 450, damping: 20 }}
            className="group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-xs font-mono font-medium text-zinc-300 bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-white/20 hover:text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-white/30 focus-visible:border-white/30 active:bg-white/[0.05] transition-all duration-200 cursor-pointer backdrop-blur-md"
          >
            <span>{showSupporting ? "Hide Supporting Pipelines" : supportingBtnText}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-200 transition-transform duration-200 ${
                showSupporting ? "rotate-180" : ""
              }`}
            />
          </motion.button>

          {showSupporting && (
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="overflow-hidden mt-8 text-left space-y-4"
            >
              <div className="mb-4 pb-3 border-b border-white/[0.06]">
                <h4 className="text-sm font-semibold text-white tracking-tight">{supportingHeading}</h4>
                <p className="text-xs text-zinc-400 mt-0.5">{supportingSubtitle}</p>
              </div>
              {supportingProjects.map((sp) => (
                <motion.div
                  key={sp.id}
                  whileHover={shouldReduceMotion ? {} : { y: -3, scale: 1.008 }}
                  transition={{ type: "spring", stiffness: 350, damping: 22 }}
                  className="clean-card p-6 rounded-xl border border-white/[0.06]"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <h4 className="text-base font-semibold text-white">{sp.title}</h4>
                    <div className="flex flex-wrap gap-1">
                      {sp.targetRoleRelevance.map((r) => (
                        <span
                          key={r}
                          className="text-[10px] font-mono text-zinc-400 bg-white/[0.03] px-2 py-0.5 rounded border border-white/5"
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-zinc-400 mb-3">{sp.description}</p>
                  <div className="flex items-center gap-4">
                    {sp.tableauUrl && (
                      <motion.a
                        href={sp.tableauUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor="project"
                        whileHover={shouldReduceMotion ? {} : { scale: 1.05, x: 2 }}
                        whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
                        transition={{ type: "spring", stiffness: 450, damping: 18 }}
                        className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                      >
                        <TableauIcon className="w-3.5 h-3.5" />
                        <span>View Dashboard ↗</span>
                      </motion.a>
                    )}
                    {sp.githubUrl && (
                      <motion.a
                        href={sp.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor="project"
                        whileHover={shouldReduceMotion ? {} : { scale: 1.05, x: 2 }}
                        whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
                        transition={{ type: "spring", stiffness: 450, damping: 18 }}
                        className="inline-flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white transition-colors cursor-pointer"
                      >
                        <GithubIcon className="w-3.5 h-3.5" />
                        <span>View Codebase ↗</span>
                      </motion.a>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <ImageLightboxModal item={modalItem} onClose={() => setModalItem(null)} />
    </div>
  );
};
