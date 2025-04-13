import Replicate from "replicate";
import { uploadImageBuffer } from "@/lib/blob";
import { safeStringify } from "@/lib/debug-utils";

// Create the Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Define model ID types to match Replicate's expected format
type ModelIdWithVersion = `${string}/${string}:${string}`;
type ModelId = `${string}/${string}`;

/**
 * Generates an interior design using the most reliable models with fallback
 */
export async function generateInteriorDesign(
  imageUrl: string,
  roomType: string,
  style: string
) {
  const prompt = `Transform this ${roomType} into a beautiful ${style} style interior design. 
  Make it look professional, realistic, and high-quality. Maintain the same layout and dimensions of the room.`;

  console.log(`Generating interior design: ${roomType}, ${style}`);
  console.log(`Using image URL: ${imageUrl}`);

  // Try models in order of reliability
  const models = [
    {
      name: "Stable Diffusion v1.5",
      // Split the model ID and version to match the expected format
      id: "stability-ai/stable-diffusion" as ModelId,
      version:
        "ac732df83cea7a18b7a7674901a95dd590d5d1e308e5dee379ecf15eb6a14da9",
      params: {
        prompt: prompt,
        image: imageUrl,
        num_outputs: 1,
        guidance_scale: 7.5,
        num_inference_steps: 30,
        strength: 0.8,
        negative_prompt: "ugly, disfigured, low quality, blurry, nsfw",
      },
    },
    {
      name: "SDXL",
      id: "stability-ai/sdxl" as ModelId,
      version:
        "c221b2b8ef527988fb59bf24a8b97c4561f1c671f73bd389f866bfb27c061316",
      params: {
        prompt: prompt,
        image: imageUrl,
        num_outputs: 1,
        guidance_scale: 7.5,
        num_inference_steps: 25,
        strength: 0.7,
        negative_prompt: "ugly, disfigured, low quality, blurry, nsfw",
      },
    },
  ];

  let lastError = null;

  // Try each model in sequence
  for (const model of models) {
    try {
      console.log(`Attempting to generate with ${model.name}...`);

      // Use the predictions.create method instead of run
      const prediction = await replicate.predictions.create({
        version: model.version,
        input: model.params,
      });

      // Wait for the prediction to complete
      const output = await replicate.wait(prediction);

      // Handle different output types
      if (
        output.output &&
        Array.isArray(output.output) &&
        output.output.length > 0
      ) {
        const result = output.output[0];
        console.log(`Successfully generated with ${model.name}`);

        // Handle if result is a ReadableStream
        if (result && typeof result === "object" && "locked" in result) {
          return await processStreamResponse(
            result as ReadableStream<Uint8Array>
          );
        }

        return result;
      } else if (output.output && typeof output.output === "string") {
        console.log(`Successfully generated with ${model.name}`);
        return output.output;
      } else {
        console.log(
          `Unexpected output format from ${model.name}:`,
          safeStringify(output)
        );
      }
    } catch (error) {
      console.error(`Error with ${model.name}:`, error);
      lastError = error;
      // Continue to next model
    }
  }

  // If all models failed
  const errorMessage =
    lastError instanceof Error ? lastError.message : "Unknown error";
  throw new Error(`All models failed. Last error: ${errorMessage}`);
}

/**
 * Process a ReadableStream response from Replicate
 */
async function processStreamResponse(
  stream: ReadableStream<Uint8Array>
): Promise<string> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];

  try {
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

    // Check if it's a PNG image (starts with PNG signature)
    if (
      combinedChunks.length > 8 &&
      combinedChunks[0] === 0x89 &&
      combinedChunks[1] === 0x50 &&
      combinedChunks[2] === 0x4e &&
      combinedChunks[3] === 0x47
    ) {
      console.log("Detected PNG image data, uploading to Blob storage...");

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
    }

    // Try to convert to text and parse as JSON
    const textDecoder = new TextDecoder();
    const text = textDecoder.decode(combinedChunks);

    // Check if it looks like JSON
    if (text.trim().startsWith("{") || text.trim().startsWith("[")) {
      try {
        const parsedResult = JSON.parse(text);
        if (Array.isArray(parsedResult) && parsedResult.length > 0) {
          return parsedResult[0];
        } else if (typeof parsedResult === "string") {
          return parsedResult;
        } else if (parsedResult.url) {
          return parsedResult.url;
        }
      } catch (e) {
        console.error("Failed to parse stream result as JSON:", e);
      }
    }

    // If it's not JSON or parsing failed, it might be binary data
    // Upload it as a file to Vercel Blob
    console.log("Treating output as binary data, uploading to Blob storage...");
    const blob = new Blob([combinedChunks]);
    const file = new File([blob], "generated-interior.bin", {
      type: "application/octet-stream",
    });
    const uploadedUrl = await uploadImageBuffer(file);
    console.log("Uploaded binary data to Blob storage:", uploadedUrl);
    return uploadedUrl;
  } catch (e) {
    console.error("Error reading stream:", e);
    const errorMessage = e instanceof Error ? e.message : "Unknown error";
    throw new Error(
      `Failed to process Replicate output stream: ${errorMessage}`
    );
  }
}
