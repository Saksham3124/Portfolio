# Kumar Saksham — Professional Portfolio Website

> **Data · Risk · Engineering · Operations**  
> *"Turning Complex Data into Clear, Defensible Decisions."*

A high-performance personal portfolio website built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**. Designed for showcasing quantitative risk analytics pipelines, forensic SQL anomaly detection engines, and executive Tableau / Power BI business intelligence solutions.

---

## 🌟 Core Highlights & Architectural Features

- **High-Impact Hero Section:**
  - Dynamic kinetic typing effect for core quantitative specializations.
  - Interactive **Live Risk Matrix Widget** highlighting scale (307K+ loan applicants, 3-layer anomaly detection, real-time train delay telemetry).
  - Prominent **GitHub (`@Saksham3124`)** and **LinkedIn** direct access badges in both the sticky navigation bar and the Hero section.
  - Primary CTAs: `View My Work →` (smooth anchor scroll) and `Request Resume ↓` (interactive modal).

- **Strict "No Direct Resume Download" Policy:**
  - Implements an interactive **"Request for Resume" modal & contact trigger** instead of a static downloadable PDF.
  - Generates pre-filled `mailto:` links with recruiter context, role category selection, and instant clipboard copy.
  - Includes celebratory confetti feedback (`canvas-confetti`) upon dispatch.

- **Verified GitHub & Tableau Live Integrations:**
  - Direct links to Kumar Saksham's real GitHub repositories and interactive Tableau Public dashboards:
    - **Credit Risk Analytics:** 307K+ loan applicants default modeling ([GitHub Repo](https://github.com/Saksham3124/credit-risk-analytics) | [Live Tableau Dashboard](https://public.tableau.com/app/profile/kumar.saksham2703/viz/CreditRiskAnalysis_17802306468670/CreditRiskAnalyticsDashboard?publish=yes))
    - **GST Invoice Anomaly Detection:** 3-layer window function forensic engine ([GitHub Repo](https://github.com/Saksham3124/gst-invoice-anomaly-detection) | [Live Tableau Dashboard](https://public.tableau.com/app/profile/kumar.saksham2703/viz/GST__/Dashboard1))
    - **Automated Rail Delay Monitoring Pipeline:** Real-time APScheduler + Postgres dual storage ([GitHub Repo](https://github.com/Saksham3124/Automated-Rail-Delay-Operation-Monitoring-Pipeline))
    - **Dunnhumby Customer & Promotional Opportunity:** AWS Athena & S3 retail analytics ([GitHub Repo](https://github.com/Saksham3124/dunnhumby-customer-promotional-opportunity))
    - **Olist E-Commerce Delivery Risk Analysis:** 100K+ orders logistics audit ([GitHub Repo](https://github.com/Saksham3124/olist-ecommerce-delivery-analysis) | [Live Tableau Dashboard](https://public.tableau.com/app/profile/kumar.saksham2703/viz/OlistDeliveryPerformanceAnalysis_17789432992130/OlistDeliverryAnalysis?publish=yes))
    - **LUSIP Research Fellowship (2025):** 3D chipless RFID tags & MATLAB optimization.
    - **Spending Analytics & Budget Forecasting:** Django + Naive Bayes ML ([GitHub Repo](https://github.com/Saksham3124/Spending-Analytics-Forecasting))
    - **Embedded Systems & Robotics:** Arduino Surveillance Robot & 12V Train Speed Controller.

- **Categorized Skills Matrix:**
  - Interactive category tabs (Programming & Automation, AI & APIs, Data Engineering & Cloud, Analytics & Tools, Engineering & Hardware) with proficiency badges.

- **Achievements & Certifications Timeline:**
  - Distinct card-based timeline highlighting academic milestones at BIT Mesra, national research fellowships, and quantitative certifications.

- **Direct Reach-Out & Contact Section:**
  - Clean message form, 1-click clipboard copy for phone (`+91 9166552458`) and email (`kumarsaksham560@gmail.com`).

---

## 📁 Project Directory Structure

```
Portfolio/
├── src/
│   ├── app/
│   │   ├── fonts/               # Geist Sans & Geist Mono variable fonts
│   │   ├── favicon.ico
│   │   ├── globals.css          # Glassmorphism, animations & cyber dark theme
│   │   ├── layout.tsx           # SEO Metadata & Root HTML
│   │   └── page.tsx             # Main Home Page assembling all sections
│   ├── components/
│   │   ├── Navbar.tsx           # Sticky nav with prominent GitHub button & CTA
│   │   ├── Hero.tsx             # Typing effect, metric counters, direct links
│   │   ├── About.tsx            # BIT Mesra ECE background & 4 analytical pillars
│   │   ├── Skills.tsx           # Interactive categorized skill badges
│   │   ├── Projects.tsx         # Real GitHub codebases & Tableau dashboard links
│   │   ├── Achievements.tsx     # Honors, LUSIP fellowship, and certifications
│   │   ├── Contact.tsx          # Direct message form & 1-click copy info
│   │   ├── RequestResumeModal.tsx # Pre-filled mailto resume request workflow
│   │   ├── BrandIcons.tsx       # Pixel-perfect SVG brand icons (GitHub, LinkedIn, Tableau)
│   │   └── Footer.tsx           # Bottom navigation, links, and status
│   └── data/
│       └── portfolioData.ts     # Centralized, strongly-typed portfolio content
├── .eslintrc.json
├── .gitignore
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts           # Cyber/fintech theme & custom animations
└── tsconfig.json
```

---

## 🚀 Running Locally

### Prerequisites
- Node.js (v18.17+ or v20+)
- npm (or yarn / pnpm)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application with Hot Module Replacement.

### Step 3: Test Production Build
```bash
npm run build
npm run start
```

---

## 🌐 End-to-End Free Deployment Guide

### Option 1: Deploy on Vercel (Recommended — 2 Minutes, Zero Configuration)

Next.js is built by Vercel, making deployment completely frictionless and automated with CI/CD.

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "feat: complete professional portfolio website"
   ```
   Create a new public repository on GitHub (e.g., `portfolio` or `saksham-portfolio`) and run:
   ```bash
   git remote add origin https://github.com/Saksham3124/portfolio.git
   git push -u origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com) and click **Sign Up** or **Log In** with your GitHub account.
   - Click **"Add New..."** → **"Project"**.
   - Under "Import Git Repository", locate your `portfolio` repository and click **Import**.

3. **Configure & Deploy:**
   - **Framework Preset:** Next.js (automatically detected).
   - **Root Directory:** `./` (default).
   - **Build Command:** `npm run build` (default).
   - **Output Directory:** `.next` (default).
   - Click **Deploy**.

4. **Continuous Deployment (CI/CD):**
   - Vercel automatically deploys every time you push changes to your `main` branch.
   - You will receive a free `*.vercel.app` domain (e.g., `https://kumar-saksham.vercel.app`), which you can later link to a custom domain with free automatic SSL.

---

### Option 2: Deploy on Netlify (Alternative)

1. Push your repository to GitHub as shown above.
2. Sign in to [netlify.com](https://www.netlify.com) using your GitHub account.
3. Click **"Add new site"** → **"Import an existing project"**.
4. Select **GitHub** and grant access to your `portfolio` repository.
5. In the Build Settings:
   - **Base directory:** (leave empty)
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
   - Netlify will automatically install the `@netlify/plugin-nextjs` plugin.
6. Click **Deploy site**.
7. Netlify will build your site and provide a free `*.netlify.app` URL with continuous git integration.
