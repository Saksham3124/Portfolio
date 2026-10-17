import { PortfolioView } from "@/components/PortfolioView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work & Projects | Kumar Saksham",
  description: "Evidence-based flagship and supporting analytical solutions.",
};

export default function WorkPage() {
  return <PortfolioView targetSection="work" />;
}
