import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createUser, getUserByEmail } from "@/lib/db"
import { sign } from "jsonwebtoken"

// Only allow this in development
export async function POST(req: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not allowed in production" }, { status: 403 })
  }

  try {
    const { email, name } = await req.json()

    if (!email || !name) {
      return NextResponse.json({ error: "Email and name are required" }, { status: 400 })
    }

    // Check if user exists or create a new one
    let user = await getUserByEmail(email)

    if (!user) {
      user = await createUser(email, name)
    }

    // Create a simple JWT token
    const token = sign(
      {
        name,
        email,
        id: user.id,
        credits: user.credits || 1,
        picture: null,
      },
      process.env.NEXTAUTH_SECRET || "development-secret",
      { expiresIn: "7d" },
    )

    // Set a cookie
    cookies().set("next-auth.session-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Dev login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
