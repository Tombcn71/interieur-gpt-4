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

    console.log(`Attempting to delete design ${designId} for user ${userId}`);

    // Check if the design exists and belongs to the user
    const design = await getDesignById(designId);

    if (!design) {
      console.log(`Design ${designId} not found`);
      return NextResponse.json(
        { error: "Ontwerp niet gevonden" },
        { status: 404 }
      );
    }

    if (design.user_id !== Number.parseInt(userId)) {
      console.log(
        `User ${userId} does not own design ${designId} (owned by ${design.user_id})`
      );
      return NextResponse.json(
        { error: "Geen toegang tot dit ontwerp" },
        { status: 403 }
      );
    }

    // Delete the design
    const result = await deleteDesign(designId, userId);
    console.log(`Delete result for design ${designId}:`, result);

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
