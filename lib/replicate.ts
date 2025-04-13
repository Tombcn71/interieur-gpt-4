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

  // Create a more descriptive prompt for the general Stable Diffusion model
  const prompt = `Transform this ${roomType} into a beautiful ${style} style interior design. 
  Make it look professional, realistic, and high-quality. Maintain the same layout and dimensions of the room.`;

  try {
    console.log(
      `Generating interior design with Replicate: ${roomType}, ${style}`
    );
    console.log(`Using image URL: ${imageUrl}`);
    console.log(`Using prompt: ${prompt}`);

    // Use the standard Stable Diffusion model which is widely available
    // This is one of the most popular models on Replicate and should work with any API token
    const output = await replicate.run(
      "stability-ai/stable-diffusion:ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4",
      {
        input: {
          prompt: prompt,
          image: imageUrl,
          num_outputs: 1,
          guidance_scale: 7.5,
          num_inference_steps: 30,
          scheduler: "K_EULER_ANCESTRAL",
          strength: 0.8, // Keep some of the original image structure
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
  } catch (error: any) {
    console.error("Error generating interior design with Replicate:", error);

    // Check if the error is related to the model version
    if (error.response && error.response.status === 422) {
      console.log("Trying fallback model...");

      // Try a fallback model if the first one fails
      try {
        // Use an even more basic and widely available model as fallback
        const fallbackOutput = await replicate.run(
          "stability-ai/sdxl:c221b2b8ef527988fb59bf24a8b97c4561f1c671f73bd389f866bfb27c061316",
          {
            input: {
              prompt: prompt,
              negative_prompt: "ugly, disfigured, low quality, blurry, nsfw",
              width: 1024,
              height: 1024,
            },
          }
        );

        console.log("Fallback model output:", fallbackOutput);

        if (Array.isArray(fallbackOutput) && fallbackOutput.length > 0) {
          return fallbackOutput[0];
        } else if (typeof fallbackOutput === "string") {
          return fallbackOutput;
        }
      } catch (fallbackError) {
        console.error("Fallback model also failed:", fallbackError);
        throw new Error(
          "All available models failed. Please check your Replicate API token permissions."
        );
      }
    }

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
