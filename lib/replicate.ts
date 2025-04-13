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

  console.log("Replicate output:", output);

  // The output is typically an array with the generated image URL as the first element
  if (Array.isArray(output) && output.length > 0) {
    return output[0];
  } else if (typeof output === "string") {
    return output;
  } else {
    console.error("Unexpected output format from Replicate:", output);
    throw new Error("Unexpected output format from Replicate");
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
