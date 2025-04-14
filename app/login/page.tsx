import type { Metadata } from "next";
import { LoginForm } from "@/components/login-form";
import { GoogleOAuthGuide } from "@/components/google-oauth-guide";
import { GoogleConfigChecker } from "@/components/google-config-checker";
import { Logo } from "@/components/logo";

export const metadata: Metadata = {
  title: "Inloggen - InterieurGPT",
  description: "Log in op je InterieurGPT account",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string; error?: string };
}) {
  // Don't use getServerSession here to avoid redirect loops
  // We'll rely on client-side session checking in the LoginForm component

  const isDevelopment = process.env.NODE_ENV === "development";

  return (
    <>
      <div className="absolute top-8 left-8">
        <Logo />
      </div>
      <LoginForm
        callbackUrl={searchParams.callbackUrl}
        error={searchParams.error}
      />
      {isDevelopment && (
        <>
          <GoogleOAuthGuide />
          <GoogleConfigChecker />
        </>
      )}
    </>
  );
}
