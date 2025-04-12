import { getServerSession } from "next-auth/next";
import { type NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { createDesign, updateDesignResult, updateUserCredits } from "@/lib/db";
import { generateInteriorDesign } from "@/lib/replicate";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  // Ensure user ID exists and is a string
  if (!session.user?.id) {
    console.error("User ID is missing in session:", session);
    return NextResponse.json(
      { error: "Gebruiker ID ontbreekt" },
      { status: 400 }
    );
  }

  const { roomType, style, imageUrl } = await req.json();

  if (!roomType || !style || !imageUrl) {
    return NextResponse.json(
      { error: "Alle velden zijn verplicht" },
      { status: 400 }
    );
  }

  // Check if user has credits
  if (session.user.credits < 1) {
    return NextResponse.json({ error: "Niet genoeg credits" }, { status: 400 });
  }

  try {
    // Create design record with explicit user ID conversion
    const userId = String(session.user.id);
    console.log("Creating design with user ID:", userId);

    const prompt = `Een ${roomType} met een ${style} stijl.`;
    const design = await createDesign(
      userId,
      roomType,
      style,
      imageUrl,
      prompt
    );

    // Deduct credit
    await updateUserCredits(userId, -1);

    // Generate design with Replicate
    const output = await generateInteriorDesign(imageUrl, roomType, style);

    // Update design with result
    if (output && typeof output === "string") {
      await updateDesignResult(design.id, output, "completed");

      return NextResponse.json({
        success: true,
        design: {
          ...design,
          result_image_url: output,
          status: "completed",
        },
      });
    } else {
      await updateDesignResult(design.id, "", "failed");
      return NextResponse.json({ error: "Generatie mislukt" }, { status: 500 });
    }
  } catch (error) {
    console.error("Design generation error:", error);
    return NextResponse.json(
      { error: "Er is een fout opgetreden" },
      { status: 500 }
    );
  }
}
