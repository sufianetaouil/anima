import { prisma } from "@/lib/prisma";
import { DashboardClient } from "./client";

export default async function DashboardPage() {
  const [employersCount, employeesCount, jobsCount, refundsCount] = await Promise.all([
    prisma.employer.count(),
    prisma.employee.count(),
    prisma.job.count(),
    prisma.refund.count(),
  ]);

  return (
    <DashboardClient 
      stats={{
        employersCount,
        employeesCount,
        jobsCount,
        refundsCount
      }}
    />
  );
} 