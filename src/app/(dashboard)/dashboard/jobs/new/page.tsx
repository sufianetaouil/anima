import { Metadata } from "next";
import { JobForm } from "@/components/forms/job-form";

export const metadata: Metadata = {
  title: "New Job - Naima Employment Agency",
  description: "Create a new job",
};

export default function NewJobPage() {
  return (
    <div>
      <h2 className="mb-8 text-2xl font-bold">New Job</h2>
      <JobForm mode="create" />
    </div>
  );
} 