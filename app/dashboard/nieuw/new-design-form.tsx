"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RoomTypeSelector } from "@/components/room-type-selector";
import { StyleSelector } from "@/components/style-selector";
import { ImageUpload } from "@/components/image-upload";
import { useToast } from "@/hooks/use-toast";
import { Zap } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useSession } from "next-auth/react";

interface NewDesignFormProps {
  credits: number;
}

export function NewDesignForm({ credits }: NewDesignFormProps) {
  const [roomType, setRoomType] = useState("woonkamer");
  const [style, setStyle] = useState("modern");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleSubmit = async () => {
    if (!imageUrl) {
      toast({
        title: "Fout",
        description: "Upload eerst een afbeelding",
        variant: "destructive",
      });
      return;
    }

    // Check if user is authenticated
    if (status !== "authenticated" || !session?.user?.id) {
      toast({
        title: "Fout",
        description: "Je bent niet ingelogd. Log in om een ontwerp te maken.",
        variant: "destructive",
      });
      router.push("/login");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
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

      if (!data.success) {
        throw new Error(data.error || "Er is een fout opgetreden");
      }

      toast({
        title: "Succes!",
        description: "Je ontwerp is succesvol gemaakt",
      });

      router.push("/dashboard");
      router.refresh();
    } catch (error: any) {
      console.error("Error creating design:", error);
      setError(
        error.message ||
          "Er is een fout opgetreden bij het maken van je ontwerp"
      );
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

  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Ontwerp details</h2>
            <div className="bg-blue-50 text-blue-600 rounded-full px-4 py-1">
              <span className="text-sm font-medium">Credits: {credits}</span>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Fout</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <RoomTypeSelector onChange={setRoomType} />

          <StyleSelector onChange={setStyle} />

          <ImageUpload onUpload={setImageUrl} />

          <div className="pt-4">
            <Button
              onClick={handleSubmit}
              disabled={!imageUrl || isSubmitting || status !== "authenticated"}
              className="w-full rounded-full h-12">
              {isSubmitting ? (
                "Bezig met genereren..."
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
