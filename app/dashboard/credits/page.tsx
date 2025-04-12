import { Navbar } from "@/components/navbar"
import { PricingSection } from "@/components/pricing-section"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { AuthCheck } from "@/components/auth-check"

export default async function CreditsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return <AuthCheck>{null}</AuthCheck>
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-2">Credits kopen</h1>
            <p className="text-muted-foreground max-w-[600px] mx-auto">
              Je hebt momenteel <span className="font-medium">{session.user.credits}</span> credits. Koop meer credits
              om meer interieurontwerpen te maken.
            </p>
          </div>
          <PricingSection />
        </div>
      </main>
    </div>
  )
}
