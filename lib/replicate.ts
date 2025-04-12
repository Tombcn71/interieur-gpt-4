import Replicate from "replicate"

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
})

export async function generateInteriorDesign(imageUrl: string, roomType: string, style: string) {
  const prompt = `Een ${roomType} met een ${style} stijl.`

  const output = await replicate.run(
    "adirik/interior-design:76606baddcb5b1b4616e1c6475eca880da339c8875bd49967d544d684a6eac38",
    {
      input: {
        image: imageUrl,
        prompt: prompt,
      },
    },
  )

  return output
}
