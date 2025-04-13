import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";

// Define allowed methods
const ALLOWED_METHODS = ["POST"];

export async function POST(req: NextRequest) {
  console.log("Stripe checkout API route called with POST method");

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

    // Log the request method and headers for debugging
    console.log("Request method:", req.method);
    console.log("Request headers:", Object.fromEntries(req.headers.entries()));

    // Parse the request body
    let body;
    try {
      body = await req.json();
      console.log("Request body:", body);
    } catch (error) {
      console.error("Error parsing request body:", error);
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { priceId, customerEmail } = body;

    if (!priceId) {
      console.error("No priceId provided");
      return NextResponse.json(
        { error: "Geen prijs ID opgegeven" },
        { status: 400 }
      );
    }

    // Use the email from the request body or fall back to the session email
    const email = customerEmail || session.user.email;

    console.log(
      `Creating checkout session for user ${session.user.id} with priceId ${priceId} and email ${email}`
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
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/nieuw?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/credits?canceled=true`,
        client_reference_id: session.user.id,
        // Pre-fill the customer's email
        customer_email: email,
        // Add metadata for the webhook
        metadata: {
          userId: session.user.id,
          debug: "true",
        },
      });

      console.log(
        "Created checkout session with client_reference_id:",
        session.user.id
      );
      console.log(
        `Checkout session created with client_reference_id: ${session.user.id} and email: ${email}`
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

// Add a GET handler to respond with a proper error for GET requests
export async function GET() {
  console.log("Stripe checkout API route called with GET method (not allowed)");
  return NextResponse.json(
    { error: "Method not allowed. Please use POST." },
    { status: 405 }
  );
}
