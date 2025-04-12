import "next-auth";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    // Extend the built-in session type
    user: {
      // Add custom user properties
      id: string;
      credits: number;
    } & DefaultSession["user"]; // Include all default user properties
    // Include all default session properties
    expires: string;
  }
}
