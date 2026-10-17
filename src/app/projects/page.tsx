import { PortfolioView } from "@/components/PortfolioView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Kumar Saksham",
  description: "Evidence-based flagship and supporting analytical solutions.",
};

export default function ProjectsPage() {
  return <PortfolioView targetSection="work" />;
}
