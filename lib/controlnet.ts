import Replicate from "replicate";
import { uploadImageBuffer } from "@/lib/blob";

// Create the Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function generateInteriorDesignWithControlNet(
  imageUrl: string,
  roomType: string,
  style: string
) {
  // Create a descriptive prompt for the interior design
  const prompt = `Transform this ${roomType} into a beautiful ${style} style interior design. 
  Make it look professional, realistic, and high-quality. Maintain the same layout and dimensions of the room.`;

  console.log(
    `Generating interior design with ControlNet Hough: ${roomType}, ${style}`
  );
  console.log(`Using image URL: ${imageUrl}`);
  console.log(`Using prompt: ${prompt}`);

  // Use ControlNet Hough model with CORRECT parameter types
  const output = await replicate.run(
    "jagilley/controlnet-hough:854e8727697a057c525cdb45ab037f64ecca770a1769cc52287c2e56472a247b",
    {
      input: {
        prompt: prompt,
        image: imageUrl,
        num_samples: "1", // String
        image_resolution: "768", // String
        ddim_steps: 50, // INTEGER (not string)
        scale: 9.0, // NUMBER (not string)
        seed: Math.floor(Math.random() * 1000000), // INTEGER (not string)
        eta: 0.0, // NUMBER (not string)
        a_prompt:
          "best quality, high resolution, photo-realistic, ultra-detailed",
        n_prompt:
          "longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, blurry, distorted",
        detect_resolution: 768, // INTEGER (not string)
        low_threshold: 100,
        high_threshold: 200,
        value_threshold: 0.1, // NUMBER (not string)
        distance_threshold: 0.1, // NUMBER (not string)
      },
    }
  );

  // Process output
  if (Array.isArray(output) && output.length > 0) {
    return output[0];
  } else if (typeof output === "string") {
    return output;
  } else if (output && typeof output === "object") {
    if ("url" in output) {
      return output.url;
    } else if ("output" in output && typeof output.output === "string") {
      return output.output;
    }
  }

  console.error("Unexpected output format from ControlNet:", output);
  throw new Error("Unexpected output format from ControlNet");
}

// Fallback model in case ControlNet fails
export async function fallbackGenerateInteriorDesign(
  imageUrl: string,
  roomType: string,
  style: string
) {
  const prompt = `Transform this ${roomType} into a beautiful ${style} style interior design. 
  Make it look professional, realistic, and high-quality. Maintain the same layout and dimensions of the room.`;

  console.log(
    `Using fallback SDXL model for interior design: ${roomType}, ${style}`
  );

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

  if (Array.isArray(output) && output.length > 0) {
    return output[0];
  } else if (typeof output === "string") {
    return output;
  } else {
    console.error("Unexpected output format from fallback model:", output);
    throw new Error("Unexpected output format from fallback model");
  }
}
