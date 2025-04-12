import Replicate from "replicate";

// Create the Replicate client with proper error handling
const createReplicateClient = () => {
  if (!process.env.REPLICATE_API_TOKEN) {
    console.warn("Missing REPLICATE_API_TOKEN environment variable");
    return null;
  }

  return new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });
};

const replicate = createReplicateClient();

export async function generateInteriorDesign(
  imageUrl: string,
  roomType: string,
  style: string
) {
  if (!replicate) {
    throw new Error(
      "Replicate client not initialized. Please check your REPLICATE_API_TOKEN."
    );
  }

  // Create a more descriptive prompt
  const prompt = `Transform this ${roomType} into a beautiful ${style} style interior design. 
  Make it look professional and realistic. Maintain the same layout and dimensions of the room.`;

  try {
    console.log(
      `Generating interior design with Replicate: ${roomType}, ${style}`
    );
    console.log(`Using image URL: ${imageUrl}`);

    // Use a more recent and reliable interior design model
    // This is the "interior-diffusion" model which is specifically for interior design
    const output = await replicate.run(
      "fofr/interior-diffusion:a2a8b9a89568a296e23376eb48b2309f6d9b14729c3b5b43a9bee4ebf2801f9b",
      {
        input: {
          prompt: prompt,
          image: imageUrl,
          num_inference_steps: 30,
          guidance_scale: 7.5,
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
  } catch (error) {
    console.error("Error generating interior design with Replicate:", error);
    throw error;
  }
}

// Add a function to check if Replicate is properly configured
export async function checkReplicateConfig() {
  if (!process.env.REPLICATE_API_TOKEN) {
    return { configured: false, error: "Missing REPLICATE_API_TOKEN" };
  }

  try {
    const client = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // Try to get a list of models to verify the API token works
    await client.models.list();
    return { configured: true };
  } catch (error: any) {
    return {
      configured: false,
      error: error.message || "Failed to connect to Replicate API",
    };
  }
}
