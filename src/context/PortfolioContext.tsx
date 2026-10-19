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
    let base = initialData || DEFAULT_PORTFOLIO_CONTENT;
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("portfolio_cached_data");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && typeof parsed === "object") {
            base = {
              ...DEFAULT_PORTFOLIO_CONTENT,
              ...base,
              ...parsed,
              personalInfo: {
                ...DEFAULT_PORTFOLIO_CONTENT.personalInfo,
                ...base.personalInfo,
                ...(parsed.personalInfo || {}),
                contact: {
                  ...DEFAULT_PORTFOLIO_CONTENT.personalInfo.contact,
                  ...(base.personalInfo?.contact || {}),
                  ...(parsed.personalInfo?.contact || {}),
                },
              },
            };
          }
        }
        const savedVideo = localStorage.getItem("portfolio_hero_video");
        if (savedVideo && (savedVideo.startsWith("/") || savedVideo.startsWith("http"))) {
          base = {
            ...base,
            personalInfo: {
              ...base.personalInfo,
              heroVideoUrl: savedVideo,
            },
          };
        }
      } catch {
        // Ignore JSON parse errors
      }
    }
    return base;
  });

  const [isLoading, setIsLoading] = useState<boolean>(!initialData);

  const fetchLatest = async () => {
    try {
      const res = await fetch("/api/portfolio-data", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        
        let shouldApplyServer = true;
        if (typeof window !== "undefined") {
          try {
            const cached = localStorage.getItem("portfolio_cached_data");
            if (cached) {
              const localData = JSON.parse(cached);
              const localTime = localData?.updatedAt ? new Date(localData.updatedAt).getTime() : 0;
              const serverTime = json?.updatedAt ? new Date(json.updatedAt).getTime() : 0;
              
              // If local edits are newer than the server response (e.g. serverless container restarted with old defaults),
              // PRESERVE the user's edits! Do NOT let the server wipe them out.
              if (localTime > serverTime) {
                shouldApplyServer = false;
                setData(localData);
              }
            }
          } catch {
            // Ignore storage errors
          }
        }

        if (shouldApplyServer) {
          setData(json);
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem("portfolio_cached_data", JSON.stringify(json));
              if (json.personalInfo?.heroVideoUrl) {
                localStorage.setItem("portfolio_hero_video", json.personalInfo.heroVideoUrl);
                document.cookie = `portfolio_hero_video=${encodeURIComponent(
                  json.personalInfo.heroVideoUrl
                )}; path=/; max-age=31536000; SameSite=Lax`;
              }
            } catch {
              // Ignore storage errors
            }
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
