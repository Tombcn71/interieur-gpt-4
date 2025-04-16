import { Navbar } from "@/components/navbar";
import { ScreenshotUploader } from "@/components/screenshot-uploader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function PressKitAdminPage() {
  // Check if user is logged in
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // In a real app, you would check if the user is an admin
  // For now, we'll just allow any logged-in user

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container max-w-5xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Perskit Beheer</h1>
            <p className="text-muted-foreground">
              Beheer de inhoud van de perskit, zoals screenshots, logo's en
              persberichten.
            </p>
          </div>

          <Tabs defaultValue="screenshots" className="space-y-6">
            <TabsList>
              <TabsTrigger value="screenshots">Screenshots</TabsTrigger>
              <TabsTrigger value="logos">Logo's</TabsTrigger>
              <TabsTrigger value="press-releases">Persberichten</TabsTrigger>
            </TabsList>

            <TabsContent value="screenshots" className="space-y-6">
              <ScreenshotUploader />

              <Card>
                <CardHeader>
                  <CardTitle>Bestaande Screenshots</CardTitle>
                  <CardDescription>
                    Bekijk en beheer de bestaande screenshots in de perskit.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Hier komt een overzicht van de bestaande screenshots. Dit is
                    nog niet geïmplementeerd.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="logos">
              <Card>
                <CardHeader>
                  <CardTitle>Logo's Beheer</CardTitle>
                  <CardDescription>
                    Upload en beheer de logo's voor de perskit.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Hier komt de functionaliteit voor het beheren van logo's.
                    Dit is nog niet geïmplementeerd.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="press-releases">
              <Card>
                <CardHeader>
                  <CardTitle>Persberichten Beheer</CardTitle>
                  <CardDescription>
                    Upload en beheer de persberichten voor de perskit.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Hier komt de functionaliteit voor het beheren van
                    persberichten. Dit is nog niet geïmplementeerd.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
