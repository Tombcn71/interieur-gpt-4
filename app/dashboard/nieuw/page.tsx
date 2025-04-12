import { Navbar } from "@/components/navbar"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { NewDesignForm } from "./new-design-form"
import { AuthCheck } from "@/components/auth-check"

export default async function NewDesignPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return <AuthCheck>{null}</AuthCheck>
  }

  if (session.user.credits < 1) {
    redirect("/dashboard/credits")
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Nieuw ontwerp</h1>
            <p className="text-muted-foreground">Maak een nieuw interieurontwerp</p>
          </div>
          <NewDesignForm credits={session.user.credits} />
        </div>
      </main>
    </div>
  )
}
