import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { EmployeeForm } from "@/components/forms/employee-form";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Edit Employee - Naima Employment Agency",
  description: "Edit employee details",
};

export default async function EditEmployeePage({
  params,
}: {
  params: { employeeId: string };
}) {
  const employee = await prisma.employee.findUnique({
    where: {
      id: params.employeeId,
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