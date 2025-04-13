/**
 * Simple and direct approach to generate interior designs using Replicate API
 * With retry logic for network errors
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

  // Try with Stable Diffusion v1.5 with basic retry logic
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      console.log(`Attempt ${attempt}/3 with Stable Diffusion 1.5...`);

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
        console.error(
          `Failed to start SD 1.5 prediction (attempt ${attempt}):`,
          errorText
        );
        // Wait before retrying
        if (attempt < 3) {
          await new Promise((resolve) => setTimeout(resolve, 2000 * attempt));
          continue;
        }
        throw new Error(`SD 1.5 prediction failed: ${errorText}`);
      }

      const jsonStartResponse = await startResponse.json();
      console.log("SD 1.5 prediction started:", jsonStartResponse.id);

      const endpointUrl = jsonStartResponse.urls.get;

      // Poll for the result
      for (let pollAttempt = 1; pollAttempt <= 30; pollAttempt++) {
        console.log(`Polling for SD 1.5 result... (attempt ${pollAttempt}/30)`);

        try {
          // Wait between poll attempts
          await new Promise((resolve) => setTimeout(resolve, 2000));

          const finalResponse = await fetch(endpointUrl, {
            headers: {
              Authorization: "Token " + process.env.REPLICATE_API_TOKEN,
            },
          });

          if (!finalResponse.ok) {
            console.log(`Poll attempt ${pollAttempt} failed, will retry...`);
            continue;
          }

          const jsonFinalResponse = await finalResponse.json();
          console.log(
            `Poll attempt ${pollAttempt} status:`,
            jsonFinalResponse.status
          );

          if (jsonFinalResponse.status === "succeeded") {
            const output = Array.isArray(jsonFinalResponse.output)
              ? jsonFinalResponse.output[0]
              : jsonFinalResponse.output;

            if (output && typeof output === "string") {
              console.log("SD 1.5 generation succeeded:", output);
              return output;
            }
          } else if (jsonFinalResponse.status === "failed") {
            console.error("SD 1.5 generation failed:", jsonFinalResponse.error);
            break;
          }
          // If still processing, continue polling
        } catch (pollError) {
          console.error(`Error polling (attempt ${pollAttempt}):`, pollError);
          // Continue polling despite errors
        }
      }

      // If we get here, polling timed out or failed
      throw new Error("SD 1.5 generation timed out or failed");
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);

      if (attempt < 3) {
        // Wait before retrying
        const backoffMs = 2000 * attempt;
        console.log(`Retrying in ${backoffMs}ms...`);
        await new Promise((resolve) => setTimeout(resolve, backoffMs));
      } else {
        // Try fallback after all retries fail
        console.log("All attempts with SD 1.5 failed, trying fallback...");
        return await simpleFallback(imageUrl, prompt);
      }
    }
  }

  // If all attempts fail, try fallback
  return await simpleFallback(imageUrl, prompt);
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

    if (!response.ok) {
      console.error("Failed to start fallback prediction");
      return "/placeholder.svg?text=Generation+Failed";
    }

    const jsonResponse = await response.json();
    console.log("Fallback prediction started:", jsonResponse.id);

    const endpointUrl = jsonResponse.urls.get;

    // Poll for the result with a simpler approach
    for (let i = 0; i < 30; i++) {
      console.log(`Polling for fallback result... (attempt ${i + 1}/30)`);

      await new Promise((resolve) => setTimeout(resolve, 2000));

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
