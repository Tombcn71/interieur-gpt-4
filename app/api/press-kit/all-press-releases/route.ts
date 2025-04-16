import { NextResponse } from "next/server";
import JSZip from "jszip";

export async function GET() {
  try {
    // Create a new ZIP file
    const zip = new JSZip();

    // Add README file
    zip.file(
      "README.txt",
      `InterieurGPT Persberichten
===========================

Dit pakket bevat alle officiële persberichten van InterieurGPT.
De persberichten zijn beschikbaar in PDF- en Word-formaat.

Voor vragen of aanvullende informatie, neem contact op met ons mediateam:
pers@interieurgpt.nl
+31 20 123 4567

© ${new Date().getFullYear()} InterieurGPT. Alle rechten voorbehouden.
`
    );

    // Add mock press release files
    // In a real implementation, you would add actual files from your storage

    // Launch press release
    zip.file(
      "2023-03-15-launch.pdf",
      "Mock PDF content for launch press release"
    );
    zip.file(
      "2023-03-15-launch.docx",
      "Mock DOCX content for launch press release"
    );

    // Milestone press release
    zip.file(
      "2023-06-22-milestone.pdf",
      "Mock PDF content for milestone press release"
    );
    zip.file(
      "2023-06-22-milestone.docx",
      "Mock DOCX content for milestone press release"
    );

    // New features press release
    zip.file(
      "2023-09-10-new-features.pdf",
      "Mock PDF content for new features press release"
    );
    zip.file(
      "2023-09-10-new-features.docx",
      "Mock DOCX content for new features press release"
    );

    // Generate the ZIP file
    const zipContent = await zip.generateAsync({ type: "nodebuffer" });

    // Return the ZIP file as a download
    return new NextResponse(zipContent, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition":
          "attachment; filename=interieurgpt-persberichten.zip",
      },
    });
  } catch (error) {
    console.error("Error generating press releases package:", error);
    return NextResponse.json(
      { error: "Failed to generate press releases package" },
      { status: 500 }
    );
  }
}
