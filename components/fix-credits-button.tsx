"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export function FixCreditsButton({ credits }: { credits: number }) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Only show the button if credits are negative
  if (credits >= 0) {
    return null;
  }

  const handleFixCredits = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/credits/fix", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to fix credits");
      }

      const data = await response.json();

      toast({
        title: "Credits gerepareerd",
        description: `Je credits zijn gereset naar ${data.credits}.`,
      });

      // Refresh the page to update the UI
      router.refresh();
    } catch (error) {
      console.error("Error fixing credits:", error);
      toast({
        title: "Fout",
        description:
          "Er is een fout opgetreden bij het repareren van je credits.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
      <h3 className="font-medium text-red-800 mb-2">
        Negatieve Credits Gedetecteerd
      </h3>
      <p className="text-red-700 mb-4">
        Je hebt momenteel {credits} credits. Dit is een fout in het systeem.
      </p>
      <Button
        onClick={handleFixCredits}
        disabled={isLoading}
        variant="destructive">
        {isLoading ? "Bezig..." : "Repareer Credits"}
      </Button>
    </div>
  );
}
