import { ClientLayout } from "./client-layout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Naima Employment Agency",
  description: "Overview of your employment agency",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientLayout>{children}</ClientLayout>;
} 