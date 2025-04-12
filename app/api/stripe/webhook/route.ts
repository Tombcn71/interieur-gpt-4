import { type NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { createPayment, updateUserCredits } from "@/lib/db"

// Credits mapping based on price amounts
const CREDITS_MAPPING = {
  999: 5, // €9.99 plan
  2499: 15, // €24.99 plan
  4999: 50, // €49.99 plan
}

export async function POST(req: NextRequest) {
  console.log("Stripe webhook called")

  // Check if Stripe is properly configured
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("Missing Stripe environment variables")
    return NextResponse.json(
      { error: "Stripe is not properly configured. Please check your environment variables." },
      { status: 500 },
    )
  }

  const body = await req.text()
  const signature = headers().get("Stripe-Signature") as string

  let event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
    console.log(`Webhook event received: ${event.type}`)
  } catch (error: any) {
    console.error("Webhook signature verification failed:", error.message)
    return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 })
  }

  // Handle checkout session completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object

    try {
      // Get user ID from client_reference_id
      const userId = session.client_reference_id

      if (!userId) {
        console.error("No user ID found in session client_reference_id")
        return NextResponse.json({ error: "Geen gebruiker ID gevonden" }, { status: 400 })
      }

      // Get the amount paid (in cents)
      const amountPaid = session.amount_total

      if (!amountPaid) {
        console.error("No amount found in session")
        return NextResponse.json({ error: "Geen bedrag gevonden" }, { status: 400 })
      }

      // Determine credits based on amount paid
      const credits = CREDITS_MAPPING[amountPaid / 100] || 0

      if (credits === 0) {
        console.error(`Unknown price amount: ${amountPaid}`)
        return NextResponse.json({ error: "Onbekend prijsbedrag" }, { status: 400 })
      }

      console.log(`Adding ${credits} credits to user ${userId}`)

      // Create payment record
      await createPayment(userId, session.id, amountPaid / 100, credits, "completed")

      // Add credits to user
      await updateUserCredits(userId, credits)

      console.log("Payment processed successfully")
    } catch (error) {
      console.error("Error processing payment:", error)
      return NextResponse.json({ error: "Error processing payment" }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}

export const config = {
  api: {
    bodyParser: false,
  },
}
