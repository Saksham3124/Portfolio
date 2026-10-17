"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  PortfolioContentData,
  DEFAULT_PORTFOLIO_CONTENT,
} from "@/lib/portfolioModel";

interface PortfolioContextType {
  data: PortfolioContentData;
  isLoading: boolean;
  refreshData: () => Promise<void>;
  updateLocalData: (newData: PortfolioContentData) => void;
}

const PortfolioContext = createContext<PortfolioContextType>({
  data: DEFAULT_PORTFOLIO_CONTENT,
  isLoading: false,
  refreshData: async () => {},
  updateLocalData: () => {},
});

export const PortfolioProvider: React.FC<{
  children: React.ReactNode;
  initialData?: PortfolioContentData;
}> = ({ children, initialData }) => {
  const [data, setData] = useState<PortfolioContentData>(() => {
    if (initialData) return initialData;
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("portfolio_cached_data");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.personalInfo) {
            return parsed;
          }
        }
      } catch {
        // Ignore JSON parse errors
      }
    }
    return DEFAULT_PORTFOLIO_CONTENT;
  });

  const [isLoading, setIsLoading] = useState<boolean>(!initialData);

  const fetchLatest = async () => {
    try {
      const res = await fetch("/api/portfolio-data", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        setData(json);
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("portfolio_cached_data", JSON.stringify(json));
          } catch {
            // Ignore storage errors
          }
        }
      }
    } catch {
      // Fallback silently to current state
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLatest();

    const handleCustomUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<PortfolioContentData>;
      if (customEvent.detail) {
        setData(customEvent.detail);
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(
              "portfolio_cached_data",
              JSON.stringify(customEvent.detail)
            );
          } catch {
            // Ignore
          }
        }
      } else {
        fetchLatest();
      }
    };

    window.addEventListener("portfolio_data_updated", handleCustomUpdate);
    return () => {
      window.removeEventListener("portfolio_data_updated", handleCustomUpdate);
    };
  }, []);

  const updateLocalData = (newData: PortfolioContentData) => {
    setData(newData);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("portfolio_cached_data", JSON.stringify(newData));
      } catch {
        // Ignore
      }
      window.dispatchEvent(
        new CustomEvent("portfolio_data_updated", { detail: newData })
      );
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        data,
        isLoading,
        refreshData: fetchLatest,
        updateLocalData,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => useContext(PortfolioContext);
