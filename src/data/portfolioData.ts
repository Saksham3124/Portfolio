export interface Project {
  id: string;
  title: string;
  category: "Risk Analytics" | "Data Engineering" | "BI & Reporting" | "Full-Stack & Hardware";
  tagline: string;
  description: string;
  architectureHighlights: string[];
  metrics: { label: string; value: string }[];
  tags: string[];
  githubUrl?: string;
  tableauUrl?: string;
  liveUrl?: string;
  featured?: boolean;
  statusBadge?: string;
}

export interface SkillCategory {
  name: string;
  description: string;
  skills: { name: string; level?: string; iconName?: string }[];
}

export interface Achievement {
  id: string;
  year: string;
  title: string;
  issuer: string;
  badge: string;
  description: string;
  skills: string[];
}

export const PERSONAL_INFO = {
  name: "Kumar Saksham",
  subHeadline: "Data · Risk · Engineering · Operations",
  tagline: "Turning Complex Data into Clear, Defensible Decisions.",
  bio: "Engineering graduate focused on risk analytics, data engineering, reporting, and operational efficiency. I work across SQL, Python, PostgreSQL, AWS, Tableau, and Power BI to investigate data, streamline workflows, and turn analysis into actionable insight.",
  education: {
    degree: "B.Tech in Electronics and Communication Engineering",
    institution: "Birla Institute of Technology (BIT), Mesra",
    period: "2022 – 2026",
    location: "Ranchi, India",
    focus: "Signal Processing, Microcontrollers, Stochastic Modeling, Embedded Systems & Quantitative Analytics",
  },
  contact: {
    phone: "+91 9166552458",
    email: "kumarsaksham560@gmail.com",
    linkedin: "https://www.linkedin.com/in/kumarsaksham/",
    github: "https://github.com/Saksham3124",
    location: "India",
  },
  keyMetrics: [
    { label: "Loan Applicants Analyzed", value: "307K+", detail: "Multi-factor credit default risk modeling" },
    { label: "Forensic Rule Layers", value: "3-Layer", detail: "Automated GST anomaly detection engine" },
    { label: "Orders & Delivery Mapped", value: "100K+", detail: "Olist logistics risk & seller accountability" },
    { label: "Superstore Sales Modeled", value: "$2.3M", detail: "End-to-end Power BI KPI dashboard" },
  ],
};

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    name: "Programming & Automation",
    description: "Algorithmic scripting, numerical computing, and automated scheduling pipelines",
    skills: [
      { name: "Python", level: "Expert" },
      { name: "SQL", level: "Expert" },
      { name: "Pandas", level: "Advanced" },
      { name: "NumPy", level: "Advanced" },
      { name: "MATLAB", level: "Advanced" },
      { name: "APScheduler", level: "Advanced" },
      { name: "JavaScript", level: "Intermediate" },
      { name: "Java", level: "Intermediate" },
      { name: "C++", level: "Advanced" },
      { name: "VHDL", level: "Intermediate" },
    ],
  },
  {
    name: "AI & APIs",
    description: "Integrating intelligent models, synthetic evaluation, and structured data validation",
    skills: [
      { name: "LLM APIs", level: "Advanced" },
      { name: "Generative AI", level: "Advanced" },
      { name: "API Integration", level: "Advanced" },
      { name: "Data Validation", level: "Advanced" },
      { name: "Evidence-Cited Risk Prompts", level: "Advanced" },
      { name: "Scikit-Learn ML", level: "Intermediate" },
    ],
  },
  {
    name: "Data Engineering & Cloud",
    description: "Relational database modeling, streaming/batch ingestion, and cloud warehouses",
    skills: [
      { name: "PostgreSQL", level: "Expert" },
      { name: "ETL / ELT Pipelines", level: "Advanced" },
      { name: "Data Warehousing", level: "Advanced" },
      { name: "AWS S3", level: "Advanced" },
      { name: "AWS Athena", level: "Advanced" },
      { name: "AWS RDS", level: "Intermediate" },
      { name: "MySQL", level: "Advanced" },
      { name: "Git & Version Control", level: "Advanced" },
    ],
  },
  {
    name: "Analytics & Tools",
    description: "Exploratory data analysis, forensic risk scoring, and enterprise reporting",
    skills: [
      { name: "Statistical Analysis", level: "Advanced" },
      { name: "Exploratory Data Analysis (EDA)", level: "Expert" },
      { name: "Anomaly Detection", level: "Advanced" },
      { name: "Tableau Desktop / Public", level: "Expert" },
      { name: "Power BI Desktop", level: "Expert" },
      { name: "Advanced Excel", level: "Advanced" },
      { name: "Jupyter Notebooks", level: "Expert" },
    ],
  },
  {
    name: "Engineering & Hardware",
    description: "Rigorous hardware modeling, electromagnetic simulation, and embedded robotics",
    skills: [
      { name: "Cadence Virtuoso", level: "Intermediate" },
      { name: "CST Studio Suite", level: "Intermediate" },
      { name: "Xilinx Vivado", level: "Intermediate" },
      { name: "Arduino & Microcontrollers", level: "Advanced" },
      { name: "PWM Speed Controllers", level: "Advanced" },
      { name: "Circuit Design & Soldering", level: "Advanced" },
    ],
  },
];

export const PROJECTS: Project[] = [
  {
    id: "credit-risk-analytics",
    title: "Credit Risk Analytics & Default Prediction",
    category: "Risk Analytics",
    tagline: "End-to-End Loan Portfolio Default Risk Analysis with AI Narrative Layer",
    description:
      "Engineered an end-to-end credit risk analysis pipeline investigating 307K+ loan applicants. Leveraged PostgreSQL and Python for extensive exploratory data analysis, correlation auditing, and applicant segmentation across demographic cohorts, bureau activity, and credit exposure. Features an interactive Tableau executive dashboard with an AI-assisted evidence-cited risk narrative engine.",
    architectureHighlights: [
      "Processed 307,000+ loan application records across multiple relational tables",
      "Calculated delinquency probabilities and debt-to-income default correlation tiers",
      "Designed dynamic Tableau dashboards with scenario filtering and risk scoring",
      "Integrated evidence-cited AI narrative summaries for credit committee decisions",
    ],
    metrics: [
      { label: "Applicants Audited", value: "307,000+" },
      { label: "Key Risk Indicators", value: "18+ Features" },
      { label: "Dashboard", value: "Tableau Public" },
    ],
    tags: ["Python", "SQL", "PostgreSQL", "Tableau", "Pandas", "EDA", "Risk Modeling", "Jupyter"],
    githubUrl: "https://github.com/Saksham3124/credit-risk-analytics",
    tableauUrl:
      "https://public.tableau.com/app/profile/kumar.saksham2703/viz/CreditRiskAnalysis_17802306468670/CreditRiskAnalyticsDashboard?publish=yes",
    featured: true,
    statusBadge: "Flagship Risk Project",
  },
  {
    id: "gst-anomaly-detection",
    title: "GST Invoice Anomaly Detection & Vendor Risk Audit",
    category: "Risk Analytics",
    tagline: "3-Layer Forensic Anomaly Engine with SQL Window Functions & Tableau",
    description:
      "Architected a 3-layer automated GST anomaly detection system to identify suspicious tax credit claims, circular invoicing patterns, and vendor compliance discrepancies. Leveraged complex PostgreSQL window functions, rolling averages, and z-score anomaly thresholds paired with an executive Tableau forensic audit dashboard.",
    architectureHighlights: [
      "Engineered 3-tier heuristic: Volume Spikes, Tax Discrepancy Ratios, and Circular Flow Patterns",
      "Implemented high-performance PostgreSQL window functions for temporal outlier detection",
      "Built multi-factor Vendor Risk Scoring (VRS) framework for audit prioritization",
      "Created drill-down Tableau dashboard tracking vendor risk tiers and recoverable capital",
    ],
    metrics: [
      { label: "Detection Engine", value: "3-Layer Rules" },
      { label: "Database", value: "PostgreSQL" },
      { label: "Audit Output", value: "Tableau Dashboard" },
    ],
    tags: ["SQL Window Functions", "PostgreSQL", "Python", "Tableau", "Anomaly Detection", "ETL Pipeline", "Vendor Risk"],
    githubUrl: "https://github.com/Saksham3124/gst-invoice-anomaly-detection",
    tableauUrl: "https://public.tableau.com/app/profile/kumar.saksham2703/viz/GST__/Dashboard1",
    featured: true,
    statusBadge: "Forensic Data Engine",
  },
  {
    id: "rail-delay-pipeline",
    title: "Automated Rail Delay Operation Monitoring Pipeline",
    category: "Data Engineering",
    tagline: "Real-Time Railway Delay Simulation, APScheduler & Power BI Risk Dashboard",
    description:
      "Developed an automated railway operations monitoring pipeline that simulates live train delay telemetry, applies automated risk classification, and continuously ingests data into dual storage (PostgreSQL relational warehouse and timestamped CSV archives). Includes an operational Power BI dashboard tracking bottleneck routes and punctuality metrics.",
    architectureHighlights: [
      "Real-time train telemetry simulator with realistic network disruption probabilities",
      "Automated batch orchestration using Python APScheduler and SQLAlchemy ORM",
      "Dual-sink storage architecture: transactional PostgreSQL + immutable CSV backup files",
      "Comprehensive Power BI operational dashboard with punctuality KPIs and delay heatmaps",
    ],
    metrics: [
      { label: "Scheduling", value: "APScheduler" },
      { label: "Storage", value: "Postgres + CSV" },
      { label: "BI Platform", value: "Power BI" },
    ],
    tags: ["Python", "APScheduler", "PostgreSQL", "Power BI", "SQLAlchemy", "Pandas", "ETL", "Operations"],
    githubUrl: "https://github.com/Saksham3124/Automated-Rail-Delay-Operation-Monitoring-Pipeline",
    featured: true,
    statusBadge: "Real-Time Pipeline",
  },
  {
    id: "dunnhumby-promotional-analytics",
    title: "Dunnhumby Customer & Promotional Opportunity Analysis",
    category: "BI & Reporting",
    tagline: "Behavioral Analytics & Targeted Promotions via AWS Athena, S3 & Power BI",
    description:
      "Conducted behavioral retail analytics on the extensive Dunnhumby dataset using AWS S3 cloud storage, AWS Athena serverless SQL queries, and Python. Segmented customer shopping cohorts and uncovered high-ROI promotional levers to eliminate margin-diluting discount campaigns.",
    architectureHighlights: [
      "Structured large-scale transaction datasets on AWS S3 partitioned for cost-effective querying",
      "Executed distributed SQL queries via AWS Athena for customer basket affinity analysis",
      "Identified price elasticity patterns and seasonal promotional elasticity",
      "Delivered Power BI executive dashboards summarizing customer lifetime value and uplift",
    ],
    metrics: [
      { label: "Cloud Engine", value: "AWS Athena & S3" },
      { label: "Analysis", value: "Customer Segmentation" },
      { label: "Visualization", value: "Power BI" },
    ],
    tags: ["AWS S3", "AWS Athena", "Python", "SQL", "Power BI", "Pandas", "Customer Segmentation", "Retail BI"],
    githubUrl: "https://github.com/Saksham3124/dunnhumby-customer-promotional-opportunity",
    featured: true,
  },
  {
    id: "olist-delivery-analysis",
    title: "Olist E-Commerce Delivery & Logistics Risk Analysis",
    category: "Risk Analytics",
    tagline: "Geographic Delivery Failure & Seller Accountability Audit in Tableau",
    description:
      "Conducted a comprehensive SQL forensic audit of 100,000+ Brazilian e-commerce orders from Olist. Identified freight bottlenecks, carrier latency hot-spots across remote states, and seller fulfillment lag leading to customer churn.",
    architectureHighlights: [
      "Aggregated and cleaned 100K+ multi-table orders, order items, and geolocation records in PostgreSQL",
      "Isolated delivery lead time variances between estimated versus actual customer receipt dates",
      "Mapped geographic risk clusters with high dispute frequencies across Brazilian regions",
      "Built interactive Tableau geographical dashboard featuring seller accountability metrics",
    ],
    metrics: [
      { label: "Orders Analyzed", value: "100,000+" },
      { label: "Audited Metrics", value: "Freight & Delivery SLA" },
      { label: "Dashboard", value: "Tableau Public" },
    ],
    tags: ["SQL", "PostgreSQL", "Tableau", "Logistics Analytics", "EDA", "Supply Chain Risk"],
    githubUrl: "https://github.com/Saksham3124/olist-ecommerce-delivery-analysis",
    tableauUrl:
      "https://public.tableau.com/app/profile/kumar.saksham2703/viz/OlistDeliveryPerformanceAnalysis_17789432992130/OlistDeliverryAnalysis?publish=yes",
    featured: true,
  },
  {
    id: "lusip-research-internship",
    title: "LUSIP Research Internship (2025): 3D Chipless RFID Tags",
    category: "Full-Stack & Hardware",
    tagline: "Electromagnetic Tag Signatures & MATLAB Algorithmic Optimization",
    description:
      "Selected for the competitive LUSIP Research Fellowship. Conducted deep research on 3D chipless Radio Frequency Identification (RFID) structures, resonance signature extraction, and algorithmic optimization utilizing MATLAB and electromagnetic field simulation tools.",
    architectureHighlights: [
      "Modeled frequency-signature encoding mechanisms for novel 3D structural geometries",
      "Developed MATLAB optimization algorithms for tag resonant response extraction and radar cross-section (RCS) analysis",
      "Benchmarked spectral efficiency against traditional planar resonant tag architectures",
      "Synthesized research findings for high-density physical asset tracking and authentication",
    ],
    metrics: [
      { label: "Domain", value: "RF & Applied Electromagnetics" },
      { label: "Computation", value: "MATLAB Algorithms" },
      { label: "Period", value: "2025 Research Fellow" },
    ],
    tags: ["MATLAB", "Electromagnetics", "RFID", "Optimization Algorithms", "Signal Processing", "R&D"],
    featured: true,
    statusBadge: "Research Milestone",
  },
  {
    id: "spending-analytics-forecasting",
    title: "Spending Analytics & Budget Forecasting",
    category: "Full-Stack & Hardware",
    tagline: "ML-Powered Financial Analytics Engine with Django, Scikit-Learn & PostgreSQL",
    description:
      "Developed a full-stack personal finance and operational expense tracking system powered by machine learning. Implemented automated transaction categorization using a Scikit-Learn Naive Bayes model, automated budget alert triggers, and interactive spending visualization with Chart.js.",
    architectureHighlights: [
      "Built resilient Django backend with secure session auth and PostgreSQL relational schema",
      "Trained a Naive Bayes NLP model to auto-classify transaction narratives into budget categories",
      "Implemented budget pacing algorithms that forecast month-end burn rates",
      "Visualized expenditure trends through responsive Chart.js and Vanilla JS components",
    ],
    metrics: [
      { label: "Backend", value: "Django + PostgreSQL" },
      { label: "ML Model", value: "Naive Bayes Classifier" },
      { label: "Frontend", value: "Interactive Chart.js" },
    ],
    tags: ["Python", "Django", "PostgreSQL", "Scikit-Learn", "Machine Learning", "Chart.js", "Full-Stack"],
    githubUrl: "https://github.com/Saksham3124/Spending-Analytics-Forecasting",
    featured: false,
  },
  {
    id: "superstore-kpi-dashboard",
    title: "Superstore Sales & Profitability KPI Dashboard",
    category: "BI & Reporting",
    tagline: "Executive BI Solution Analyzing $2.3M Commercial Sales in Power BI & SQL",
    description:
      "Constructed an executive-ready business intelligence solution analyzing $2.3M in Superstore retail sales data. Uncovered profit margin leakages, discounted volume traps, and sub-category performance variance.",
    architectureHighlights: [
      "Designed clean star-schema data model in Power BI with optimized DAX measures",
      "Calculated return rates, profit ratios, and customer segment margins",
      "Implemented interactive dynamic slicers for regional performance auditing",
    ],
    metrics: [
      { label: "Revenue Analyzed", value: "$2.3M+" },
      { label: "BI Platform", value: "Power BI Desktop" },
      { label: "Data Prep", value: "Python & SQL" },
    ],
    tags: ["Power BI", "DAX", "SQL", "Python", "Pandas", "Retail Analytics", "KPI Dashboards"],
    githubUrl: "https://github.com/Saksham3124/Superstore-KPI-Dashboard",
    featured: false,
  },
  {
    id: "hardware-robotics-suite",
    title: "Embedded Systems & Hardware Engineering Suite",
    category: "Full-Stack & Hardware",
    tagline: "Arduino Surveillance Robot & 12V Closed-Loop Train Speed Controller",
    description:
      "Demonstrating foundational hardware and electronics engineering capabilities through two distinct embedded systems: an autonomous Arduino Surveillance Robot equipped with ultrasonic sensor telemetry, and a custom 12V Train Speed Controller utilizing closed-loop PWM power modulation.",
    architectureHighlights: [
      "Designed Arduino-controlled mobile robot with ultrasonic obstacle avoidance and motor drivers",
      "Engineered closed-loop PWM 12V train controller ensuring smooth low-speed torque control",
      "Implemented hardware thermal protection, MOSFET H-bridge switching, and noise suppression",
      "Combined circuit design, schematic capture, breadboard prototyping, and embedded C++ firmware",
    ],
    metrics: [
      { label: "Hardware", value: "Arduino & Microcontrollers" },
      { label: "Control", value: "Closed-Loop PWM" },
      { label: "Sensors", value: "Ultrasonic Telemetry" },
    ],
    tags: ["Arduino", "Embedded C++", "PWM Control", "Motor Drivers", "Robotics", "Hardware Design"],
    featured: false,
    statusBadge: "Hardware Engineering",
  },
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "lusip-2025",
    year: "2025",
    title: "LUSIP Research Fellowship Awardee",
    issuer: "Competitive National Research Fellowship",
    badge: "Research Honor",
    description:
      "Awarded prestigious research fellowship focusing on 3D chipless RFID structural simulation, radar cross-section response extraction, and mathematical optimization algorithms in MATLAB.",
    skills: ["MATLAB", "Electromagnetics", "Mathematical Optimization", "Research Rigor"],
  },
  {
    id: "bit-mesra-ece",
    year: "2022 – 2026",
    title: "B.Tech in Electronics & Communication Engineering",
    issuer: "Birla Institute of Technology (BIT), Mesra",
    badge: "Degree Milestone",
    description:
      "Rigorous 4-year engineering curriculum covering Signals & Systems, Digital Signal Processing, Microcontrollers, Microelectronics (Cadence Virtuoso, CST Studio), and Data Structures.",
    skills: ["Signal Processing", "VLSI / Microelectronics", "C++", "Mathematics & Statistics"],
  },
  {
    id: "data-analytics-portfolio",
    year: "2025 – 2026",
    title: "300K+ Scale Risk & Anomaly Analytics Pipelines",
    issuer: "Independent Quantitative & BI Engineering",
    badge: "Technical Milestone",
    description:
      "Engineered production-grade data pipelines across Credit Risk (307K loans), GST Invoice Anomalies, and Real-Time Rail Delay telemetry, integrating PostgreSQL, AWS, Tableau, and Power BI.",
    skills: ["PostgreSQL", "Tableau Public", "Power BI", "AWS Athena", "Forensic Analytics"],
  },
  {
    id: "composio-app-research",
    year: "2026",
    title: "AI Tools & Composio App Research Deployment",
    issuer: "Web & AI Engineering",
    badge: "Live Web App",
    description:
      "Researched, architected, and deployed the Composio App Research platform to analyze AI agent tool calling, external tool integrations, and API workflows.",
    skills: ["Next.js / HTML", "API Integration", "Vercel Deployment", "AI Tooling"],
  },
];
