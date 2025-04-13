import { NextResponse } from "next/server";
import Replicate from "replicate";
import { safeStringify } from "@/lib/debug-utils";

export async function GET() {
  try {
    // Check if Replicate API token is set
    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json({
        success: false,
        error: "REPLICATE_API_TOKEN is not set",
        development: process.env.NODE_ENV === "development",
      });
    }

    // Create a Replicate client
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // Try to list models to verify the API token works
    await replicate.models.list();

    return NextResponse.json({
      success: true,
      development: process.env.NODE_ENV === "development",
      replicateToken: process.env.REPLICATE_API_TOKEN
        ? `${process.env.REPLICATE_API_TOKEN.substring(0, 5)}...`
        : "Not set",
    });
  } catch (error: any) {
    console.error("Replicate configuration error:", error);
    return NextResponse.json({
      success: false,
      error: error.message || "Replicate configuration failed",
      errorDetails: safeStringify(error),
      development: process.env.NODE_ENV === "development",
    });
  }
}
