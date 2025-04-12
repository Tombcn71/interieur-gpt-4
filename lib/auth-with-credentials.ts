import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { createUser, getUserByEmail } from "@/lib/db"

export const authOptionsWithCredentials: NextAuthOptions = {
  providers: [
    // Define the Google provider directly without importing
    {
      id: "google",
      name: "Google",
      type: "oauth",
      wellKnown: "https://accounts.google.com/.well-known/openid-configuration",
      authorization: { params: { scope: "openid email profile" } },
      idToken: true,
      checks: ["pkce", "state"],
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        }
      },
    },
    // Add a credentials provider for development
    CredentialsProvider({
      name: "Development Login",
      credentials: {
        email: { label: "Email", type: "email" },
        name: { label: "Name", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.name) {
          return null
        }

        // For development, just return a user object
        return {
          id: "dev-user",
          name: credentials.name,
          email: credentials.email,
          image: null,
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user, account }) {
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
              token.id = "temp-" + Math.random().toString(36).substring(2, 9)
              token.credits = 1
            }
          } else {
            token.id = dbUser.id
            token.credits = dbUser.credits
          }
        } catch (error) {
          console.error("Error in JWT callback:", error)
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
