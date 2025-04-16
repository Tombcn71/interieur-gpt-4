import { NextResponse } from "next/server";
import JSZip from "jszip";

export async function GET() {
  try {
    // Create a new ZIP file
    const zip = new JSZip();

    // Add README file
    zip.file(
      "README.txt",
      `InterieurGPT Schermafbeeldingen
=============================

Dit pakket bevat officiële schermafbeeldingen van de InterieurGPT applicatie.
De afbeeldingen zijn beschikbaar in verschillende resoluties en formaten.

Gebruik deze afbeeldingen voor artikelen, reviews en andere media-uitingen.

Voor vragen of aanvullende informatie, neem contact op met ons mediateam:
pers@interieurgpt.nl

© ${new Date().getFullYear()} InterieurGPT. Alle rechten voorbehouden.
`
    );

    // Add mock screenshot files
    // In a real implementation, you would add actual files from your storage

    // Dashboard screenshots
    zip.file("dashboard/dashboard-desktop.jpg", "Mock JPG content");
    zip.file("dashboard/dashboard-desktop.png", "Mock PNG content");
    zip.file("dashboard/dashboard-mobile.jpg", "Mock JPG content");
    zip.file("dashboard/dashboard-mobile.png", "Mock PNG content");

    // Design process screenshots
    zip.file("design-process/upload-photo.jpg", "Mock JPG content");
    zip.file("design-process/select-style.jpg", "Mock JPG content");
    zip.file("design-process/result-comparison.jpg", "Mock JPG content");

    // Before-after examples
    zip.file("before-after/living-room-before.jpg", "Mock JPG content");
    zip.file("before-after/living-room-after.jpg", "Mock JPG content");
    zip.file("before-after/bedroom-before.jpg", "Mock JPG content");
    zip.file("before-after/bedroom-after.jpg", "Mock JPG content");
    zip.file("before-after/kitchen-before.jpg", "Mock JPG content");
    zip.file("before-after/kitchen-after.jpg", "Mock JPG content");

    // Generate the ZIP file
    const zipContent = await zip.generateAsync({ type: "nodebuffer" });

    // Return the ZIP file as a download
    return new NextResponse(zipContent, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition":
          "attachment; filename=interieurgpt-screenshots.zip",
      },
    });
  } catch (error) {
    console.error("Error generating screenshots package:", error);
    return NextResponse.json(
      { error: "Failed to generate screenshots package" },
      { status: 500 }
    );
  }
}
