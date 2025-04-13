import Replicate from "replicate";
import { uploadImageBuffer } from "@/lib/blob";

// Create the Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function generateInteriorDesign(
  imageUrl: string,
  roomType: string,
  style: string
) {
  // Create a descriptive prompt for the interior design
  const prompt = `Transform this ${roomType} into a beautiful ${style} style interior design. 
  Make it look professional, realistic, and high-quality. Maintain the same layout and dimensions of the room.`;

  console.log(
    `Generating interior design with Replicate: ${roomType}, ${style}`
  );
  console.log(`Using image URL: ${imageUrl}`);
  console.log(`Using prompt: ${prompt}`);

  // Use ControlNet Hough model for more precise room transformations
  const output = await replicate.run(
    "jagilley/controlnet-hough:854e8727697a057c525cdb45ab037f64ecca770a1769cc52287c2e56472a247b",
    {
      input: {
        prompt: prompt,
        image: imageUrl,
        num_samples: 1,
        image_resolution: 768,
        ddim_steps: 50,
        scale: 9.0,
        seed: Math.floor(Math.random() * 1000000),
        eta: 0.0,
        a_prompt:
          "best quality, high resolution, photo-realistic, ultra-detailed",
        n_prompt:
          "longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, blurry, distorted",
        detect_resolution: 768,
        low_threshold: 100,
        high_threshold: 200,
        value_threshold: 0.1,
        distance_threshold: 0.1,
      },
    }
  );

  console.log("Replicate output type:", typeof output);

  // Handle different output types from Replicate
  if (Array.isArray(output) && output.length > 0) {
    // If it's an array, check the first element
    const firstOutput = output[0];

    // If the first element is a ReadableStream, we need to handle it
    if (
      firstOutput &&
      typeof firstOutput === "object" &&
      "locked" in firstOutput
    ) {
      console.log("Detected ReadableStream in output, processing stream...");

      // Create a reader from the stream
      const reader = (firstOutput as ReadableStream<Uint8Array>).getReader();
      const chunks: Uint8Array[] = [];

      try {
        // Read the stream chunks
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
        }

        // Combine all chunks into a single Uint8Array
        const totalLength = chunks.reduce(
          (acc, chunk) => acc + chunk.length,
          0
        );
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
        console.log(
          "Treating output as binary data, uploading to Blob storage..."
        );
        const blob = new Blob([combinedChunks]);
        const file = new File([blob], "generated-interior.bin", {
          type: "application/octet-stream",
        });
        const uploadedUrl = await uploadImageBuffer(file);
        console.log("Uploaded binary data to Blob storage:", uploadedUrl);
        return uploadedUrl;
      } catch (e) {
        console.error("Error reading stream:", e);
        throw new Error("Failed to process Replicate output stream");
      }
    } else if (typeof firstOutput === "string") {
      // If it's a string, return it directly
      return firstOutput;
    }
  } else if (typeof output === "string") {
    // If the output itself is a string, return it
    return output;
  } else if (output && typeof output === "object") {
    // If it's an object, check for common properties
    if ("url" in output) {
      return output.url;
    } else if ("output" in output && typeof output.output === "string") {
      return output.output;
    }
  }

  // If we couldn't process the output, log it and throw an error
  console.error("Unexpected output format from Replicate:", output);
  throw new Error("Unexpected output format from Replicate");
}

// Add a fallback function that uses SDXL in case ControlNet fails
export async function fallbackGenerateInteriorDesign(
  imageUrl: string,
  roomType: string,
  style: string
) {
  // Create a descriptive prompt for the interior design
  const prompt = `Transform this ${roomType} into a beautiful ${style} style interior design. 
  Make it look professional, realistic, and high-quality. Maintain the same layout and dimensions of the room.`;

  console.log(
    `Using fallback model for interior design: ${roomType}, ${style}`
  );

  // Use SDXL model as fallback
  const output = await replicate.run(
    "stability-ai/sdxl:c221b2b8ef527988fb59bf24a8b97c4561f1c671f73bd389f866bfb27c061316",
    {
      input: {
        prompt: prompt,
        image: imageUrl,
        num_outputs: 1,
        guidance_scale: 7.5,
        num_inference_steps: 50,
        strength: 0.8,
        negative_prompt: "ugly, disfigured, low quality, blurry, nsfw",
      },
    }
  );

  // Process output (simplified for brevity)
  if (Array.isArray(output) && output.length > 0) {
    return output[0];
  } else if (typeof output === "string") {
    return output;
  } else {
    console.error("Unexpected output format from fallback model:", output);
    throw new Error("Unexpected output format from fallback model");
  }
}

// Simple function to check if Replicate is configured
export async function checkReplicateConfig() {
  try {
    await replicate.models.list();
    return { configured: true };
  } catch (error: any) {
    return {
      configured: false,
      error: error.message || "Failed to connect to Replicate API",
    };
  }
}
