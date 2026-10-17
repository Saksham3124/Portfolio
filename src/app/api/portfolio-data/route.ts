import { NextResponse } from "next/server";
import { getPortfolioData } from "@/lib/portfolioStorage";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = getPortfolioData();
    return NextResponse.json(data);
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
