import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { EmployersClient } from "./employers-client";

export const metadata: Metadata = {
  title: "Employers - Naima Employment Agency",
  description: "Manage employers",
};

export default async function EmployersPage() {
  const employers = await prisma.employer.findMany({
    select: {
      id: true,
      businessName: true,
      phone: true,
      contactName: true,
      state: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <EmployersClient employers={employers} />;
} 