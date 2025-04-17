import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { uploadImage } from "@/lib/blob";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
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

    const url = await uploadImage(file);

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        error: "Er is een fout opgetreden bij het uploaden",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
