"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function GoogleConfigChecker() {
  const [missingVars, setMissingVars] = useState<string[]>([])
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Only check in development mode
    if (process.env.NODE_ENV !== "development") {
      setIsChecking(false)
      return
    }

    fetch("/api/auth/check-google-config")
      .then((res) => res.json())
      .then((data) => {
        if (!data.googleConfigured) {
          setMissingVars(data.missingVars)
        }
      })
      .catch((error) => {
        console.error("Error checking Google config:", error)
      })
      .finally(() => {
        setIsChecking(false)
      })
  }, [])

  if (isChecking || missingVars.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Google OAuth Configuration Missing</AlertTitle>
        <AlertDescription>
          <p>The following environment variables are missing:</p>
          <ul className="list-disc pl-5 mt-2">
            {missingVars.map((v) => (
              <li key={v}>{v}</li>
            ))}
          </ul>
          <p className="mt-2">
            Please check the Google OAuth Setup Guide for instructions on how to configure Google authentication.
          </p>
        </AlertDescription>
      </Alert>
    </div>
  )
}
