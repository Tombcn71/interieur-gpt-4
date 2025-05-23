"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RoomTypeSelector } from "@/components/room-type-selector";
import { StyleSelector } from "@/components/style-selector";
import { ImageUpload } from "@/components/image-upload";
import { useToast } from "@/hooks/use-toast";
import { Zap, AlertCircle, CreditCard } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface NewDesignFormProps {
  credits: number;
}

export function NewDesignForm({ credits: initialCredits }: NewDesignFormProps) {
  const [roomType, setRoomType] = useState("woonkamer");
  const [style, setStyle] = useState("modern");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { data: session, update } = useSession();

  // Use the credits from session if available, otherwise use the initial credits
  const credits = session?.user?.credits ?? initialCredits;

  const handleSubmit = async () => {
    if (!imageUrl) {
      toast({
        title: "Fout",
        description: "Upload eerst een afbeelding",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      toast({
        title: "Bezig met genereren",
        description: "Dit kan ongeveer 20-30 seconden duren.",
      });

      const response = await fetch("/api/design", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomType,
          style,
          imageUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Er is een fout opgetreden");
      }

      // Update the session to reflect the new credit count
      await update();

      toast({
        title: "Succes!",
        description: "Je ontwerp is succesvol gemaakt",
      });

      // Navigate to the design detail page if we have a design ID
      if (data.design && data.design.id) {
        router.push(`/dashboard/ontwerp/${data.design.id}`);
      } else {
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Error creating design:", error);
      toast({
        title: "Fout",
        description:
          error.message ||
          "Er is een fout opgetreden bij het maken van je ontwerp",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if user has enough credits
  const hasEnoughCredits = credits > 0;

  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Ontwerp details</h2>
            <div
              className={`rounded-full px-4 py-1 ${
                hasEnoughCredits
                  ? "bg-blue-50 text-blue-600"
                  : "bg-red-50 text-red-600"
              }`}>
              <span className="text-sm font-medium">Credits: {credits}</span>
            </div>
          </div>

          {!hasEnoughCredits && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Niet genoeg credits</AlertTitle>
              <AlertDescription>
                Je hebt niet genoeg credits om een ontwerp te maken.
                <div className="mt-2">
                  <Button asChild>
                    <Link href="/dashboard/credits">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Koop credits
                    </Link>
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <RoomTypeSelector onChange={setRoomType} />

          <StyleSelector onChange={setStyle} />

          <ImageUpload onUpload={setImageUrl} />

          <div className="pt-4">
            <Button
              onClick={handleSubmit}
              disabled={!imageUrl || isSubmitting || !hasEnoughCredits}
              className="w-full rounded-full h-12">
              {isSubmitting ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Bezig met genereren...
                </div>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Genereer ontwerp
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Dit kost 1 credit
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
