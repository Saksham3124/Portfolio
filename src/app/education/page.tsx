import { PortfolioView } from "@/components/PortfolioView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Education | Kumar Saksham",
  description: "Academic background and engineering foundation at BIT Mesra.",
};

export default function EducationPage() {
  return <PortfolioView targetSection="education" />;
}
