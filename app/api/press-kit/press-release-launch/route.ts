import { NextResponse } from "next/server";

export async function GET() {
  try {
    // In a real implementation, you would return an actual PDF file from your storage
    // For this example, we'll return a mock PDF file

    // Create a simple PDF-like content (this is not a real PDF, just for demonstration)
    const mockPdfContent = Buffer.from(
      "Mock PDF content for launch press release"
    );

    // Return the mock PDF file as a download
    return new NextResponse(mockPdfContent, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          "attachment; filename=interieurgpt-launch-press-release.pdf",
      },
    });
  } catch (error) {
    console.error("Error generating press release:", error);
    return NextResponse.json(
      { error: "Failed to generate press release" },
      { status: 500 }
    );
  }
}
