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
    const file = formData.get("file") as File;
    const category = formData.get("category") as string;
    const filename = formData.get("filename") as string;

    if (!file || !category || !filename) {
      return NextResponse.json(
        { error: "Bestand, categorie en bestandsnaam zijn verplicht" },
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

    // Create the path for the file
    const path = `press-kit/screenshots/${category}/${filename}.${fileExtension}`;

    // Upload the file to Vercel Blob
    const { url } = await put(path, file, {
      access: "public",
    });

    return NextResponse.json({
      success: true,
      url,
      path,
    });
  } catch (error) {
    console.error("Error uploading screenshot:", error);
    return NextResponse.json(
      { error: "Er is een fout opgetreden bij het uploaden van de screenshot" },
      { status: 500 }
    );
  }
}
