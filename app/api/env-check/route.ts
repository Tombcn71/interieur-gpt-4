import { NextResponse } from "next/server"

export async function GET() {
  // Only run in development
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ success: true })
  }

  const requiredVars = ["NEXTAUTH_SECRET", "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "DATABASE_URL"]

  const missingVars = requiredVars.filter((v) => !process.env[v] || process.env[v] === "")

  return NextResponse.json({
    success: missingVars.length === 0,
    missingVars,
  })
}
