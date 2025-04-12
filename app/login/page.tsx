import type { Metadata } from "next"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { LoginForm } from "@/components/login-form"
import { GoogleOAuthGuide } from "@/components/google-oauth-guide"
import { GoogleConfigChecker } from "@/components/google-config-checker"

export const metadata: Metadata = {
  title: "Inloggen - InterieurGPT",
  description: "Log in op je InterieurGPT account",
}

export default async function LoginPage() {
  // Check session on server side
  try {
    const session = await getServerSession(authOptions)
    if (session) {
      redirect("/dashboard")
    }
  } catch (error) {
    console.error("Error checking session:", error)
    // Continue to login form if there's an error
  }

  const isDevelopment = process.env.NODE_ENV === "development"

  return (
    <>
      <LoginForm />
      {isDevelopment && (
        <>
          <GoogleOAuthGuide />
          <GoogleConfigChecker />
        </>
      )}
    </>
  )
}
