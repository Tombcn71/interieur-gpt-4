import { NextResponse } from "next/server";
import { list } from "@vercel/blob";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    // Check authentication - only allow admins to list press releases
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

    // List all metadata JSON files with the press-kit/press-releases prefix
    const { blobs } = await list({
      prefix: "press-kit/press-releases/",
      limit: 100,
    });

    console.log(`Found ${blobs.length} press release files`);

    // Filter only the JSON metadata files
    const metadataFiles = blobs.filter((blob) =>
      blob.pathname.endsWith(".json")
    );

    console.log(`Found ${metadataFiles.length} press release metadata files`);

    // Fetch the content of each metadata file
    const pressReleases = await Promise.all(
      metadataFiles.map(async (blob) => {
        try {
          const response = await fetch(blob.url);
          if (!response.ok) {
            console.error(
              `Failed to fetch metadata from ${blob.url}: ${response.status} ${response.statusText}`
            );
            return null;
          }
          const metadata = await response.json();
          return metadata;
        } catch (error) {
          console.error(`Error parsing metadata from ${blob.url}:`, error);
          return null;
        }
      })
    );

    // Filter out any null values and sort by release date (newest first)
    const validPressReleases = pressReleases
      .filter((pr) => pr !== null)
      .sort(
        (a, b) =>
          new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
      );

    console.log(`Returning ${validPressReleases.length} valid press releases`);

    return NextResponse.json(
      {
        success: true,
        pressReleases: validPressReleases,
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
    console.error("Error listing press releases:", error);
    return NextResponse.json(
      {
        error: "Er is een fout opgetreden bij het ophalen van de persberichten",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
