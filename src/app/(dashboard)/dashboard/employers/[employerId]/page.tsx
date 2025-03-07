import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { EmployerForm } from "@/components/forms/employer-form";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Edit Employer - Naima Employment Agency",
  description: "Edit employer details",
};

export default async function EditEmployerPage({
  params,
}: {
  params: { employerId: string };
}) {
  const employer = await prisma.employer.findUnique({
    where: {
      id: params.employerId,
    },
  });

  if (!employer) {
    notFound();
  }

  return (
    <div>
      <h2 className="mb-8 text-2xl font-bold">Edit Employer</h2>
      <EmployerForm mode="edit" employer={employer} />
    </div>
  );
} 