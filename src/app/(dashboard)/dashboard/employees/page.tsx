import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { EmployeesClient } from "./employees-client";

export const metadata: Metadata = {
  title: "Employees - Naima Employment Agency",
  description: "Manage employees",
};

export default async function EmployeesPage() {
  const employees = await prisma.employee.findMany({
    select: {
      id: true,
      memberId: true,
      name: true,
      phone: true,
      position: true,
      status: true,
      jobType: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <EmployeesClient employees={employees} />;
} 