"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

interface LoginFormProps {
  callbackUrl?: string;
  error?: string;
}

export function LoginForm({ callbackUrl, error }: LoginFormProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [redirectAttempted, setRedirectAttempted] = useState(false);

  // Handle redirection if user is already logged in
  useEffect(() => {
    // Only redirect if authenticated and we haven't attempted a redirect yet
    if (status === "authenticated" && session && !redirectAttempted) {
      setRedirectAttempted(true);
      console.log(
        "User is authenticated, redirecting to:",
        callbackUrl || "/dashboard"
      );

      // Use a direct window location change instead of Next.js router
      // This is more forceful and should break any potential loops
      window.location.href = callbackUrl || "/dashboard";
    }
  }, [session, status, callbackUrl, redirectAttempted]);

  const handleGoogleSignIn = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      // Use a simple redirect for Google sign-in
      await signIn("google", {
        callbackUrl: callbackUrl || "/dashboard",
        redirect: true,
      });
    } catch (error) {
      console.error("Sign in error:", error);
      setIsLoading(false);
    }
  };

  // Map error codes to user-friendly messages
  const getErrorMessage = (errorCode: string) => {
    const errorMessages: Record<string, string> = {
      google:
        "Er is een probleem met Google inloggen. Probeer het later opnieuw.",
      callback: "De callback URL is ongeldig.",
      default:
        "Er is een fout opgetreden bij het inloggen. Probeer het opnieuw.",
      auth: "Er is een probleem met je authenticatie. Probeer opnieuw in te loggen.",
    };

    return errorMessages[errorCode] || errorMessages.default;
  };

  // If already authenticated and we've attempted to redirect, show loading
  if (status === "authenticated" && redirectAttempted) {
    return (
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Je bent al ingelogd
            </h1>
            <p className="text-sm text-muted-foreground">
              Je wordt doorgestuurd naar het dashboard...
            </p>
            <div className="flex justify-center mt-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welkom bij InterieurGPT
          </h1>
          <p className="text-sm text-muted-foreground">
            Log in om je interieur te transformeren
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Fout bij inloggen</AlertTitle>
            <AlertDescription>{getErrorMessage(error)}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6">
          <Button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="rounded-full h-12">
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Bezig met inloggen...
              </span>
            ) : (
              <>
                <svg
                  className="mr-2 h-4 w-4"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fab"
                  data-icon="google"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 488 512">
                  <path
                    fill="currentColor"
                    d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                </svg>
                Inloggen met Google
              </>
            )}
          </Button>
        </div>

        <p className="px-8 text-center text-sm text-muted-foreground">
          Door in te loggen ga je akkoord met onze{" "}
          <Link
            href="/voorwaarden"
            className="underline underline-offset-4 hover:text-primary">
            Gebruiksvoorwaarden
          </Link>{" "}
          en{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-4 hover:text-primary">
            Privacybeleid
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
