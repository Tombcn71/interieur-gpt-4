import { Navbar } from "@/components/navbar";
import { PressKitDownload } from "@/components/press-kit-download";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, FileText, ImageIcon, Users } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/footer";

export const metadata = {
  title: "Perskit - InterieurGPT",
  description:
    "Download de officiële perskit van InterieurGPT met logo's, afbeeldingen en informatie voor de media",
};

export default function PressKitPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container max-w-5xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">InterieurGPT Perskit</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Officiële media resources voor journalisten, bloggers en partners
            </p>
          </div>

          <div className="mb-12">
            <PressKitDownload />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <Card className="overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-8">
                <img
                  src="/images/press/logo-dark.svg"
                  alt="InterieurGPT Logo (Dark)"
                  className="max-w-full max-h-full"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">
                  Logo's & Merkidentiteit
                </h3>
                <p className="text-muted-foreground mb-4">
                  Download onze logo's in verschillende formaten en kleuren,
                  samen met onze merkrichtlijnen.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    className="text-sm py-1 h-auto border bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
                    asChild>
                    <a href="/api/press-kit/logos" download>
                      <Download className="mr-2 h-4 w-4" />
                      Logo pakket
                    </a>
                  </Button>
                  <Button
                    className="text-sm py-1 h-auto border bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
                    asChild>
                    <a href="/api/press-kit/brand-guidelines" download>
                      <FileText className="mr-2 h-4 w-4" />
                      Merkrichtlijnen
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-8">
                <img
                  src="/images/press/app-screenshot.jpg"
                  alt="InterieurGPT App Screenshot"
                  className="max-w-full max-h-full rounded-lg shadow-lg"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">
                  Productafbeeldingen
                </h3>
                <p className="text-muted-foreground mb-4">
                  Hoogwaardige schermafbeeldingen en productfoto's voor gebruik
                  in artikelen en publicaties.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    className="text-sm py-1 h-auto border bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
                    asChild>
                    <a href="/api/press-kit/screenshots" download>
                      <ImageIcon className="mr-2 h-4 w-4" />
                      Schermafbeeldingen
                    </a>
                  </Button>
                  <Button
                    className="text-sm py-1 h-auto border bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
                    asChild>
                    <a href="/api/press-kit/product-photos" download>
                      <ImageIcon className="mr-2 h-4 w-4" />
                      Productfoto's
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">
                  Bedrijfsinformatie
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Over InterieurGPT</h4>
                    <p className="text-sm text-muted-foreground">
                      InterieurGPT is een AI-aangedreven platform dat gebruikers
                      helpt hun interieur te transformeren met behulp van
                      geavanceerde beeldgeneratietechnologie. Opgericht in 2023,
                      stelt ons platform gebruikers in staat om foto's van hun
                      bestaande ruimtes te uploaden en deze in verschillende
                      stijlen te visualiseren.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Missie</h4>
                    <p className="text-sm text-muted-foreground">
                      Onze missie is om interieurontwerp toegankelijk te maken
                      voor iedereen, door de kracht van AI te benutten om mensen
                      te helpen hun droomruimtes te visualiseren voordat ze
                      investeren in renovaties of herinrichting.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Kernstatistieken</h4>
                    <ul className="text-sm text-muted-foreground list-disc pl-5">
                      <li>Meer dan 50.000 gebruikers wereldwijd</li>
                      <li>Meer dan 200.000 gegenereerde interieurontwerpen</li>
                      <li>Beschikbaar in 5 talen</li>
                      <li>Ondersteunt 20+ interieurstijlen</li>
                    </ul>
                  </div>
                  <Button
                    className="text-sm py-1 h-auto border bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
                    asChild>
                    <a href="/api/press-kit/company-info" download>
                      <FileText className="mr-2 h-4 w-4" />
                      Download bedrijfsprofiel
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">
                  Persberichten & Media
                </h3>
                <div className="space-y-4">
                  <div className="border-b pb-3">
                    <p className="text-sm text-muted-foreground mb-1">
                      15 maart 2023
                    </p>
                    <h4 className="font-medium">
                      InterieurGPT lanceert AI-platform voor interieurontwerp
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      InterieurGPT introduceert een revolutionair platform dat
                      AI gebruikt om interieurontwerp te democratiseren.
                    </p>
                    <Button
                      className="text-sm py-1 h-auto border bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
                      asChild>
                      <a href="/api/press-kit/press-release-launch" download>
                        <FileText className="mr-2 h-4 w-4" />
                        Download persbericht
                      </a>
                    </Button>
                  </div>
                  <div className="border-b pb-3">
                    <p className="text-sm text-muted-foreground mb-1">
                      22 juni 2023
                    </p>
                    <h4 className="font-medium">
                      InterieurGPT bereikt mijlpaal van 50.000 gebruikers
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Slechts drie maanden na de lancering heeft InterieurGPT
                      meer dan 50.000 gebruikers aangetrokken.
                    </p>
                    <Button
                      className="text-sm py-1 h-auto border bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
                      asChild>
                      <a href="/api/press-kit/press-release-milestone" download>
                        <FileText className="mr-2 h-4 w-4" />
                        Download persbericht
                      </a>
                    </Button>
                  </div>
                  <Button
                    className="text-sm py-1 h-auto border bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
                    asChild>
                    <a href="/api/press-kit/all-press-releases" download>
                      <FileText className="mr-2 h-4 w-4" />
                      Alle persberichten
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-blue-50 rounded-xl p-8 mb-16">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Mediacontact</h2>
              <p className="text-muted-foreground">
                Voor persaanvragen, interviews of aanvullende informatie, neem
                contact op met ons mediateam.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-2 flex items-center">
                  <Users className="mr-2 h-5 w-5 text-blue-500" />
                  Mediarelaties
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Voor algemene persaanvragen, interviews en informatie.
                </p>
                <p className="text-sm font-medium">pers@interieurgpt.nl</p>
                <p className="text-sm">+31 20 123 4567</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-2 flex items-center">
                  <Users className="mr-2 h-5 w-5 text-blue-500" />
                  Partnerschappen
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Voor samenwerkingen, partnerschappen en zakelijke
                  mogelijkheden.
                </p>
                <p className="text-sm font-medium">partners@interieurgpt.nl</p>
                <p className="text-sm">+31 20 123 4568</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Heb je andere vragen of verzoeken? Neem contact met ons op via
              onze contactpagina.
            </p>
            <Button
              className="h-10 px-4 py-2 text-base bg-primary text-primary-foreground hover:bg-primary/90"
              asChild>
              <Link href="/contact">Contactpagina</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
