import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { getDesignById } from "@/lib/db"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { AuthCheck } from "@/components/auth-check"

export default async function DesignDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return <AuthCheck>{null}</AuthCheck>
  }

  const design = await getDesignById(params.id)

  if (!design || design.user_id !== Number.parseInt(session.user.id)) {
    redirect("/dashboard")
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container max-w-5xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold capitalize">
                {design.room_type} - {design.style}
              </h1>
              <p className="text-muted-foreground">Gemaakt op {formatDate(design.created_at)}</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/dashboard">Terug naar dashboard</Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-0">
                <div className="relative aspect-square">
                  <img
                    src={design.original_image_url || "/placeholder.svg"}
                    alt="Originele afbeelding"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm p-4">
                    <h3 className="font-medium">Originele afbeelding</h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-0">
                <div className="relative aspect-square">
                  {design.result_image_url ? (
                    <img
                      src={design.result_image_url || "/placeholder.svg"}
                      alt="Gegenereerd ontwerp"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <div className="text-center p-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Ontwerp wordt gegenereerd...</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm p-4">
                    <h3 className="font-medium">Gegenereerd ontwerp</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-2">Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foregroun">Kamertype</p>
                    <p className="font-medium capitalize">{design.room_type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Stijl</p>
                    <p className="font-medium capitalize">{design.style}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-medium capitalize">
                      {design.status === "completed" ? "Voltooid" : "In behandeling"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Prompt</p>
                    <p className="font-medium">{design.prompt}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
