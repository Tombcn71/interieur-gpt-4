import { put } from "@vercel/blob";
import { nanoid } from "nanoid";

// Maximum number of retry attempts
const MAX_RETRIES = 3;

// Helper function to wait between retries
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Update de uploadImage functie om de juiste opties te gebruiken
export async function uploadImage(file: File) {
  const filename = `${nanoid()}-${file.name}`;
  const { url } = await put(filename, file, {
    access: "public",
    addRandomSuffix: true, // Voeg een willekeurig achtervoegsel toe om unieke bestandsnamen te garanderen
    // Verwijder eventuele ongeldige opties
  });

  return url;
}

export async function uploadImageBuffer(file: File) {
  const filename = `${nanoid()}-${file.name}`;
  const { url } = await put(filename, file, {
    access: "public",
    addRandomSuffix: true, // Voeg een willekeurig achtervoegsel toe om unieke bestandsnamen te garanderen
    // Verwijder eventuele ongeldige opties
  });

  return url;
}

// Function to check Vercel Blob configuration
export async function checkBlobConfig() {
  try {
    // Check if BLOB_READ_WRITE_TOKEN is set
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return {
        configured: false,
        error: "BLOB_READ_WRITE_TOKEN is not set",
      };
    }

    // Try a simple operation to verify the token works
    // Create a tiny test file
    const testContent = "test";
    const testFile = new File([testContent], "test.txt", {
      type: "text/plain",
    });

    // Try to upload it
    const { url } = await put("test-config.txt", testFile, {
      access: "public",
    });

    return {
      configured: true,
      testUrl: url,
    };
  } catch (error) {
    return {
      configured: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
