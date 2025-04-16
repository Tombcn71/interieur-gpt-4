import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacybeleid - InterieurGPT",
  description:
    "Lees ons privacybeleid om te begrijpen hoe we uw gegevens verzamelen, gebruiken en beschermen.",
};

export default function PrivacyPage() {
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
          <h1 className="text-3xl font-bold mb-8">Privacybeleid</h1>
          <div className="prose prose-blue max-w-none">
            <p className="text-muted-foreground mb-6">
              Laatst bijgewerkt: 16 april 2025
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">1. Inleiding</h2>
            <p>
              Welkom bij InterieurGPT ("wij", "ons", "onze"). Wij respecteren uw
              privacy en zetten ons in om uw persoonlijke gegevens te
              beschermen. Dit privacybeleid legt uit hoe wij informatie
              verzamelen, gebruiken en beschermen wanneer u onze website en
              diensten gebruikt.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              2. Welke gegevens we verzamelen
            </h2>
            <p>
              We kunnen de volgende soorten persoonlijke gegevens verzamelen:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                <strong>Accountgegevens:</strong> Wanneer u zich registreert,
                verzamelen we uw naam, e-mailadres en profielafbeelding via
                Google OAuth.
              </li>
              <li>
                <strong>Gebruiksgegevens:</strong> Informatie over hoe u onze
                website gebruikt, inclusief de pagina's die u bezoekt en de
                functies die u gebruikt.
              </li>
              <li>
                <strong>Afbeeldingen en ontwerpen:</strong> De foto's die u
                uploadt van uw kamers en de AI-gegenereerde ontwerpen die worden
                gecreëerd.
              </li>
              <li>
                <strong>Betalingsinformatie:</strong> Wanneer u credits koopt,
                verwerkt onze betalingsverwerker (Stripe) uw betalingsgegevens.
                Wij slaan geen volledige creditcardgegevens op.
              </li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              3. Hoe we uw gegevens gebruiken
            </h2>
            <p>
              We gebruiken uw persoonlijke gegevens voor de volgende doeleinden:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                Om onze diensten aan u te leveren en uw account te beheren
              </li>
              <li>
                Om AI-gegenereerde interieurontwerpen te creëren op basis van uw
                geüploade afbeeldingen
              </li>
              <li>
                Om betalingen te verwerken en uw aankopen van credits bij te
                houden
              </li>
              <li>
                Om onze diensten te verbeteren en nieuwe functies te ontwikkelen
              </li>
              <li>
                Om technische problemen op te lossen en de veiligheid van onze
                website te waarborgen
              </li>
              <li>
                Om te communiceren over updates, aanbiedingen of wijzigingen in
                onze diensten
              </li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              4. AI-technologie en gegevensverwerking
            </h2>
            <p>
              InterieurGPT maakt gebruik van kunstmatige intelligentie om
              interieurontwerpen te genereren. Hiervoor:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                Worden uw geüploade afbeeldingen verwerkt door onze AI-modellen
              </li>
              <li>
                Kunnen we geanonimiseerde afbeeldingen gebruiken om onze
                AI-modellen te verbeteren
              </li>
              <li>
                Worden gegenereerde ontwerpen opgeslagen in uw account voor
                toekomstig gebruik
              </li>
            </ul>
            <p>
              We verkopen uw geüploade afbeeldingen niet aan derden en gebruiken
              ze alleen voor het doel waarvoor ze zijn geüpload.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              5. Gegevensopslag en beveiliging
            </h2>
            <p>
              We nemen de beveiliging van uw gegevens serieus en implementeren
              passende technische en organisatorische maatregelen om uw
              persoonlijke gegevens te beschermen tegen ongeautoriseerde
              toegang, verlies of diefstal.
            </p>
            <p>
              Uw gegevens worden opgeslagen op beveiligde servers en we
              gebruiken industriestandaard encryptie om gevoelige informatie te
              beschermen. We bewaren uw persoonlijke gegevens niet langer dan
              nodig is voor de doeleinden waarvoor ze zijn verzameld.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              6. Delen van gegevens
            </h2>
            <p>
              We delen uw persoonlijke gegevens alleen in de volgende
              omstandigheden:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                <strong>Serviceproviders:</strong> We werken samen met externe
                dienstverleners die ons helpen bij het leveren van onze diensten
                (zoals cloudopslag, betalingsverwerking en authenticatie).
              </li>
              <li>
                <strong>Wettelijke vereisten:</strong> Als we wettelijk
                verplicht zijn om informatie te delen of om onze rechten te
                beschermen.
              </li>
              <li>
                <strong>Met uw toestemming:</strong> Als u ons toestemming geeft
                om uw gegevens te delen.
              </li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              7. Cookies en tracking
            </h2>
            <p>
              We gebruiken cookies en vergelijkbare technologieën om uw ervaring
              op onze website te verbeteren, gebruikspatronen te analyseren en
              onze diensten te optimaliseren. U kunt uw browserinstellingen
              aanpassen om cookies te weigeren, maar dit kan de functionaliteit
              van onze website beïnvloeden.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">8. Uw rechten</h2>
            <p>
              Afhankelijk van uw locatie heeft u mogelijk bepaalde rechten met
              betrekking tot uw persoonlijke gegevens, waaronder:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                Het recht om te weten welke persoonlijke gegevens we over u
                hebben
              </li>
              <li>
                Het recht om uw persoonlijke gegevens te corrigeren of bij te
                werken
              </li>
              <li>
                Het recht om uw persoonlijke gegevens te laten verwijderen
              </li>
              <li>
                Het recht om bezwaar te maken tegen de verwerking van uw
                gegevens
              </li>
              <li>
                Het recht om uw gegevens in een overdraagbaar formaat te
                ontvangen
              </li>
            </ul>
            <p>
              Om een van deze rechten uit te oefenen, kunt u contact met ons
              opnemen via de contactgegevens onderaan dit beleid.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              9. Wijzigingen in dit privacybeleid
            </h2>
            <p>
              We kunnen dit privacybeleid van tijd tot tijd bijwerken. We zullen
              u op de hoogte stellen van belangrijke wijzigingen door een
              melding op onze website te plaatsen of u een e-mail te sturen. We
              raden u aan dit beleid regelmatig te controleren op updates.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">10. Contact</h2>
            <p>
              Als u vragen of zorgen heeft over ons privacybeleid of hoe we met
              uw persoonlijke gegevens omgaan, neem dan contact met ons op via:
            </p>
            <p>E-mail: privacy@interieurgpt.nl</p>
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
