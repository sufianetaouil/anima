import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { RefundForm } from "@/components/forms/refund-form";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Edit Refund - Naima Employment Agency",
  description: "Edit refund details",
};

type Params = Promise<{ refundId: string }>;

export default async function EditRefundPage({
  params,
}: {
  params: Params;
}) {
  const resolvedParams = await params;
  const refundData = await prisma.refund.findUnique({
    where: {
      id: resolvedParams.refundId,
    },
  });

  if (!refundData) {
    notFound();
  }

  // Convert decimal values to numbers for the form
  const refund = {
    ...refundData,
    paidBefore: refundData.paidBefore !== null ? Number(refundData.paidBefore) : null,
    hoursWorking: refundData.hoursWorking !== null ? Number(refundData.hoursWorking) : null,
    salaryPerHour: refundData.salaryPerHour !== null ? Number(refundData.salaryPerHour) : null,
    commissionRate: refundData.commissionRate !== null ? Number(refundData.commissionRate) : null,
    lastBalance: refundData.lastBalance !== null ? Number(refundData.lastBalance) : null,
  };

  return (
    <div>
      <h2 className="mb-8 text-2xl font-bold">Edit Refund</h2>
      <RefundForm
        mode="edit"
        refund={refund}
      />
    </div>
  );
} 