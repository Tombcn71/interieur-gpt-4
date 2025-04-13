import { type NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import {
  stripe,
  getPriceToCreditsMap,
  AMOUNT_CREDITS_MAPPING,
} from "@/lib/stripe";
import { createPayment, updateUserCredits, getUserById } from "@/lib/db";
import { safeStringify } from "@/lib/debug-utils"; // If you have this utility

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

    // Log the full event for debugging
    console.log(
      "Full event data:",
      safeStringify
        ? safeStringify(event.data.object)
        : JSON.stringify(event.data.object)
    );
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
        console.error(
          "No user ID found in session:",
          safeStringify ? safeStringify(session) : JSON.stringify(session)
        );
        return NextResponse.json(
          { error: "Geen gebruiker ID gevonden" },
          { status: 400 }
        );
      }

      console.log(`Processing payment for user ID: ${userId}`);

      // Get the price ID and amount paid
      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id,
        { limit: 1 }
      );
      console.log(
        "Line items:",
        safeStringify ? safeStringify(lineItems) : JSON.stringify(lineItems)
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

      console.log(`Price ID: ${priceId}, Amount paid: ${amountPaid}`);

      // Get the price to credits mapping
      const priceToCreditsMap = getPriceToCreditsMap();
      console.log("Price to credits map:", priceToCreditsMap);

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
        // Fallback to a default mapping based on common price points
        const amount = amountPaid ? Math.round(amountPaid / 100) : 0;
        console.log(
          `Trying to determine credits from rounded amount: ${amount}`
        );

        if (amount >= 45 && amount <= 55) {
          credits = 50; // Premium plan
          console.log(`Assigned 50 credits based on amount ~€50`);
        } else if (amount >= 20 && amount <= 30) {
          credits = 15; // Standard plan
          console.log(`Assigned 15 credits based on amount ~€25`);
        } else if (amount >= 8 && amount <= 12) {
          credits = 5; // Basic plan
          console.log(`Assigned 5 credits based on amount ~€10`);
        } else {
          console.error(
            `Unknown price ID: ${priceId} or amount: ${amountPaid}`
          );
          return NextResponse.json(
            { error: "Onbekend prijsbedrag of ID" },
            { status: 400 }
          );
        }
      }

      // Get current user credits before updating
      const userBefore = await getUserById(userId);
      console.log(
        `User ${userId} had ${userBefore?.credits || 0} credits before update`
      );

      console.log(`Adding ${credits} credits to user ${userId}`);

      // Create payment record
      await createPayment(
        userId,
        session.id,
        amountPaid ? amountPaid / 100 : 0,
        credits,
        "completed"
      );

      // Add credits to user - ensure it's a positive number
      if (credits > 0) {
        const updatedUser = await updateUserCredits(userId, Math.abs(credits));
        console.log(
          `Updated user result:`,
          updatedUser ? JSON.stringify(updatedUser) : "No result"
        );
      } else {
        console.error(`Invalid credit amount: ${credits}`);
      }

      // Get updated user credits
      const userAfter = await getUserById(userId);
      console.log(
        `User ${userId} now has ${userAfter?.credits || 0} credits after update`
      );

      console.log("Payment processed successfully");
      return NextResponse.json({
        received: true,
        processed: true,
        userId,
        credits,
      });
    } catch (error) {
      console.error("Error processing payment:", error);
      return NextResponse.json(
        {
          error: "Error processing payment",
          details: error instanceof Error ? error.message : String(error),
        },
        { status: 500 }
      );
    }
  } else {
    console.log(`Ignoring event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

// This is important to disable the default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};
