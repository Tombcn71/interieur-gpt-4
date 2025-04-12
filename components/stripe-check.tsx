"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function StripeCheck() {
  const [showWarning, setShowWarning] = useState(false)
  const [isDevelopment, setIsDevelopment] = useState(false)

  useEffect(() => {
    // Check if we're in development mode
    if (process.env.NODE_ENV === "development") {
      // Make a simple request to check Stripe configuration
      fetch("/api/stripe/check")
        .then((res) => res.json())
        .then((data) => {
          if (!data.success) {
            setShowWarning(true)
            setIsDevelopment(data.development)
          }
        })
        .catch(() => {
          setShowWarning(true)
        })
    }
  }, [])

  if (!showWarning) return null

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-md">
      <Alert variant={isDevelopment ? "default" : "destructive"}>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Stripe {isDevelopment ? "Development Mode" : "Configuration Error"}</AlertTitle>
        <AlertDescription>
          {isDevelopment
            ? "Stripe is running in development mode with a mock API. Set a valid STRIPE_SECRET_KEY for production use."
            : "Stripe is not properly configured. Please check your STRIPE_SECRET_KEY environment variable and make sure you have replaced the placeholder price IDs with your actual Stripe price IDs."}
        </AlertDescription>
      </Alert>
    </div>
  )
}
