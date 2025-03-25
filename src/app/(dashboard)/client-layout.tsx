'use client';

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
import { Session } from "next-auth";

export function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  }) as { data: Session | null; status: "loading" | "authenticated" | "unauthenticated" };

  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const getNavItemStyles = (item: { name: string; current: boolean }) => {
    switch (item.name) {
      case "Employers":
        return {
          active: "bg-emerald-50 text-emerald-700",
          hover: "hover:bg-emerald-50 hover:text-emerald-700",
          default: "text-emerald-600",
          icon: item.current ? "text-emerald-600" : "text-emerald-500 group-hover:text-emerald-600"
        };
      case "Employees":
        return {
          active: "bg-indigo-50 text-indigo-700",
          hover: "hover:bg-indigo-50 hover:text-indigo-700",
          default: "text-indigo-600",
          icon: item.current ? "text-indigo-600" : "text-indigo-500 group-hover:text-indigo-600"
        };
      case "Jobs":
        return {
          active: "bg-purple-50 text-purple-700",
          hover: "hover:bg-purple-50 hover:text-purple-700",
          default: "text-purple-600",
          icon: item.current ? "text-purple-600" : "text-purple-500 group-hover:text-purple-600"
        };
      case "Refunds":
        return {
          active: "bg-rose-50 text-rose-700",
          hover: "hover:bg-rose-50 hover:text-rose-700",
          default: "text-rose-600",
          icon: item.current ? "text-rose-600" : "text-rose-500 group-hover:text-rose-600"
        };
      case "Users":
        return {
          active: "bg-amber-50 text-amber-700",
          hover: "hover:bg-amber-50 hover:text-amber-700",
          default: "text-amber-600",
          icon: item.current ? "text-amber-600" : "text-amber-500 group-hover:text-amber-600"
        };
      default:
        return {
          active: "bg-gray-100 text-gray-900",
          hover: "hover:bg-gray-50 hover:text-gray-900",
          default: "text-gray-600",
          icon: item.current ? "text-gray-600" : "text-gray-400 group-hover:text-gray-600"
        };
    }
  };

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
      <div className="fixed right-6 top-6 z-50 lg:hidden">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="rounded-lg bg-white p-3 shadow-lg"
        >
          {isSidebarOpen ? (
            <X className="h-8 w-8 text-gray-600" />
          ) : (
            <Menu className="h-8 w-8 text-gray-600" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-80 transform bg-white shadow-lg transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="border-b px-8 py-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Naima Employment
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 px-4 py-6">
            {navigation.map((item) => {
              const styles = getNavItemStyles(item);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center rounded-lg px-4 py-3 text-base font-medium ${
                    item.current ? styles.active : `${styles.default} ${styles.hover}`
                  }`}
                >
                  <item.icon
                    className={`mr-4 h-6 w-6 flex-shrink-0 ${styles.icon}`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="border-t p-6">
            <div className="flex items-center">
              <div className="flex-1 truncate">
                <div className="text-base font-medium text-gray-900">
                  {session?.user?.name}
                </div>
                <div className="truncate text-base text-gray-500">
                  {session?.user?.email}
                </div>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="mt-6 flex w-full items-center justify-center rounded-lg bg-gray-100 px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-200"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className={`lg:pl-80`}>
        <main className="min-h-screen p-10">
          {children}
        </main>
      </div>
    </div>
  );
} 