import { NextResponse } from "next/server";
import { getFallbackImage } from "@/lib/fallback-upload";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  // Get the image from localStorage
  const imageData = getFallbackImage(id);

  if (!imageData) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }

  // Extract the content type and base64 data
  const [metaData, base64Data] = imageData.split(",");
  const contentType = metaData.match(/:(.*?);/)?.[1] || "image/jpeg";

  // Convert base64 to binary
  const binaryData = Buffer.from(base64Data, "base64");

  // Return the image
  return new NextResponse(binaryData, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
