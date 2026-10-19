import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const token =
      request.headers.get("x-github-token") ||
      body.token ||
      process.env.GITHUB_TOKEN;

    if (!token) {
      return NextResponse.json(
        { error: "No GitHub token provided or configured" },
        { status: 400 }
      );
    }

    const repo = process.env.GITHUB_REPO || "Saksham3124/Portfolio";
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "Portfolio-Admin-CMS",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json(
        { error: `GitHub API error (${res.status}): ${err}` },
        { status: res.status }
      );
    }

    const repoData = await res.json();
    return NextResponse.json({
      success: true,
      repo: repoData.full_name,
      permissions: repoData.permissions,
      hasPushAccess: Boolean(repoData.permissions?.push),
      defaultBranch: repoData.default_branch,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
