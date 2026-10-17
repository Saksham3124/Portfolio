"use client";

import React from "react";
import { PortfolioProvider } from "@/context/PortfolioContext";

export const Providers: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <PortfolioProvider>{children}</PortfolioProvider>;
};
