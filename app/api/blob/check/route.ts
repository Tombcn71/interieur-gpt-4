import { NextResponse } from "next/server";
import { checkBlobConfig } from "@/lib/blob";

export async function GET() {
  try {
    const result = await checkBlobConfig();

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error checking Blob configuration:", error);
    return NextResponse.json(
      {
        configured: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
