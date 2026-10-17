import {
  PERSONAL_INFO,
  EXPERIENCE,
  EDUCATION,
  FEATURED_PROJECTS,
  SUPPORTING_PROJECTS,
  SKILL_GROUPS,
  AREAS_OF_INTEREST,
  CERTIFICATIONS,
  ACHIEVEMENTS,
  Project,
  ExperienceItem,
  EducationItem,
  CredentialCategory,
  AchievementItem,
} from "@/data/portfolioData";

export interface AboutPillar {
  title: string;
  description: string;
  iconName: string; // "LineChart" | "ShieldCheck" | "Cpu" | "Database"
}

export interface AboutContent {
  pill: string;
  heading: string;
  subheading: string;
  narrativeParagraph1: string;
  narrativeParagraph2: string;
  pillars: AboutPillar[];
}

export interface TelemetryMetric {
  end: number;
  decimals: number;
  prefix?: string;
  suffix?: string;
  label: string;
  sub: string;
}

export interface PortfolioContentData {
  personalInfo: typeof PERSONAL_INFO;
  about: AboutContent;
  telemetry: TelemetryMetric[];
  experience: ExperienceItem[];
  education: EducationItem;
  featuredProjects: Project[];
  supportingProjects: Project[];
  skillGroups: typeof SKILL_GROUPS;
  areasOfInterest: string[];
  certifications: CredentialCategory[];
  achievements: AchievementItem[];
  updatedAt?: string;
}

export const DEFAULT_PORTFOLIO_CONTENT: PortfolioContentData = {
  personalInfo: PERSONAL_INFO,
  about: {
    pill: "Analytical Foundation · Decision Focus",
    heading: "Analytics in Service of Better Decisions",
    subheading:
      "I combine structured analysis, statistical methods, and reliable data workflows to solve customer, risk, and data-quality problems and support better decisions.",
    narrativeParagraph1:
      "My academic foundation is in Electronics and Communication Engineering at BIT Mesra, complemented by research at LNMIIT. Working across electromagnetic simulation, signal processing, and numerical optimization taught me to approach complex technical problems from first principles.",
    narrativeParagraph2:
      "I now apply that structured mindset to Customer Analytics, Risk Modeling, and Data Systems. My work focuses on evaluating real data scale, uncovering verifiable signals, and building reliable decision-support systems.",
    pillars: [
      {
        title: "Customer & Product Analytics",
        description:
          "Customer behavior, segmentation, opportunity modeling, and decision support.",
        iconName: "LineChart",
      },
      {
        title: "Risk & Statistical Analysis",
        description:
          "Risk scoring, anomaly detection, statistical validation, and evidence-based analysis.",
        iconName: "ShieldCheck",
      },
      {
        title: "AI-Assisted Analytics",
        description:
          "LLM APIs, structured AI outputs, risk narratives, and AI-assisted analytical workflows.",
        iconName: "Cpu",
      },
      {
        title: "Data & Analytical Systems",
        description:
          "SQL, data quality, reliable workflows, dashboards, and analytical implementation.",
        iconName: "Database",
      },
    ],
  },
  telemetry: [
    {
      end: 50,
      decimals: 0,
      suffix: "K+",
      label: "Invoice Records",
      sub: "GST Forensic Audit",
    },
    {
      end: 2.6,
      decimals: 1,
      suffix: "M+",
      label: "Transactions",
      sub: "Customer Segmentation",
    },
    {
      end: 8.06,
      decimals: 2,
      prefix: "$",
      suffix: "M",
      label: "Sales Analyzed",
      sub: "Promotional Uplift",
    },
    {
      end: 10,
      decimals: 0,
      suffix: "K+",
      label: "E-Way Bill Records",
      sub: "Data Reliability Pipeline",
    },
  ],
  experience: EXPERIENCE,
  education: EDUCATION,
  featuredProjects: FEATURED_PROJECTS,
  supportingProjects: SUPPORTING_PROJECTS,
  skillGroups: SKILL_GROUPS,
  areasOfInterest: AREAS_OF_INTEREST,
  certifications: CERTIFICATIONS,
  achievements: ACHIEVEMENTS,
};
