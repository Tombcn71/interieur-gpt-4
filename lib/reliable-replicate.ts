import Replicate from "replicate";
import { uploadImageBuffer } from "@/lib/blob";
import { safeStringify } from "@/lib/debug-utils";

// Create the Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Define the type that Replicate expects for model IDs
type ReplicateModelId = `${string}/${string}` | `${string}/${string}:${string}`;

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

  // Try models in order of reliability - using the latest public versions
  const models = [
    {
      name: "Stable Diffusion 2.1",
      // Use the full model identifier with type assertion
      modelId:
        "stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf" as ReplicateModelId,
      input: {
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
      modelId:
        "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b" as ReplicateModelId,
      input: {
        prompt: prompt,
        image: imageUrl,
        num_outputs: 1,
        guidance_scale: 7.5,
        num_inference_steps: 25,
        strength: 0.7,
        negative_prompt: "ugly, disfigured, low quality, blurry, nsfw",
      },
    },
    {
      name: "Stable Diffusion 1.5",
      modelId:
        "runwayml/stable-diffusion-v1-5:a4a8bcfd6a211c88392c5427ea6c334c9c022b984f7c55e98b1b62db0a7e0b85" as ReplicateModelId,
      input: {
        prompt: prompt,
        image: imageUrl,
        num_outputs: 1,
        guidance_scale: 7.5,
        num_inference_steps: 30,
        strength: 0.8,
        negative_prompt: "ugly, disfigured, low quality, blurry, nsfw",
      },
    },
  ];

  let lastError = null;

  // Try each model in sequence
  for (const model of models) {
    try {
      console.log(`Attempting to generate with ${model.name}...`);

      // Use the direct run method with the full model ID
      const output = await replicate.run(model.modelId, { input: model.input });

      console.log(`${model.name} output:`, safeStringify(output));

      // Handle different output types
      if (Array.isArray(output) && output.length > 0) {
        const result = output[0];
        console.log(`Successfully generated with ${model.name}`);

        // Handle if result is a ReadableStream
        if (result && typeof result === "object" && "locked" in result) {
          return await processStreamResponse(
            result as ReadableStream<Uint8Array>
          );
        }

        return result;
      } else if (typeof output === "string") {
        console.log(`Successfully generated with ${model.name}`);
        return output;
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
