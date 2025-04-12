import { getServerSession } from "next-auth/next"
import { type NextRequest, NextResponse } from "next/server"
import { authOptions } from "../auth/[...nextauth]/route"
import { createDesign, updateDesignResult, updateUserCredits } from "@/lib/db"
import { generateInteriorDesign } from "@/lib/replicate"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 })
  }

  const { roomType, style, imageUrl } = await req.json()

  if (!roomType || !style || !imageUrl) {
    return NextResponse.json({ error: "Alle velden zijn verplicht" }, { status: 400 })
  }

  // Check if user has credits
  if (session.user.credits < 1) {
    return NextResponse.json({ error: "Niet genoeg credits" }, { status: 400 })
  }

  try {
    // Create design record
    const prompt = `Een ${roomType} met een ${style} stijl.`
    const design = await createDesign(session.user.id, roomType, style, imageUrl, prompt)

    // Deduct credit
    await updateUserCredits(session.user.id, -1)

    // Generate design with Replicate
    const output = await generateInteriorDesign(imageUrl, roomType, style)

    // Update design with result
    if (output && typeof output === "string") {
      await updateDesignResult(design.id, output, "completed")

      return NextResponse.json({
        success: true,
        design: {
          ...design,
          result_image_url: output,
          status: "completed",
        },
      })
    } else {
      await updateDesignResult(design.id, "", "failed")
      return NextResponse.json({ error: "Generatie mislukt" }, { status: 500 })
    }
  } catch (error) {
    console.error("Design generation error:", error)
    return NextResponse.json({ error: "Er is een fout opgetreden" }, { status: 500 })
  }
}
