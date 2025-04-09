"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Select } from "@/components/ui/select";
import { formatPhoneNumber } from "@/lib/utils";

const formSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  phone: z.string()
    .optional()
    .transform(val => val === "" ? null : val),
  faxNumber: z.string()
    .optional()
    .transform(val => val === "" ? null : val),
  cellPhone: z.string()
    .optional()
    .transform(val => val === "" ? null : val),
  contactName: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  position: z.string().optional(),
  gender: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface Employer {
  id: string;
  businessName: string;
  phone: string | null;
  faxNumber: string | null;
  cellPhone: string | null;
  contactName: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  position: string | null;
  gender: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface EmployerFormProps {
  employer?: Employer;
  mode: "create" | "edit";
}

const genderOptions = [
  { label: "Select gender", value: "" },
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];

export function EmployerForm({ employer, mode }: EmployerFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const defaultValues = employer
    ? {
        businessName: employer.businessName,
        phone: employer.phone || "",
        faxNumber: employer.faxNumber || "",
        cellPhone: employer.cellPhone || "",
        contactName: employer.contactName || "",
        address: employer.address || "",
        city: employer.city || "",
        state: employer.state || "",
        zip: employer.zip || "",
        position: employer.position || "",
        gender: employer.gender || "",
      }
    : {
        businessName: "",
        phone: "",
        faxNumber: "",
        cellPhone: "",
        contactName: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        position: "",
        gender: "",
      };

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);

    try {
      const response = await fetch("/api/employers" + (mode === "edit" ? `/${employer?.id}` : ""), {
        method: mode === "create" ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to save employer");
      }

      router.push("/dashboard/employers");
      router.refresh();
    } catch (error) {
      console.error("Error saving employer:", error);
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
            <label htmlFor="businessName" className="block text-sm font-medium text-gray-900">
              Business Name *
            </label>
            <input
              type="text"
              id="businessName"
              {...form.register("businessName")}
              className="mt-2 block w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
            />
            {form.formState.errors.businessName && (
              <p className="mt-2 text-sm text-red-600">
                {form.formState.errors.businessName.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="contactName" className="block text-sm font-medium text-gray-900">
              Contact Name
            </label>
            <input
              type="text"
              id="contactName"
              {...form.register("contactName")}
              className="mt-2 block w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-900">
              Position
            </label>
            <input
              type="text"
              id="position"
              {...form.register("position")}
              className="mt-2 block w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <Select
              label="Gender"
              options={genderOptions}
              {...form.register("gender")}
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
            <label htmlFor="cellPhone" className="block text-sm font-medium text-gray-900">
              Cell Phone
            </label>
            <input
              type="text"
              id="cellPhone"
              placeholder="Enter cell phone number"
              {...form.register("cellPhone")}
              className="mt-2 block w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
            />
            {form.formState.errors.cellPhone && (
              <p className="mt-2 text-sm text-red-600">
                {form.formState.errors.cellPhone.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="faxNumber" className="block text-sm font-medium text-gray-900">
              Fax Number
            </label>
            <input
              type="text"
              id="faxNumber"
              placeholder="Enter fax number"
              {...form.register("faxNumber")}
              className="mt-2 block w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
            />
            {form.formState.errors.faxNumber && (
              <p className="mt-2 text-sm text-red-600">
                {form.formState.errors.faxNumber.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-medium text-gray-900">Address</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
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
          {isLoading ? "Saving..." : mode === "create" ? "Create Employer" : "Update Employer"}
        </button>
      </div>
    </form>
  );
} 
