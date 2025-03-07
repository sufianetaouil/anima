import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { JobForm } from "@/components/forms/job-form";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Edit Job - Naima Employment Agency",
  description: "Edit job details",
};

export default async function EditJobPage({
  params,
}: {
  params: { jobId: string };
}) {
  const jobData = await prisma.job.findUnique({
    where: {
      id: params.jobId,
    },
  });

  if (!jobData) {
    notFound();
  }

  // Convert Decimal to number for pricePerHour
  const job = {
    ...jobData,
    pricePerHour: jobData.pricePerHour ? Number(jobData.pricePerHour) : null,
  };

  return (
    <div>
      <h2 className="mb-8 text-2xl font-bold">Edit Job</h2>
      <JobForm mode="edit" job={job} />
    </div>
  );
} 
