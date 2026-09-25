import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Kumar Saksham | Data · Risk · Engineering · Operations",
  description:
    "Personal Portfolio of Kumar Saksham. Electronics & Communication Engineering graduate from BIT Mesra specializing in Credit Risk Analytics, Forensic Anomaly Detection, PostgreSQL ETL Pipelines, and Tableau & Power BI Dashboards.",
  keywords: [
    "Kumar Saksham",
    "Data Analyst",
    "Risk Analyst",
    "Credit Risk Analytics",
    "PostgreSQL",
    "Tableau Public",
    "Power BI",
    "BIT Mesra",
    "LUSIP Research Fellowship",
    "ETL Pipelines",
    "Anomaly Detection",
  ],
  authors: [{ name: "Kumar Saksham", url: "https://github.com/Saksham3124" }],
  openGraph: {
    title: "Kumar Saksham | Data · Risk · Engineering · Operations",
    description: "Turning Complex Data into Clear, Defensible Decisions.",
    url: "https://github.com/Saksham3124",
    siteName: "Kumar Saksham Portfolio",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#060913] text-slate-100 min-h-screen selection:bg-cyan-500/30 selection:text-cyan-200`}
      >
        {children}
      </body>
    </html>
  );
}
