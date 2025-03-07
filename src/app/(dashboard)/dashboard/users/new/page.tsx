import { Metadata } from "next";
import { UserForm } from "@/components/forms/user-form";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "New User - Naima Employment Agency",
  description: "Create a new user",
};

export default async function NewUserPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
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

  return (
    <div>
      <h2 className="mb-8 text-2xl font-bold">New User</h2>
      <UserForm mode="create" />
    </div>
  );
} 