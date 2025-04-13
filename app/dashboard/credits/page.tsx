import { Navbar } from "@/components/navbar";
import { PricingSection } from "@/components/pricing-section";
import { StripePricingTable } from "@/components/stripe-pricing-table";
import { FixCreditsButton } from "@/components/fix-credits-button";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { AuthCheck } from "@/components/auth-check";
import { getUserById } from "@/lib/db";

export default async function CreditsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <AuthCheck>{null}</AuthCheck>;
  }

  // Get the latest user data from the database
  const userId = String(session.user.id);
  const user = await getUserById(userId);
  const credits = user?.credits || session.user.credits;

  // Get Stripe configuration from environment variables
  const pricingTableId = process.env.NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID || "";
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

  // Determine whether to show Stripe pricing table or regular pricing section
  const showStripePricingTable = pricingTableId && publishableKey;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-2">Credits kopen</h1>
            <p className="text-muted-foreground max-w-[600px] mx-auto">
              Je hebt momenteel <span className="font-medium">{credits}</span>{" "}
              credits. Koop meer credits om meer interieurontwerpen te maken.
            </p>
          </div>

          {/* Show fix credits button if credits are negative */}
          <div className="max-w-3xl mx-auto">
            <FixCreditsButton credits={credits} />
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
