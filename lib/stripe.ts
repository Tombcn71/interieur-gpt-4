import Stripe from "stripe"

// Create a mock Stripe instance for development if no API key is provided
const createStripeClient = () => {
  const apiKey = process.env.STRIPE_SECRET_KEY

  if (!apiKey || apiKey === "your-stripe-secret-key") {
    console.warn("Using mock Stripe client. Please set a valid STRIPE_SECRET_KEY for production.")

    // Return a mock Stripe client for development
    return {
      checkout: {
        sessions: {
          create: async () => ({
            id: "mock_session_" + Math.random().toString(36).substring(2, 9),
            url: "https://example.com/checkout/mock",
          }),
        },
      },
      products: {
        list: async () => ({ data: [] }),
      },
      webhooks: {
        constructEvent: () => ({
          type: "mock.event",
          data: { object: {} },
        }),
      },
    } as unknown as Stripe
  }

  // Return a real Stripe client if API key is provided
  return new Stripe(apiKey, {
    apiVersion: "2023-10-16",
  })
}

export const stripe = createStripeClient()

export async function createCheckoutSession(userId: string, priceId: string) {
  if (!process.env.NEXT_PUBLIC_APP_URL) {
    throw new Error("Missing NEXT_PUBLIC_APP_URL environment variable")
  }

  try {
    console.log(`Creating Stripe checkout session with priceId: ${priceId}`)

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?canceled=true`,
      metadata: {
        userId,
      },
    })

    return session
  } catch (error: any) {
    console.error("Error creating Stripe checkout session:", error)

    // Provide more detailed error message based on the Stripe error
    if (error.type === "StripeInvalidRequestError") {
      if (error.param === "price") {
        throw new Error(`Invalid price ID: ${priceId}. Please check your Stripe price IDs.`)
      }
    }

    // For development, return a mock session if Stripe is not configured
    if (
      process.env.NODE_ENV === "development" &&
      (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === "your-stripe-secret-key")
    ) {
      return {
        id: "mock_session_" + Math.random().toString(36).substring(2, 9),
        url: "/dashboard?mock=true",
      }
    }

    throw error
  }
}
