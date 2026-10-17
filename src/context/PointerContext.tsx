"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { MotionValue, useMotionValue } from "framer-motion";

export type CursorVariant = "default" | "pointer" | "project" | "text" | "hidden";

interface PointerContextType {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  cursorVariant: CursorVariant;
  setCursorVariant: (variant: CursorVariant) => void;
  isHoveringProject: boolean;
  hoveredProjectTitle: string | null;
  isTouchDevice: boolean;
  isMascotDismissed: boolean;
  dismissMascot: () => void;
}

const PointerContext = createContext<PointerContextType | null>(null);

export const usePointer = () => {
  const context = useContext(PointerContext);
  if (!context) {
    throw new Error("usePointer must be used within a PointerProvider");
  }
  return context;
};

export const PointerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // MotionValues for mouse coordinates - direct update, ZERO React re-renders on movement!
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const [cursorVariant, setCursorVariant] = useState<CursorVariant>("default");
  const [isHoveringProject, setIsHoveringProject] = useState(false);
  const [hoveredProjectTitle, setHoveredProjectTitle] = useState<string | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isMascotDismissed, setIsMascotDismissed] = useState(false);

  // Check dismissal state from sessionStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const dismissed = sessionStorage.getItem("portfolio_mascot_dismissed");
        if (dismissed === "true") {
          setIsMascotDismissed(true);
        }
      } catch {
        // Ignore session storage errors
      }
    }
  }, []);

  const dismissMascot = useCallback(() => {
    setIsMascotDismissed(true);
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem("portfolio_mascot_dismissed", "true");
      } catch {
        // Ignore session storage errors
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Detect touch / coarse pointer
    const checkTouch = () => {
      const isCoarse = window.matchMedia("(pointer: coarse)").matches;
      const noFine = !window.matchMedia("(pointer: fine)").matches;
      setIsTouchDevice(isCoarse || noFine);
    };
    checkTouch();
    window.addEventListener("resize", checkTouch);

    // Single pointermove listener updating MotionValues directly
    const handlePointerMove = (e: PointerEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    // Global event delegation for hover states (only updates when crossing elements)
    const handlePointerOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const projectCard = target.closest("[data-cursor='project'], .project-card");
      if (projectCard) {
        setCursorVariant("project");
        setIsHoveringProject(true);
        const titleEl = projectCard.querySelector("h3");
        setHoveredProjectTitle(titleEl ? titleEl.textContent : null);
        return;
      }

      const isText = target.closest(
        "input[type='text'], input[type='email'], input[type='search'], textarea, [contenteditable='true']"
      );
      if (isText) {
        setCursorVariant("text");
        setIsHoveringProject(false);
        setHoveredProjectTitle(null);
        return;
      }

      const isClickable = target.closest(
        "a, button, [role='button'], input[type='submit'], input[type='button'], .cursor-pointer, select, summary"
      );
      if (isClickable) {
        setCursorVariant("pointer");
        setIsHoveringProject(false);
        setHoveredProjectTitle(null);
        return;
      }

      setCursorVariant("default");
      setIsHoveringProject(false);
      setHoveredProjectTitle(null);
    };

    const handleMouseLeave = () => {
      setCursorVariant("hidden");
    };

    const handleMouseEnter = () => {
      setCursorVariant("default");
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("mouseover", handlePointerOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    document.documentElement.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("resize", checkTouch);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("mouseover", handlePointerOver);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      document.documentElement.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [mouseX, mouseY]);

  return (
    <PointerContext.Provider
      value={{
        mouseX,
        mouseY,
        cursorVariant,
        setCursorVariant,
        isHoveringProject,
        hoveredProjectTitle,
        isTouchDevice,
        isMascotDismissed,
        dismissMascot,
      }}
    >
      {children}
    </PointerContext.Provider>
  );
};
