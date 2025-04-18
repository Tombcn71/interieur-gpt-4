"use client";

import type React from "react";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { Design } from "@/types/design";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

interface DesignCardProps {
  design: Design;
}

export function DesignCard({ design }: DesignCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageError, setImageError] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // Use a fallback image if the result or original image is not available
  const imageUrl =
    design.result_image_url || design.original_image_url || "/placeholder.svg";

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to detail page
    e.stopPropagation(); // Stop event propagation

    if (isDeleting) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/design/${design.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Er is een fout opgetreden");
      }

      toast({
        title: "Ontwerp verwijderd",
        description: "Het ontwerp is succesvol verwijderd",
      });

      // Refresh the page to update the UI
      router.refresh();
    } catch (error) {
      console.error("Error deleting design:", error);
      toast({
        title: "Fout",
        description:
          error instanceof Error ? error.message : "Er is een fout opgetreden",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleImageError = () => {
    console.error(`Failed to load image: ${imageUrl}`);
    setImageError(true);
  };

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg group">
      <Link href={`/dashboard/ontwerp/${design.id}`}>
        <CardContent className="p-0">
          <div className="relative aspect-square">
            {imageError ? (
              // Fallback div with background color when image fails to load
              <div
                className="w-full h-full bg-gray-200 flex items-center justify-center"
                aria-label="Afbeelding kon niet worden geladen">
                <span className="text-gray-500 text-sm">
                  Afbeelding niet beschikbaar
                </span>
              </div>
            ) : (
              // Try to load the image with error handling
              <div
                className="w-full h-full bg-gray-100"
                style={{
                  backgroundImage: `url('${imageUrl}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
                onError={handleImageError}>
                {/* Add a hidden image to trigger the onError event */}
                <img
                  src={imageUrl || "/placeholder.svg"}
                  alt=""
                  className="hidden"
                  onError={handleImageError}
                  crossOrigin="anonymous"
                />
              </div>
            )}
            <div className="absolute top-2 right-2">
              <Badge
                variant={design.status === "completed" ? "default" : "outline"}
                className="rounded-full">
                {design.status === "completed" ? "Voltooid" : "In behandeling"}
              </Badge>
            </div>

            {/* Delete button that's always visible on mobile and visible on hover for desktop */}
            <div className="absolute top-2 left-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full"
                disabled={isDeleting}
                aria-label="Verwijder ontwerp">
                {isDeleting ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 flex flex-col items-start gap-1">
          <h3 className="font-medium capitalize">
            {design.room_type} - {design.style}
          </h3>
          <p className="text-sm text-muted-foreground">
            {formatDate(design.created_at)}
          </p>
        </CardFooter>
      </Link>
    </Card>
  );
}
