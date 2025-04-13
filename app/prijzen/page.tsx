import { Navbar } from "@/components/navbar";
import { PricingSection } from "@/components/pricing-section";
import { StripePricingTable } from "@/components/stripe-pricing-table";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function PricingPage() {
  const session = await getServerSession(authOptions);
  const isLoggedIn = !!session;

  // Get Stripe configuration from environment variables
  const pricingTableId = process.env.NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID || "";
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

  // Determine whether to show Stripe pricing table or regular pricing section
  const showStripePricingTable = isLoggedIn && pricingTableId && publishableKey;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Prijzen</h1>
            <p className="text-xl text-muted-foreground max-w-[600px] mx-auto">
              Kies het plan dat bij je past en begin met het transformeren van
              je ruimtes.
            </p>
          </div>

          {showStripePricingTable ? (
            <StripePricingTable
              pricingTableId={pricingTableId}
              publishableKey={publishableKey}
            />
          ) : (
            <PricingSection />
          )}
        </div>
      </main>
    </div>
  );
}
