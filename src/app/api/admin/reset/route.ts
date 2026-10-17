import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { resetPortfolioData, DEFAULT_PORTFOLIO_CONTENT } from "@/lib/portfolioStorage";

export async function POST() {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const success = resetPortfolioData();
    if (!success) {
      return NextResponse.json(
        { error: "Failed to reset portfolio data" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Portfolio data reset to default successfully",
      data: DEFAULT_PORTFOLIO_CONTENT,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
