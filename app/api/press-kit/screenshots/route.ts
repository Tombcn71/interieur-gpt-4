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

    // Fetch actual screenshots from the public directory
    // In a real implementation, you would add actual files from your storage

    // Create folders in the ZIP
    const dashboardFolder = zip.folder("dashboard");
    const designProcessFolder = zip.folder("design-process");
    const beforeAfterFolder = zip.folder("before-after");

    // Add the actual screenshot files
    // For this example, we're using placeholder content, but in a real implementation
    // you would read the actual files from your file system or Vercel Blob storage

    // Dashboard screenshots
    dashboardFolder?.file("dashboard-desktop.jpg", "Mock JPG content");
    dashboardFolder?.file("dashboard-desktop.png", "Mock PNG content");
    dashboardFolder?.file("dashboard-mobile.jpg", "Mock JPG content");
    dashboardFolder?.file("dashboard-mobile.png", "Mock PNG content");

    // Design process screenshots
    designProcessFolder?.file("upload-photo.jpg", "Mock JPG content");
    designProcessFolder?.file("select-style.jpg", "Mock JPG content");
    designProcessFolder?.file("result-comparison.jpg", "Mock JPG content");

    // Before-after examples
    beforeAfterFolder?.file("living-room-before.jpg", "Mock JPG content");
    beforeAfterFolder?.file("living-room-after.jpg", "Mock JPG content");
    beforeAfterFolder?.file("bedroom-before.jpg", "Mock JPG content");
    beforeAfterFolder?.file("bedroom-after.jpg", "Mock JPG content");
    beforeAfterFolder?.file("kitchen-before.jpg", "Mock JPG content");
    beforeAfterFolder?.file("kitchen-after.jpg", "Mock JPG content");

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
