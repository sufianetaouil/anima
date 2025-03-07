"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  isAdmin: z.boolean().default(false),
});

type FormData = z.infer<typeof formSchema>;

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: Date;
}

interface UserFormProps {
  user?: User;
  mode: "create" | "edit";
}

export function UserForm({ user, mode }: UserFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const defaultValues = user
    ? {
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      }
    : {
        name: "",
        email: "",
        password: "",
        isAdmin: false,
      };

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);

    try {
      const response = await fetch("/api/users" + (mode === "edit" ? `/${user?.id}` : ""), {
        method: mode === "create" ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to save user");
      }

      router.push("/dashboard/users");
      router.refresh();
    } catch (error) {
      console.error("Error saving user:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const isAdminUser = user?.email === "admin@naima.com";

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-900">
            Name *
          </label>
          <input
            type="text"
            id="name"
            {...form.register("name")}
            className="mt-1 w-full rounded-md border p-2"
          />
          {form.formState.errors.name && (
            <p className="mt-1 text-sm text-red-500">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-900">
            Email *
          </label>
          <input
            type="email"
            id="email"
            {...form.register("email")}
            disabled={isAdminUser}
            className="mt-1 w-full rounded-md border p-2 disabled:bg-gray-100"
          />
          {form.formState.errors.email && (
            <p className="mt-1 text-sm text-red-500">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        {mode === "create" && (
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-900">
              Password *
            </label>
            <input
              type="password"
              id="password"
              {...form.register("password")}
              className="mt-1 w-full rounded-md border p-2"
            />
            {form.formState.errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-900">Role</label>
          <div className="mt-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                {...form.register("isAdmin")}
                disabled={isAdminUser}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2">Admin</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md border px-4 py-2 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "Saving..." : mode === "create" ? "Create User" : "Update User"}
        </button>
      </div>
    </form>
  );
} 