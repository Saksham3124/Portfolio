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
  title: "Kumar Saksham: Data · Analytics · Risk · Product",
  description:
    "Engineering graduate focused on analytics, risk, customer insights, and AI-assisted decision systems.",
  keywords: [
    "Kumar Saksham",
    "Analytics",
    "Risk Analytics",
    "Customer Analytics",
    "Product Analytics",
    "Data Quality",
    "PostgreSQL",
    "Tableau",
    "Power BI",
    "BIT Mesra",
    "LNMIIT",
    "LNMIIT Research",
    "ETL Pipelines",
    "Anomaly Detection",
    "Decision Support",
  ],
  authors: [{ name: "Kumar Saksham", url: "https://github.com/Saksham3124" }],
  openGraph: {
    title: "Kumar Saksham: Data · Analytics · Risk · Product",
    description: "Turning Complex Data into Clear, Defensible Decisions.",
    url: "https://github.com/Saksham3124",
    siteName: "Kumar Saksham Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Kumar Saksham: Data · Analytics · Risk · Product",
    description: "Turning Complex Data into Clear, Defensible Decisions.",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="alternate icon" href="/favicon.ico" />
        <script
          dangerouslySetInnerHTML={{
            __html: `if ('scrollRestoration' in history) { history.scrollRestoration = 'manual'; } if (!window.location.hash) { window.scrollTo(0, 0); }`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-[#030304] text-[#fafafa] min-h-screen selection:bg-white/20 selection:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
