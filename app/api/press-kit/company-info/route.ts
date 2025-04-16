import { NextResponse } from "next/server";
import JSZip from "jszip";

export async function GET() {
  try {
    // Create a new ZIP file
    const zip = new JSZip();

    // Add README file
    zip.file(
      "README.txt",
      `InterieurGPT Bedrijfsinformatie
==============================

Dit pakket bevat officiële bedrijfsinformatie over InterieurGPT.
De documenten zijn beschikbaar in PDF- en Word-formaat.

Inhoud:
- Bedrijfsprofiel
- Factsheet
- Oprichtersbiografieën
- Tijdlijn
- Missie en visie

Voor vragen of aanvullende informatie, neem contact op met ons mediateam:
pers@interieurgpt.nl
+31 20 123 4567

© ${new Date().getFullYear()} InterieurGPT. Alle rechten voorbehouden.
`
    );

    // Add mock company info files
    // In a real implementation, you would add actual files from your storage

    // Company profile
    zip.file("company-profile.pdf", "Mock PDF content for company profile");
    zip.file("company-profile.docx", "Mock DOCX content for company profile");

    // Fact sheet
    zip.file("fact-sheet.pdf", "Mock PDF content for fact sheet");
    zip.file("fact-sheet.docx", "Mock DOCX content for fact sheet");

    // Founder bios
    zip.file("founder-bios.pdf", "Mock PDF content for founder bios");
    zip.file("founder-bios.docx", "Mock DOCX content for founder bios");

    // Timeline
    zip.file("timeline.pdf", "Mock PDF content for timeline");

    // Mission and vision
    zip.file("mission-vision.pdf", "Mock PDF content for mission and vision");

    // Generate the ZIP file
    const zipContent = await zip.generateAsync({ type: "nodebuffer" });

    // Return the ZIP file as a download
    return new NextResponse(zipContent, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition":
          "attachment; filename=interieurgpt-company-info.zip",
      },
    });
  } catch (error) {
    console.error("Error generating company info package:", error);
    return NextResponse.json(
      { error: "Failed to generate company info package" },
      { status: 500 }
    );
  }
}
