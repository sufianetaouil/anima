"use client";

import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  Building2,
  UserCircle,
  Briefcase,
  RefreshCw,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });

  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const navigation = [
    {
      name: "Employers",
      href: "/dashboard/employers",
      icon: Building2,
      current: pathname.startsWith("/dashboard/employers"),
    },
    {
      name: "Employees",
      href: "/dashboard/employees",
      icon: UserCircle,
      current: pathname.startsWith("/dashboard/employees"),
    },
    {
      name: "Jobs",
      href: "/dashboard/jobs",
      icon: Briefcase,
      current: pathname.startsWith("/dashboard/jobs"),
    },
    {
      name: "Refunds",
      href: "/dashboard/refunds",
      icon: RefreshCw,
      current: pathname.startsWith("/dashboard/refunds"),
    },
    ...(session?.user?.isAdmin
      ? [
          {
            name: "Users",
            href: "/dashboard/users",
            icon: Users,
            current: pathname.startsWith("/dashboard/users"),
          },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Mobile sidebar toggle */}
      <div className="fixed right-4 top-4 z-50 lg:hidden">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="rounded-lg bg-white p-2 shadow-lg"
        >
          {isSidebarOpen ? (
            <X className="h-6 w-6 text-gray-600" />
          ) : (
            <Menu className="h-6 w-6 text-gray-600" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white shadow-lg transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="border-b px-6 py-4">
            <h1 className="text-xl font-bold text-gray-900">
              Naima Employment
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center rounded-lg px-3 py-2 text-sm font-medium ${
                  item.current
                    ? "bg-gray-100 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 flex-shrink-0 ${
                    item.current ? "text-blue-600" : "text-gray-400 group-hover:text-blue-600"
                  }`}
                />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User section */}
          <div className="border-t p-4">
            <div className="flex items-center">
              <div className="flex-1 truncate">
                <div className="text-sm font-medium text-gray-900">
                  {session.user.name}
                </div>
                <div className="truncate text-sm text-gray-500">
                  {session.user.email}
                </div>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="mt-4 flex w-full items-center justify-center rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className={`lg:pl-64`}>
        <main className="min-h-screen p-8">
          {children}
        </main>
      </div>
    </div>
  );
} 
