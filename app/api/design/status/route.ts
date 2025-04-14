import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { deleteDesign, getDesignById } from "@/lib/db";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
    }

    const designId = params.id;
    const userId = String(session.user.id);

    // Check if the design exists and belongs to the user
    const design = await getDesignById(designId);

    if (!design) {
      return NextResponse.json(
        { error: "Ontwerp niet gevonden" },
        { status: 404 }
      );
    }

    if (design.user_id !== Number.parseInt(userId)) {
      return NextResponse.json(
        { error: "Geen toegang tot dit ontwerp" },
        { status: 403 }
      );
    }

    // Delete the design
    await deleteDesign(designId, userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting design:", error);
    return NextResponse.json(
      {
        error: "Er is een fout opgetreden bij het verwijderen van het ontwerp",
      },
      { status: 500 }
    );
  }
}
