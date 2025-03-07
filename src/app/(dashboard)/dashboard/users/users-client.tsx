"use client";

import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: Date;
}

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "isAdmin",
    header: "Role",
    cell: ({ row }) => {
      const isAdmin = row.getValue("isAdmin") as boolean;
      return (
        <span
          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
            isAdmin
              ? "bg-purple-100 text-purple-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {isAdmin ? "Admin" : "User"}
        </span>
      );
    },
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
    cell: ({ row }) => {
      const isAdmin = row.original.email === "admin@naima.com";
      return (
        <div className="flex space-x-2">
          <Link
            href={`/dashboard/users/${row.original.id}`}
            className="text-blue-600 hover:underline"
          >
            Edit
          </Link>
          {!isAdmin && (
            <button
              onClick={async () => {
                if (confirm("Are you sure you want to delete this user?")) {
                  const response = await fetch(`/api/users/${row.original.id}`, {
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
          )}
        </div>
      );
    },
  },
];

interface UsersClientProps {
  users: User[];
}

export function UsersClient({ users }: UsersClientProps) {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-blue-900">Users</h2>
        <Link
          href="/dashboard/users/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Add User
        </Link>
      </div>
      <DataTable columns={columns} data={users} searchColumn="email" />
    </div>
  );
} 