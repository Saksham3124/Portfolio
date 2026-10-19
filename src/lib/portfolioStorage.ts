import fs from "fs";
import path from "path";
import {
  PortfolioContentData,
  DEFAULT_PORTFOLIO_CONTENT,
  AboutPillar,
  AboutContent,
  TelemetryMetric,
} from "./portfolioModel";

export type {
  PortfolioContentData,
  AboutPillar,
  AboutContent,
  TelemetryMetric,
};
export { DEFAULT_PORTFOLIO_CONTENT };

// In-memory cache for fast read/writes
let memoryCache: PortfolioContentData | null = null;

function getCandidateFilePaths(): { primaryPath: string; tempPath: string } {
  const primaryPath = path.join(process.cwd(), "src", "data", "portfolioContent.json");
  const tempPath = path.join("/tmp", "portfolioContent.json");
  return { primaryPath, tempPath };
}

export interface SaveResult {
  success: boolean;
  filePath: string;
  isEphemeral: boolean;
  syncedToGitHub: boolean;
  githubError?: string;
  error?: string;
}

/**
 * Get current portfolio data, reading from disk if available, otherwise returning defaults
 */
export function getPortfolioData(): PortfolioContentData {
  if (memoryCache) {
    return memoryCache;
  }

  const { primaryPath, tempPath } = getCandidateFilePaths();
  let candidatePath: string | null = null;

  // Check if tempPath exists (runtime save in serverless) vs primaryPath
  const hasTemp = fs.existsSync(tempPath);
  const hasPrimary = fs.existsSync(primaryPath);

  if (hasTemp && hasPrimary) {
    try {
      const tempStat = fs.statSync(tempPath);
      const primaryStat = fs.statSync(primaryPath);
      candidatePath = tempStat.mtimeMs >= primaryStat.mtimeMs ? tempPath : primaryPath;
    } catch {
      candidatePath = primaryPath;
    }
  } else if (hasTemp) {
    candidatePath = tempPath;
  } else if (hasPrimary) {
    candidatePath = primaryPath;
  }

  if (candidatePath && fs.existsSync(candidatePath)) {
    try {
      const raw = fs.readFileSync(candidatePath, "utf-8");
      const parsed = JSON.parse(raw);
      // Merge with defaults to ensure any missing fields are safely populated
      const merged: PortfolioContentData = {
        ...DEFAULT_PORTFOLIO_CONTENT,
        ...parsed,
        personalInfo: {
          ...DEFAULT_PORTFOLIO_CONTENT.personalInfo,
          ...(parsed.personalInfo || {}),
          contact: {
            ...DEFAULT_PORTFOLIO_CONTENT.personalInfo.contact,
            ...(parsed.personalInfo?.contact || {}),
          },
        },
        about: {
          ...DEFAULT_PORTFOLIO_CONTENT.about,
          ...(parsed.about || {}),
        },
        educationSection: {
          ...DEFAULT_PORTFOLIO_CONTENT.educationSection,
          ...(parsed.educationSection || {}),
        },
        skillsSection: {
          ...DEFAULT_PORTFOLIO_CONTENT.skillsSection,
          ...(parsed.skillsSection || {}),
        },
        experience:
          Array.isArray(parsed.experience) && parsed.experience.length > 0
            ? parsed.experience
            : DEFAULT_PORTFOLIO_CONTENT.experience,
        experienceSection: {
          ...DEFAULT_PORTFOLIO_CONTENT.experienceSection,
          ...(parsed.experienceSection || {}),
        },
        educationList:
          Array.isArray(parsed.educationList) && parsed.educationList.length > 0
            ? parsed.educationList
            : DEFAULT_PORTFOLIO_CONTENT.educationList,
        telemetrySection: {
          ...DEFAULT_PORTFOLIO_CONTENT.telemetrySection,
          ...(parsed.telemetrySection || {}),
        },
        credentialsSection: {
          ...DEFAULT_PORTFOLIO_CONTENT.credentialsSection,
          ...(parsed.credentialsSection || {}),
        },
        contactSection: {
          ...DEFAULT_PORTFOLIO_CONTENT.contactSection,
          ...(parsed.contactSection || {}),
        },
      };
      memoryCache = merged;
      return merged;
    } catch {
      // fallback to defaults on read error
    }
  }

  return DEFAULT_PORTFOLIO_CONTENT;
}

/**
 * Save updated portfolio data to disk and cache
 */
export async function savePortfolioData(
  newData: PortfolioContentData,
  customGitHubToken?: string
): Promise<SaveResult> {
  try {
    const withTimestamp = {
      ...newData,
      updatedAt: new Date().toISOString(),
    };

    memoryCache = withTimestamp;

    const { primaryPath, tempPath } = getCandidateFilePaths();
    let savedPath = primaryPath;
    let isEphemeral = false;

    // Attempt primary path first
    try {
      const dir = path.dirname(primaryPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(primaryPath, JSON.stringify(withTimestamp, null, 2), "utf-8");
      savedPath = primaryPath;
    } catch {
      // Read-only serverless fallback: write to /tmp
      const tempDir = path.dirname(tempPath);
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      fs.writeFileSync(tempPath, JSON.stringify(withTimestamp, null, 2), "utf-8");
      savedPath = tempPath;
      isEphemeral = true;
    }

    let syncedToGitHub = false;
    let githubError: string | undefined;

    const tokenToUse = customGitHubToken || process.env.GITHUB_TOKEN;
    if (tokenToUse) {
      try {
        await syncToGitHub(withTimestamp, tokenToUse);
        syncedToGitHub = true;
      } catch (ghErr) {
        githubError = ghErr instanceof Error ? ghErr.message : String(ghErr);
        console.warn("GitHub sync warning:", ghErr);
      }
    }

    return {
      success: true,
      filePath: savedPath,
      isEphemeral,
      syncedToGitHub,
      githubError,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      filePath: "",
      isEphemeral: false,
      syncedToGitHub: false,
      error: errorMsg,
    };
  }
}

/**
 * Reset portfolio data back to defaults
 */
export function resetPortfolioData(): boolean {
  memoryCache = DEFAULT_PORTFOLIO_CONTENT;
  const { primaryPath, tempPath } = getCandidateFilePaths();
  try {
    if (fs.existsSync(primaryPath)) {
      fs.unlinkSync(primaryPath);
    }
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Sync data to GitHub repository via GitHub API if GITHUB_TOKEN is available
 */
export async function syncToGitHub(
  data: PortfolioContentData,
  customToken?: string
): Promise<void> {
  const token = customToken || process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error("No GitHub Token provided or configured.");
  }
  const repo = process.env.GITHUB_REPO || "Saksham3124/Portfolio";
  const branch = process.env.GITHUB_BRANCH || "main";
  const filePath = "src/data/portfolioContent.json";

  const getUrl = `https://api.github.com/repos/${repo}/contents/${filePath}?ref=${branch}`;
  let sha: string | undefined;

  try {
    const checkRes = await fetch(getUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "Portfolio-Admin-CMS",
      },
      cache: "no-store",
    });
    if (checkRes.ok) {
      const fileData = await checkRes.json();
      sha = fileData.sha;
    }
  } catch {
    // file might not exist yet
  }

  const contentBase64 = Buffer.from(JSON.stringify(data, null, 2)).toString("base64");

  const putRes = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
      "User-Agent": "Portfolio-Admin-CMS",
    },
    body: JSON.stringify({
      message: "Update portfolio content via Admin Panel CMS",
      content: contentBase64,
      sha: sha || undefined,
      branch: branch,
    }),
  });

  if (!putRes.ok) {
    const errText = await putRes.text();
    throw new Error(`GitHub API commit failed (${putRes.status}): ${errText}`);
  }
}
