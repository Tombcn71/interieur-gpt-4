import { Button } from "@/components/ui/button";
import { DesignCard } from "@/components/design-card";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getUserDesigns, getUserById, fixNegativeCredits } from "@/lib/db";
import { AuthCheck } from "@/components/auth-check";
import { Navbar } from "@/components/navbar";
import { Zap } from "lucide-react";
import type { Design } from "@/types/design";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <AuthCheck>{null}</AuthCheck>;
  }

  const userId = String(session.user.id);

  // Automatically fix negative credits server-side
  let credits = session.user.credits;
  if (credits < 0) {
    console.log(
      `Automatically fixing negative credits (${credits}) for user ${userId}`
    );
    const user = await getUserById(userId);
    if (user?.credits < 0) {
      const updatedUser = await fixNegativeCredits(userId);
      credits = updatedUser?.credits || 0;
      console.log(`Credits fixed to ${credits} for user ${userId}`);
    } else {
      credits = user?.credits || 0;
    }
  }

  const designs: Design[] = await getUserDesigns(session.user.id);

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

          {designs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
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
                Je hebt nog geen interieurontwerpen gemaakt. Begin met het maken
                van je eerste ontwerp.
              </p>
              <Button asChild className="rounded-full">
                <Link href="/dashboard/nieuw">
                  <Zap className="mr-2 h-4 w-4" />
                  Maak je eerste ontwerp
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {designs.map((design) => (
                <Link key={design.id} href={`/dashboard/ontwerp/${design.id}`}>
                  <DesignCard design={design} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
