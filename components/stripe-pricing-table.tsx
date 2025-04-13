"use client";

import React, { useEffect } from "react";
import { useSession } from "next-auth/react";

// Define the props for our component
interface Props {
  pricingTableId: string;
  publishableKey: string;
}

export function StripePricingTable({ pricingTableId, publishableKey }: Props) {
  const { data: session } = useSession();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.stripe.com/v3/pricing-table.js";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

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

  if (!session?.user) {
    return <div>Please log in to view pricing options</div>;
  }

  console.log("Rendering Stripe Pricing Table with user ID:", session.user.id);
  console.log("User email:", session.user.email);

  // Use createElement to avoid TypeScript errors with custom elements
  return (
    <div className="w-full max-w-6xl mx-auto">
      {React.createElement("stripe-pricing-table", {
        "pricing-table-id": pricingTableId,
        "publishable-key": publishableKey,
        "client-reference-id": session?.user?.id,
        "customer-email": session?.user?.email || "",
      })}
    </div>
  );
}
