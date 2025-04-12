import { NextResponse } from "next/server"

export async function GET() {
  const googleClientId = process.env.GOOGLE_CLIENT_ID
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET
  const nextAuthSecret = process.env.NEXTAUTH_SECRET
  const nextAuthUrl = process.env.NEXTAUTH_URL

  const missingVars = []

  if (!googleClientId) missingVars.push("GOOGLE_CLIENT_ID")
  if (!googleClientSecret) missingVars.push("GOOGLE_CLIENT_SECRET")
  if (!nextAuthSecret) missingVars.push("NEXTAUTH_SECRET")
  if (!nextAuthUrl) missingVars.push("NEXTAUTH_URL")

  return NextResponse.json({
    configured: missingVars.length === 0,
    missingVars,
    googleConfigured: !!(googleClientId && googleClientSecret),
  })
}
