"use client";

import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

interface Refund {
  id: string;
  employee: {
    memberId: string;
    name: string;
  };
  refundDate: Date;
  refundAgent: string | null;
  paidBefore: number | null;
  hoursWorking: number | null;
  salaryPerHour: number | null;
  commissionRate: number | null;
  lastBalance: number | null;
  createdAt: Date;
}

const columns: ColumnDef<Refund>[] = [
  {
    accessorKey: "employee.memberId",
    header: "Member ID",
    cell: ({ row }) => (
      <Link
        href={`/dashboard/employees/${row.original.employee.memberId}`}
        className="text-blue-600 hover:underline"
      >
        {row.original.employee.memberId}
      </Link>
    ),
  },
  {
    accessorKey: "employee.name",
    header: "Employee Name",
  },
  {
    accessorKey: "refundDate",
    header: "Refund Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("refundDate"));
      return date.toLocaleDateString();
    },
  },
  {
    accessorKey: "refundAgent",
    header: "Agent",
  },
  {
    accessorKey: "hoursWorking",
    header: "Hours",
    cell: ({ row }) => {
      const hours = row.getValue("hoursWorking") as number;
      return hours?.toFixed(2) || "-";
    },
  },
  {
    accessorKey: "salaryPerHour",
    header: "Rate/Hour",
    cell: ({ row }) => {
      const rate = row.getValue("salaryPerHour") as number;
      return rate ? `$${rate.toFixed(2)}` : "-";
    },
  },
  {
    accessorKey: "commissionRate",
    header: "Commission",
    cell: ({ row }) => {
      const rate = row.getValue("commissionRate") as number;
      return rate ? `${rate.toFixed(2)}%` : "-";
    },
  },
  {
    accessorKey: "paidBefore",
    header: "Paid Before",
    cell: ({ row }) => {
      const amount = row.getValue("paidBefore") as number;
      return amount ? `$${amount.toFixed(2)}` : "-";
    },
  },
  {
    accessorKey: "lastBalance",
    header: "Balance",
    cell: ({ row }) => {
      const balance = row.getValue("lastBalance") as number;
      return balance ? `$${balance.toFixed(2)}` : "-";
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <Link
          href={`/dashboard/refunds/${row.original.id}`}
          className="text-blue-600 hover:underline"
        >
          Edit
        </Link>
        <button
          onClick={async () => {
            if (confirm("Are you sure you want to delete this refund?")) {
              const response = await fetch(`/api/refunds/${row.original.id}`, {
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

interface RefundsClientProps {
  refunds: Refund[];
}

export function RefundsClient({ refunds }: RefundsClientProps) {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-blue-900">Refunds</h2>
        <Link
          href="/dashboard/refunds/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Add Refund
        </Link>
      </div>
      <DataTable columns={columns} data={refunds} searchColumn="employee.memberId" />
    </div>
  );
} 