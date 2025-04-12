"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

interface HomeHeaderProps {
  isLoggedIn: boolean
}

export function HomeHeader({ isLoggedIn }: HomeHeaderProps) {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold text-2xl text-blue-500">interieurGPT</span>
        </Link>
        <Button asChild className="rounded-full">
          <Link href={isLoggedIn ? "/dashboard" : "/login"}>{isLoggedIn ? "Dashboard" : "Login"}</Link>
        </Button>
      </div>
    </header>
  )
}
