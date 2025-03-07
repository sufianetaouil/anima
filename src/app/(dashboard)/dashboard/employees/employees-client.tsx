"use client";

import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

interface Employee {
  id: string;
  memberId: string;
  name: string;
  phone: string | null;
  position: string | null;
  status: string | null;
  jobType: string | null;
  createdAt: Date;
}

const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: "memberId",
    header: "Member ID",
    cell: ({ row }) => (
      <Link
        href={`/dashboard/employees/${row.original.id}`}
        className="text-blue-600 hover:underline"
      >
        {row.getValue("memberId")}
      </Link>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "position",
    header: "Position",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <span
          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
            status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {status || "inactive"}
        </span>
      );
    },
  },
  {
    accessorKey: "jobType",
    header: "Job Type",
  },
  {
    accessorKey: "createdAt",
    header: "Join Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return date.toLocaleDateString();
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <Link
          href={`/dashboard/employees/${row.original.id}`}
          className="text-blue-600 hover:underline"
        >
          Edit
        </Link>
        <button
          onClick={async () => {
            if (confirm("Are you sure you want to delete this employee?")) {
              const response = await fetch(`/api/employees/${row.original.id}`, {
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

interface EmployeesClientProps {
  employees: Employee[];
}

export function EmployeesClient({ employees }: EmployeesClientProps) {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-blue-900">Employees</h2>
        <Link
          href="/dashboard/employees/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Add Employee
        </Link>
      </div>
      <DataTable 
        columns={columns} 
        data={employees} 
        searchColumn="memberId"
        searchPlaceholder="Search by member ID, name, or phone..."
        searchableColumns={["memberId", "name", "phone"]}
      />
    </div>
  );
} 