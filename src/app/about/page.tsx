import { PortfolioView } from "@/components/PortfolioView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Kumar Saksham",
  description: "Executive narrative, analytical foundation, and decision focus.",
};

export default function AboutPage() {
  return <PortfolioView targetSection="about" />;
}
