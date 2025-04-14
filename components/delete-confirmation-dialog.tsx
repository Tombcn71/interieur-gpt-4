"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface DeleteConfirmationDialogProps {
  designId: string;
  designName: string;
  onDeleted?: () => void;
}

export function DeleteConfirmationDialog({
  designId,
  designName,
  onDeleted,
}: DeleteConfirmationDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      console.log(`Sending delete request for design ${designId}`);

      const response = await fetch(`/api/design/${designId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Delete response error:", data);
        throw new Error(data.error || "Er is een fout opgetreden");
      }

      console.log("Delete response:", data);

      toast({
        title: "Ontwerp verwijderd",
        description: "Het ontwerp is succesvol verwijderd",
      });

      // Close the dialog
      setIsOpen(false);

      // Call the onDeleted callback if provided
      if (onDeleted) {
        onDeleted();
      } else {
        // Otherwise redirect to dashboard
        router.push("/dashboard");
        router.refresh();
      }
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
    <>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="flex items-center">
        <Trash2 className="h-4 w-4 mr-2" />
        Verwijderen
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ontwerp verwijderen</DialogTitle>
            <DialogDescription>
              Weet je zeker dat je dit ontwerp wilt verwijderen? Deze actie kan
              niet ongedaan worden gemaakt.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="font-medium">{designName}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Design ID: {designId}
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isDeleting}>
              Annuleren
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}>
              {isDeleting ? "Bezig met verwijderen..." : "Verwijderen"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
