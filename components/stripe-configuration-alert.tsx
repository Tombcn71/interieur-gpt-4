"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function StripeConfigurationAlert() {
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Stripe Configuration Missing</AlertTitle>
      <AlertDescription>
        <p>
          The Stripe pricing table cannot be displayed because the required
          environment variables are missing:
        </p>
        <ul className="list-disc pl-5 mt-2">
          <li>NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID</li>
          <li>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</li>
        </ul>
        <p className="mt-2">
          Please add these variables to your .env.local file and restart the
          application.
        </p>
      </AlertDescription>
    </Alert>
  );
}
