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

    // Use a webhook if NEXT_PUBLIC_APP_URL is set
    const webhookUrl = process.env.NEXT_PUBLIC_APP_URL
      ? `${process.env.NEXT_PUBLIC_APP_URL}/api/replicate/webhook`
      : undefined;

    console.log("Webhook URL:", webhookUrl || "Not configured");

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
          webhook: webhookUrl,
          webhook_events_filter: ["completed"],
        }),
      }
    );

    const responseText = await startResponse.text();
    console.log("Raw response from Replicate:", responseText);

    if (!startResponse.ok) {
      console.error("Failed to start SD 1.5 prediction:", responseText);
      throw new Error(`SD 1.5 prediction failed: ${responseText}`);
    }

    let jsonStartResponse;
    try {
      jsonStartResponse = JSON.parse(responseText);
      console.log("SD 1.5 prediction started:", jsonStartResponse.id);
    } catch (e) {
      console.error("Failed to parse response JSON:", e);
      throw new Error(`Failed to parse response: ${responseText}`);
    }

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

      const statusResponseText = await finalResponse.text();
      console.log(`Poll attempt ${attempts + 1} response:`, statusResponseText);

      if (!finalResponse.ok) {
        console.error(
          "Error checking SD 1.5 prediction status:",
          statusResponseText
        );
        throw new Error(`Error checking SD 1.5 status: ${statusResponseText}`);
      }

      let jsonFinalResponse;
      try {
        jsonFinalResponse = JSON.parse(statusResponseText);
        console.log(
          `Poll attempt ${attempts + 1} status:`,
          jsonFinalResponse.status
        );
      } catch (e) {
        console.error("Failed to parse status response JSON:", e);
        throw new Error(
          `Failed to parse status response: ${statusResponseText}`
        );
      }

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
    console.log("SD 1.5 generation timed out after 30 attempts");
    throw new Error("SD 1.5 generation timed out");
  } catch (error) {
    // Log the error and try the fallback model
    console.error("Error with SD 1.5:", error);
    console.log("Trying fallback model...");
    return await simpleFallback(imageUrl, prompt);
  }
}

/**
 * Simple fallback that uses a different model
 */
async function simpleFallback(
  imageUrl: string,
  prompt: string
): Promise<string> {
  console.log("Using simple fallback model");

  try {
    // Try a simpler approach with a different model
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + process.env.REPLICATE_API_TOKEN,
      },
      body: JSON.stringify({
        // Use a different model - Stable Diffusion 2.1
        version:
          "ee88d150d4344c7ba6b1a2324a5a6c91e1963c8ed5f49e6fdaa3da9fe4c661ec",
        input: {
          prompt: prompt,
          image: imageUrl,
          strength: 0.6,
        },
      }),
    });

    const responseText = await response.text();
    console.log("Raw response from fallback model:", responseText);

    if (!response.ok) {
      console.error("Failed to start fallback prediction:", responseText);
      return "/placeholder.svg?text=Generation+Failed";
    }

    let jsonResponse;
    try {
      jsonResponse = JSON.parse(responseText);
      console.log("Fallback prediction started:", jsonResponse.id);
    } catch (e) {
      console.error("Failed to parse fallback response JSON:", e);
      return "/placeholder.svg?text=Generation+Failed";
    }

    const endpointUrl = jsonResponse.urls.get;

    // Poll for the result with a simpler approach
    for (let i = 0; i < 30; i++) {
      console.log(`Polling for fallback result... (attempt ${i + 1}/30)`);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const statusResponse = await fetch(endpointUrl, {
        headers: {
          Authorization: "Token " + process.env.REPLICATE_API_TOKEN,
        },
      });

      if (!statusResponse.ok) {
        console.error("Error checking fallback status");
        continue;
      }

      const statusData = await statusResponse.json();
      console.log(`Fallback poll attempt ${i + 1} status:`, statusData.status);

      if (statusData.status === "succeeded") {
        const output = Array.isArray(statusData.output)
          ? statusData.output[0]
          : statusData.output;

        if (output && typeof output === "string") {
          console.log("Fallback generation succeeded:", output);
          return output;
        }
      } else if (statusData.status === "failed") {
        console.error("Fallback generation failed:", statusData.error);
        break;
      }
    }

    // If we get here, return a placeholder
    return "/placeholder.svg?text=Generation+Failed";
  } catch (error) {
    console.error("Fallback generation error:", error);
    return "/placeholder.svg?text=Generation+Failed";
  }
}
