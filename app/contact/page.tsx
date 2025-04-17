"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Footer } from "@/components/footer";
import { useToast } from "@/hooks/use-toast";

export default function ContactPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(event: { preventDefault: () => void }) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();

      // Add form fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      // Add access key
      formDataToSend.append(
        "access_key",
        "0cf2ce0d-ca4a-48bd-a129-5379969be0ae"
      );

      // Convert to JSON
      const object = Object.fromEntries(formDataToSend);
      const json = JSON.stringify(object);

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: json,
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Bericht verzonden",
          description:
            "Bedankt voor je bericht. We nemen zo snel mogelijk contact met je op.",
        });
        // Reset form
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        throw new Error(result.message || "Er is iets misgegaan");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Er is iets misgegaan bij het verzenden van je bericht. Probeer het later opnieuw.";

      toast({
        title: "Fout bij verzenden",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

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
        <div className="container max-w-5xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h1 className="text-3xl font-bold mb-4">Contact</h1>
              <p className="text-muted-foreground mb-6">
                Heeft u vragen, feedback of heeft u hulp nodig? Neem contact met
                ons op en we zullen zo snel mogelijk reageren.
              </p>

              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2">E-mail</h2>
                  <p className="text-blue-600">info@interieurgpt.nl</p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-2">Klantenservice</h2>
                  <p>Beschikbaar op werkdagen van 9:00 tot 17:00</p>
                </div>
              </div>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Stuur ons een bericht</CardTitle>
                  <CardDescription>
                    Vul het formulier in en we nemen zo snel mogelijk contact
                    met u op.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Naam</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Uw naam"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="uw@email.nl"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Onderwerp</Label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="Onderwerp van uw bericht"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Bericht</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Typ uw bericht hier..."
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}>
                      {isSubmitting ? "Verzenden..." : "Verstuur bericht"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
