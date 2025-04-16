import { NextResponse } from "next/server";
import JSZip from "jszip";

export async function GET() {
  try {
    // Create a new ZIP file
    const zip = new JSZip();

    // Add README file
    zip.file(
      "README.txt",
      `InterieurGPT Logo Pakket
=======================

Dit pakket bevat de officiële logo's van InterieurGPT in verschillende formaten en kleuren.
Gebruik deze logo's volgens de richtlijnen in het meegeleverde merkrichtlijnen document.

Inhoud:
- SVG logo's (donker en licht)
- PNG logo's in verschillende resoluties
- Iconen
- Merkrichtlijnen

Voor vragen of aanvullende informatie, neem contact op met ons mediateam:
pers@interieurgpt.nl

© ${new Date().getFullYear()} InterieurGPT. Alle rechten voorbehouden.
`
    );

    // Add mock logo files
    // In a real implementation, you would add actual files from your storage

    // SVG logos
    zip.file("svg/logo-dark.svg", "<svg>Mock SVG content for dark logo</svg>");
    zip.file(
      "svg/logo-light.svg",
      "<svg>Mock SVG content for light logo</svg>"
    );
    zip.file("svg/logo-icon.svg", "<svg>Mock SVG content for icon</svg>");

    // PNG logos
    zip.file("png/logo-dark-large.png", "Mock PNG content");
    zip.file("png/logo-dark-medium.png", "Mock PNG content");
    zip.file("png/logo-dark-small.png", "Mock PNG content");
    zip.file("png/logo-light-large.png", "Mock PNG content");
    zip.file("png/logo-light-medium.png", "Mock PNG content");
    zip.file("png/logo-light-small.png", "Mock PNG content");

    // Guidelines
    zip.file("brand-guidelines.pdf", "Mock PDF content for brand guidelines");

    // Generate the ZIP file
    const zipContent = await zip.generateAsync({ type: "nodebuffer" });

    // Return the ZIP file as a download
    return new NextResponse(zipContent, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": "attachment; filename=interieurgpt-logos.zip",
      },
    });
  } catch (error) {
    console.error("Error generating logo package:", error);
    return NextResponse.json(
      { error: "Failed to generate logo package" },
      { status: 500 }
    );
  }
}
