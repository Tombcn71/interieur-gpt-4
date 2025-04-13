import Replicate from "replicate";
import { safeStringify } from "@/lib/debug-utils";

// Create the Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

/**
 * Alternative implementation using the predictions API directly
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
      name: "Stable Diffusion 2.1",
      owner: "stability-ai",
      model: "stable-diffusion",
      version:
        "db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf",
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
      owner: "stability-ai",
      model: "sdxl",
      version:
        "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
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
      owner: "runwayml",
      model: "stable-diffusion-v1-5",
      version:
        "a4a8bcfd6a211c88392c5427ea6c334c9c022b984f7c55e98b1b62db0a7e0b85",
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

      // Use the predictions API directly
      const prediction = await replicate.predictions.create({
        version: model.version,
        input: model.input,
      });

      // Wait for the prediction to complete
      const result = await replicate.wait(prediction);
      console.log(`${model.name} result:`, safeStringify(result));

      if (result.output) {
        if (Array.isArray(result.output) && result.output.length > 0) {
          console.log(`Successfully generated with ${model.name}`);
          return result.output[0];
        } else if (typeof result.output === "string") {
          console.log(`Successfully generated with ${model.name}`);
          return result.output;
        }
      }

      console.log(
        `Unexpected output format from ${model.name}:`,
        safeStringify(result)
      );
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
