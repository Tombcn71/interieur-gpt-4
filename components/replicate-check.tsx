"use client";

import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function ReplicateCheck() {
  const [showWarning, setShowWarning] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDevelopment, setIsDevelopment] = useState(false);

  useEffect(() => {
    // Check if we're in development mode
    if (process.env.NODE_ENV === "development") {
      // Make a simple request to check Replicate configuration
      fetch("/api/replicate/check")
        .then((res) => res.json())
        .then((data) => {
          if (!data.success) {
            setShowWarning(true);
            setErrorMessage(
              data.error || "Replicate is not properly configured"
            );
            setIsDevelopment(data.development);
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
      <Alert variant={isDevelopment ? "default" : "destructive"}>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Replicate Configuration Issue</AlertTitle>
        <AlertDescription>
          {errorMessage}
          {isDevelopment && (
            <p className="mt-2">
              Make sure you have set the REPLICATE_API_TOKEN environment
              variable in your .env.local file. You can get an API token from{" "}
              <a
                href="https://replicate.com/account/api-tokens"
                target="_blank"
                rel="noopener noreferrer"
                className="underline">
                https://replicate.com/account/api-tokens
              </a>
            </p>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
}
