import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { updateUserCredits, getUserById } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { credits } = await req.json();

    if (!credits || typeof credits !== "number") {
      return NextResponse.json(
        { error: "Invalid credits amount" },
        { status: 400 }
      );
    }

    const userId = String(session.user.id);

    // Get current credits
    const userBefore = await getUserById(userId);
    const beforeCredits = userBefore?.credits || 0;

    // Update credits
    const user = await updateUserCredits(userId, credits);

    if (!user) {
      return NextResponse.json(
        { error: "Failed to update credits" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      userId,
      beforeCredits,
      addedCredits: credits,
      afterCredits: user.credits,
    });
  } catch (error) {
    console.error("Error in debug add credits route:", error);
    return NextResponse.json(
      {
        error: "Failed to add credits",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
