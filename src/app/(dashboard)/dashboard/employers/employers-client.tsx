"use client";

import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

interface Employer {
  id: string;
  businessName: string;
  phone: string | null;
  rawPhone?: string | null;
  contactName: string | null;
  state: string | null;
  createdAt: Date;
}

const stripPhoneFormatting = (phone: string | null): string | null => {
  if (!phone) return null;
  return phone.replace(/\D/g, '');
};

const columns: ColumnDef<Employer>[] = [
  {
    accessorKey: "businessName",
    header: "Business Name",
    cell: ({ row }) => (
      <Link
        href={`/dashboard/employers/${row.original.id}`}
        className="text-blue-600 hover:underline"
      >
        {row.getValue("businessName")}
      </Link>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "rawPhone",
    header: "Raw Phone",
    enableHiding: true,
  },
  {
    accessorKey: "contactName",
    header: "Contact Name",
  },
  {
    accessorKey: "state",
    header: "State",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
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
          href={`/dashboard/employers/${row.original.id}`}
          className="text-blue-600 hover:underline"
        >
          Edit
        </Link>
        <button
          onClick={async () => {
            if (confirm("Warning: Deleting this employer will also delete all associated jobs. Are you sure you want to continue?")) {
              const response = await fetch(`/api/employers/${row.original.id}`, {
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

interface EmployersClientProps {
  employers: Employer[];
}

export function EmployersClient({ employers }: EmployersClientProps) {
  const enrichedEmployers = employers.map(employer => ({
    ...employer,
    rawPhone: stripPhoneFormatting(employer.phone)
  }));
  
  // Initial column visibility state - hide rawPhone column
  const initialColumnVisibility = {
    rawPhone: false
  };
  
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-blue-900">Employers</h2>
        <Link
          href="/dashboard/employers/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Add Employer
        </Link>
      </div>
      <DataTable 
        columns={columns} 
        data={enrichedEmployers} 
        searchColumn="businessName"
        searchPlaceholder="Search by business name, phone, or state..."
        searchableColumns={["businessName", "phone", "rawPhone", "state"]}
        initialColumnVisibility={initialColumnVisibility}
      />
    </div>
  );
} 