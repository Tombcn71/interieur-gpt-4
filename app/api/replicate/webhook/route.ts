import { type NextRequest, NextResponse } from "next/server";
import { updateDesignResult } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    // Log the raw request body for debugging
    const rawBody = await req.text();
    console.log("Received webhook raw body:", rawBody);

    let body;
    try {
      body = JSON.parse(rawBody);
      console.log("Parsed webhook body:", body);
    } catch (e) {
      console.error("Failed to parse webhook body:", e);
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    // Extract the relevant information
    const { id, status, output, error, metadata } = body;
    console.log("Webhook details:", {
      id,
      status,
      output: Array.isArray(output) ? output[0] : output,
      error,
      metadata,
    });

    // Check if this is a design generation
    if (metadata && metadata.designId) {
      const designId = metadata.designId;
      console.log(`Processing webhook for design ${designId}`);

      if (status === "succeeded" && output) {
        let resultUrl = null;

        // Extract the output URL
        if (Array.isArray(output) && output.length > 0) {
          resultUrl = output[0];
        } else if (typeof output === "string") {
          resultUrl = output;
        }

        if (resultUrl) {
          console.log(
            `Updating design ${designId} with result URL: ${resultUrl}`
          );
          await updateDesignResult(designId, resultUrl, "completed");
        } else {
          console.error("No valid output URL found in webhook response");
          await updateDesignResult(designId, "", "failed");
        }
      } else if (status === "failed") {
        console.error(`Design generation failed: ${error || "Unknown error"}`);
        await updateDesignResult(designId, "", "failed");
      }
    } else {
      console.log("Webhook received but no designId in metadata");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing Replicate webhook:", error);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
