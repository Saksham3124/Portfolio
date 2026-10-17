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

function getDataFilePath(): string {
  const localPath = path.join(process.cwd(), "src", "data", "portfolioContent.json");
  const localDir = path.dirname(localPath);
  if (fs.existsSync(localDir)) {
    try {
      fs.accessSync(localDir, fs.constants.W_OK);
      return localPath;
    } catch {
      // Read-only serverless fallback
    }
  }
  return path.join("/tmp", "portfolioContent.json");
}

/**
 * Get current portfolio data, reading from disk if available, otherwise returning defaults
 */
export function getPortfolioData(): PortfolioContentData {
  if (memoryCache) {
    return memoryCache;
  }

  const filePath = getDataFilePath();
  if (fs.existsSync(filePath)) {
    try {
      const raw = fs.readFileSync(filePath, "utf-8");
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
  newData: PortfolioContentData
): Promise<{ success: boolean; filePath: string; error?: string }> {
  try {
    const withTimestamp = {
      ...newData,
      updatedAt: new Date().toISOString(),
    };

    memoryCache = withTimestamp;

    const filePath = getDataFilePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(withTimestamp, null, 2), "utf-8");

    // Optional: If GitHub Token and Repo are configured in environment variables, commit to GitHub
    if (process.env.GITHUB_TOKEN && process.env.GITHUB_REPO) {
      try {
        await syncToGitHub(withTimestamp);
      } catch (ghErr) {
        console.warn("GitHub sync warning:", ghErr);
      }
    }

    return { success: true, filePath };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return { success: false, filePath: "", error: errorMsg };
  }
}

/**
 * Reset portfolio data back to defaults
 */
export function resetPortfolioData(): boolean {
  memoryCache = DEFAULT_PORTFOLIO_CONTENT;
  const filePath = getDataFilePath();
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Sync data to GitHub repository via GitHub API if GITHUB_TOKEN is set
 */
async function syncToGitHub(data: PortfolioContentData): Promise<void> {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO || "Saksham3124/Portfolio";
  const filePath = "src/data/portfolioContent.json";

  const getUrl = `https://api.github.com/repos/${repo}/contents/${filePath}`;
  let sha: string | undefined;

  try {
    const checkRes = await fetch(getUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });
    if (checkRes.ok) {
      const fileData = await checkRes.json();
      sha = fileData.sha;
    }
  } catch {
    // file might not exist yet
  }

  const contentBase64 = Buffer.from(JSON.stringify(data, null, 2)).toString("base64");

  await fetch(getUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "Update portfolio content via Admin Panel CMS",
      content: contentBase64,
      sha: sha || undefined,
      branch: "main",
    }),
  });
}
