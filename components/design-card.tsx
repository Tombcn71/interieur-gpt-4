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
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";

interface DesignCardProps {
  design: Design;
}

export function DesignCard({ design }: DesignCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // Use a fallback image if the result or original image is not available
  const imageUrl =
    design.result_image_url || design.original_image_url || "/placeholder.svg";

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to detail page
    e.stopPropagation(); // Stop event propagation
    setShowDeleteDialog(true);
  };

  const handleDeleteComplete = () => {
    // Refresh the page to update the UI
    router.refresh();
  };

  return (
    <>
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg group">
        <Link href={`/dashboard/ontwerp/${design.id}`}>
          <CardContent className="p-0">
            <div className="relative aspect-square">
              <div
                className="w-full h-full bg-gray-100"
                style={{
                  backgroundImage: `url('${imageUrl}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              />
              <div className="absolute top-2 right-2">
                <Badge
                  variant={
                    design.status === "completed" ? "default" : "outline"
                  }
                  className="rounded-full">
                  {design.status === "completed"
                    ? "Voltooid"
                    : "In behandeling"}
                </Badge>
              </div>

              {/* Delete button that appears on hover */}
              <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={handleDeleteClick}
                  className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full"
                  aria-label="Verwijder ontwerp">
                  <Trash2 className="h-4 w-4" />
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

      {showDeleteDialog && (
        <DeleteConfirmationDialog
          designId={design.id}
          designName={`${design.room_type} - ${design.style}`}
          onDeleted={handleDeleteComplete}
        />
      )}
    </>
  );
}
