import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { UserForm } from "@/components/forms/user-form";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Edit User - Naima Employment Agency",
  description: "Edit user details",
};

export default async function EditUserPage({
  params,
}: {
  params: { userId: string };
}) {
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

  const user = await prisma.user.findUnique({
    where: {
      id: params.userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      isAdmin: true,
      createdAt: true,
    },
  });

  if (!user) {
    notFound();
  }

  return (
    <div>
      <h2 className="mb-8 text-2xl font-bold">Edit User</h2>
      <UserForm mode="edit" user={user} />
    </div>
  );
} 