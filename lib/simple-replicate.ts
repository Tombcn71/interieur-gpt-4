import Replicate from "replicate";

/**
 * Simple and direct approach to generate interior designs using Replicate API
 * Using the specialized adirik/interior-design model
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

    console.log("Model output:", output);

    // Handle different output formats
    if (typeof output === "string") {
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
