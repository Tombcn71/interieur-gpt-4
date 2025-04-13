"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";

interface StripeCheckoutButtonProps {
  priceId: string;
  credits: number;
}

export function StripeCheckoutButton({
  priceId,
  credits,
}: StripeCheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { data: session } = useSession();

  const handleCheckout = async () => {
    setIsLoading(true);

    try {
      console.log("Starting checkout process with priceId:", priceId);
      console.log("User email:", session?.user?.email);
      console.log("User ID:", session?.user?.id);

      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
          customerEmail: session?.user?.email,
        }),
      });

      console.log("Response status:", response.status);

      // Try to parse the response as JSON
      let data;
      try {
        data = await response.json();
        console.log("Response data:", data);
      } catch (error) {
        console.error("Error parsing response:", error);
        throw new Error("Invalid response from server");
      }

      if (!response.ok) {
        throw new Error(data.error || "Er is een fout opgetreden");
      }

      if (!data.url) {
        throw new Error("No checkout URL returned from server");
      }

      // Redirect to Stripe Checkout
      console.log("Redirecting to:", data.url);
      window.location.href = data.url;
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast({
        title: "Fout",
        description:
          error.message ||
          "Er is een fout opgetreden bij het starten van de betaling",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleCheckout} disabled={isLoading} className="w-full">
      {isLoading ? "Bezig..." : `Koop ${credits} credits`}
    </Button>
  );
}
