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

  // Start the prediction
  const startResponse = await fetch(
    "https://api.replicate.com/v1/predictions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + process.env.REPLICATE_API_TOKEN,
      },
      body: JSON.stringify({
        version:
          "a4a8bcfd6a211c88392c5427ea6c334c9c022b984f7c55e98b1b62db0a7e0b85", // SD 1.5
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
    console.error("Failed to start prediction:", errorText);

    // Try fallback model if first one fails
    return await fallbackGeneration(imageUrl, prompt);
  }

  const jsonStartResponse = await startResponse.json();
  console.log("Prediction started:", jsonStartResponse.id);

  const endpointUrl = jsonStartResponse.urls.get;

  // Poll for the result
  let generatedImage: string | null = null;
  let attempts = 0;
  const maxAttempts = 30; // 30 seconds max wait time

  while (!generatedImage && attempts < maxAttempts) {
    console.log(
      `Polling for result... (attempt ${attempts + 1}/${maxAttempts})`
    );

    const finalResponse = await fetch(endpointUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + process.env.REPLICATE_API_TOKEN,
      },
    });

    if (!finalResponse.ok) {
      console.error("Error checking prediction status");
      break;
    }

    const jsonFinalResponse = await finalResponse.json();

    if (jsonFinalResponse.status === "succeeded") {
      generatedImage = Array.isArray(jsonFinalResponse.output)
        ? jsonFinalResponse.output[0]
        : jsonFinalResponse.output;

      console.log("Generation succeeded:", generatedImage);

      // Make sure we have a valid string
      if (generatedImage && typeof generatedImage === "string") {
        return generatedImage;
      } else {
        console.error("Invalid output format:", generatedImage);
        break;
      }
    } else if (jsonFinalResponse.status === "failed") {
      console.error("Generation failed:", jsonFinalResponse.error);
      break;
    } else {
      // Wait 1 second before polling again
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    attempts++;
  }

  console.log("Generation timed out or failed, trying fallback model");
  return await fallbackGeneration(imageUrl, prompt);
}

/**
 * Fallback generation using a different model
 */
async function fallbackGeneration(
  imageUrl: string,
  prompt: string
): Promise<string> {
  console.log("Using fallback model (SDXL)");

  try {
    const startResponse = await fetch(
      "https://api.replicate.com/v1/predictions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + process.env.REPLICATE_API_TOKEN,
        },
        body: JSON.stringify({
          version:
            "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b", // SDXL
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
      throw new Error(
        `Failed to start fallback prediction: ${await startResponse.text()}`
      );
    }

    const jsonStartResponse = await startResponse.json();
    const endpointUrl = jsonStartResponse.urls.get;

    // Poll for the result
    let attempts = 0;
    const maxAttempts = 30;

    while (attempts < maxAttempts) {
      console.log(
        `Polling for fallback result... (attempt ${
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
        throw new Error("Error checking fallback prediction status");
      }

      const jsonFinalResponse = await finalResponse.json();

      if (jsonFinalResponse.status === "succeeded") {
        const output = Array.isArray(jsonFinalResponse.output)
          ? jsonFinalResponse.output[0]
          : jsonFinalResponse.output;

        if (output && typeof output === "string") {
          console.log("Fallback generation succeeded:", output);
          return output;
        } else {
          throw new Error(`Invalid output format: ${JSON.stringify(output)}`);
        }
      } else if (jsonFinalResponse.status === "failed") {
        throw new Error(
          `Fallback generation failed: ${jsonFinalResponse.error}`
        );
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      attempts++;
    }

    throw new Error("Fallback generation timed out");
  } catch (error) {
    console.error("Fallback generation error:", error);

    // Last resort - return a placeholder image URL
    // This ensures we always return a string even if everything fails
    return "/placeholder.svg?text=Generation+Failed";
  }
}
