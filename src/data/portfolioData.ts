export interface Project {
  id: string;
  title: string;
  category: "Risk Analytics" | "Fraud & Anomaly Detection" | "Customer & Promotional Analytics";
  targetRoleRelevance: string[];
  tagline: string;
  description: string;
  architectureHighlights: string[];
  metrics: { label: string; value: string }[];
  tags: string[];
  githubUrl?: string;
  tableauUrl?: string;
  liveUrl?: string;
  featured?: boolean;
}

export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  program: string;
  period: string;
  location: string;
  type: string;
  summary: string;
  highlights: string[];
  tags: string[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
  location: string;
  framing: string;
  coursework: string[];
}

export interface CredentialCategory {
  category: "Data & Cloud" | "Analytics" | "Engineering & Electronics" | "Engineering & AI";
  items: {
    name: string;
    issuer: string;
    year: string;
    credentialId?: string;
    verifyUrl?: string;
    highlight?: string;
  }[];
}

export interface AchievementItem {
  id: string;
  title: string;
  context: string;
  year: string;
  badge: string;
  description: string;
  impactMetrics?: string;
}

export const PERSONAL_INFO = {
  name: "Kumar Saksham",
  roleTitle: "Data · Risk · Engineering",
  heroHeadline: "Turning complex data into clear, defensible decisions.",
  heroSupporting:
    "Engineering graduate focused on risk analytics, data engineering, reporting, and analytical problem solving.",
  coreNarrative:
    "An engineering graduate applying analytical thinking, data engineering, and risk-focused analysis to turn complex data into reliable insights and decision support.",
  contact: {
    phone: "+91 9166552458",
    email: "kumarsaksham560@gmail.com",
    linkedin: "https://www.linkedin.com/in/kumarsaksham/",
    github: "https://github.com/Saksham3124",
    location: "India",
  },
  keyMetrics: [
    { label: "Invoice Records", value: "50K+", detail: "Forensic GST anomaly detection" },
    { label: "Loan Applications", value: "307K+", detail: "Credit default risk stratification" },
    { label: "Transactions", value: "2.6M+", detail: "Behavioral retail customer clustering" },
    { label: "Transaction Value", value: "$8.06M", detail: "Promotional elasticity & sales uplift" },
  ],
};

export const HERO_METRICS = [
  { value: "50K+", label: "Invoice Records", sub: "GST Forensic Audit" },
  { value: "307K+", label: "Loan Applications", sub: "Default Stratification" },
  { value: "2.6M+", label: "Transactions", sub: "Customer Segmentation" },
  { value: "$8.06M", label: "Transaction Value", sub: "Promotional Uplift" },
];

export const EXPERIENCE: ExperienceItem[] = [
  {
    id: "lnmiit-lusip-2025",
    role: "Summer Research Intern",
    organization: "The LNM Institute of Information Technology (LNMIIT)",
    program: "LUSIP 2025 Research Fellowship",
    period: "May 2025 – July 2025",
    location: "Jaipur, India",
    type: "Research Internship",
    summary:
      "Selected through a competitive national screening process for the LUSIP Research Fellowship. Focused on advanced structural electromagnetics, radar cross-section (RCS) response extraction, and mathematical optimization algorithms in MATLAB.",
    highlights: [
      "Formulated mathematical optimization algorithms in MATLAB to isolate and extract resonant electromagnetic signatures from novel 3D chipless RFID structures.",
      "Conducted extensive numerical modeling and hypothesis-driven parameter tuning, benchmarking spectral efficiency against traditional planar resonant tag architectures.",
      "Applied quantitative signal noise suppression and stochastic evaluation to microwave backscatter telemetry, demonstrating first-principles analytical discipline.",
      "Documented formal research methodologies and structural data models for high-density physical asset authentication.",
    ],
    tags: ["MATLAB", "Electromagnetics", "Optimization Algorithms", "Signal Processing", "Quantitative R&D", "Systems Modeling"],
  },
];

export const EDUCATION: EducationItem = {
  degree: "B.Tech in Electronics and Communication Engineering",
  institution: "Birla Institute of Technology (BIT), Mesra",
  period: "2022 – 2026",
  location: "Ranchi, Jharkhand, India",
  framing:
    "Rigorous engineering education providing deep grounding in quantitative reasoning, systems thinking, signal integrity, and mathematical problem-solving applied to high-throughput data operations.",
  coursework: [
    "Signals & Systems",
    "Digital Signal Processing",
    "Probability & Stochastic Processes",
    "Microcontrollers & Embedded Systems",
    "Data Structures & Algorithms",
    "Numerical Analysis & Linear Algebra",
  ],
};

// ONLY 3 PRIMARY FEATURED PROJECTS IN FRONT
export const FEATURED_PROJECTS: Project[] = [
  {
    id: "credit-risk-analytics",
    title: "Credit Risk Analytics & Default Prediction",
    category: "Risk Analytics",
    targetRoleRelevance: ["Risk Analytics", "Risk Analyst", "Data Science Analyst", "Decision Support"],
    tagline: "Comprehensive loan portfolio risk stratification on 307K+ applicants with AI narrative layer",
    description:
      "End-to-end credit risk analysis pipeline auditing 307,000+ loan applicants. Leveraged PostgreSQL and Python to perform rigorous demographic and credit bureau correlation modeling, identifying key delinquency indicators and debt-to-income default thresholds. Visualized in an executive Tableau dashboard with an evidence-cited risk narrative engine.",
    architectureHighlights: [
      "Audited 307,000+ real-world loan applications across multi-table relational schema",
      "Modeled delinquency probability tiers across borrower age brackets, credit history, and income ratios",
      "Designed dynamic Tableau executive dashboard with scenario filtering and portfolio stress testing",
      "Synthesized AI-assisted evidence-cited risk narratives for credit committee decision-support",
    ],
    metrics: [
      { label: "Applicants Audited", value: "307,000+" },
      { label: "Key Risk Indicators", value: "18+ Features" },
      { label: "Dashboard", value: "Tableau Public" },
    ],
    tags: ["SQL", "Python", "PostgreSQL", "Tableau", "Pandas", "Credit Risk Modeling", "EDA"],
    githubUrl: "https://github.com/Saksham3124/credit-risk-analytics",
    tableauUrl:
      "https://public.tableau.com/app/profile/kumar.saksham2703/viz/CreditRiskAnalysis_17802306468670/CreditRiskAnalyticsDashboard?publish=yes",
    featured: true,
  },
  {
    id: "gst-anomaly-detection",
    title: "GST Invoice Anomaly Detection & Vendor Risk Scoring",
    category: "Fraud & Anomaly Detection",
    targetRoleRelevance: ["Risk", "Fraud / Anomaly Detection", "Data Quality", "Operations Analytics", "Data Engineering"],
    tagline: "3-layer forensic rule engine with SQL window functions, statistical outlier detection & audit dashboard",
    description:
      "Architected an automated 3-layer forensic anomaly detection system to identify suspicious tax credit claims, circular invoicing patterns, and vendor compliance discrepancies. Leveraged PostgreSQL window functions, rolling volume variance, and z-score anomaly scoring connected to an interactive Tableau audit dashboard.",
    architectureHighlights: [
      "Engineered 3-tier heuristic: Volume Spikes, Tax Discrepancy Ratios, and Circular Flow Patterns",
      "Authored high-performance PostgreSQL window functions to detect temporal and transactional outliers",
      "Formulated multi-factor Vendor Risk Scoring (VRS) framework for audit prioritization",
      "Constructed drill-down Tableau forensic dashboard tracking vendor risk tiers and recoverable capital",
    ],
    metrics: [
      { label: "Detection Engine", value: "3-Layer Rules" },
      { label: "Database", value: "PostgreSQL" },
      { label: "Audit Output", value: "Tableau Dashboard" },
    ],
    tags: ["SQL Window Functions", "PostgreSQL", "Python", "Tableau", "Fraud Detection", "Risk Scoring"],
    githubUrl: "https://github.com/Saksham3124/gst-invoice-anomaly-detection",
    tableauUrl: "https://public.tableau.com/app/profile/kumar.saksham2703/viz/GST__/Dashboard1",
    featured: true,
  },
  {
    id: "dunnhumby-promotional-analytics",
    title: "Promotional Opportunity & Customer Segmentation Analysis",
    category: "Customer & Promotional Analytics",
    targetRoleRelevance: ["Analytical Reasoning", "Customer Analytics", "Reporting", "Decision Support", "Business-Facing Analytics"],
    tagline: "Behavioral retail customer segmentation & promotional elasticity modeling using AWS Athena & Power BI",
    description:
      "Large-scale customer and promotional opportunity analysis on Dunnhumby transaction data. Partitioned and queried large data volumes in AWS S3 using AWS Athena serverless SQL, uncovering high-ROI promotional levers and segmenting behavioral customer clusters to prevent margin-diluting discounts.",
    architectureHighlights: [
      "Architected partitioned S3 data lake queried via serverless AWS Athena distributed SQL",
      "Conducted behavioral customer segmentation and basket affinity analysis in Python & Pandas",
      "Isolated promotional discount elasticity across product categories to safeguard profit margins",
      "Built executive Power BI reporting dashboards detailing customer lifetime value and promotional uplift",
    ],
    metrics: [
      { label: "Cloud Engine", value: "AWS Athena & S3" },
      { label: "Analysis", value: "Customer Segmentation" },
      { label: "Visualization", value: "Power BI" },
    ],
    tags: ["AWS Athena", "AWS S3", "Python", "SQL", "Power BI", "Pandas", "Customer Segmentation"],
    githubUrl: "https://github.com/Saksham3124/dunnhumby-customer-promotional-opportunity",
    tableauUrl: "https://public.tableau.com/app/profile/kumar.saksham2703/vizzes",
    featured: true,
  },
];

// SUPPORTING PROJECTS (Accessible via secondary view for deep dive)
export const SUPPORTING_PROJECTS: Project[] = [
  {
    id: "rail-delay-pipeline",
    title: "Automated Rail Delay Operation Monitoring Pipeline",
    category: "Risk Analytics",
    targetRoleRelevance: ["Automation", "Data Pipelines", "Scheduled Processing", "Data Engineering"],
    tagline: "Real-time railway delay simulation, APScheduler orchestration, dual PostgreSQL + CSV storage & Power BI",
    description:
      "Simulates live railway operations telemetry, applies automated risk classification, and continuously ingests data into dual storage (PostgreSQL and CSV archives) with Power BI monitoring.",
    architectureHighlights: [
      "Automated batch orchestration using Python APScheduler and SQLAlchemy ORM",
      "Dual-sink storage architecture: transactional PostgreSQL + immutable CSV backup files",
      "Operational Power BI dashboard with punctuality KPIs and delay heatmaps",
    ],
    metrics: [
      { label: "Scheduling", value: "APScheduler" },
      { label: "Storage", value: "Postgres + CSV" },
      { label: "BI Platform", value: "Power BI" },
    ],
    tags: ["Python", "APScheduler", "PostgreSQL", "Power BI", "SQLAlchemy"],
    githubUrl: "https://github.com/Saksham3124/Automated-Rail-Delay-Operation-Monitoring-Pipeline",
  },
  {
    id: "spending-analytics-forecasting",
    title: "Financial Analytics & Budget Forecasting",
    category: "Customer & Promotional Analytics",
    targetRoleRelevance: ["Financial Analysis", "Analytical Reasoning", "Reporting"],
    tagline: "ML-powered financial analytics system with Naive Bayes classification & Django backend",
    description:
      "Operational expense analytics and budget pacing system featuring automated transaction classification, burn rate forecasting, and interactive Chart.js visualization.",
    architectureHighlights: [
      "Django backend with relational PostgreSQL schema and secure session handling",
      "Trained Scikit-Learn Naive Bayes model for automatic transaction categorization",
      "Forecasted month-end burn rate and budget variances",
    ],
    metrics: [
      { label: "Backend", value: "Django + Postgres" },
      { label: "ML Model", value: "Naive Bayes" },
      { label: "Visualization", value: "Chart.js" },
    ],
    tags: ["Python", "Django", "PostgreSQL", "Scikit-Learn", "Financial Modeling"],
    githubUrl: "https://github.com/Saksham3124/Spending-Analytics-Forecasting",
  },
  {
    id: "olist-delivery-analysis",
    title: "Olist E-Commerce Logistics & Delivery Risk Analysis",
    category: "Risk Analytics",
    targetRoleRelevance: ["Logistics Risk", "Operations Analytics", "Data Quality"],
    tagline: "Geographic delivery failure & seller SLA compliance audit on 100K+ Brazilian orders in Tableau",
    description:
      "SQL forensic audit of 100K+ orders from Olist identifying carrier latency hot-spots and seller fulfillment delays visualized in Tableau.",
    architectureHighlights: [
      "PostgreSQL aggregation isolating delivery lead time variances against estimates",
      "Geographic dispute hot-spots mapped across Brazilian territories",
      "Interactive Tableau dashboard tracking seller SLA breach frequency",
    ],
    metrics: [
      { label: "Orders Analyzed", value: "100,000+" },
      { label: "Audited Metrics", value: "Freight & Delivery SLA" },
      { label: "Dashboard", value: "Tableau Public" },
    ],
    tags: ["SQL", "PostgreSQL", "Tableau", "Logistics Analytics"],
    githubUrl: "https://github.com/Saksham3124/olist-ecommerce-delivery-analysis",
    tableauUrl:
      "https://public.tableau.com/app/profile/kumar.saksham2703/viz/OlistDeliveryPerformanceAnalysis_17789432992130/OlistDeliverryAnalysis?publish=yes",
  },
];

export const SKILL_GROUPS = [
  {
    name: "Risk & Decision Analytics",
    description: "Quantitative modeling, fraud scoring, and executive reporting",
    skills: [
      "Credit Risk Modeling",
      "Anomaly Detection",
      "Vendor Risk Scoring",
      "Statistical Analysis",
      "Exploratory Data Analysis (EDA)",
      "Decision Support",
    ],
  },
  {
    name: "Data Engineering & Cloud",
    description: "Relational modeling, pipeline scheduling, and cloud data warehouses",
    skills: [
      "PostgreSQL",
      "SQL Window Functions",
      "ETL / ELT Pipelines",
      "AWS Athena",
      "AWS S3",
      "APScheduler",
      "MySQL",
      "Git",
    ],
  },
  {
    name: "BI & Visualization",
    description: "Executive dashboards, DAX modeling, and self-service analytics",
    skills: [
      "Tableau Desktop / Public",
      "Power BI Desktop",
      "DAX Measures",
      "Advanced Excel",
      "Jupyter Notebooks",
      "KPI Dashboards",
    ],
  },
  {
    name: "Programming & Systems",
    description: "Numerical computation, algorithmic optimization, and hardware rigor",
    skills: [
      "Python (Pandas, NumPy)",
      "MATLAB",
      "C++",
      "Systems Thinking",
      "Signal Processing",
      "VHDL / Microcontrollers",
    ],
  },
];

export const CERTIFICATIONS: CredentialCategory[] = [
  {
    category: "Data & Cloud",
    items: [
      {
        name: "AWS Certified Cloud Practitioner",
        issuer: "Amazon Web Services (AWS)",
        year: "2024",
        highlight: "Cloud infrastructure, security, IAM, S3 storage architectures & billing management",
      },
      {
        name: "AWS Fundamentals of Analytics (Part 1 & 2)",
        issuer: "Amazon Web Services (AWS)",
        year: "2024",
        highlight: "Data lake design, distributed query optimization in Amazon Athena, ETL best practices",
      },
    ],
  },
  {
    category: "Analytics",
    items: [
      {
        name: "Data Analytics Job Simulation",
        issuer: "Deloitte",
        year: "2024",
        highlight: "Practical client risk data telemetry, forensic data cleaning, and executive reporting",
      },
      {
        name: "SQL (Advanced) & Problem Solving",
        issuer: "HackerRank",
        year: "2024",
        highlight: "Advanced joins, recursive queries, window functions, and relational indexing",
      },
    ],
  },
  {
    category: "Engineering & Electronics",
    items: [
      {
        name: "AI & Deep Learning in Healthcare Workshop",
        issuer: "Institution of Electronics and Telecommunication Engineers (IETE)",
        year: "2023",
        highlight: "Neural network architectures, biomedical signal classification, and feature engineering",
      },
    ],
  },
];

export const ACHIEVEMENTS: AchievementItem[] = [
  {
    id: "sih-2023",
    title: "Smart India Hackathon (SIH) 2023 — 7th Position",
    context: "Birla Institute of Technology (BIT), Mesra Internal Hackathon",
    year: "2023",
    badge: "Hackathon Finalist",
    description:
      "Secured 7th position out of dozens of competitive engineering teams at the BIT Mesra internal round of Smart India Hackathon 2023, presenting a hardware-software integrated solution evaluated on technical feasibility, operational viability, and measurable impact.",
    impactMetrics: "Top 7 out of 40+ engineering teams at BIT Mesra",
  },
];
