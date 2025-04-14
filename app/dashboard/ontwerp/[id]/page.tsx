import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getDesignById } from "@/lib/db";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { AuthCheck } from "@/components/auth-check";
import { ArrowLeft, Zap, Home, Download } from "lucide-react";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";

export default async function DesignDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <AuthCheck>{null}</AuthCheck>;
  }

  const design = await getDesignById(params.id);

  if (!design) {
    console.log(`Design ${params.id} not found`);
    redirect("/dashboard");
  }

  if (design.user_id !== Number.parseInt(session.user.id)) {
    console.log(
      `User ${session.user.id} does not own design ${params.id} (owned by ${design.user_id})`
    );
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container max-w-5xl">
          {/* Breadcrumb navigation */}
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <Link
              href="/dashboard"
              className="hover:text-foreground flex items-center">
              <Home className="h-3.5 w-3.5 mr-1" />
              Dashboard
            </Link>
            <span className="mx-2">/</span>
            <span>Ontwerp details</span>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold capitalize">
                {design.room_type} - {design.style}
              </h1>
              <p className="text-muted-foreground">
                Gemaakt op {formatDate(design.created_at)}
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" asChild className="flex items-center">
                <Link href="/dashboard">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Terug naar dashboard
                </Link>
              </Button>
              <Button asChild>
                <Link href="/dashboard/nieuw">
                  <Zap className="mr-2 h-4 w-4" />
                  Nieuw ontwerp
                </Link>
              </Button>
            </div>
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
                        <p className="text-muted-foreground">
                          Ontwerp wordt gegenereerd...
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm p-4 flex justify-between items-center">
                    <h3 className="font-medium">Gegenereerd ontwerp</h3>
                    {design.result_image_url && (
                      <a
                        href={design.result_image_url}
                        download={`interieurGPT-${design.room_type}-${design.style}.jpg`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </a>
                    )}
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
                      {design.status === "completed"
                        ? "Voltooid"
                        : "In behandeling"}
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

          {/* Clear navigation options */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex gap-3">
              <Button variant="outline" asChild className="flex-1 sm:flex-none">
                <Link href="/dashboard">
                  <Home className="mr-2 h-4 w-4" />
                  Terug naar dashboard
                </Link>
              </Button>
              <Button asChild className="flex-1 sm:flex-none">
                <Link href="/dashboard/nieuw">
                  <Zap className="mr-2 h-4 w-4" />
                  Maak nog een ontwerp
                </Link>
              </Button>
            </div>
            <div className="flex gap-3 mt-4 sm:mt-0">
              {design.result_image_url && (
                <Button
                  variant="outline"
                  asChild
                  className="flex-1 sm:flex-none">
                  <a
                    href={design.result_image_url}
                    download={`interieurGPT-${design.room_type}-${design.style}.jpg`}
                    target="_blank"
                    rel="noopener noreferrer">
                    <Download className="mr-2 h-4 w-4" />
                    Download ontwerp
                  </a>
                </Button>
              )}
              <DeleteConfirmationDialog
                designId={design.id}
                designName={`${design.room_type} - ${design.style}`}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
