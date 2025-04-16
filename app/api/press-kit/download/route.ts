import { NextResponse } from "next/server";
import JSZip from "jszip";

export async function GET() {
  try {
    // Create a new ZIP file
    const zip = new JSZip();

    // Add README file
    zip.file(
      "README.txt",
      `InterieurGPT Perskit
=====================

Bedankt voor je interesse in InterieurGPT!

Deze perskit bevat alle officiële media-assets en informatie over InterieurGPT.
Gebruik deze materialen voor publicaties, artikelen en andere media-uitingen.

Inhoud:
- Logo's en merkidentiteit
- Productafbeeldingen en schermafbeeldingen
- Bedrijfsinformatie
- Persberichten
- Contactinformatie

Voor vragen of aanvullende informatie, neem contact op met ons mediateam:
pers@interieurgpt.nl
+31 20 123 4567

© ${new Date().getFullYear()} InterieurGPT. Alle rechten voorbehouden.
`
    );

    // Create folders
    const logosFolder = zip.folder("logos");
    const imagesFolder = zip.folder("images");
    const pressReleasesFolder = zip.folder("press-releases");
    const companyInfoFolder = zip.folder("company-info");

    // Add mock content to folders
    // In a real implementation, you would add actual files from your storage

    // Logos
    logosFolder?.file(
      "logo-guidelines.pdf",
      "Mock PDF content for logo guidelines"
    );
    logosFolder?.file("logo-dark.svg", "<svg>Mock SVG content</svg>");
    logosFolder?.file("logo-light.svg", "<svg>Mock SVG content</svg>");
    logosFolder?.file("logo-icon.svg", "<svg>Mock SVG content</svg>");

    // Images
    imagesFolder?.file("app-screenshot-1.jpg", "Mock image content");
    imagesFolder?.file("app-screenshot-2.jpg", "Mock image content");
    imagesFolder?.file("product-photo-1.jpg", "Mock image content");
    imagesFolder?.file("product-photo-2.jpg", "Mock image content");

    // Press releases
    pressReleasesFolder?.file(
      "2023-03-15-launch.pdf",
      "Mock PDF content for launch press release"
    );
    pressReleasesFolder?.file(
      "2023-06-22-milestone.pdf",
      "Mock PDF content for milestone press release"
    );

    // Company info
    companyInfoFolder?.file(
      "company-profile.pdf",
      "Mock PDF content for company profile"
    );
    companyInfoFolder?.file(
      "fact-sheet.pdf",
      "Mock PDF content for fact sheet"
    );
    companyInfoFolder?.file(
      "founder-bios.pdf",
      "Mock PDF content for founder bios"
    );

    // Generate the ZIP file
    const zipContent = await zip.generateAsync({ type: "nodebuffer" });

    // Return the ZIP file as a download
    return new NextResponse(zipContent, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": "attachment; filename=interieurgpt-perskit.zip",
      },
    });
  } catch (error) {
    console.error("Error generating press kit:", error);
    return NextResponse.json(
      { error: "Failed to generate press kit" },
      { status: 500 }
    );
  }
}
