import type { AuthOptions } from "next-auth";
import { createUser, getUserByEmail } from "@/lib/db";

// Use AuthOptions instead of NextAuthOptions
export const authOptions: AuthOptions = {
  providers: [
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
        };
      },
    },
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
          // Make sure email is not null or undefined
          if (!user.email) {
            console.error("User email is missing");
            token.id = "temp-" + Math.random().toString(36).substring(2, 9);
            token.credits = 1;
            return token;
          }

          const dbUser = await getUserByEmail(user.email);

          if (!dbUser) {
            try {
              // Ensure we handle null values properly
              const userName = user.name || "Gebruiker";
              // Convert null image to undefined to match function signature
              const userImage = user.image || undefined;

              const newUser = await createUser(user.email, userName, userImage);

              // Ensure ID is a string and log it
              token.id = String(newUser.id);
              token.credits = newUser.credits;
              console.log("Created new user with ID:", token.id);
            } catch (error) {
              console.error("Error creating user in JWT callback:", error);
              token.id = "temp-" + Math.random().toString(36).substring(2, 9);
              token.credits = 1;
            }
          } else {
            // Ensure ID is a string and log it
            token.id = String(dbUser.id);
            token.credits = dbUser.credits;
            console.log("Found existing user with ID:", token.id);
          }
        } catch (error) {
          console.error("Error in JWT callback:", error);
          token.id = "temp-" + Math.random().toString(36).substring(2, 9);
          token.credits = 1;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        // Add custom properties to the session.user object
        session.user.id = String(token.id);
        session.user.credits = (token.credits as number) || 1;

        // Log the session user ID for debugging
        console.log("Session user ID:", session.user.id);
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
};
