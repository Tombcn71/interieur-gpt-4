import type { NextAuthOptions } from "next-auth"
import { createUser, getUserByEmail } from "@/lib/db"

// Generate a default secret if none is provided
const generateSecret = () => {
  return Array.from({ length: 32 }, () => Math.floor(Math.random() * 36).toString(36)).join("")
}

// Import the Google provider dynamically
let GoogleProvider: any
try {
  GoogleProvider = require("next-auth/providers/google").default
} catch (error) {
  console.error("Error importing Google provider:", error)
  GoogleProvider = null
}

export const authOptions: NextAuthOptions = {
  providers: [
    // Only add Google provider if it was successfully imported
    ...(GoogleProvider
      ? [
          {
            ...GoogleProvider({
              clientId: process.env.GOOGLE_CLIENT_ID || "",
              clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
            }),
          },
        ]
      : []),
  ],
  secret: process.env.NEXTAUTH_SECRET || generateSecret(),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login", // Add error page redirection
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        try {
          const dbUser = await getUserByEmail(user.email!)

          if (!dbUser) {
            try {
              const newUser = await createUser(user.email!, user.name || "Gebruiker", user.image)
              token.id = newUser.id
              token.credits = newUser.credits
            } catch (error) {
              console.error("Error creating user in JWT callback:", error)
              // Provide default values if database operations fail
              token.id = "temp-" + Math.random().toString(36).substring(2, 9)
              token.credits = 1
            }
          } else {
            token.id = dbUser.id
            token.credits = dbUser.credits
          }
        } catch (error) {
          console.error("Error in JWT callback:", error)
          // Provide default values if database operations fail
          token.id = "temp-" + Math.random().toString(36).substring(2, 9)
          token.credits = 1
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.credits = (token.credits as number) || 1
      }
      return session
    },
  },
  debug: process.env.NODE_ENV === "development",
}
