import { Navbar } from "@/components/navbar";
import { PricingSection } from "@/components/pricing-section";
import { StripePricingTable } from "@/components/stripe-pricing-table";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { AuthCheck } from "@/components/auth-check";
import { getUserById, fixNegativeCredits } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

export default async function CreditsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <AuthCheck>{null}</AuthCheck>;
  }

  // Get the latest user data from the database
  const userId = String(session.user.id);
  const user = await getUserById(userId);

  // Automatically fix negative credits server-side without showing UI
  let credits = user?.credits || session.user.credits;
  if (credits < 0) {
    console.log(
      `Automatically fixing negative credits (${credits}) for user ${userId}`
    );
    const updatedUser = await fixNegativeCredits(userId);
    credits = updatedUser?.credits || 0;
    console.log(`Credits fixed to ${credits} for user ${userId}`);
  }

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
            <form
              action="/api/auth/session?update=true"
              method="get"
              className="mt-2">
              <Button
                type="submit"
                variant="outline"
                size="sm"
                className="gap-2">
                <RefreshCcw className="h-4 w-4" />
                Refresh Credits
              </Button>
            </form>
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
