import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getDesignById } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
    }

    const design = await getDesignById(params.id);

    if (!design) {
      return NextResponse.json(
        { error: "Ontwerp niet gevonden" },
        { status: 404 }
      );
    }

    // Check if the design belongs to the current user
    if (design.user_id !== Number.parseInt(session.user.id)) {
      return NextResponse.json(
        { error: "Geen toegang tot dit ontwerp" },
        { status: 403 }
      );
    }

    return NextResponse.json({ design });
  } catch (error) {
    console.error("Error fetching design status:", error);
    return NextResponse.json(
      {
        error: "Er is een fout opgetreden bij het ophalen van de ontwerpstatus",
      },
      { status: 500 }
    );
  }
}
