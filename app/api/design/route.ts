import { getServerSession } from "next-auth/next";
import { type NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { createDesign, updateDesignResult, updateUserCredits } from "@/lib/db";
// Import the simplified implementation
import { generateInteriorDesign } from "@/lib/simple-replicate";

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

    // IMPORTANT: Instead of doing background processing, we'll do it synchronously
    // This will make the API route wait for the generation to complete
    try {
      console.log("Starting image generation for design:", design.id);

      // Generate the design (this will now block the API route until complete)
      const outputImageUrl = await generateInteriorDesign(
        imageUrl,
        roomType,
        style
      );

      console.log("Generated image URL:", outputImageUrl);

      // Update design with result
      await updateDesignResult(design.id, outputImageUrl, "completed");
      console.log("Design updated with result:", design.id);

      // Return success with the completed design
      return NextResponse.json({
        success: true,
        message: "Design creation completed",
        design: {
          ...design,
          result_image_url: outputImageUrl,
          status: "completed",
        },
      });
    } catch (error) {
      console.error("Image generation error:", error);

      // Update the design as failed
      await updateDesignResult(design.id, "", "failed");

      // Return error to the client
      return NextResponse.json(
        {
          error: "Er is een fout opgetreden bij het genereren van het ontwerp",
          details: error instanceof Error ? error.message : String(error),
        },
        { status: 500 }
      );
    }
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
