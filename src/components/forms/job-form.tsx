"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Select } from "@/components/ui/select";
import { EmployerCombobox } from "@/components/ui/employer-combobox";

const formSchema = z.object({
  employerId: z.string().min(1, "Employer is required"),
  daysNumber: z.string().optional(),
  daysPerWeek: z.string().optional(),
  hoursNumber: z.string().optional(),
  pricePerHour: z.string().optional(),
  tips: z.boolean().optional(),
  paymentMethod: z.string().optional(),
  jobType: z.string().optional(),
  language: z.string().optional(),
  jobStatus: z.string().optional(),
  jobTime: z.string().optional(),
  status: z.string().optional(),
  jobDate: z.string().optional(),
  description: z.string().optional(),
  requirements: z.string().optional(),
  benefits: z.string().optional(),
  location: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface Job {
  id: string;
  employerId: string;
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
  updatedAt: Date;
}

interface JobFormProps {
  job?: Job;
  mode: "create" | "edit";
}

const jobTypeOptions = [
  { label: "Select job type", value: "" },
  { label: "Full Time", value: "full" },
  { label: "Part Time", value: "part" },
];

const jobTimeOptions = [
  { label: "Select job time", value: "" },
  { label: "Day", value: "day" },
  { label: "Night", value: "night" },
];

const jobStatusOptions = [
  { label: "Select job status", value: "" },
  { label: "Permanent", value: "permanent" },
  { label: "Temporary", value: "temporary" },
];

const statusOptions = [
  { label: "Select status", value: "" },
  { label: "Available", value: "available" },
  { label: "Closed", value: "closed" },
];

const languageOptions = [
  { label: "Select language", value: "" },
  { label: "English", value: "english" },
  { label: "Spanish", value: "spanish" },
  { label: "Both", value: "both" },
];

const paymentMethodOptions = [
  { label: "Select payment method", value: "" },
  { label: "Cash", value: "cash" },
  { label: "Check", value: "check" },
];

export function JobForm({ job, mode }: JobFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const defaultValues = job
    ? {
        employerId: job.employerId,
        daysNumber: job.daysNumber?.toString() || "",
        daysPerWeek: job.daysPerWeek?.toString() || "",
        hoursNumber: job.hoursNumber?.toString() || "",
        pricePerHour: job.pricePerHour?.toString() || "",
        tips: job.tips || false,
        paymentMethod: job.paymentMethod || "",
        jobType: job.jobType || "",
        language: job.language || "",
        jobStatus: job.jobStatus || "",
        jobTime: job.jobTime || "",
        status: job.status || "",
        jobDate: job.jobDate ? job.jobDate.toISOString().split("T")[0] : "",
        description: job.description || "",
        requirements: job.requirements || "",
        benefits: job.benefits || "",
        location: job.location || "",
      }
    : {
        employerId: "",
        daysNumber: "",
        daysPerWeek: "",
        hoursNumber: "",
        pricePerHour: "",
        tips: false,
        paymentMethod: "",
        jobType: "",
        language: "",
        jobStatus: "",
        jobTime: "",
        status: "",
        jobDate: "",
        description: "",
        requirements: "",
        benefits: "",
        location: "",
      };

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);

    try {
      const response = await fetch("/api/jobs" + (mode === "edit" ? `/${job?.id}` : ""), {
        method: mode === "create" ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          daysNumber: data.daysNumber ? parseInt(data.daysNumber) : null,
          daysPerWeek: data.daysPerWeek ? parseInt(data.daysPerWeek) : null,
          hoursNumber: data.hoursNumber ? parseInt(data.hoursNumber) : null,
          pricePerHour: data.pricePerHour ? parseFloat(data.pricePerHour) : null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save job");
      }

      router.push("/dashboard/jobs");
      router.refresh();
    } catch (error) {
      console.error("Error saving job:", error);
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
            <label className="block text-sm font-medium text-gray-900">
              Employer *
            </label>
            <div className="mt-2">
              <EmployerCombobox
                value={form.watch("employerId")}
                onChange={(value) => form.setValue("employerId", value)}
                error={form.formState.errors.employerId?.message}
              />
            </div>
          </div>

          <div>
            <label htmlFor="jobDate" className="block text-sm font-medium text-gray-900">
              Start Date
            </label>
            <input
              type="date"
              id="jobDate"
              {...form.register("jobDate")}
              className="mt-2 block w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <Select
              label="Job Type"
              options={jobTypeOptions}
              {...form.register("jobType")}
            />
          </div>

          <div>
            <Select
              label="Job Status"
              options={jobStatusOptions}
              {...form.register("jobStatus")}
            />
          </div>

          <div>
            <Select
              label="Job Time"
              options={jobTimeOptions}
              {...form.register("jobTime")}
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

      {/* Schedule and Payment */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-medium text-gray-900">Schedule and Payment</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="daysNumber" className="block text-sm font-medium text-gray-900">
              Days
            </label>
            <input
              type="number"
              id="daysNumber"
              {...form.register("daysNumber")}
              className="mt-2 block w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="daysPerWeek" className="block text-sm font-medium text-gray-900">
              Days per Week
            </label>
            <input
              type="number"
              id="daysPerWeek"
              {...form.register("daysPerWeek")}
              className="mt-2 block w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="hoursNumber" className="block text-sm font-medium text-gray-900">
              Hours per Day
            </label>
            <input
              type="number"
              id="hoursNumber"
              {...form.register("hoursNumber")}
              className="mt-2 block w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="pricePerHour" className="block text-sm font-medium text-gray-900">
              Rate per Hour ($)
            </label>
            <input
              type="number"
              step="0.01"
              id="pricePerHour"
              {...form.register("pricePerHour")}
              className="mt-2 block w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <Select
              label="Payment Method"
              options={paymentMethodOptions}
              {...form.register("paymentMethod")}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="tips"
              {...form.register("tips")}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="tips" className="text-sm font-medium text-gray-900">
              Tips Available
            </label>
          </div>
        </div>
      </div>

      {/* Additional Details */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-medium text-gray-900">Additional Details</h3>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <Select
              label="Language Requirements"
              options={languageOptions}
              {...form.register("language")}
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-900">
              Location
            </label>
            <input
              type="text"
              id="location"
              {...form.register("location")}
              className="mt-2 block w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-900">
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              {...form.register("description")}
              className="mt-2 block w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="requirements" className="block text-sm font-medium text-gray-900">
              Requirements
            </label>
            <textarea
              id="requirements"
              rows={3}
              {...form.register("requirements")}
              className="mt-2 block w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="benefits" className="block text-sm font-medium text-gray-900">
              Benefits
            </label>
            <textarea
              id="benefits"
              rows={3}
              {...form.register("benefits")}
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
          {isLoading ? "Saving..." : mode === "create" ? "Create Job" : "Update Job"}
        </button>
      </div>
    </form>
  );
} 
