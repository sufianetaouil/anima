import { Metadata } from "next";
import { RefundForm } from "@/components/forms/refund-form";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "New Refund - Naima Employment Agency",
  description: "Create a new refund",
};

export default async function NewRefundPage() {
  const employees = await prisma.employee.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  // Transform employee data to match the expected format
  const formattedEmployees = employees.map(employee => ({
    id: employee.id,
    firstName: employee.name.split(" ")[0] || "",
    lastName: employee.name.split(" ").slice(1).join(" ") || "",
  }));

  return (
    <div>
      <h2 className="mb-8 text-2xl font-bold">New Refund</h2>
      <RefundForm mode="create" employees={formattedEmployees} />
    </div>
  );
} 