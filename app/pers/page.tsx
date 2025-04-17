import { Navbar } from "@/components/navbar";
import { PressKitDownload } from "@/components/press-kit-download";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Users } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { PressLogos } from "@/components/press-logos";
import { PressScreenshots } from "@/components/press-screenshots";
import { PressReleases } from "@/components/press-releases";

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

          <div className="space-y-16 mb-16">
            <section id="logos">
              <PressLogos />
            </section>

            <section id="screenshots">
              <PressScreenshots />
            </section>

            <section id="press-releases">
              <PressReleases />
            </section>
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
                <h3 className="text-xl font-semibold mb-4">Mediacontact</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Persaanvragen</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Voor interviews, informatieverzoeken en andere
                      media-aanvragen.
                    </p>
                    <p className="text-sm font-medium">pers@interieurgpt.nl</p>
                    <p className="text-sm">+31 20 123 4567</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Partnerschappen</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Voor zakelijke samenwerkingen en partnerschappen.
                    </p>
                    <p className="text-sm font-medium">
                      partners@interieurgpt.nl
                    </p>
                    <p className="text-sm">+31 20 123 4568</p>
                  </div>
                  <Button
                    className="text-sm py-1 h-auto border bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
                    asChild>
                    <Link href="/contact">
                      <Users className="mr-2 h-4 w-4" />
                      Contactpagina
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
