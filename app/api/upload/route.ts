import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { uploadImage } from "@/lib/blob";

export async function POST(req: NextRequest) {
  console.log("Upload API route called");

  const session = await getServerSession(authOptions);

  if (!session) {
    console.log("Upload rejected: User not authenticated");
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      console.log("Upload rejected: No file provided");
      return NextResponse.json(
        { error: "Geen bestand geüpload" },
        { status: 400 }
      );
    }

    // Log file details for debugging
    console.log("Uploading file:", {
      name: file.name,
      type: file.type,
      size: `${(file.size / 1024).toFixed(2)} KB`,
    });

    // Log the Blob token status (don't log the actual token)
    console.log(
      "BLOB_READ_WRITE_TOKEN present:",
      !!process.env.BLOB_READ_WRITE_TOKEN
    );

    const url = await uploadImage(file);

    console.log("Upload successful, returned URL:", url);

    return NextResponse.json(
      { url },
      {
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        error: "Er is een fout opgetreden bij het uploaden",
        details: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(), // Voeg een timestamp toe voor debugging
      },
      {
        status: 500,
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  }
}
