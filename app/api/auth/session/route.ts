import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getUserById } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const update = searchParams.get("update") === "true";

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    // If update is requested, get the latest user data from the database
    if (update) {
      const userId = String(session.user.id);
      const user = await getUserById(userId);

      if (user) {
        // Return the updated session with the latest credits
        return NextResponse.json({
          ...session,
          user: {
            ...session.user,
            credits: user.credits,
          },
        });
      }
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error("Error in session route:", error);
    return NextResponse.json(
      { error: "Failed to get session" },
      { status: 500 }
    );
  }
}
