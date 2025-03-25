import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { UsersClient } from "./users-client";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
export const metadata: Metadata = {
  title: "Users - Naima Employment Agency",
  description: "Manage users",
};

export default async function UsersPage() {
  const session = await getSession();

  if (!session || !session.user?.email) {
    redirect("/auth/signin");
  }

  // Check if the current user is an admin
  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { isAdmin: true },
  });

  if (!currentUser?.isAdmin) {
    redirect("/dashboard");
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      isAdmin: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <UsersClient users={users} />;
} 