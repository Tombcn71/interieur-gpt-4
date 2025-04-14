"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface SimpleDeleteButtonProps {
  designId: string;
  redirectTo?: string;
}

export function SimpleDeleteButton({
  designId,
  redirectTo = "/dashboard",
}: SimpleDeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleDelete = async () => {
    if (isDeleting) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/design/${designId}`, {
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

      // Redirect after successful deletion
      router.push(redirectTo);
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

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={isDeleting}
      className="flex items-center">
      {isDeleting ? (
        <>
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          Verwijderen...
        </>
      ) : (
        <>
          <Trash2 className="h-4 w-4 mr-2" />
          Verwijderen
        </>
      )}
    </Button>
  );
}
