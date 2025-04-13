import Replicate from "replicate";

// Create the Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Alternative model for interior design
export async function generateInteriorDesignWithReimagineXL(
  imageUrl: string,
  roomType: string,
  style: string
) {
  // Create a descriptive prompt for the interior design
  const prompt = `Transform this ${roomType} into a beautiful ${style} style interior design. 
  Make it look professional, realistic, and high-quality. Maintain the same layout and dimensions of the room.`;

  console.log(
    `Generating interior design with Reimagine XL: ${roomType}, ${style}`
  );
  console.log(`Using image URL: ${imageUrl}`);
  console.log(`Using prompt: ${prompt}`);

  // Use Reimagine XL model which is specialized for room redesign
  const output = await replicate.run(
    "cjwbw/reimagine-xl:5c5d9a4f1d0dfc6e7b7b94e3f39a47d8b7ad1b4d2fc514ac440f4493e82a4256",
    {
      input: {
        prompt: prompt,
        image: imageUrl,
        negative_prompt: "ugly, disfigured, low quality, blurry, nsfw",
        num_inference_steps: 30,
        guidance_scale: 7.5,
        strength: 0.8,
      },
    }
  );

  console.log("Reimagine XL output:", output);

  // Process output
  if (Array.isArray(output) && output.length > 0) {
    return output[0];
  } else if (typeof output === "string") {
    return output;
  } else if (output && typeof output === "object" && "output" in output) {
    return output.output;
  } else {
    console.error("Unexpected output format from Reimagine XL:", output);
    throw new Error("Unexpected output format from Reimagine XL");
  }
}
