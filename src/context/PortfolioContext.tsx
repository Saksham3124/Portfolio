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

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [data, setData] = useState<PortfolioContentData>(DEFAULT_PORTFOLIO_CONTENT);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchLatest = async () => {
    try {
      const res = await fetch("/api/portfolio-data", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch {
      // Fallback silently to current state (defaults)
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
