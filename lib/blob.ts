import { put } from "@vercel/blob";
import { nanoid } from "nanoid";

// Maximum number of retry attempts
const MAX_RETRIES = 3;

// Helper function to wait between retries
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function uploadImage(file: File, retryCount = 0): Promise<string> {
  try {
    // Log upload attempt
    console.log(
      `Attempting to upload file (attempt ${retryCount + 1}/${MAX_RETRIES + 1})`
    );

    // Check if BLOB_READ_WRITE_TOKEN is set
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error("BLOB_READ_WRITE_TOKEN is not set");
      throw new Error(
        "Vercel Blob is niet geconfigureerd. BLOB_READ_WRITE_TOKEN ontbreekt."
      );
    }

    // Generate a unique filename
    const filename = `${nanoid()}-${file.name}`;

    // Upload to Vercel Blob
    const { url } = await put(filename, file, {
      access: "public",
      contentType: file.type, // Ensure correct content type
    });

    console.log("Upload successful:", url);
    return url;
  } catch (error) {
    // Log the error
    console.error(
      `Upload error (attempt ${retryCount + 1}/${MAX_RETRIES + 1}):`,
      error
    );

    // If we haven't reached max retries, try again
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying upload in ${(retryCount + 1) * 1000}ms...`);
      await wait((retryCount + 1) * 1000); // Exponential backoff
      return uploadImage(file, retryCount + 1);
    }

    // If we've reached max retries, throw the error
    throw error;
  }
}

export async function uploadImageBuffer(file: File): Promise<string> {
  return uploadImage(file); // Use the same function with retry logic
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
