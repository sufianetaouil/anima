"use client";

import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

interface Job {
  id: string;
  employer: {
    businessName: string;
  };
  daysNumber: number | null;
  daysPerWeek: number | null;
  hoursNumber: number | null;
  pricePerHour: number | null;
  tips: boolean | null;
  paymentMethod: string | null;
  jobType: string | null;
  language: string | null;
  jobStatus: string | null;
  jobTime: string | null;
  status: string | null;
  jobDate: Date | null;
  description: string | null;
  requirements: string | null;
  benefits: string | null;
  location: string | null;
  createdAt: Date;
}

const columns: ColumnDef<Job>[] = [
  {
    accessorKey: "employer.businessName",
    header: "Employer",
    cell: ({ row }) => (
      <Link
        href={`/dashboard/jobs/${row.original.id}`}
        className="text-blue-600 hover:underline"
      >
        {row.original.employer.businessName}
      </Link>
    ),
  },
  {
    accessorKey: "jobType",
    header: "Type",
    cell: ({ row }) => {
      const jobType = row.getValue("jobType") as string;
      return jobType === "full" ? "Full Time" : "Part Time";
    },
  },
  {
    accessorKey: "jobTime",
    header: "Time",
    cell: ({ row }) => {
      const jobTime = row.getValue("jobTime") as string;
      return jobTime === "day" ? "Day" : "Night";
    },
  },
  {
    accessorKey: "hoursNumber",
    header: "Hours/Day",
  },
  {
    accessorKey: "daysPerWeek",
    header: "Days/Week",
  },
  {
    accessorKey: "pricePerHour",
    header: "Rate/Hour",
    cell: ({ row }) => {
      const price = row.getValue("pricePerHour") as number | null;
      return price ? `$${Number(price).toFixed(2)}` : "-";
    },
  },
  {
    accessorKey: "jobStatus",
    header: "Job Status",
    cell: ({ row }) => {
      const status = row.getValue("jobStatus") as string;
      return (
        <span
          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
            status === "permanent"
              ? "bg-blue-100 text-blue-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {status || "N/A"}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <span
          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
            status === "available"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {status || "closed"}
        </span>
      );
    },
  },
  {
    accessorKey: "jobDate",
    header: "Start Date",
    cell: ({ row }) => {
      const date = row.getValue("jobDate") as Date;
      return date ? new Date(date).toLocaleDateString() : "Not set";
    },
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <Link
          href={`/dashboard/jobs/${row.original.id}`}
          className="text-blue-600 hover:underline"
        >
          Edit
        </Link>
        <button
          onClick={async () => {
            if (confirm("Are you sure you want to delete this job?")) {
              const response = await fetch(`/api/jobs/${row.original.id}`, {
                method: "DELETE",
              });
              if (response.ok) {
                window.location.reload();
              }
            }
          }}
          className="text-red-600 hover:underline"
        >
          Delete
        </button>
      </div>
    ),
  },
];

interface JobsClientProps {
  jobs: Job[];
}

export function JobsClient({ jobs }: JobsClientProps) {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-blue-900">Jobs</h2>
        <Link
          href="/dashboard/jobs/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Add Job
        </Link>
      </div>
      <DataTable columns={columns} data={jobs} searchColumn="employer.businessName" />
    </div>
  );
} 
