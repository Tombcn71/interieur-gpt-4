import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    // Set cache control headers to prevent caching
    const headers = {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    };

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ authenticated: false }, { headers });
    }

    return NextResponse.json(
      {
        authenticated: true,
        user: {
          id: session.user.id,
          email: session.user.email,
        },
      },
      { headers }
    );
  } catch (error) {
    console.error("Error checking session:", error);
    return NextResponse.json(
      {
        authenticated: false,
        error: "Failed to check session",
      },
      { status: 500 }
    );
  }
}
