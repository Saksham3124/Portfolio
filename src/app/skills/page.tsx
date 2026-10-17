import { PortfolioView } from "@/components/PortfolioView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Skills & Stack | Kumar Saksham",
  description: "Technical skills, analytical tools, cloud technologies, and domains of interest.",
};

export default function SkillsPage() {
  return <PortfolioView targetSection="skills" />;
}
