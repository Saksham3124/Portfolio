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
  title: "Kumar Saksham — Data · Risk · Engineering",
  description:
    "Engineering graduate focused on risk analytics, data engineering, reporting, and decision-support modeling. Hands-on work across credit risk, anomaly detection, customer analytics, and quantitative research.",
  keywords: [
    "Kumar Saksham",
    "Risk Analyst",
    "Risk Analytics",
    "Credit Risk Analytics",
    "PostgreSQL",
    "Tableau",
    "Power BI",
    "BIT Mesra",
    "LNMIIT",
    "LUSIP Research Fellowship",
    "ETL Pipelines",
    "Anomaly Detection",
    "Decision Support",
  ],
  authors: [{ name: "Kumar Saksham", url: "https://github.com/Saksham3124" }],
  openGraph: {
    title: "Kumar Saksham — Data · Risk · Engineering",
    description: "Turning complex data into clear, defensible decisions.",
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
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-[#09090b] text-[#fafafa] min-h-screen selection:bg-white/20 selection:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
