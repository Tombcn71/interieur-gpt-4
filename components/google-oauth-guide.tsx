"use client"

import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { AlertCircle, ChevronDown, ChevronUp } from "lucide-react"

export function GoogleOAuthGuide() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="bg-white rounded-lg shadow-lg border overflow-hidden"
      >
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full flex justify-between p-4 h-auto">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-orange-500 mr-2" />
              <span>Google OAuth Setup Guide</span>
            </div>
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="p-4 space-y-4">
            <Alert>
              <AlertTitle>Google OAuth Configuration</AlertTitle>
              <AlertDescription>Follow these steps to set up Google OAuth for your application:</AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium">1. Create a Google Cloud Project</h3>
                <p className="text-sm text-muted-foreground">
                  Go to the{" "}
                  <a
                    href="https://console.cloud.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Google Cloud Console
                  </a>{" "}
                  and create a new project.
                </p>
              </div>

              <div>
                <h3 className="font-medium">2. Configure OAuth Consent Screen</h3>
                <p className="text-sm text-muted-foreground">
                  Go to "APIs & Services" {">"} "OAuth consent screen" and configure the consent screen. Choose
                  "External" for testing.
                </p>
              </div>

              <div>
                <h3 className="font-medium">3. Create OAuth Credentials</h3>
                <p className="text-sm text-muted-foreground">
                  Go to "APIs & Services" {">"} "Credentials" {">"} "Create Credentials" {">"} "OAuth client ID". Choose
                  "Web application" as the application type.
                </p>
              </div>

              <div>
                <h3 className="font-medium">4. Configure Authorized Redirect URIs</h3>
                <p className="text-sm text-muted-foreground">
                  Add the following redirect URI:
                  <code className="block bg-gray-100 p-2 mt-1 rounded text-sm">
                    http://localhost:3000/api/auth/callback/google
                  </code>
                  For production, also add:
                  <code className="block bg-gray-100 p-2 mt-1 rounded text-sm">
                    https://your-domain.com/api/auth/callback/google
                  </code>
                </p>
              </div>

              <div>
                <h3 className="font-medium">5. Set Environment Variables</h3>
                <p className="text-sm text-muted-foreground">
                  Add these variables to your .env.local file:
                  <code className="block bg-gray-100 p-2 mt-1 rounded text-sm">
                    GOOGLE_CLIENT_ID=your-client-id
                    <br />
                    GOOGLE_CLIENT_SECRET=your-client-secret
                    <br />
                    NEXTAUTH_SECRET=your-nextauth-secret
                    <br />
                    NEXTAUTH_URL=http://localhost:3000
                  </code>
                </p>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
