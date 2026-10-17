"use client";

import React from "react";
import { PortfolioProvider } from "@/context/PortfolioContext";
import { PortfolioContentData } from "@/lib/portfolioModel";

export const Providers: React.FC<{
  children: React.ReactNode;
  initialData?: PortfolioContentData;
}> = ({ children, initialData }) => {
  return <PortfolioProvider initialData={initialData}>{children}</PortfolioProvider>;
};
