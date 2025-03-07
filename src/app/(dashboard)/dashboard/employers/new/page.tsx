import { Metadata } from "next";
import { EmployerForm } from "@/components/forms/employer-form";

export const metadata: Metadata = {
  title: "New Employer - Naima Employment Agency",
  description: "Create a new employer",
};

export default function NewEmployerPage() {
  return (
    <div>
      <h2 className="mb-8 text-2xl font-bold">New Employer</h2>
      <EmployerForm mode="create" />
    </div>
  );
} 