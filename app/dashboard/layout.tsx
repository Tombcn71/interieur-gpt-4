import type React from "react";
import { ClientAuthCheck } from "@/components/client-auth-check";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientAuthCheck>{children}</ClientAuthCheck>;
}
