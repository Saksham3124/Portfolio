export interface Project {
  id: string;
  title: string;
  category: "Risk Analytics" | "Fraud & Anomaly Detection" | "Customer & Promotional Analytics" | "Data Engineering · Data Reliability" | string;
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
  researchAreas: {
    id: string;
    title: string;
    highlight: string;
    description: string;
  }[];
  outcomes: {
    value: string;
    label: string;
    sub: string;
  }[];
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
  roleTitle: "DATA · ANALYTICS · RISK · PRODUCT",
  heroHeadline: "Turning Complex Data into Clear, Defensible Decisions.",
  heroSupporting:
    "Engineering graduate focused on analytics, risk, customer insights, and AI-assisted decision systems.",
  coreNarrative:
    "I combine structured analysis, statistical methods, and reliable data workflows to solve customer, risk, and data-quality problems and support better decisions.",
  contact: {
    phone: "+91 9166552458",
    email: "kumarsaksham560@gmail.com",
    linkedin: "https://www.linkedin.com/in/kumarsaksham/",
    github: "https://github.com/Saksham3124",
    location: "India",
  },
  keyMetrics: [
    { label: "Invoice Records", value: "50K+", detail: "Forensic GST anomaly detection" },
    { label: "Transactions", value: "2.6M+", detail: "Behavioral retail customer clustering" },
    { label: "Sales Analyzed", value: "$8.06M", detail: "Promotional elasticity & sales uplift" },
    { label: "E-Way Bill Records", value: "10K+", detail: "Regulatory data reliability pipeline" },
  ],
};

export const IMPACT_METRICS = [
  { value: "50K+", label: "Invoice Records", sub: "GST Forensic Audit" },
  { value: "2.6M+", label: "Transactions", sub: "Customer Segmentation" },
  { value: "$8.06M", label: "Sales Analyzed", sub: "Promotional Uplift" },
  { value: "10K+", label: "E-Way Bill Records", sub: "Data Reliability Pipeline" },
];

export const HERO_METRICS = IMPACT_METRICS;

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
      "Investigated 3D chipless RFID structures through electromagnetic simulation, MATLAB-based data processing, and experimental validation, focusing on improving tag performance and extracting reliable resonant signatures.",
    researchAreas: [
      {
        id: "data-processing",
        title: "DATA PROCESSING",
        highlight: "20K+ RFID signatures",
        description:
          "Processed 20K+ RFID signatures through a modular MATLAB workflow, converting simulation outputs into structured data for analysis.",
      },
      {
        id: "configuration-analysis",
        title: "CONFIGURATION ANALYSIS",
        highlight: "4 resonator configurations",
        description:
          "Compared four resonator configurations and multiple feed variations to identify patterns associated with improved chipless RFID performance.",
      },
      {
        id: "validation",
        title: "VALIDATION",
        highlight: "Simulation vs Experimental",
        description:
          "Cross-checked experimental results against simulation outputs, investigated discrepancies, and refined a reproducible analytical workflow.",
      },
    ],
    outcomes: [
      {
        value: "20K+",
        label: "RFID Signatures Processed",
        sub: "Converted simulation outputs into structured datasets",
      },
      {
        value: "66% → 80%",
        label: "Tag Utilization Efficiency",
        sub: "Measured technical performance improvement",
      },
      {
        value: "4",
        label: "Resonator Configurations",
        sub: "Multi-geometry analysis across feed variations",
      },
    ],
    highlights: [
      "Engineered a modular MATLAB data-processing workflow to automate processing and analysis of 20K+ RFID signatures.",
      "Analyzed simulation data across four resonator configurations and multiple feed variations to identify optimal tag performance.",
      "Cross-checked experimental results against simulation outputs, investigating discrepancies to document a reproducible workflow.",
      "Contributed to measured research improvement in tag utilization efficiency from 66% to 80%.",
    ],
    tags: [
      "CST Studio Suite",
      "MATLAB",
      "Electromagnetics",
      "Optimization Algorithms",
      "Signal Processing",
      "Quantitative R&D",
      "Systems Modeling",
    ],
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

// FEATURED FLAGSHIP PROJECTS (EQUAL VISUAL WEIGHT)
export const FEATURED_PROJECTS: Project[] = [
  {
    id: "dunnhumby-promotional-analytics",
    title: "Promotional Opportunity & Customer Segmentation Analysis",
    category: "Customer & Product Analytics",
    targetRoleRelevance: ["Customer Analytics", "Product Analytics", "Decision Support"],
    tagline: "Customer segmentation, basket affinity, and household promotional opportunity scoring in Power BI",
    description:
      "Analyzed 2.6M+ transactions across 2,500 households representing $8.06M in sales to understand customer behavior and identify promotional opportunities.",
    architectureHighlights: [
      "Engineered a household-level promotional scoring framework evaluating customer engagement, category affinity, and campaign responsiveness.",
      "Controlled for analytical zero-inflation bias and department-size distortion across 2,500 households and $8.06M in sales.",
      "Translated and cross-validated analytical pipelines across Python, PostgreSQL, and AWS Athena.",
      "Constructed an executive Power BI dashboard, identifying 10 un-campaigned high-affinity households and evaluating an illustrative $18.1K sensitivity case.",
    ],
    metrics: [
      { label: "Transactions", value: "2.6M+" },
      { label: "Households", value: "2,500" },
      { label: "Sales Analyzed", value: "$8.06M" },
    ],
    tags: ["Python", "SQL", "PostgreSQL", "AWS S3", "AWS Athena", "Power BI"],
    githubUrl: "https://github.com/Saksham3124/dunnhumby-customer-promotional-opportunity",
    featured: true,
  },
  {
    id: "gst-anomaly-detection",
    title: "GST Invoice Anomaly Detection & Vendor Risk Scoring",
    category: "Risk Analytics & AI",
    targetRoleRelevance: ["Risk Analytics", "Fraud Detection", "Applied AI"],
    tagline: "Four-layer forensic framework (Detect → Score → Explain) with statistical anomaly detection and Gemini AI narratives in Tableau",
    description:
      "An end-to-end invoice analytics and vendor risk solution analyzing 50K+ GST invoices across 210 vendors to detect anomalies, quantify vendor risk, and support audit prioritization.",
    architectureHighlights: [
      "Engineered a four-layer risk architecture (Detect → Score → Explain) combining deterministic rule validation with Z-Score and IQR statistical anomaly detection.",
      "Formulated deterministic vendor risk scoring across four signals (anomaly frequency, deviation magnitude, validation failures, recency), flagging 7,500+ invoices and 32 HIGH-risk vendors.",
      "Integrated Gemini API to generate evidence-grounded vendor risk narratives from deterministic risk signals, without modifying risk scores or risk tiers.",
      "Constructed an interactive drill-down Tableau forensic dashboard connecting 32 AI narratives with audit-recoverable tax capital.",
    ],
    metrics: [
      { label: "Invoices Audited", value: "50K+" },
      { label: "High-Risk Vendors", value: "32" },
      { label: "AI Narratives", value: "32" },
    ],
    tags: ["Python", "SQL", "PostgreSQL", "Gemini API", "Tableau", "Risk Scoring"],
    githubUrl: "https://github.com/Saksham3124/gst-invoice-anomaly-detection",
    tableauUrl: "https://public.tableau.com/app/profile/kumar.saksham2703/viz/GST__/Dashboard1",
    featured: true,
  },
  {
    id: "ewaybill-data-reliability",
    title: "E-Way Bill Data Reliability Pipeline",
    category: "Data Quality & Reliability",
    targetRoleRelevance: ["Data Quality", "Statistical Analysis", "Reliability"],
    tagline: "Automated reliability validation, KS and PSI statistical analysis, and Airflow PASS/FAIL gate for regulatory datasets",
    description:
      "An analytical data-quality and reliability system evaluating 10,089 E-Way Bill records across FY2022-23 and FY2023-24 to ensure statistical integrity and data quality.",
    architectureHighlights: [
      "Built multi-layer reliability validation and cross-table reconciliation for 10,089 regulatory records across FY2022-23 and FY2023-24.",
      "Conducted Kolmogorov-Smirnov (KS) tests and Population Stability Index (PSI) year-over-year statistical analysis generating 204 statistical results.",
      "Designed an automated Airflow PASS/FAIL reliability gate blocking unvalidated data from promotion to trusted PostgreSQL storage.",
      "Verified failure handling through 7 controlled corruption scenarios and 125 tests, blocking missing records, duplicates, invalid values, structural defects, and an INR 500 Cr alteration.",
    ],
    metrics: [
      { label: "Trusted Records", value: "10,089" },
      { label: "Statistical Results", value: "204" },
      { label: "Corruption Scenarios", value: "7" },
      { label: "Automated Tests", value: "125" },
    ],
    tags: [
      "Python",
      "SQL",
      "PostgreSQL",
      "Apache Airflow",
      "Docker",
      "SciPy",
      "Streamlit",
    ],
    githubUrl: "https://github.com/Saksham3124/ewaybill-data-reliability-pipeline",
    featured: true,
  },
  {
    id: "payment-status-recovery",
    title: "Payment Status Recovery",
    category: "Product Management · Fintech",
    targetRoleRelevance: ["Payment Reliability", "Product Management", "Fintech"],
    tagline: "UPI Transaction Uncertainty Engine",
    description:
      "Designed a fintech prototype that resolves uncertain UPI payment outcomes using deterministic, evidence-based recovery logic. The system evaluates synthetic payment evidence across the remitter bank, payment switch, and beneficiary bank to distinguish confirmed failures from unresolved transactions and prevent unsafe duplicate retries.",
    architectureHighlights: [
      "Evidence-based transaction recovery with explicit retry-safety rules.",
      "Transaction investigation and support-case management workflows.",
      "Product analytics for recovery outcomes and support funnels.",
    ],
    metrics: [
      { label: "Synthetic Cases", value: "13" },
      { label: "Banking Telemetry", value: "4-Party" },
      { label: "Automated Tests", value: "88" },
    ],
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Vitest"],
    githubUrl: "https://github.com/Saksham3124/payment-status-recovery",
    liveUrl: "https://payment-status-recovery.vercel.app",
    featured: true,
  },
];

// SUPPORTING PROJECTS (Accessible via secondary view for deep dive)
export const SUPPORTING_PROJECTS: Project[] = [
  {
    id: "credit-risk-analytics",
    title: "Credit Risk Analytics & Default Prediction",
    category: "Risk Analytics",
    targetRoleRelevance: ["Risk Analytics", "Risk Analyst", "Data Science Analyst", "Decision Support"],
    tagline: "Comprehensive loan portfolio risk stratification on 307K+ applicants with AI narrative layer",
    description:
      "End-to-end credit risk analysis pipeline auditing 307,511 loan applicants. Leveraged PostgreSQL and Python to perform demographic and credit bureau correlation modeling, isolating default indicators and debt-to-income default thresholds visualized in an executive Tableau dashboard.",
    architectureHighlights: [
      "Audited 307,511 real-world loan applications across multi-table relational PostgreSQL schema",
      "Modeled delinquency probability tiers across borrower age brackets, credit history, and income ratios",
      "Evaluated default distribution patterns identifying an 8.07% overall portfolio default rate",
      "Designed dynamic Tableau executive dashboard with scenario filtering and portfolio stress testing",
    ],
    metrics: [
      { label: "Applicants", value: "307,511" },
      { label: "Default Rate", value: "8.07%" },
      { label: "Risk Indicators", value: "18+ Features" },
    ],
    tags: ["Python", "SQL", "PostgreSQL", "Tableau", "Pandas", "Credit Risk Modeling", "EDA"],
    githubUrl: "https://github.com/Saksham3124/credit-risk-analytics",
    tableauUrl:
      "https://public.tableau.com/app/profile/kumar.saksham2703/viz/CreditRiskAnalysis_17802306468670/CreditRiskAnalyticsDashboard?publish=yes",
  },
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
    name: "Analytics",
    description: "Statistical modeling, exploratory analysis, and quantitative querying",
    skills: [
      "Python",
      "SQL",
      "Pandas",
      "NumPy",
      "SciPy",
      "EDA",
      "Statistical Analysis",
    ],
  },
  {
    name: "Risk & AI",
    description: "Forensic anomaly identification, LLM APIs, and AI-assisted analytics",
    skills: [
      "Risk Analytics",
      "Anomaly Detection",
      "LLM APIs",
      "Generative AI",
      "API Integration",
      "Prompt Engineering",
    ],
  },
  {
    name: "Data Engineering & Cloud",
    description: "Relational modeling, pipeline architecture, and cloud data querying",
    skills: [
      "PostgreSQL",
      "ETL/ELT",
      "Data Pipelines",
      "Data Quality & Validation",
      "AWS S3",
      "AWS Athena",
      "Airflow",
    ],
  },
  {
    name: "BI & Tools",
    description: "Interactive visual reporting, container orchestration, and version control",
    skills: [
      "Power BI",
      "Tableau",
      "Streamlit",
      "Docker",
      "Git",
      "Jupyter",
    ],
  },
];

export const AREAS_OF_INTEREST = [
  "Customer & Product Analytics",
  "Risk & Statistical Analysis",
  "AI-Assisted Analytics",
  "Data Quality & Analytical Reliability",
  "Data-Driven Operations",
  "Decision-Support Systems",
];

export const CERTIFICATIONS: CredentialCategory[] = [
  {
    category: "Data & Cloud",
    items: [
      {
        name: "AWS Certified Cloud Practitioner",
        issuer: "Amazon Web Services (AWS)",
        year: "2026",
        highlight: "Cloud infrastructure, security, IAM, S3 storage architectures & billing management",
      },
      {
        name: "AWS Fundamentals of Analytics (Part 1 & 2)",
        issuer: "Amazon Web Services (AWS)",
        year: "2026",
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
        year: "2026",
        highlight: "Practical client risk data telemetry, forensic data cleaning, and executive reporting",
      },
      {
        name: "SQL (Advanced) & Problem Solving",
        issuer: "HackerRank",
        year: "2026",
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
    title: "Smart India Hackathon (SIH) 2023: 7th Position",
    context: "Birla Institute of Technology (BIT), Mesra Internal Hackathon",
    year: "2023",
    badge: "Hackathon Finalist",
    description:
      "Secured 7th position out of dozens of competitive engineering teams at the BIT Mesra internal round of Smart India Hackathon 2023, presenting a hardware-software integrated solution evaluated on technical feasibility, operational viability, and measurable impact.",
    impactMetrics: "Top 7 out of 40+ engineering teams at BIT Mesra",
  },
];
