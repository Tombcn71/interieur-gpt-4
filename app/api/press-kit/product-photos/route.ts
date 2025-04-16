import { NextResponse } from "next/server";
import JSZip from "jszip";

export async function GET() {
  try {
    // Create a new ZIP file
    const zip = new JSZip();

    // Add README file
    zip.file(
      "README.txt",
      `InterieurGPT Productfoto's
=========================

Dit pakket bevat officiële productfoto's van InterieurGPT.
De afbeeldingen zijn beschikbaar in hoge resolutie en zijn geschikt voor print en web.

Gebruik deze afbeeldingen voor artikelen, reviews en andere media-uitingen.

Voor vragen of aanvullende informatie, neem contact op met ons mediateam:
pers@interieurgpt.nl

© ${new Date().getFullYear()} InterieurGPT. Alle rechten voorbehouden.
`
    );

    // Add mock product photo files
    // In a real implementation, you would add actual files from your storage

    // Product photos
    zip.file("product/app-usage-1.jpg", "Mock JPG content");
    zip.file("product/app-usage-2.jpg", "Mock JPG content");
    zip.file("product/app-usage-3.jpg", "Mock JPG content");

    // Team photos
    zip.file("team/team-photo-1.jpg", "Mock JPG content");
    zip.file("team/team-photo-2.jpg", "Mock JPG content");

    // Office photos
    zip.file("office/office-1.jpg", "Mock JPG content");
    zip.file("office/office-2.jpg", "Mock JPG content");

    // Generate the ZIP file
    const zipContent = await zip.generateAsync({ type: "nodebuffer" });

    // Return the ZIP file as a download
    return new NextResponse(zipContent, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition":
          "attachment; filename=interieurgpt-product-photos.zip",
      },
    });
  } catch (error) {
    console.error("Error generating product photos package:", error);
    return NextResponse.json(
      { error: "Failed to generate product photos package" },
      { status: 500 }
    );
  }
}
