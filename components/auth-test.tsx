"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"

export function AuthTest() {
  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" })
  }

  return (
    <div className="p-4 border rounded-md">
      <h2 className="text-lg font-bold mb-4">Test Google Authentication</h2>
      <Button onClick={handleGoogleSignIn}>Sign in with Google (Direct)</Button>
      <p className="mt-4 text-sm text-gray-500">
        This button uses the signIn function directly from next-auth/react, which might work better than the form
        redirect.
      </p>
    </div>
  )
}
