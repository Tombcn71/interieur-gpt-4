import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  console.log("Stripe checkout API route called");

  // Check if Stripe is properly configured
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("Missing STRIPE_SECRET_KEY environment variable");
    return NextResponse.json(
      {
        error:
          "Stripe is not properly configured. Please check your environment variables.",
      },
      { status: 500 }
    );
  }

  // Check if NEXT_PUBLIC_APP_URL is properly configured
  if (!process.env.NEXT_PUBLIC_APP_URL) {
    console.error("Missing NEXT_PUBLIC_APP_URL environment variable");
    return NextResponse.json(
      {
        error:
          "NEXT_PUBLIC_APP_URL is not configured. Please check your environment variables.",
      },
      { status: 500 }
    );
  }

  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      console.error("User not authenticated");
      return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
    }

    const body = await req.json();
    const { priceId } = body;

    if (!priceId) {
      console.error("No priceId provided");
      return NextResponse.json(
        { error: "Geen prijs ID opgegeven" },
        { status: 400 }
      );
    }

    console.log(
      `Creating checkout session for user ${session.user.id} with priceId ${priceId}`
    );

    try {
      // Create a checkout session with the price ID
      const checkoutSession = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?canceled=true`,
        client_reference_id: session.user.id,
        // Add metadata for the webhook
        metadata: {
          userId: session.user.id,
        },
      });

      console.log(
        `Checkout session created with client_reference_id: ${session.user.id}`
      );
      console.log("Checkout session created successfully", checkoutSession.id);
      return NextResponse.json({ url: checkoutSession.url });
    } catch (stripeError: any) {
      console.error("Stripe checkout error:", stripeError);
      return NextResponse.json(
        {
          error: `Stripe error: ${
            stripeError.message || "Unknown Stripe error"
          }`,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("General error in checkout API route:", error);
    return NextResponse.json(
      {
        error: `Er is een fout opgetreden: ${error.message || "Unknown error"}`,
      },
      { status: 500 }
    );
  }
}
