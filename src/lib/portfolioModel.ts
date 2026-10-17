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

export interface ContactSectionContent {
  pill: string;
  heading: string;
  subheading: string;
  resumeCardTitle: string;
  resumeCardDescription: string;
  resumeButtonText: string;
}

export interface PortfolioContentData {
  personalInfo: typeof PERSONAL_INFO & {
    heroVideoUrl?: string;
    heroVideoEnabled?: boolean;
  };
  about: AboutContent;
  telemetry: TelemetryMetric[];
  experience: ExperienceItem[];
  education: EducationItem;
  educationList?: EducationItem[];
  featuredProjects: Project[];
  supportingProjects: Project[];
  featuredProjectsHeading?: string;
  featuredProjectsSubtitle?: string;
  supportingProjectsHeading?: string;
  supportingProjectsSubtitle?: string;
  supportingProjectsButtonText?: string;
  skillGroups: typeof SKILL_GROUPS;
  areasOfInterest: string[];
  certifications: CredentialCategory[];
  achievements: AchievementItem[];
  contactSection?: ContactSectionContent;
  updatedAt?: string;
}

export const DEFAULT_PORTFOLIO_CONTENT: PortfolioContentData = {
  personalInfo: {
    ...PERSONAL_INFO,
    heroVideoUrl: "/videos/hero-background.mp4",
    heroVideoEnabled: true,
  },
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
  educationList: [EDUCATION],
  featuredProjects: FEATURED_PROJECTS,
  supportingProjects: SUPPORTING_PROJECTS,
  featuredProjectsHeading: "Work & Flagship Projects",
  featuredProjectsSubtitle:
    "Evidence-based projects supporting customer opportunity modeling, forensic anomaly detection, regulatory data reliability, and payment uncertainty recovery.",
  supportingProjectsHeading: "Supporting Analytical Projects",
  supportingProjectsSubtitle:
    "Secondary systems and analytical pipelines (e.g. Credit Risk Scorecard Engine).",
  supportingProjectsButtonText:
    "Inspect Supporting Pipelines (Credit Risk, Rail Telemetry, Financial Modeling)",
  skillGroups: SKILL_GROUPS,
  areasOfInterest: AREAS_OF_INTEREST,
  certifications: CERTIFICATIONS,
  achievements: ACHIEVEMENTS,
  contactSection: {
    pill: "Get in Touch",
    heading: "Start a Conversation",
    subheading:
      "Open to analytics, risk, product, operations, and data-focused opportunities. Reach out directly or send a message.",
    resumeCardTitle: "Need an Official Résumé?",
    resumeCardDescription:
      "To provide tailored versions aligned with specific role requirements, resumes are shared directly upon verified request.",
    resumeButtonText: "Request Résumé Form",
  },
};
