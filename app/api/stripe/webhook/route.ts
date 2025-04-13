import { type NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import {
  stripe,
  getPriceToCreditsMap,
  AMOUNT_CREDITS_MAPPING,
} from "@/lib/stripe";
import { createPayment, updateUserCredits } from "@/lib/db";

export async function POST(req: NextRequest) {
  console.log("Stripe webhook called");

  // Check if Stripe is properly configured
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("Missing Stripe environment variables");
    return NextResponse.json(
      {
        error:
          "Stripe is not properly configured. Please check your environment variables.",
      },
      { status: 500 }
    );
  }

  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    console.log(`Webhook event received: ${event.type}`);
  } catch (error: any) {
    console.error("Webhook signature verification failed:", error.message);
    return NextResponse.json(
      { error: `Webhook Error: ${error.message}` },
      { status: 400 }
    );
  }

  // Handle checkout session completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      // Get user ID from client_reference_id or metadata
      const userId = session.client_reference_id || session.metadata?.userId;

      if (!userId) {
        console.error("No user ID found in session");
        return NextResponse.json(
          { error: "Geen gebruiker ID gevonden" },
          { status: 400 }
        );
      }

      // Get the price ID and amount paid
      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id,
        { limit: 1 }
      );
      const priceId = lineItems.data[0]?.price?.id;
      const amountPaid = session.amount_total;

      if (!priceId && !amountPaid) {
        console.error("No price ID or amount found in session");
        return NextResponse.json(
          { error: "Geen prijs ID of bedrag gevonden" },
          { status: 400 }
        );
      }

      // Get the price to credits mapping
      const priceToCreditsMap = getPriceToCreditsMap();

      // Determine credits based on price ID or amount paid
      let credits = 0;

      if (priceId && priceToCreditsMap[priceId]) {
        credits = priceToCreditsMap[priceId];
        console.log(
          `Found credits from price ID: ${priceId} -> ${credits} credits`
        );
      } else if (amountPaid && AMOUNT_CREDITS_MAPPING[amountPaid / 100]) {
        credits = AMOUNT_CREDITS_MAPPING[amountPaid / 100];
        console.log(
          `Found credits from amount: ${amountPaid / 100} -> ${credits} credits`
        );
      } else {
        console.error(`Unknown price ID: ${priceId} or amount: ${amountPaid}`);
        return NextResponse.json(
          { error: "Onbekend prijsbedrag of ID" },
          { status: 400 }
        );
      }

      console.log(`Adding ${credits} credits to user ${userId}`);

      // Create payment record
      await createPayment(
        userId,
        session.id,
        amountPaid ? amountPaid / 100 : 0,
        credits,
        "completed"
      );

      // Add credits to user
      await updateUserCredits(userId, credits);

      console.log("Payment processed successfully");
    } catch (error) {
      console.error("Error processing payment:", error);
      return NextResponse.json(
        { error: "Error processing payment" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
