import { getServerSession } from "next-auth/next";
import { type NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { createDesign, updateDesignResult, updateUserCredits } from "@/lib/db";
import { generateInteriorDesign } from "@/lib/replicate";

// Define the mock function directly in this file to avoid import issues
async function mockGenerateInteriorDesign(
  imageUrl: string,
  roomType: string,
  style: string
) {
  console.log(
    `[INLINE MOCK] Generating interior design: ${roomType}, ${style}`
  );
  console.log(`[INLINE MOCK] Using image URL: ${imageUrl}`);

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Return a placeholder image URL
  return "https://placehold.co/600x400/jpeg?text=AI+Generated+Interior+Design+(Inline)";
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
    }

    // Ensure user ID exists and is a string
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

    try {
      // Ensure user ID is a string and not null or undefined
      const userId = String(session.user.id);

      // Log the user ID for debugging
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

      // Log the created design for debugging
      console.log("Design created:", design);

      // Deduct credit
      await updateUserCredits(userId, -1);

      try {
        let outputImageUrl: string;

        // Check if we should use the mock implementation
        const useMock =
          process.env.NODE_ENV === "development" &&
          (!process.env.REPLICATE_API_TOKEN ||
            process.env.USE_MOCK_REPLICATE === "true");

        if (useMock) {
          console.log("Using mock Replicate implementation");
          // Use the inline mock function instead of importing
          outputImageUrl = await mockGenerateInteriorDesign(
            imageUrl,
            roomType,
            style
          );
        } else {
          // Generate design with Replicate
          outputImageUrl = await generateInteriorDesign(
            imageUrl,
            roomType,
            style
          );
        }

        // Update design with result
        if (outputImageUrl) {
          await updateDesignResult(design.id, outputImageUrl, "completed");

          return NextResponse.json({
            success: true,
            design: {
              ...design,
              result_image_url: outputImageUrl,
              status: "completed",
            },
          });
        } else {
          await updateDesignResult(design.id, "", "failed");
          return NextResponse.json(
            { error: "Generatie mislukt" },
            { status: 500 }
          );
        }
      } catch (replicateError: any) {
        console.error("Replicate error:", replicateError);

        // Update design status to failed
        await updateDesignResult(design.id, "", "failed");

        // Return a more user-friendly error message
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
      console.error("Error creating design:", error);
      return NextResponse.json(
        {
          error: `Error creating design: ${error.message || "Unknown error"}`,
          details: error,
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
