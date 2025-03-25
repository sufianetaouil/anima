import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { EmployeeForm } from "@/components/forms/employee-form";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Edit Employee - Naima Employment Agency",
  description: "Edit employee details",
};

type Params = Promise<{ employeeId: string }>;

export default async function EditEmployeePage({
  params,
}: {
  params: Params;
}) {
  const resolvedParams = await params;
  const employee = await prisma.employee.findUnique({
    where: {
      id: resolvedParams.employeeId,
    },
  });

  if (!employee) {
    notFound();
  }

  return (
    <div>
      <h2 className="mb-8 text-2xl font-bold">Edit Employee</h2>
      <EmployeeForm mode="edit" employee={employee} />
    </div>
  );
} 