import { NextResponse } from "next/server";
import { checkReplicateConfig } from "@/lib/replicate";
import { safeStringify } from "@/lib/debug-utils";

export async function GET() {
  try {
    const result = await checkReplicateConfig();

    return NextResponse.json({
      success: result.configured,
      error: result.error,
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
