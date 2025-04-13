import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getUserById } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      console.log("No session found in refresh-session API");
      return NextResponse.json(
        { error: "Not authenticated", success: false },
        { status: 401 }
      );
    }

    // Get the latest user data from the database
    const userId = String(session.user.id);
    console.log(`Refreshing session for user ${userId}`);

    const user = await getUserById(userId);

    if (!user) {
      console.log(`User ${userId} not found in database`);
      return NextResponse.json(
        { error: "User not found", success: false },
        { status: 404 }
      );
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
        name: user.name,
        email: user.email,
      },
      sessionCredits: session.user.credits,
      databaseCredits: user.credits,
    });
  } catch (error) {
    console.error("Error refreshing session:", error);
    return NextResponse.json(
      { error: "Failed to refresh session", success: false },
      { status: 500 }
    );
  }
}
