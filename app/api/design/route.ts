import { getServerSession } from "next-auth/next";
import { type NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { createDesign, updateDesignResult, updateUserCredits } from "@/lib/db";
import { generateInteriorDesign } from "@/lib/reliable-replicate";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
    }

    if (!session.user?.id) {
      console.error("User ID is missing in session:", JSON.stringify(session));
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
      return NextResponse.json(
        { error: "Niet genoeg credits" },
        { status: 400 }
      );
    }

    // Ensure user ID is a string
    const userId = String(session.user.id);
    console.log("Creating design with user ID:", userId);

    const prompt = `Een ${roomType} met een ${style} stijl.`;

    // Create the design with the user ID
    const design = await createDesign(
      userId,
      roomType,
      style,
      imageUrl,
      prompt
    );
    console.log("Design created:", design);

    // Deduct credit
    await updateUserCredits(userId, -1);

    // Start the generation process in the background
    // This prevents the API route from timing out
    void (async () => {
      try {
        console.log("Starting background processing for design:", design.id);
        const outputImageUrl = await generateInteriorDesign(
          imageUrl,
          roomType,
          style
        );

        console.log("Generated image URL:", outputImageUrl);

        // Validate the output URL
        if (!outputImageUrl || typeof outputImageUrl !== "string") {
          console.error("Invalid output from Replicate:", outputImageUrl);
          await updateDesignResult(design.id, "", "failed");
        } else {
          // Update design with result
          await updateDesignResult(design.id, outputImageUrl, "completed");
          console.log("Design updated with result:", design.id);
        }
      } catch (error) {
        console.error("Background processing error:", error);
        await updateDesignResult(design.id, "", "failed");
      }
    })();

    // Return immediately with the design ID
    return NextResponse.json({
      success: true,
      message: "Design creation started",
      design: {
        ...design,
        status: "processing",
      },
    });
  } catch (error) {
    console.error("General error in design API:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: `Er is een fout opgetreden: ${errorMessage}`,
        details: error,
      },
      { status: 500 }
    );
  }
}
