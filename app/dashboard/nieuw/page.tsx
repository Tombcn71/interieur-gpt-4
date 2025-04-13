import { Navbar } from "@/components/navbar";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { NewDesignForm } from "./new-design-form";
import { AuthCheck } from "@/components/auth-check";
import { getUserById } from "@/lib/db";

export default async function NewDesignPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <AuthCheck>{null}</AuthCheck>;
  }

  // Get the latest user data from the database
  const userId = String(session.user.id);
  const user = await getUserById(userId);

  // Use database credits if available, otherwise fall back to session
  const credits = user ? user.credits : session.user.credits;

  // Only redirect if credits are definitely 0 or negative
  if (credits <= 0) {
    redirect("/dashboard/credits");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Nieuw ontwerp</h1>
            <p className="text-muted-foreground">
              Maak een nieuw interieurontwerp
            </p>
          </div>
          <NewDesignForm credits={credits} />
        </div>
      </main>
    </div>
  );
}
