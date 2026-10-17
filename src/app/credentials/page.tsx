import { PortfolioView } from "@/components/PortfolioView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Credentials & Honors | Kumar Saksham",
  description: "Industry credentials, certifications, and competitive hackathon milestones.",
};

export default function CredentialsPage() {
  return <PortfolioView targetSection="credentials" />;
}
