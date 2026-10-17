import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import {
  getPortfolioData,
  savePortfolioData,
  PortfolioContentData,
} from "@/lib/portfolioStorage";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = getPortfolioData();
    return NextResponse.json(data);
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as PortfolioContentData;

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid portfolio data payload" },
        { status: 400 }
      );
    }

    const result = await savePortfolioData(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to save portfolio data" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Portfolio data saved successfully",
      savedAt: new Date().toISOString(),
      filePath: result.filePath,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
