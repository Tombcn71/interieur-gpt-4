import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { fixNegativeCredits, getUserById } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
    }

    if (!session.user?.id) {
      return NextResponse.json(
        { error: "Gebruiker ID ontbreekt" },
        { status: 400 }
      );
    }

    // Fix negative credits for the user
    const userId = String(session.user.id);
    await fixNegativeCredits(userId);

    // Get the updated user
    const user = await getUserById(userId);

    return NextResponse.json({
      success: true,
      message: "Credits gerepareerd",
      credits: user?.credits || 0,
    });
  } catch (error) {
    console.error("Error fixing credits:", error);
    return NextResponse.json(
      {
        error: "Er is een fout opgetreden bij het repareren van credits",
      },
      { status: 500 }
    );
  }
}
