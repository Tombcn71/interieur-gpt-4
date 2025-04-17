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
    const filename = formData.get("filename") as string;

    console.log("Received upload request:", {
      category,
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

    if (!category || !filename) {
      return NextResponse.json(
        { error: "Categorie en bestandsnaam zijn verplicht" },
        { status: 400 }
      );
    }

    // Validate the category
    const validCategories = ["dashboard", "design-process", "before-after"];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: "Ongeldige categorie" },
        { status: 400 }
      );
    }

    // Get the file extension
    const fileExtension = file.name.split(".").pop()?.toLowerCase() || "jpg";

    // Only allow image files
    const allowedExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
    if (!allowedExtensions.includes(fileExtension)) {
      return NextResponse.json(
        { error: "Alleen afbeeldingsbestanden zijn toegestaan" },
        { status: 400 }
      );
    }

    // Create the path for the file - ensure the category is included in the path
    const path = `press-kit/screenshots/${category}/${filename}.${fileExtension}`;

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
      // BELANGRIJK: Voeg allowOverwrite: true toe om bestaande bestanden te overschrijven
      const { url } = await put(path, file, {
        access: "public",
        addRandomSuffix: false, // Use exact filename
        // Verwijder de 'allowOverwrite' optie omdat deze niet bestaat in het type
        contentType: file.type, // Set the correct content type
      });

      console.log("Successfully uploaded to Vercel Blob:", { url, path });

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
    console.error("Error uploading screenshot:", error);
    return NextResponse.json(
      {
        error: "Er is een fout opgetreden bij het uploaden van de screenshot",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
