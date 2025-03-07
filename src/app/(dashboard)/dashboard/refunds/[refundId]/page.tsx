import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { RefundForm } from "@/components/forms/refund-form";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Edit Refund - Naima Employment Agency",
  description: "Edit refund details",
};

export default async function EditRefundPage({
  params,
}: {
  params: { refundId: string };
}) {
  const [refundData, employees] = await Promise.all([
    prisma.refund.findUnique({
      where: {
        id: params.refundId,
      },
    }),
    prisma.employee.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  if (!refundData) {
    notFound();
  }

  // Transform employee data to match the expected format
  const formattedEmployees = employees.map(employee => ({
    id: employee.id,
    firstName: employee.name.split(" ")[0] || "",
    lastName: employee.name.split(" ").slice(1).join(" ") || "",
  }));

  // Convert Decimal values to numbers
  const refund = {
    ...refundData,
    paidBefore: refundData.paidBefore ? Number(refundData.paidBefore) : null,
    hoursWorking: refundData.hoursWorking ? Number(refundData.hoursWorking) : null,
    salaryPerHour: refundData.salaryPerHour ? Number(refundData.salaryPerHour) : null,
    commissionRate: refundData.commissionRate ? Number(refundData.commissionRate) : null,
    lastBalance: refundData.lastBalance ? Number(refundData.lastBalance) : null,
  };

  return (
    <div>
      <h2 className="mb-8 text-2xl font-bold">Edit Refund</h2>
      <RefundForm mode="edit" refund={refund} employees={formattedEmployees} />
    </div>
  );
} 