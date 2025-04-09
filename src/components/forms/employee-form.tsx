"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Select } from "@/components/ui/select";
import { formatPhoneNumber } from "@/lib/utils";

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string()
    .optional()
    .transform(val => val === "" ? null : val),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  gender: z.string().optional(),
  status: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface Employee {
  id: string;
  memberId: string;
  name: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  gender: string | null;
  status: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface EmployeeFormProps {
  employee?: Employee;
  mode: "create" | "edit";
}

const genderOptions = [
  { label: "Select gender", value: "" },
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];

const statusOptions = [
  { label: "Select status", value: "" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Pending", value: "pending" },
];

export function EmployeeForm({ employee, mode }: EmployeeFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const defaultValues = employee
    ? {
        firstName: employee.name.split(" ")[0] || "",
        lastName: employee.name.split(" ").slice(1).join(" ") || "",
        phone: employee.phone || "",
        address: employee.address || "",
        city: employee.city || "",
        state: employee.state || "",
        zip: employee.zip || "",
        gender: employee.gender || "",
        status: employee.status || "",
      }
    : {
        firstName: "",
        lastName: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        gender: "",
        status: "",
      };

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);

    try {
      const response = await fetch("/api/employees" + (mode === "edit" ? `/${employee?.id}` : ""), {
        method: mode === "create" ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to save employee");
      }

      router.push("/dashboard/employees");
      router.refresh();
    } catch (error) {
      console.error("Error saving employee:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Information */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-medium text-gray-900">Basic Information</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-900">
              First Name *
            </label>
            <input
              type="text"
              id="firstName"
              {...form.register("firstName")}
              className="mt-2 block w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
            />
            {form.formState.errors.firstName && (
              <p className="mt-2 text-sm text-red-600">
                {form.formState.errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-900">
              Last Name *
            </label>
            <input
              type="text"
              id="lastName"
              {...form.register("lastName")}
              className="mt-2 block w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
            />
            {form.formState.errors.lastName && (
              <p className="mt-2 text-sm text-red-600">
                {form.formState.errors.lastName.message}
              </p>
            )}
          </div>

          <div>
            <Select
              label="Gender"
              options={genderOptions}
              {...form.register("gender")}
            />
          </div>

          <div>
            <Select
              label="Status"
              options={statusOptions}
              {...form.register("status")}
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-medium text-gray-900">Contact Information</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-900">
              Phone
            </label>
            <input
              type="text"
              id="phone"
              placeholder="Enter phone number"
              {...form.register("phone")}
              className="mt-2 block w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
            />
            {form.formState.errors.phone && (
              <p className="mt-2 text-sm text-red-600">
                {form.formState.errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-900">
              Street Address
            </label>
            <input
              type="text"
              id="address"
              {...form.register("address")}
              className="mt-2 block w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-900">
              City
            </label>
            <input
              type="text"
              id="city"
              {...form.register("city")}
              className="mt-2 block w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-900">
              State
            </label>
            <input
              type="text"
              id="state"
              {...form.register("state")}
              className="mt-2 block w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="zip" className="block text-sm font-medium text-gray-900">
              ZIP Code
            </label>
            <input
              type="text"
              id="zip"
              {...form.register("zip")}
              className="mt-2 block w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? "Saving..." : mode === "create" ? "Create Employee" : "Update Employee"}
        </button>
      </div>
    </form>
  );
} 
