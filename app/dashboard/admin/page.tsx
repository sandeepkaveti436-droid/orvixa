"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  Users,
  ShieldCheck,
  Users2,
  FolderKanban,
  CheckCircle2,
  Activity,
  Megaphone,
  BarChart3,
  Sparkles,
  CreditCard,
  FileCode,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  UserPlus,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: "Command Center", href: "/dashboard/admin", icon: Building2 },
    {
      name: "Employee Directory",
      href: "/dashboard/admin/employees",
      icon: Users,
    },
    {
      name: "Roles & Permissions",
      href: "/dashboard/admin/roles",
      icon: ShieldCheck,
    },
    { name: "Teams & Leads", href: "/dashboard/admin/teams", icon: Users2 },
    {
      name: "Org Projects",
      href: "/dashboard/admin/projects",
      icon: FolderKanban,
    },
    {
      name: "Task Allocation",
      href: "/dashboard/admin/tasks",
      icon: CheckCircle2,
    },
    {
      name: "Activity & Attendance",
      href: "/dashboard/admin/activity",
      icon: Activity,
    },
    {
      name: "Announcements & Chat",
      href: "/dashboard/admin/announcements",
      icon: Megaphone,
    },
    {
      name: "AI Reports & Analytics",
      href: "/dashboard/admin/reports",
      icon: BarChart3,
    },
    {
      name: "Billing & Licenses",
      href: "/dashboard/admin/billing",
      icon: CreditCard,
    },
    { name: "Audit Logs", href: "/dashboard/admin/audit-logs", icon: FileCode },
    { name: "Org Settings", href: "/dashboard/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* SIDEBAR (DESKTOP) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 p-5 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="space-y-6">
          <Link href="/" className="flex items-center gap-3 px-2">
            <Image
              src="/orviax.jpg"
              alt="Orvixa"
              width={32}
              height={32}
              className="rounded-xl"
            />
            <div>
              <span className="font-heading text-lg font-bold text-slate-900 block leading-none">
                Orvixa Admin
              </span>
              <span className="text-[10px] font-bold text-[#0047AB]">
                Organization OS
              </span>
            </div>
          </Link>

          <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-[#0047AB] text-white shadow-md shadow-[#0047AB]/25"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#0047AB] text-white flex items-center justify-center font-bold text-xs">
              AM
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 line-clamp-1">
                Alex Mercer
              </div>
              <div className="text-[10px] text-slate-400 font-semibold">
                Super Admin
              </div>
            </div>
          </div>

          <Link
            href="/auth"
            title="Log Out"
            className="p-1.5 text-slate-400 hover:text-slate-700"
          >
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </aside>

      {/* MAIN BODY */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between sticky top-0 z-40 font-sans">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-xl"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
            <div className="relative hidden sm:block w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search organization workspace..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              ● 32 Members Online
            </span>
            <Link
              href="/dashboard/admin/employees"
              className="bg-[#0047AB] hover:bg-[#003680] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Invite Employee</span>
            </Link>
          </div>
        </header>

        <main className="p-6 sm:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
