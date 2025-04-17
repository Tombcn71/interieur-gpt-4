import { NextResponse } from "next/server";
import { list } from "@vercel/blob";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    // Check authentication - only allow admins to list logos
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

    // List all blobs with the press-kit/logos prefix
    const { blobs } = await list({
      prefix: "press-kit/logos/",
    });

    console.log(`Found ${blobs.length} logos`);

    // Add this logging after fetching the blobs
    console.log(`Found ${blobs.length} logos with the following details:`);
    blobs.forEach((blob, index) => {
      console.log(`Logo ${index + 1}:`, {
        pathname: blob.pathname,
        url: blob.url,
        size: blob.size,
        uploadedAt: blob.uploadedAt,
      });
    });

    // Transform the blobs into a more user-friendly format
    const logos = blobs.map((blob) => {
      // Extract category, format and filename from the path
      const pathParts = blob.pathname
        .replace("press-kit/logos/", "")
        .split("/");
      const category = pathParts[0] as
        | "dark"
        | "light"
        | "icon"
        | "monochrome"
        | "color";

      // Extract filename and format
      const filenameWithFormat =
        pathParts[1] || blob.pathname.split("/").pop() || "unknown";
      const parts = filenameWithFormat.split(".");
      const format = parts.pop() || "svg"; // Default to svg if no extension
      const filename = parts.join(".");

      return {
        url: blob.url,
        pathname: blob.pathname,
        filename,
        format,
        category,
        uploadedAt: blob.uploadedAt,
        size: blob.size,
      };
    });

    // Add this logging after transforming the blobs
    console.log(
      `Transformed ${logos.length} logos with the following details:`
    );
    logos.forEach((logo, index) => {
      console.log(`Logo ${index + 1}:`, {
        url: logo.url,
        pathname: logo.pathname,
        filename: logo.filename,
        format: logo.format,
        category: logo.category,
      });
    });

    return NextResponse.json(
      {
        success: true,
        logos,
      },
      {
        headers: {
          // Prevent caching of the response
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    console.error("Error listing logos:", error);
    return NextResponse.json(
      {
        error: "Er is een fout opgetreden bij het ophalen van de logo's",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
