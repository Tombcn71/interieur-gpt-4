import { getServerSession } from "next-auth/next";
import { type NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { createDesign, updateDesignResult, updateUserCredits } from "@/lib/db";
import {
  generateInteriorDesign,
  fallbackGenerateInteriorDesign,
} from "@/lib/replicate";
import { generateInteriorDesignWithReimagineXL } from "@/lib/replicate-alternative";

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

    try {
      // Try multiple models in sequence
      let outputImageUrl: string | null = null;
      let modelUsed = "";

      // Try Reimagine XL first (specialized for room redesign)
      try {
        console.log("Attempting to generate design with Reimagine XL model...");
        outputImageUrl = await generateInteriorDesignWithReimagineXL(
          imageUrl,
          roomType,
          style
        );
        modelUsed = "Reimagine XL";
      } catch (reimagineError) {
        console.error("Reimagine XL model error:", reimagineError);

        // If Reimagine XL fails, try ControlNet
        try {
          console.log(
            "Attempting to generate design with ControlNet Hough model..."
          );
          outputImageUrl = await generateInteriorDesign(
            imageUrl,
            roomType,
            style
          );
          modelUsed = "ControlNet Hough";
        } catch (controlNetError) {
          console.error(
            "ControlNet model error, falling back to SDXL:",
            controlNetError
          );

          // If ControlNet fails, try the fallback SDXL model
          outputImageUrl = await fallbackGenerateInteriorDesign(
            imageUrl,
            roomType,
            style
          );
          modelUsed = "SDXL (fallback)";
        }
      }

      console.log(`Generated image URL using ${modelUsed}:`, outputImageUrl);

      // Validate the output URL
      if (!outputImageUrl || typeof outputImageUrl !== "string") {
        console.error("Invalid output from Replicate:", outputImageUrl);
        await updateDesignResult(design.id, "", "failed");
        return NextResponse.json(
          {
            error: "Ongeldige uitvoer ontvangen van de AI service",
            details: "The AI service returned an invalid output format",
          },
          { status: 500 }
        );
      }

      // Update design with result
      await updateDesignResult(design.id, outputImageUrl, "completed");

      return NextResponse.json({
        success: true,
        design: {
          ...design,
          result_image_url: outputImageUrl,
          status: "completed",
          model_used: modelUsed,
        },
      });
    } catch (replicateError: any) {
      console.error("Replicate error:", replicateError);

      // Update design status to failed
      await updateDesignResult(design.id, "", "failed");

      return NextResponse.json(
        {
          error:
            "Er is een fout opgetreden bij het genereren van het ontwerp. Probeer het later opnieuw.",
          details: replicateError.message || "Unknown Replicate error",
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("General error in design API:", error);
    return NextResponse.json(
      {
        error: `Er is een fout opgetreden: ${error.message || "Unknown error"}`,
        details: error,
      },
      { status: 500 }
    );
  }
}
