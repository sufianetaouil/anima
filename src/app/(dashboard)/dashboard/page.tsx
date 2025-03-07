import { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Dashboard - Naima Employment Agency",
  description: "Overview of your employment agency",
};

export default async function DashboardPage() {
  const [employersCount, employeesCount, jobsCount, refundsCount] = await Promise.all([
    prisma.employer.count(),
    prisma.employee.count(),
    prisma.job.count(),
    prisma.refund.count(),
  ]);

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-lg font-medium text-gray-900">Total Employers</h3>
          <p className="mt-2 text-3xl font-bold text-indigo-600">{employersCount}</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-lg font-medium text-gray-900">Total Employees</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">{employeesCount}</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-lg font-medium text-gray-900">Active Jobs</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">{jobsCount}</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-lg font-medium text-gray-900">Total Refunds</h3>
          <p className="mt-2 text-3xl font-bold text-yellow-600">{refundsCount}</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold">Recent Activity</h2>
        <p className="mt-2 text-gray-600">
          This section will show recent changes and updates across the system.
        </p>
      </div>
    </div>
  );
} 