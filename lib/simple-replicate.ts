/**
 * Simple and direct approach to generate interior designs using Replicate API
 */
export async function generateInteriorDesign(
  imageUrl: string,
  roomType: string,
  style: string
): Promise<string> {
  const prompt = `Transform this ${roomType} into a beautiful ${style} style interior design. 
    Make it look professional, realistic, and high-quality. Maintain the same layout and dimensions of the room.`;

  console.log(`Generating interior design: ${roomType}, ${style}`);
  console.log(`Using image URL: ${imageUrl}`);

  // Try with Stable Diffusion v1.5 first (latest public version)
  try {
    console.log("Trying with Stable Diffusion v1.5...");

    // Start the prediction with the latest public version of SD 1.5
    const startResponse = await fetch(
      "https://api.replicate.com/v1/predictions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + process.env.REPLICATE_API_TOKEN,
        },
        body: JSON.stringify({
          // Latest public version of Stable Diffusion v1.5
          version:
            "42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b",
          input: {
            prompt: prompt,
            image: imageUrl,
            num_outputs: 1,
            guidance_scale: 7.5,
            num_inference_steps: 25,
            strength: 0.75,
            negative_prompt: "ugly, disfigured, low quality, blurry, nsfw",
          },
        }),
      }
    );

    if (!startResponse.ok) {
      const errorText = await startResponse.text();
      console.error("Failed to start SD 1.5 prediction:", errorText);
      throw new Error(`SD 1.5 prediction failed: ${errorText}`);
    }

    const jsonStartResponse = await startResponse.json();
    console.log("SD 1.5 prediction started:", jsonStartResponse.id);

    const endpointUrl = jsonStartResponse.urls.get;

    // Poll for the result
    let generatedImage: string | null = null;
    let attempts = 0;
    const maxAttempts = 30; // 30 seconds max wait time

    while (!generatedImage && attempts < maxAttempts) {
      console.log(
        `Polling for SD 1.5 result... (attempt ${attempts + 1}/${maxAttempts})`
      );

      const finalResponse = await fetch(endpointUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + process.env.REPLICATE_API_TOKEN,
        },
      });

      if (!finalResponse.ok) {
        console.error("Error checking SD 1.5 prediction status");
        throw new Error(
          `Error checking SD 1.5 status: ${await finalResponse.text()}`
        );
      }

      const jsonFinalResponse = await finalResponse.json();

      if (jsonFinalResponse.status === "succeeded") {
        generatedImage = Array.isArray(jsonFinalResponse.output)
          ? jsonFinalResponse.output[0]
          : jsonFinalResponse.output;

        console.log("SD 1.5 generation succeeded:", generatedImage);

        // Make sure we have a valid string
        if (generatedImage && typeof generatedImage === "string") {
          return generatedImage;
        } else {
          console.error("Invalid SD 1.5 output format:", generatedImage);
          throw new Error(
            `Invalid SD 1.5 output format: ${JSON.stringify(generatedImage)}`
          );
        }
      } else if (jsonFinalResponse.status === "failed") {
        console.error("SD 1.5 generation failed:", jsonFinalResponse.error);
        throw new Error(`SD 1.5 generation failed: ${jsonFinalResponse.error}`);
      } else {
        // Wait 1 second before polling again
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      attempts++;
    }

    // If we get here, it means we timed out
    throw new Error("SD 1.5 generation timed out");
  } catch (error) {
    // Log the error and try the fallback model
    console.error("Error with SD 1.5:", error);
    console.log("Trying fallback model...");
    return await fallbackGeneration(imageUrl, prompt);
  }
}

/**
 * Fallback generation using SDXL
 */
async function fallbackGeneration(
  imageUrl: string,
  prompt: string
): Promise<string> {
  console.log("Using fallback model (SDXL)");

  try {
    // Start the prediction with the latest public version of SDXL
    const startResponse = await fetch(
      "https://api.replicate.com/v1/predictions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + process.env.REPLICATE_API_TOKEN,
        },
        body: JSON.stringify({
          // Latest public version of SDXL
          version:
            "d830ba2e722b0f9a0c18a4cfb620597b6d6810df178a39a7bdb40f2506203896",
          input: {
            prompt: prompt,
            image: imageUrl,
            num_outputs: 1,
            guidance_scale: 7.5,
            num_inference_steps: 20,
            strength: 0.7,
            negative_prompt: "ugly, disfigured, low quality, blurry, nsfw",
          },
        }),
      }
    );

    if (!startResponse.ok) {
      const errorText = await startResponse.text();
      console.error("Failed to start SDXL prediction:", errorText);

      // Try one more fallback - ControlNet
      return await controlNetFallback(imageUrl, prompt);
    }

    const jsonStartResponse = await startResponse.json();
    console.log("SDXL prediction started:", jsonStartResponse.id);

    const endpointUrl = jsonStartResponse.urls.get;

    // Poll for the result
    let attempts = 0;
    const maxAttempts = 30;

    while (attempts < maxAttempts) {
      console.log(
        `Polling for SDXL result... (attempt ${attempts + 1}/${maxAttempts})`
      );

      const finalResponse = await fetch(endpointUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + process.env.REPLICATE_API_TOKEN,
        },
      });

      if (!finalResponse.ok) {
        console.error(
          "Error checking SDXL prediction status:",
          await finalResponse.text()
        );
        break;
      }

      const jsonFinalResponse = await finalResponse.json();

      if (jsonFinalResponse.status === "succeeded") {
        const output = Array.isArray(jsonFinalResponse.output)
          ? jsonFinalResponse.output[0]
          : jsonFinalResponse.output;

        if (output && typeof output === "string") {
          console.log("SDXL generation succeeded:", output);
          return output;
        } else {
          console.error("Invalid SDXL output format:", output);
          break;
        }
      } else if (jsonFinalResponse.status === "failed") {
        console.error("SDXL generation failed:", jsonFinalResponse.error);
        break;
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      attempts++;
    }

    // If we get here, try the ControlNet fallback
    return await controlNetFallback(imageUrl, prompt);
  } catch (error) {
    console.error("SDXL generation error:", error);

    // Try ControlNet as a last resort
    return await controlNetFallback(imageUrl, prompt);
  }
}

/**
 * Final fallback using ControlNet
 */
async function controlNetFallback(
  imageUrl: string,
  prompt: string
): Promise<string> {
  console.log("Using final fallback model (ControlNet)");

  try {
    // Start the prediction with ControlNet
    const startResponse = await fetch(
      "https://api.replicate.com/v1/predictions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + process.env.REPLICATE_API_TOKEN,
        },
        body: JSON.stringify({
          // Latest public version of ControlNet
          version:
            "6c3589c95aeeb5a23d5a0e30953ec953d983d9e91d4f6d3af0c3c7c5fa7b2c3c",
          input: {
            prompt: prompt,
            image: imageUrl,
            structure: "canny",
            num_samples: "1",
            image_resolution: "512",
            ddim_steps: 20,
            scale: 9.0,
            seed: Math.floor(Math.random() * 1000000),
            a_prompt:
              "best quality, high resolution, photo-realistic, ultra-detailed",
            n_prompt:
              "longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, blurry, distorted",
          },
        }),
      }
    );

    if (!startResponse.ok) {
      const errorText = await startResponse.text();
      console.error("Failed to start ControlNet prediction:", errorText);
      return "/placeholder.svg?text=Generation+Failed";
    }

    const jsonStartResponse = await startResponse.json();
    console.log("ControlNet prediction started:", jsonStartResponse.id);

    const endpointUrl = jsonStartResponse.urls.get;

    // Poll for the result
    let attempts = 0;
    const maxAttempts = 30;

    while (attempts < maxAttempts) {
      console.log(
        `Polling for ControlNet result... (attempt ${
          attempts + 1
        }/${maxAttempts})`
      );

      const finalResponse = await fetch(endpointUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + process.env.REPLICATE_API_TOKEN,
        },
      });

      if (!finalResponse.ok) {
        console.error(
          "Error checking ControlNet prediction status:",
          await finalResponse.text()
        );
        break;
      }

      const jsonFinalResponse = await finalResponse.json();

      if (jsonFinalResponse.status === "succeeded") {
        const output = Array.isArray(jsonFinalResponse.output)
          ? jsonFinalResponse.output[0]
          : jsonFinalResponse.output;

        if (output && typeof output === "string") {
          console.log("ControlNet generation succeeded:", output);
          return output;
        } else {
          console.error("Invalid ControlNet output format:", output);
          break;
        }
      } else if (jsonFinalResponse.status === "failed") {
        console.error("ControlNet generation failed:", jsonFinalResponse.error);
        break;
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      attempts++;
    }

    // If all else fails, return a placeholder
    return "/placeholder.svg?text=Generation+Failed";
  } catch (error) {
    console.error("ControlNet generation error:", error);
    return "/placeholder.svg?text=Generation+Failed";
  }
}
