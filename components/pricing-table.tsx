"use client";

import React, { useEffect } from "react";
import Script from "next/script";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export function PricingTable() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  // This ensures the Stripe component is properly initialized after the script loads
  useEffect(() => {
    // If the script has already loaded, we need to manually initialize the component
    if (window.StripePricingTable && session?.user?.id) {
      const elements = document.querySelectorAll("stripe-pricing-table");
      elements.forEach((element) => {
        // Add the user ID as a custom field
        element.setAttribute("client-reference-id", session.user.id);
        // Force re-render of the component
        element.innerHTML = element.innerHTML;
      });
    }

    // Handle success and canceled query parameters
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("success") === "true") {
      toast({
        title: "Betaling geslaagd!",
        description: "Je credits zijn toegevoegd aan je account.",
      });
      // Remove the query parameter to prevent showing the toast again on refresh
      router.replace("/dashboard");
    } else if (urlParams.get("canceled") === "true") {
      toast({
        title: "Betaling geannuleerd",
        description:
          "Je betaling is geannuleerd. Geen credits zijn toegevoegd.",
        variant: "destructive",
      });
      // Remove the query parameter
      router.replace("/dashboard");
    }
  }, [session, router, toast]);

  if (!session) {
    return (
      <div className="text-center p-8">
        Please log in to view pricing options
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://js.stripe.com/v3/pricing-table.js"
        strategy="afterInteractive"
      />
      <div className="w-full max-w-6xl mx-auto">
        {/* Use React.createElement to avoid TypeScript errors */}
        {React.createElement("stripe-pricing-table", {
          "pricing-table-id": "prctbl_1RA7VmBqJiHgClybiFCg6oTI",
          "publishable-key":
            "pk_live_51R8xZaBqJiHgClybecxWOsCD9dAPIaNnvEj6vuEEEADt15b4ByouDBsUGpfwIPTugRUAwx0sonp44rWe5xgcljSg00EvCqraGW",
          "client-reference-id": session.user.id,
        })}
      </div>
    </>
  );
}
