import { NextResponse } from "next/server";
import { list } from "@vercel/blob";

export async function GET() {
  try {
    // Check if BLOB_READ_WRITE_TOKEN is set
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error("BLOB_READ_WRITE_TOKEN is not set");
      // Return fallback data instead of an error for public page
      return NextResponse.json(
        {
          success: true,
          pressReleases: [],
        },
        {
          headers: {
            "Cache-Control":
              "no-store, no-cache, must-revalidate, proxy-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        }
      );
    }

    // List all blobs with the press-kit/press-releases prefix
    const { blobs } = await list({
      prefix: "press-kit/press-releases/",
    });

    console.log(`Found ${blobs.length} press releases`);

    // Transform the blobs into a more user-friendly format
    const pressReleases = blobs.map((blob) => {
      // Extract metadata from the path
      const pathParts = blob.pathname
        .replace("press-kit/press-releases/", "")
        .split("/");
      const category = pathParts[0];

      // Extract filename and format
      const filenameWithFormat =
        pathParts[1] || blob.pathname.split("/").pop() || "unknown";
      const parts = filenameWithFormat.split(".");
      const format = parts.pop() || "pdf"; // Default to pdf if no extension
      const filename = parts.join(".");

      // Extract metadata from filename (assuming format: YYYY-MM-DD-title.ext)
      const dateMatch = filename.match(/^(\d{4}-\d{2}-\d{2})-(.+)$/);

      let date = "";
      let title = filename;

      if (dateMatch) {
        const [, dateStr, titleStr] = dateMatch;
        date = dateStr;
        title = titleStr.replace(/-/g, " ");
      }

      // Format the date for display
      const formattedDate = date
        ? new Date(date).toLocaleDateString("nl-NL", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "";

      return {
        url: blob.url,
        pathname: blob.pathname,
        filename: `${filename}.${format}`,
        format,
        title: title.charAt(0).toUpperCase() + title.slice(1), // Capitalize first letter
        date: formattedDate,
        description: `Persbericht: ${title}`,
        uploadedAt: blob.uploadedAt,
        size: blob.size,
      };
    });

    return NextResponse.json(
      {
        success: true,
        pressReleases,
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
    console.error("Error listing press releases:", error);
    // Return empty array instead of error for public page
    return NextResponse.json(
      {
        success: true,
        pressReleases: [],
      },
      {
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
