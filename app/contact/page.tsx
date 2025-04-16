import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = {
  title: "Contact - InterieurGPT",
  description:
    "Neem contact met ons op voor vragen, feedback of ondersteuning.",
};

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4">
          <Link href="/" className="flex items-center text-sm font-medium">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Terug naar home
          </Link>
        </div>
      </header>

      <main className="flex-1 py-12">
        <div className="container max-w-5xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h1 className="text-3xl font-bold mb-4">Contact</h1>
              <p className="text-muted-foreground mb-6">
                Heeft u vragen, feedback of heeft u hulp nodig? Neem contact met
                ons op en we zullen zo snel mogelijk reageren.
              </p>

              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2">E-mail</h2>
                  <p className="text-blue-600">info@interieurgpt.nl</p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-2">Adres</h2>
                  <address className="not-italic">
                    InterieurGPT B.V.
                    <br />
                    Designstraat 42
                    <br />
                    1234 AB Amsterdam
                    <br />
                    Nederland
                  </address>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-2">Klantenservice</h2>
                  <p>Beschikbaar op werkdagen van 9:00 tot 17:00</p>
                </div>
              </div>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Stuur ons een bericht</CardTitle>
                  <CardDescription>
                    Vul het formulier in en we nemen zo snel mogelijk contact
                    met u op.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">Voornaam</Label>
                        <Input id="first-name" placeholder="Voornaam" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">Achternaam</Label>
                        <Input id="last-name" placeholder="Achternaam" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="uw@email.nl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Onderwerp</Label>
                      <Input
                        id="subject"
                        placeholder="Onderwerp van uw bericht"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Bericht</Label>
                      <Textarea
                        id="message"
                        placeholder="Typ uw bericht hier..."
                        rows={5}
                      />
                    </div>
                  </form>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Verstuur bericht</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © 2025 InterieurGPT. Alle rechten voorbehouden.
            </p>
            <div className="flex gap-6">
              <Link
                href="/voorwaarden"
                className="text-sm text-gray-500 hover:text-gray-900">
                Gebruiksvoorwaarden
              </Link>
              <Link
                href="/privacy"
                className="text-sm text-gray-500 hover:text-gray-900">
                Privacybeleid
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
