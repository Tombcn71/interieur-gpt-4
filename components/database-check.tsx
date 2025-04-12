"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function DatabaseCheck() {
  const [showWarning, setShowWarning] = useState(false)

  useEffect(() => {
    // Check if we're in development mode
    if (process.env.NODE_ENV === "development") {
      // Make a simple request to check database connectivity
      fetch("/api/db-check")
        .then((res) => res.json())
        .then((data) => {
          if (!data.success) {
            setShowWarning(true)
          }
        })
        .catch(() => {
          setShowWarning(true)
        })
    }
  }, [])

  if (!showWarning) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Database Connection Error</AlertTitle>
        <AlertDescription>
          The application cannot connect to the database. Please check your DATABASE_URL environment variable.
        </AlertDescription>
      </Alert>
    </div>
  )
}
