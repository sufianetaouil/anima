import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { UserForm } from "@/components/forms/user-form";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Edit User - Naima Employment Agency",
  description: "Edit user details",
};

type Params = Promise<{ userId: string }>;

export default async function EditUserPage({
  params,
}: {
  params: Params;
}) {
  const session = await getSession();
  const resolvedParams = await params;

  if (!session?.user?.email) {
    redirect("/login");
  }

  // Check if the current user is an admin
  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { isAdmin: true },
  });

  if (!currentUser?.isAdmin) {
    redirect("/dashboard");
  }

  const userData = await prisma.user.findUnique({
    where: {
      id: resolvedParams.userId,
    },
  });

  if (!userData) {
    notFound();
  }

  return (
    <div>
      <h2 className="mb-8 text-2xl font-bold">Edit User</h2>
      <UserForm mode="edit" user={userData} />
    </div>
  );
} 