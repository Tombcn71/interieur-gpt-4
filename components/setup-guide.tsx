"use client"

import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { AlertCircle, ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react"

export function SetupGuide() {
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
              <span>Configuratie Hulp</span>
            </div>
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="p-4 space-y-4">
            <Alert>
              <AlertTitle>Configuratie Vereist</AlertTitle>
              <AlertDescription>
                Je moet de volgende omgevingsvariabelen configureren om de app correct te laten werken:
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-medium">1. NextAuth Configuratie</h3>
                  <p className="text-sm text-muted-foreground">
                    Stel <code className="bg-gray-100 px-1 rounded">NEXTAUTH_SECRET</code> in op een veilige
                    willekeurige string.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-medium">2. Google OAuth</h3>
                  <p className="text-sm text-muted-foreground">
                    Configureer <code className="bg-gray-100 px-1 rounded">GOOGLE_CLIENT_ID</code> en{" "}
                    <code className="bg-gray-100 px-1 rounded">GOOGLE_CLIENT_SECRET</code> via de Google Cloud Console.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-medium">3. Stripe API</h3>
                  <p className="text-sm text-muted-foreground">
                    Stel <code className="bg-gray-100 px-1 rounded">STRIPE_SECRET_KEY</code> in via het Stripe
                    Dashboard.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-medium">4. Database URL</h3>
                  <p className="text-sm text-muted-foreground">
                    Configureer <code className="bg-gray-100 px-1 rounded">DATABASE_URL</code> met je Neon database
                    verbinding.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Zie <code className="bg-gray-100 px-1 rounded">.env.example</code> voor alle benodigde variabelen.
            </p>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
