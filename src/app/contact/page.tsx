import { PortfolioView } from "@/components/PortfolioView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Kumar Saksham",
  description: "Get in touch, discuss analytics and product opportunities, or request a résumé.",
};

export default function ContactPage() {
  return <PortfolioView targetSection="contact" />;
}
