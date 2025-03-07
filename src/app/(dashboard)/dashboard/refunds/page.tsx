import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { RefundsClient } from "./refunds-client";

export const metadata: Metadata = {
  title: "Refunds - Naima Employment Agency",
  description: "Manage refunds",
};

export default async function RefundsPage() {
  const refundsData = await prisma.refund.findMany({
    select: {
      id: true,
      employee: {
        select: {
          memberId: true,
          name: true,
        },
      },
      refundDate: true,
      refundAgent: true,
      paidBefore: true,
      hoursWorking: true,
      salaryPerHour: true,
      commissionRate: true,
      lastBalance: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Convert Decimal values to numbers
  const refunds = refundsData.map(refund => ({
    ...refund,
    paidBefore: refund.paidBefore ? Number(refund.paidBefore) : null,
    hoursWorking: refund.hoursWorking ? Number(refund.hoursWorking) : null,
    salaryPerHour: refund.salaryPerHour ? Number(refund.salaryPerHour) : null,
    commissionRate: refund.commissionRate ? Number(refund.commissionRate) : null,
    lastBalance: refund.lastBalance ? Number(refund.lastBalance) : null,
  }));

  return <RefundsClient refunds={refunds} />;
} 