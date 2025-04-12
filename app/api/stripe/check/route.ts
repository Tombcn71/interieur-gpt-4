import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function GET() {
  try {
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === "your-stripe-secret-key") {
      return NextResponse.json({
        success: false,
        error: "Missing or invalid STRIPE_SECRET_KEY",
        development: process.env.NODE_ENV === "development",
      })
    }

    // Try a simple Stripe API call to check if the API key is valid
    await stripe.products.list({ limit: 1 })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Stripe configuration error:", error)
    return NextResponse.json({
      success: false,
      error: "Stripe configuration failed",
      development: process.env.NODE_ENV === "development",
    })
  }
}
