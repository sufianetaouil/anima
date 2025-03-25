import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth-options";
import type { Session } from "next-auth";

/**
 * Returns the session for the current request
 * Uses type assertion to bypass TypeScript type checking issues
 */
export async function auth() {
  // @ts-expect-error - This works in practice but TypeScript has issues with the types
  return getServerSession(authOptions);
}

/**
 * Helper function to get the server session with type assertion
 * This can be used in place of direct getServerSession calls
 */
export async function getSession() {
  // @ts-expect-error - This works in practice but TypeScript has issues with the types
  return getServerSession(authOptions) as Session;
}

// Re-export authOptions for backward compatibility
export { authOptions }; 