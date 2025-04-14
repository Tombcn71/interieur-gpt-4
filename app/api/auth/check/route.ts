import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ authenticated: false });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        credits: session.user.credits,
      },
    });
  } catch (error) {
    console.error("Error checking authentication:", error);
    return NextResponse.json({
      authenticated: false,
      error: "Failed to check authentication",
    });
  }
}
