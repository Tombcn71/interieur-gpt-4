import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Gebruiksvoorwaarden - InterieurGPT",
  description:
    "Lees onze gebruiksvoorwaarden om te begrijpen hoe u onze diensten kunt gebruiken.",
};

export default function VoorwaardenPage() {
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
        <div className="container max-w-3xl px-4">
          <h1 className="text-3xl font-bold mb-8">Gebruiksvoorwaarden</h1>
          <div className="prose prose-blue max-w-none">
            <p className="text-muted-foreground mb-6">
              Laatst bijgewerkt: 16 april 2025
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              1. Acceptatie van de voorwaarden
            </h2>
            <p>
              Welkom bij InterieurGPT. Door onze website te bezoeken, een
              account aan te maken of onze diensten te gebruiken, gaat u akkoord
              met deze gebruiksvoorwaarden. Als u niet akkoord gaat met deze
              voorwaarden, gebruik dan onze diensten niet.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              2. Beschrijving van de dienst
            </h2>
            <p>
              InterieurGPT is een online platform dat kunstmatige intelligentie
              gebruikt om interieurontwerpen te genereren op basis van door
              gebruikers geüploade afbeeldingen. Onze dienst stelt gebruikers in
              staat om:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Foto's van hun kamers te uploaden</li>
              <li>Verschillende interieurstijlen te kiezen</li>
              <li>AI-gegenereerde ontwerpen te ontvangen</li>
              <li>Ontwerpen op te slaan, te downloaden en te delen</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              3. Gebruikersaccounts
            </h2>
            <p>
              Om onze diensten te gebruiken, moet u een account aanmaken. U bent
              verantwoordelijk voor het handhaven van de vertrouwelijkheid van
              uw accountgegevens en voor alle activiteiten die onder uw account
              plaatsvinden. U stemt ermee in om:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                Nauwkeurige en volledige informatie te verstrekken bij het
                aanmaken van uw account
              </li>
              <li>Uw accountgegevens veilig te houden</li>
              <li>
                Ons onmiddellijk op de hoogte te stellen van ongeautoriseerd
                gebruik van uw account
              </li>
              <li>
                Ervoor te zorgen dat u zich afmeldt aan het einde van elke
                sessie
              </li>
            </ul>
            <p>
              We behouden ons het recht voor om accounts te beëindigen of te
              weigeren naar eigen goeddunken.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              4. Betalingen en credits
            </h2>
            <p>
              InterieurGPT werkt met een creditsysteem voor het genereren van
              ontwerpen:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                Nieuwe gebruikers ontvangen een beperkt aantal gratis credits
              </li>
              <li>Extra credits kunnen worden gekocht via onze website</li>
              <li>Credits zijn niet overdraagbaar en niet restitueerbaar</li>
              <li>
                Prijzen voor credits kunnen worden gewijzigd, maar reeds
                gekochte credits blijven geldig
              </li>
            </ul>
            <p>
              Alle betalingen worden verwerkt door onze betalingsverwerker
              (Stripe) en zijn onderworpen aan hun voorwaarden.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              5. Gebruikersinhoud en licentie
            </h2>
            <p>Wanneer u afbeeldingen uploadt naar InterieurGPT:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                Behoudt u alle eigendomsrechten op uw originele afbeeldingen
              </li>
              <li>
                Verleent u ons een wereldwijde, niet-exclusieve, royaltyvrije
                licentie om uw afbeeldingen te gebruiken, reproduceren en
                verwerken om onze diensten aan u te leveren
              </li>
              <li>
                Begrijpt u dat we uw afbeeldingen kunnen gebruiken om onze
                AI-modellen te trainen en te verbeteren
              </li>
            </ul>
            <p>
              U verklaart en garandeert dat u het recht heeft om de afbeeldingen
              die u uploadt te gebruiken en dat deze geen inbreuk maken op de
              rechten van derden.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              6. AI-gegenereerde ontwerpen
            </h2>
            <p>Met betrekking tot de AI-gegenereerde ontwerpen:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                U ontvangt een persoonlijke, niet-exclusieve licentie om de
                gegenereerde ontwerpen te gebruiken voor persoonlijke en
                commerciële doeleinden
              </li>
              <li>
                U mag de ontwerpen niet doorverkopen, herverdelen of claimen als
                uw eigen originele werk
              </li>
              <li>
                We behouden ons het recht voor om gegenereerde ontwerpen te
                gebruiken voor promotionele doeleinden, tenzij u hier specifiek
                bezwaar tegen maakt
              </li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              7. Gebruiksbeperkingen
            </h2>
            <p>Bij het gebruik van onze diensten mag u niet:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                De dienst gebruiken voor illegale doeleinden of in strijd met
                deze voorwaarden
              </li>
              <li>
                Inbreuk maken op intellectuele eigendomsrechten of andere
                rechten van derden
              </li>
              <li>Ongepaste, aanstootgevende of schadelijke inhoud uploaden</li>
              <li>
                De normale werking van de dienst verstoren of proberen te
                omzeilen
              </li>
              <li>
                Geautomatiseerde middelen gebruiken om toegang te krijgen tot de
                dienst zonder onze toestemming
              </li>
              <li>De dienst reverse-engineeren of decompileren</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              8. Aansprakelijkheid en garanties
            </h2>
            <p>
              Onze dienst wordt geleverd "zoals deze is" en "zoals beschikbaar",
              zonder enige garanties, expliciet of impliciet. We garanderen niet
              dat:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>De dienst ononderbroken of foutloos zal zijn</li>
              <li>Fouten in de dienst zullen worden gecorrigeerd</li>
              <li>
                De gegenereerde ontwerpen aan uw specifieke behoeften of
                verwachtingen zullen voldoen
              </li>
            </ul>
            <p>
              Voor zover toegestaan door de wet, zijn wij niet aansprakelijk
              voor indirecte, incidentele, speciale, gevolgschade of punitieve
              schade, of voor verlies van winst of inkomsten, ongeacht de
              oorzaak, voortvloeiend uit of in verband met het gebruik van onze
              diensten.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              9. Schadeloosstelling
            </h2>
            <p>
              U stemt ermee in om ons te verdedigen, schadeloos te stellen en te
              vrijwaren tegen alle claims, verliezen, kosten en uitgaven
              (inclusief redelijke advocaatkosten) die voortvloeien uit:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Uw gebruik van onze diensten</li>
              <li>Uw schending van deze voorwaarden</li>
              <li>Uw schending van rechten van derden</li>
              <li>Uw gebruikersinhoud</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              10. Wijzigingen in de dienst en voorwaarden
            </h2>
            <p>We behouden ons het recht voor om:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                Onze diensten op elk moment te wijzigen, op te schorten of te
                beëindigen
              </li>
              <li>Deze gebruiksvoorwaarden op elk moment te wijzigen</li>
            </ul>
            <p>
              We zullen u op de hoogte stellen van belangrijke wijzigingen in
              deze voorwaarden. Uw voortgezette gebruik van onze diensten na
              dergelijke wijzigingen betekent dat u de bijgewerkte voorwaarden
              accepteert.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              11. Toepasselijk recht
            </h2>
            <p>
              Deze voorwaarden worden beheerst door en geïnterpreteerd in
              overeenstemming met de Nederlandse wetgeving, zonder rekening te
              houden met conflicterende wetsbepalingen.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">12. Contact</h2>
            <p>
              Als u vragen heeft over deze gebruiksvoorwaarden, neem dan contact
              met ons op via:
            </p>
            <p>E-mail: voorwaarden@interieurgpt.nl</p>
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
