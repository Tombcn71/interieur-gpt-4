"use client";

import React, { useEffect, useState } from "react";
import Script from "next/script";
import { useSession } from "next-auth/react";

interface StripePricingTableProps {
  pricingTableId: string;
  publishableKey: string;
}

export function StripePricingTable({
  pricingTableId,
  publishableKey,
}: StripePricingTableProps) {
  const { data: session } = useSession();
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    // Only try to initialize if both the script is loaded and we have a session
    if (isScriptLoaded && window.StripePricingTable && session?.user?.id) {
      console.log(
        "Setting client_reference_id on stripe-pricing-table:",
        session.user.id
      );
      const elements = document.querySelectorAll("stripe-pricing-table");
      elements.forEach((element) => {
        // Add the user ID as a client reference ID
        element.setAttribute("client-reference-id", session.user.id);

        // Add customer email as a data attribute (will be picked up by our checkout endpoint)
        if (session.user.email) {
          element.setAttribute("data-customer-email", session.user.email);
        }

        // Force re-render of the component
        element.innerHTML = element.innerHTML;
      });
    }
  }, [isScriptLoaded, session]);

  // Handle script load event
  const handleScriptLoad = () => {
    setIsScriptLoaded(true);
  };

  if (!pricingTableId || !publishableKey) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">
          Stripe pricing table configuration is missing. Please check your
          environment variables.
        </p>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://js.stripe.com/v3/pricing-table.js"
        strategy="afterInteractive"
        onLoad={handleScriptLoad}
      />
      <div className="w-full max-w-6xl mx-auto">
        {React.createElement("stripe-pricing-table", {
          "pricing-table-id": pricingTableId,
          "publishable-key": publishableKey,
          "client-reference-id": session?.user?.id || "",
          "data-customer-email": session?.user?.email || "",
        })}
      </div>
    </>
  );
}
