import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getUserById } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get the latest user data from the database
    const userId = String(session.user.id);
    const user = await getUserById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Log the credits for debugging
    console.log(
      `Refresh session API: User ${userId} has ${user.credits} credits in database`
    );
    console.log(
      `Refresh session API: User ${userId} has ${session.user.credits} credits in session`
    );

    // Return the latest user data
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        credits: user.credits,
      },
    });
  } catch (error) {
    console.error("Error refreshing session:", error);
    return NextResponse.json(
      { error: "Failed to refresh session" },
      { status: 500 }
    );
  }
}
