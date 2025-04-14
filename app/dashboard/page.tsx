import { Button } from "@/components/ui/button";
import { DesignCard } from "@/components/design-card";
import Link from "next/link";
import { getUserDesigns, getUserById } from "@/lib/db";
import { Navbar } from "@/components/navbar";
import { Zap, ImageIcon, CreditCard } from "lucide-react";
import type { Design } from "@/types/design";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  // Get the session properly
  const session = await getServerSession(authOptions);

  // If no session, redirect to login
  if (!session) {
    redirect("/login");
  }

  // Get the user ID from the session
  const userId = String(session.user.id);

  // Get the latest user data from the database
  const user = await getUserById(userId);

  // Get the user's designs
  let designs: Design[] = [];
  try {
    designs = await getUserDesigns(userId);
  } catch (error) {
    console.error("Error fetching designs:", error);
    // Continue with an empty designs array
  }

  // Get the user's credits
  const credits = user?.credits || session.user.credits || 0;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">
                Beheer je interieurontwerpen
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 text-blue-600 rounded-full px-4 py-2 font-medium">
                Credits: {credits}
              </div>
              <Button asChild className="rounded-full">
                <Link href="/dashboard/nieuw">
                  <Zap className="mr-2 h-4 w-4" />
                  Nieuw ontwerp
                </Link>
              </Button>
            </div>
          </div>

          {/* Quick actions section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
              <h2 className="text-xl font-semibold mb-3 text-blue-700">
                Nieuw ontwerp maken
              </h2>
              <p className="text-blue-600 mb-4">
                Upload een foto van je kamer en transformeer het met AI.
              </p>
              <Button asChild className="w-full">
                <Link href="/dashboard/nieuw">
                  <Zap className="mr-2 h-4 w-4" />
                  Start nieuw ontwerp
                </Link>
              </Button>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <h2 className="text-xl font-semibold mb-3">
                Bekijk je ontwerpen
              </h2>
              <p className="text-muted-foreground mb-4">
                {designs.length > 0
                  ? `Je hebt ${designs.length} ontwerp${
                      designs.length !== 1 ? "en" : ""
                    }.`
                  : "Je hebt nog geen ontwerpen gemaakt."}
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href="#ontwerpen">
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Bekijk ontwerpen
                </Link>
              </Button>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <h2 className="text-xl font-semibold mb-3">Credits kopen</h2>
              <p className="text-muted-foreground mb-4">
                Koop credits om meer ontwerpen te maken.
              </p>
              <Button asChild className="w-full">
                <Link href="/dashboard/credits">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Koop credits
                </Link>
              </Button>
            </div>
          </div>

          {/* Designs section with clear heading */}
          <div id="ontwerpen" className="mt-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <ImageIcon className="mr-2 h-5 w-5" />
              Jouw ontwerpen
            </h2>

            {designs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50 rounded-xl border border-gray-100">
                <div className="rounded-full bg-blue-50 p-6 mb-4">
                  <svg
                    className="h-10 w-10 text-blue-500"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 7v6h-6" />
                    <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold mb-2">
                  Geen ontwerpen gevonden
                </h2>
                <p className="text-muted-foreground max-w-[500px] mb-4">
                  Je hebt nog geen interieurontwerpen gemaakt. Begin met het
                  maken van je eerste ontwerp.
                </p>
                <Button asChild className="rounded-full">
                  <Link href="/dashboard/nieuw">
                    <Zap className="mr-2 h-4 w-4" />
                    Maak je eerste ontwerp
                  </Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {designs.map((design) => (
                    <DesignCard key={design.id} design={design} />
                  ))}
                </div>

                {/* Clear navigation to create new design */}
                <div className="mt-8 text-center">
                  <Button asChild className="rounded-full">
                    <Link href="/dashboard/nieuw">
                      <Zap className="mr-2 h-4 w-4" />
                      Maak nog een ontwerp
                    </Link>
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
