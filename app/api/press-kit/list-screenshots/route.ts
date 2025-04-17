import { NextResponse } from "next/server";
import { list } from "@vercel/blob";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    // Check authentication - only allow admins to list screenshots
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
    }

    // In a real app, you would check if the user is an admin
    // For now, we'll just allow any logged-in user

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

    // List all blobs with the press-kit/screenshots prefix
    const { blobs } = await list({
      prefix: "press-kit/screenshots/",
    });

    console.log(`Found ${blobs.length} screenshots`);

    // Voeg deze logging toe na het ophalen van de blobs
    console.log(
      `Found ${blobs.length} screenshots with the following details:`
    );
    blobs.forEach((blob, index) => {
      console.log(`Blob ${index + 1}:`, {
        pathname: blob.pathname,
        url: blob.url,
        size: blob.size,
        uploadedAt: blob.uploadedAt,
      });
    });

    // Transform the blobs into a more user-friendly format
    const screenshots = blobs.map((blob) => {
      // Extract category and filename from the path
      const pathParts = blob.pathname
        .replace("press-kit/screenshots/", "")
        .split("/");
      const category = pathParts[0] as
        | "dashboard"
        | "design-process"
        | "before-after";
      const filename =
        pathParts[1] || blob.pathname.split("/").pop() || "unknown";

      return {
        url: blob.url,
        pathname: blob.pathname,
        filename,
        category,
        uploadedAt: blob.uploadedAt,
        size: blob.size,
      };
    });

    // Voeg deze logging toe na het transformeren van de blobs
    console.log(
      `Transformed ${screenshots.length} screenshots with the following details:`
    );
    screenshots.forEach((screenshot, index) => {
      console.log(`Screenshot ${index + 1}:`, {
        url: screenshot.url,
        pathname: screenshot.pathname,
        filename: screenshot.filename,
        category: screenshot.category,
      });
    });

    return NextResponse.json(
      {
        success: true,
        screenshots,
      },
      {
        headers: {
          // Voorkom caching van de response
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    console.error("Error listing screenshots:", error);
    return NextResponse.json(
      {
        error: "Er is een fout opgetreden bij het ophalen van de screenshots",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
