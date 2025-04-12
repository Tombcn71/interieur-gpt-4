import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    if (!process.env.DATABASE_URL || !process.env.DATABASE_URL.startsWith("postgres://")) {
      return NextResponse.json({ success: false, error: "Invalid DATABASE_URL" })
    }

    // Try a simple query to check connectivity
    await sql`SELECT 1`
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Database connection error:", error)
    return NextResponse.json({ success: false, error: "Database connection failed" })
  }
}
