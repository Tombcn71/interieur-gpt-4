import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"
import { DatabaseCheck } from "@/components/database-check"
import { StripeCheck } from "@/components/stripe-check"
import { ClientSessionProvider } from "@/components/client-session-provider"
import { SetupGuide } from "@/components/setup-guide"
import { EnvChecker } from "@/components/env-checker"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "InterieurGPT - AI Interieurontwerp",
  description: "Transformeer je ruimte met AI-gegenereerde interieurontwerpen",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientSessionProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <Suspense fallback={<div className="p-4">Loading...</div>}>{children}</Suspense>
            <Toaster />
            <DatabaseCheck />
            <StripeCheck />
            <EnvChecker />
            {process.env.NODE_ENV === "development" && <SetupGuide />}
          </ThemeProvider>
        </ClientSessionProvider>
      </body>
    </html>
  )
}


import './globals.css'