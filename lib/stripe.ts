import Stripe from "stripe";

// Create a Stripe instance with proper error handling
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-03-31.basil",
  typescript: true,
});

// Get price IDs from environment variables with fallbacks
export const STRIPE_PRICES = {
  BASIC: process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC || "",
  STANDARD: process.env.NEXT_PUBLIC_STRIPE_PRICE_STANDARD || "",
  PREMIUM: process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM || "",
};

// Define credit amounts for each plan
export const CREDIT_AMOUNTS = {
  BASIC: 5,
  STANDARD: 15,
  PREMIUM: 50,
};

// Create a mapping from price ID to credit amount
export const getPriceToCreditsMap = (): Record<string, number> => {
  const mapping: Record<string, number> = {};

  if (STRIPE_PRICES.BASIC) {
    mapping[STRIPE_PRICES.BASIC] = CREDIT_AMOUNTS.BASIC;
  }

  if (STRIPE_PRICES.STANDARD) {
    mapping[STRIPE_PRICES.STANDARD] = CREDIT_AMOUNTS.STANDARD;
  }

  if (STRIPE_PRICES.PREMIUM) {
    mapping[STRIPE_PRICES.PREMIUM] = CREDIT_AMOUNTS.PREMIUM;
  }

  return mapping;
};

// Fallback credits mapping based on price amounts (in cents)
export const AMOUNT_CREDITS_MAPPING: Record<number, number> = {
  999: CREDIT_AMOUNTS.BASIC, // €9.99 plan
  2499: CREDIT_AMOUNTS.STANDARD, // €24.99 plan
  4999: CREDIT_AMOUNTS.PREMIUM, // €49.99 plan
};

// Helper function to check if Stripe is properly configured
export async function isStripeConfigured(): Promise<boolean> {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return false;
    }

    // Try a simple API call to check if the API key is valid
    await stripe.products.list({ limit: 1 });
    return true;
  } catch (error) {
    console.error("Stripe configuration error:", error);
    return false;
  }
}

export async function createCheckoutSession(userId: string, priceId: string) {
  if (!process.env.NEXT_PUBLIC_APP_URL) {
    throw new Error("Missing NEXT_PUBLIC_APP_URL environment variable");
  }

  try {
    console.log(`Creating Stripe checkout session with priceId: ${priceId}`);

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
      client_reference_id: userId,
      metadata: {
        userId,
      },
    });

    return session;
  } catch (error: any) {
    console.error("Error creating Stripe checkout session:", error);

    // Provide more detailed error message based on the Stripe error
    if (error.type === "StripeInvalidRequestError") {
      if (error.param === "price") {
        throw new Error(
          `Invalid price ID: ${priceId}. Please check your Stripe price IDs.`
        );
      }
    }

    throw error;
  }
}
