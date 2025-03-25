"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EmployeeCombobox } from "@/components/ui/employee-combobox";

const formSchema = z.object({
  employeeId: z.string().min(1, "Employee is required"),
  refundDate: z.string().min(1, "Refund date is required"),
  refundAgent: z.string().optional(),
  paidBefore: z.string().optional(),
  hoursWorking: z.string().optional(),
  salaryPerHour: z.string().optional(),
  commissionRate: z.string().optional(),
  lastBalance: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface Refund {
  id: string;
  employeeId: string;
  refundDate: Date;
  refundAgent: string | null;
  paidBefore: number | null;
  hoursWorking: number | null;
  salaryPerHour: number | null;
  commissionRate: number | null;
  lastBalance: number | null;
  createdAt: Date;
  updatedAt: Date;
}

interface RefundFormProps {
  refund?: Refund;
  mode: "create" | "edit";
}

export function RefundForm({ refund, mode }: RefundFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const defaultValues = refund
    ? {
        employeeId: refund.employeeId,
        refundDate: refund.refundDate.toISOString().split("T")[0],
        refundAgent: refund.refundAgent || "",
        paidBefore: refund.paidBefore?.toString() || "",
        hoursWorking: refund.hoursWorking?.toString() || "",
        salaryPerHour: refund.salaryPerHour?.toString() || "",
        commissionRate: refund.commissionRate?.toString() || "",
        lastBalance: refund.lastBalance?.toString() || "",
      }
    : {
        employeeId: "",
        refundDate: "",
        refundAgent: "",
        paidBefore: "",
        hoursWorking: "",
        salaryPerHour: "",
        commissionRate: "",
        lastBalance: "",
      };

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);

    try {
      const response = await fetch("/api/refunds" + (mode === "edit" ? `/${refund?.id}` : ""), {
        method: mode === "create" ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          paidBefore: data.paidBefore ? parseFloat(data.paidBefore) : null,
          hoursWorking: data.hoursWorking ? parseFloat(data.hoursWorking) : null,
          salaryPerHour: data.salaryPerHour ? parseFloat(data.salaryPerHour) : null,
          commissionRate: data.commissionRate ? parseFloat(data.commissionRate) : null,
          lastBalance: data.lastBalance ? parseFloat(data.lastBalance) : null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save refund");
      }

      router.push("/dashboard/refunds");
      router.refresh();
    } catch (error) {
      console.error("Error saving refund:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <EmployeeCombobox
            value={form.watch("employeeId")}
            onChange={(value) => form.setValue("employeeId", value)}
            error={form.formState.errors.employeeId?.message}
          />
        </div>

        <div>
          <label htmlFor="refundDate" className="block text-sm font-medium text-gray-900">
            Refund Date *
          </label>
          <input
            type="date"
            id="refundDate"
            {...form.register("refundDate")}
            className="mt-2 block w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
          />
          {form.formState.errors.refundDate && (
            <p className="mt-2 text-sm text-red-600">
              {form.formState.errors.refundDate.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="refundAgent" className="block text-sm font-medium text-gray-900">
            Refund Agent
          </label>
          <input
            type="text"
            id="refundAgent"
            {...form.register("refundAgent")}
            className="mt-2 block w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="paidBefore" className="block text-sm font-medium text-gray-900">
            Paid Before
          </label>
          <input
            type="number"
            step="0.01"
            id="paidBefore"
            {...form.register("paidBefore")}
            className="mt-2 block w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="hoursWorking" className="block text-sm font-medium text-gray-900">
            Hours Working
          </label>
          <input
            type="number"
            step="0.01"
            id="hoursWorking"
            {...form.register("hoursWorking")}
            className="mt-2 block w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="salaryPerHour" className="block text-sm font-medium text-gray-900">
            Salary Per Hour
          </label>
          <input
            type="number"
            step="0.01"
            id="salaryPerHour"
            {...form.register("salaryPerHour")}
            className="mt-2 block w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="commissionRate" className="block text-sm font-medium text-gray-900">
            Commission Rate (%)
          </label>
          <input
            type="number"
            step="0.01"
            id="commissionRate"
            {...form.register("commissionRate")}
            className="mt-2 block w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="lastBalance" className="block text-sm font-medium text-gray-900">
            Last Balance
          </label>
          <input
            type="number"
            step="0.01"
            id="lastBalance"
            {...form.register("lastBalance")}
            className="mt-2 block w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>

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
          {isLoading ? "Saving..." : mode === "create" ? "Create Refund" : "Update Refund"}
        </button>
      </div>
    </form>
  );
} 