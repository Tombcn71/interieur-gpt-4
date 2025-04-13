"use client";

import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function ReplicateCheck() {
  const [showWarning, setShowWarning] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Only check in development mode
    if (process.env.NODE_ENV === "development") {
      fetch("/api/replicate/check")
        .then((res) => res.json())
        .then((data) => {
          if (!data.success) {
            setShowWarning(true);
            setErrorMessage(
              data.error || "Replicate is not properly configured"
            );
          }
        })
        .catch(() => {
          setShowWarning(true);
          setErrorMessage("Failed to check Replicate configuration");
        });
    }
  }, []);

  if (!showWarning) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-md">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Replicate Configuration Issue</AlertTitle>
        <AlertDescription>
          <p>{errorMessage}</p>
          <p className="mt-2">
            Please make sure your REPLICATE_API_TOKEN is correctly set in your
            environment variables.
          </p>
        </AlertDescription>
      </Alert>
    </div>
  );
}
