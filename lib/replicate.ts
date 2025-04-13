import Replicate from "replicate";

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

  // Use SDXL model which is available on paid plans
  const output = await replicate.run(
    "stability-ai/sdxl:c221b2b8ef527988fb59bf24a8b97c4561f1c671f73bd389f866bfb27c061316",
    {
      input: {
        prompt: prompt,
        image: imageUrl,
        num_outputs: 1,
        guidance_scale: 7.5,
        num_inference_steps: 50, // Higher quality for paid plan
        strength: 0.8,
        negative_prompt: "ugly, disfigured, low quality, blurry, nsfw",
      },
    }
  );

  console.log("Replicate output type:", typeof output, output);

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
      let result = "";

      try {
        // Read the stream chunks
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          // Convert the chunk to a string
          const chunk = new TextDecoder().decode(value);
          result += chunk;
        }

        console.log("Processed stream result:", result);

        // Try to parse the result as JSON if it looks like JSON
        if (result.trim().startsWith("{") || result.trim().startsWith("[")) {
          try {
            const parsedResult = JSON.parse(result);
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

        // If it's not JSON or parsing failed, return the raw result
        return result;
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
