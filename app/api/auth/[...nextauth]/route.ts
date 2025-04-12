import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Create a handler function
const handler = NextAuth(authOptions);

// Export the handler for both GET and POST requests
export { handler as GET, handler as POST };
