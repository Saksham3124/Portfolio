import { PortfolioView } from "@/components/PortfolioView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experience | Kumar Saksham",
  description: "Work experience, research fellowship at LNMIIT, and technical highlights.",
};

export default function ExperiencePage() {
  return <PortfolioView targetSection="experience" />;
}
