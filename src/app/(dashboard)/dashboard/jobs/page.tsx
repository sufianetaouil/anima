import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { JobsClient } from "./jobs-client";

export const metadata: Metadata = {
  title: "Jobs - Naima Employment Agency",
  description: "Manage jobs",
};

export default async function JobsPage() {
  const jobs = await prisma.job.findMany({
    select: {
      id: true,
      employer: {
        select: {
          businessName: true,
        },
      },
      daysNumber: true,
      daysPerWeek: true,
      hoursNumber: true,
      pricePerHour: true,
      tips: true,
      paymentMethod: true,
      jobType: true,
      language: true,
      jobStatus: true,
      jobTime: true,
      status: true,
      jobDate: true,
      description: true,
      requirements: true,
      benefits: true,
      location: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Convert Decimal to number for pricePerHour
  const formattedJobs = jobs.map(job => ({
    ...job,
    pricePerHour: job.pricePerHour ? Number(job.pricePerHour) : null,
  }));

  return <JobsClient jobs={formattedJobs} />;
} 
