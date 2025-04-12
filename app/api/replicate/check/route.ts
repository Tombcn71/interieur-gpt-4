import { NextResponse } from "next/server";
import { checkReplicateConfig } from "@/lib/replicate";

export async function GET() {
  try {
    const result = await checkReplicateConfig();

    return NextResponse.json({
      success: result.configured,
      error: result.error,
      development: process.env.NODE_ENV === "development",
    });
  } catch (error: any) {
    console.error("Replicate configuration error:", error);
    return NextResponse.json({
      success: false,
      error: error.message || "Replicate configuration failed",
      development: process.env.NODE_ENV === "development",
    });
  }
}
