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
    // Load the Stripe Pricing Table script
    const script = document.createElement("script");
    script.src = "https://js.stripe.com/v3/pricing-table.js";
    script.async = true;

    // Log when the script is loaded
    script.onload = () => {
      console.log("Stripe Pricing Table script loaded");

      // If we have a session, set the client reference ID and customer email
      if (session?.user?.id) {
        console.log("Setting client_reference_id:", session.user.id);
        console.log("Setting customer_email:", session.user.email);

        // Find all pricing table elements and set the attributes
        const elements = document.querySelectorAll("stripe-pricing-table");
        elements.forEach((element) => {
          element.setAttribute("client-reference-id", session.user.id);
          if (session.user.email) {
            element.setAttribute("customer-email", session.user.email);
          }
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      // Clean up the script when the component unmounts
      const existingScript = document.querySelector(
        `script[src="https://js.stripe.com/v3/pricing-table.js"]`
      );
      if (existingScript && existingScript.parentNode) {
        existingScript.parentNode.removeChild(existingScript);
      }
    };
  }, [session]);

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
        "client-reference-id": session.user.id,
        "customer-email": session.user.email || "",
      })}
    </div>
  );
}
