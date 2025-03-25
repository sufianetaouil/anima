import { Metadata } from "next";
import { RefundForm } from "@/components/forms/refund-form";

export const metadata: Metadata = {
  title: "New Refund - Naima Employment Agency",
  description: "Create a new refund",
};

export default async function NewRefundPage() {
  return (
    <div>
      <h2 className="mb-8 text-2xl font-bold">New Refund</h2>
      <RefundForm mode="create" />
    </div>
  );
} 