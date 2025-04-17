import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { nanoid } from "nanoid";

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
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const releaseDate = formData.get("releaseDate") as string;

    console.log("Received press release upload request:", {
      category,
      title,
      releaseDate,
      description: description ? description.substring(0, 50) + "..." : "",
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

    if (!category || !title || !releaseDate) {
      return NextResponse.json(
        { error: "Categorie, titel en publicatiedatum zijn verplicht" },
        { status: 400 }
      );
    }

    // Validate the category
    const validCategories = [
      "launch",
      "milestone",
      "update",
      "partnership",
      "other",
    ];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: "Ongeldige categorie" },
        { status: 400 }
      );
    }

    // Get the file extension
    const fileExtension = file.name.split(".").pop()?.toLowerCase() || "pdf";

    // Only allow PDF and Word documents
    const allowedExtensions = ["pdf", "doc", "docx"];
    if (!allowedExtensions.includes(fileExtension)) {
      return NextResponse.json(
        { error: "Alleen PDF en Word documenten zijn toegestaan" },
        { status: 400 }
      );
    }

    // Create a slug from the title
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-"); // Replace multiple hyphens with a single one

    // Create a unique ID for the file
    const uniqueId = nanoid(8);

    // Create the path for the file
    const path = `press-kit/press-releases/${category}/${releaseDate}-${slug}-${uniqueId}.${fileExtension}`;

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

      // Store metadata in a JSON file
      const metadata = {
        title,
        description,
        releaseDate,
        category,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        url,
        path,
        uploadedAt: new Date().toISOString(),
        uploadedBy: session.user.email,
      };

      // Create a JSON file with the metadata
      const metadataPath = `press-kit/press-releases/${category}/${releaseDate}-${slug}-${uniqueId}.json`;
      const metadataBlob = new Blob([JSON.stringify(metadata, null, 2)], {
        type: "application/json",
      });
      const metadataFile = new File([metadataBlob], "metadata.json", {
        type: "application/json",
      });

      await put(metadataPath, metadataFile, {
        access: "public",
        addRandomSuffix: false,
      });

      return NextResponse.json({
        success: true,
        url,
        path,
        metadata,
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
    console.error("Error uploading press release:", error);
    return NextResponse.json(
      {
        error: "Er is een fout opgetreden bij het uploaden van het persbericht",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
