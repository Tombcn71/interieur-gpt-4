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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Er is een fout opgetreden");
      }

      // Redirect to Stripe Checkout
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
