import { Navbar } from "@/components/navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StripeCheckoutButton } from "@/components/stripe-checkout-button";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { AuthCheck } from "@/components/auth-check";
import { STRIPE_PRICES, CREDIT_AMOUNTS } from "@/lib/stripe";

export default async function StripeTestPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <AuthCheck>{null}</AuthCheck>;
  }

  // Use environment variables for price IDs
  const pricePlans = [
    {
      name: "Basis",
      priceId: STRIPE_PRICES.BASIC,
      credits: CREDIT_AMOUNTS.BASIC,
      price: "€9,99",
    },
    {
      name: "Standaard",
      priceId: STRIPE_PRICES.STANDARD,
      credits: CREDIT_AMOUNTS.STANDARD,
      price: "€24,99",
    },
    {
      name: "Premium",
      priceId: STRIPE_PRICES.PREMIUM,
      credits: CREDIT_AMOUNTS.PREMIUM,
      price: "€49,99",
    },
  ];

  // Filter out plans with missing price IDs
  const validPricePlans = pricePlans.filter((plan) => plan.priceId);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Stripe Test</h1>
            <p className="text-muted-foreground">Test de Stripe integratie</p>
          </div>

          {validPricePlans.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <p>
                  No price IDs configured. Please set the
                  NEXT_PUBLIC_STRIPE_PRICE_* environment variables.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {validPricePlans.map((plan) => (
                <Card key={plan.priceId}>
                  <CardHeader>
                    <CardTitle>{plan.name} Plan</CardTitle>
                    <CardDescription>
                      {plan.price} voor {plan.credits} credits
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <StripeCheckoutButton
                      priceId={plan.priceId}
                      credits={plan.credits}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
