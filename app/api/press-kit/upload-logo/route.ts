import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    // Check authentication - only allow admins to upload
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
    }

    // In a real app, you would check if the user is an admin
    // For now, we'll just allow any logged-in user

    // Parse the form data
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const category = formData.get("category") as string;
    const format = formData.get("format") as string;
    const filename = formData.get("filename") as string;

    console.log("Received logo upload request:", {
      category,
      format,
      filename,
      fileSize: file?.size,
      fileType: file?.type,
      fileExists: !!file,
    });

    if (!file) {
      return NextResponse.json(
        { error: "Geen bestand ontvangen" },
        { status: 400 }
      );
    }

    if (!category || !format || !filename) {
      return NextResponse.json(
        { error: "Categorie, formaat en bestandsnaam zijn verplicht" },
        { status: 400 }
      );
    }

    // Validate the category
    const validCategories = ["dark", "light", "icon", "monochrome", "color"];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: "Ongeldige categorie" },
        { status: 400 }
      );
    }

    // Validate the format
    const validFormats = ["svg", "png", "jpg"];
    if (!validFormats.includes(format)) {
      return NextResponse.json({ error: "Ongeldig formaat" }, { status: 400 });
    }

    // Create the path for the file
    const path = `press-kit/logos/${category}/${filename}.${format}`;

    console.log("Uploading to Vercel Blob:", { path });

    // Check if BLOB_READ_WRITE_TOKEN is set
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error("BLOB_READ_WRITE_TOKEN is not set");
      return NextResponse.json(
        {
          error:
            "Vercel Blob is niet geconfigureerd. Controleer of BLOB_READ_WRITE_TOKEN is ingesteld.",
        },
        { status: 500 }
      );
    }

    try {
      // Upload the file to Vercel Blob with public access
      const { url } = await put(path, file, {
        access: "public",
        addRandomSuffix: false, // Use exact filename
        contentType: file.type, // Set the correct content type
      });

      console.log("Successfully uploaded to Vercel Blob:", { url, path });

      // Log details after uploading to Vercel Blob
      console.log("Blob upload response details:", {
        url: url,
        path: path,
        contentType: file.type,
        size: file.size,
        timestamp: new Date().toISOString(),
      });

      // Test if the URL is accessible
      try {
        const testResponse = await fetch(url, { method: "HEAD" });
        console.log("URL accessibility test:", {
          status: testResponse.status,
          ok: testResponse.ok,
          headers: Object.fromEntries(testResponse.headers.entries()),
        });
      } catch (testError) {
        console.warn("URL accessibility test failed:", testError);
        // Continue despite the error, but log it for debugging
      }

      return NextResponse.json({
        success: true,
        url,
        path,
      });
    } catch (blobError) {
      console.error("Vercel Blob upload error:", blobError);
      return NextResponse.json(
        {
          error: "Fout bij uploaden naar Vercel Blob",
          details:
            blobError instanceof Error ? blobError.message : String(blobError),
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error uploading logo:", error);
    return NextResponse.json(
      {
        error: "Er is een fout opgetreden bij het uploaden van het logo",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
