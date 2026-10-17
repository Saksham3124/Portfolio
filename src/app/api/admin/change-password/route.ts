import { NextResponse } from "next/server";
import {
  isAuthenticated,
  checkAdminPassword,
  hashPassword,
  savePasswordHash,
} from "@/lib/auth";

export async function POST(request: Request) {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in first." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Both current and new passwords are required." },
        { status: 400 }
      );
    }

    if (typeof newPassword !== "string" || newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const isCurrentValid = checkAdminPassword(currentPassword);
    if (!isCurrentValid) {
      return NextResponse.json(
        { error: "Current password does not match." },
        { status: 400 }
      );
    }

    const encryptedHash = hashPassword(newPassword);
    const saved = savePasswordHash(encryptedHash);

    if (!saved) {
      return NextResponse.json(
        { error: "Failed to persist new password. Check write permissions." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Password changed and encrypted successfully.",
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
