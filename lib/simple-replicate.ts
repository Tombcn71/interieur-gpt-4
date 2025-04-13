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

  // Try with a simpler approach - direct API call
  try {
    console.log("Using direct API call to Replicate...");

    // Start the prediction
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + process.env.REPLICATE_API_TOKEN,
      },
      body: JSON.stringify({
        // Use a simple and reliable model - Stable Diffusion 2.1
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
      const errorText = await response.text();
      console.error("Failed to start prediction:", errorText);
      throw new Error(`Prediction failed: ${errorText}`);
    }

    const jsonResponse = await response.json();
    console.log("Prediction started:", jsonResponse.id);

    const endpointUrl = jsonResponse.urls.get;

    // Poll for the result
    for (let i = 0; i < 30; i++) {
      console.log(`Polling for result... (attempt ${i + 1}/30)`);

      // Wait 2 seconds between polls
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const statusResponse = await fetch(endpointUrl, {
        headers: {
          Authorization: "Token " + process.env.REPLICATE_API_TOKEN,
        },
      });

      if (!statusResponse.ok) {
        console.error("Error checking status:", await statusResponse.text());
        continue;
      }

      const statusData = await statusResponse.json();
      console.log(`Poll attempt ${i + 1} status:`, statusData.status);

      if (statusData.status === "succeeded") {
        const output = Array.isArray(statusData.output)
          ? statusData.output[0]
          : statusData.output;

        if (output && typeof output === "string") {
          console.log("Generation succeeded:", output);
          return output;
        } else {
          throw new Error(
            `Invalid output format: ${JSON.stringify(statusData.output)}`
          );
        }
      } else if (statusData.status === "failed") {
        throw new Error(
          `Generation failed: ${statusData.error || "Unknown error"}`
        );
      }
      // If still processing, continue polling
    }

    // If we get here, polling timed out
    throw new Error("Generation timed out after 30 attempts");
  } catch (error) {
    console.error("Error generating interior design:", error);
    throw error; // Re-throw to be handled by the caller
  }
}
