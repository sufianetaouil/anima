import { Metadata } from "next";
import { EmployeeForm } from "@/components/forms/employee-form";

export const metadata: Metadata = {
  title: "New Employee - Naima Employment Agency",
  description: "Create a new employee",
};

export default function NewEmployeePage() {
  return (
    <div>
      <h2 className="mb-8 text-2xl font-bold">New Employee</h2>
      <EmployeeForm mode="create" />
    </div>
  );
} 