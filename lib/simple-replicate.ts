import Replicate from "replicate";
import { uploadImageBuffer } from "@/lib/blob";

/**
 * Simple and direct approach to generate interior designs using Replicate API
 * Using the specialized adirik/interior-design model with stream handling
 */
export async function generateInteriorDesign(
  imageUrl: string,
  roomType: string,
  style: string
): Promise<string> {
  // Create a more detailed prompt based on the room type and style
  const prompt = `A ${roomType} with a ${style} style. The room should have appropriate furniture, 
  decorations, and color scheme that match the ${style} aesthetic while maintaining the same layout and dimensions.`;

  console.log(`Generating interior design: ${roomType}, ${style}`);
  console.log(`Using image URL: ${imageUrl}`);
  console.log(`Using prompt: ${prompt}`);

  try {
    // Initialize Replicate client
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // Run the specialized interior design model
    console.log("Starting prediction with adirik/interior-design model...");
    const output = await replicate.run(
      "adirik/interior-design:76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38",
      {
        input: {
          image: imageUrl,
          prompt: prompt,
        },
      }
    );

    console.log(
      "Model output type:",
      typeof output,
      output instanceof ReadableStream
    );

    // Handle different output formats
    if (output instanceof ReadableStream) {
      console.log("Processing ReadableStream output...");
      return await processStreamOutput(output);
    } else if (typeof output === "string") {
      return output;
    } else if (Array.isArray(output) && output.length > 0) {
      return output[0];
    } else {
      console.error("Unexpected output format:", output);
      throw new Error("Unexpected output format from model");
    }
  } catch (error) {
    console.error("Error generating interior design:", error);
    throw error;
  }
}

/**
 * Process a ReadableStream output from the model
 * Reads the stream, converts it to a Blob, and uploads it to get a URL
 */
async function processStreamOutput(stream: ReadableStream): Promise<string> {
  try {
    // Get a reader from the stream
    const reader = stream.getReader();
    const chunks: Uint8Array[] = [];

    // Read all chunks from the stream
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }

    // Combine all chunks into a single Uint8Array
    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const combinedChunks = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      combinedChunks.set(chunk, offset);
      offset += chunk.length;
    }

    // Create a Blob from the Uint8Array
    const blob = new Blob([combinedChunks], { type: "image/png" });

    // Create a File object from the Blob
    const file = new File([blob], "generated-interior.png", {
      type: "image/png",
    });

    // Upload the file to Vercel Blob
    const uploadedUrl = await uploadImageBuffer(file);
    console.log("Uploaded image to Blob storage:", uploadedUrl);
    return uploadedUrl;
  } catch (error) {
    console.error("Error processing stream output:", error);
    throw new Error("Failed to process image from model");
  }
}
