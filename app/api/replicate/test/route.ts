import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("Testing Replicate API connection...");

    // Check if Replicate API token is set
    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json({
        success: false,
        error: "REPLICATE_API_TOKEN is not set",
      });
    }

    // Try a simple prediction with a text-to-image model
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + process.env.REPLICATE_API_TOKEN,
      },
      body: JSON.stringify({
        // Use a simple text-to-image model
        version:
          "5c7d5dc6dd8bf75c1acaa8565735e7986bc5b66206b55cca93cb72c9bf15ccaa",
        input: {
          prompt: "A beautiful landscape",
        },
      }),
    });

    const responseText = await response.text();
    console.log("Raw response from Replicate test:", responseText);

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: `Replicate API error: ${responseText}`,
        status: response.status,
      });
    }

    try {
      const jsonResponse = JSON.parse(responseText);
      return NextResponse.json({
        success: true,
        prediction: jsonResponse,
        token: process.env.REPLICATE_API_TOKEN
          ? `${process.env.REPLICATE_API_TOKEN.substring(0, 5)}...`
          : "Not set",
      });
    } catch (e) {
      return NextResponse.json({
        success: false,
        error: "Failed to parse response JSON",
        rawResponse: responseText,
      });
    }
  } catch (error) {
    console.error("Error testing Replicate:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
