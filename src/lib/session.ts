import { getServerSession as getNextAuthServerSession } from "next-auth/next";
import { authOptions } from "./auth-options";
import type { Session } from "next-auth";

/**
 * A wrapper around getServerSession that handles type issues
 * This is the recommended way to get the session in Next.js 15
 */
export async function getServerSession(): Promise<Session | null> {
  // @ts-expect-error - TypeScript has issues with the types but this works at runtime
  const session = await getNextAuthServerSession(authOptions);
  // Use a more explicit type assertion to resolve compatibility issues
  return session as unknown as Session | null;
}

/**
 * A helper function to get the session in a type-safe way
 */
export async function getTypedSession(): Promise<Session> {
  const session = await getServerSession();
  if (!session) {
    throw new Error("No session found");
  }
  return session;
} 