"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function EnvChecker() {
  const [missingVars, setMissingVars] = useState<string[]>([])

  useEffect(() => {
    // Check if we're in development mode
    if (process.env.NODE_ENV === "development") {
      // Make a simple request to check environment variables
      fetch("/api/env-check")
        .then((res) => res.json())
        .then((data) => {
          if (data.missingVars && data.missingVars.length > 0) {
            setMissingVars(data.missingVars)
          }
        })
        .catch(() => {
          setMissingVars(["API_ERROR"])
        })
    }
  }, [])

  if (missingVars.length === 0) return null

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-md">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Missing Environment Variables</AlertTitle>
        <AlertDescription>
          <p>The following environment variables are missing or invalid:</p>
          <ul className="list-disc pl-5 mt-2">
            {missingVars.map((v) => (
              <li key={v}>{v}</li>
            ))}
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  )
}
