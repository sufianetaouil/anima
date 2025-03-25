import NextAuth from "next-auth/next";
import { authOptions } from "@/lib/auth-options";

// @ts-expect-error - Type incompatibility with NextAuth but works at runtime
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 