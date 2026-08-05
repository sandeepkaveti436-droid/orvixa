"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FolderKanban,
  CheckCircle2,
  FileText,
  Users,
  Clock,
  FileCode,
  Sparkles,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  CreditCard,
  Briefcase,
} from "lucide-react";

export default function FreelancerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: "Overview", href: "/dashboard/freelancer", icon: FolderKanban },
    {
      name: "Projects",
      href: "/dashboard/freelancer/projects",
      icon: Briefcase,
    },
    { name: "Tasks", href: "/dashboard/freelancer/tasks", icon: CheckCircle2 },
    {
      name: "Invoices & Payments",
      href: "/dashboard/freelancer/invoices",
      icon: FileText,
    },
    { name: "Clients", href: "/dashboard/freelancer/clients", icon: Users },
    {
      name: "Time Tracker",
      href: "/dashboard/freelancer/time-tracker",
      icon: Clock,
    },
    {
      name: "Documents",
      href: "/dashboard/freelancer/documents",
      icon: FileCode,
    },
    {
      name: "AI Assistant",
      href: "/dashboard/freelancer/ai-assistant",
      icon: Sparkles,
      isAi: true,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* LEFT SIDEBAR (DESKTOP) */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 p-5 shrink-0 justify-between font-sans sticky top-0 h-screen">
        <div className="space-y-6">
          {/* Logo */}
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
                Orvixa
              </span>
              <span className="text-[10px] font-bold text-[#0047AB]">
                Freelancer OS
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-[#0047AB] text-white shadow-md shadow-[#0047AB]/25"
                      : item.isAi
                        ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-[#0047AB] border border-blue-200/80 hover:bg-blue-100/50"
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

        {/* User Profile Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#0047AB] text-white flex items-center justify-center font-bold text-xs">
              SJ
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 line-clamp-1">
                Sarah Jenkins
              </div>
              <div className="text-[10px] text-slate-400 font-semibold">
                Pro Freelancer
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

      {/* RIGHT MAIN APP BODY */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP APP BAR */}
        <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 font-sans">
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

            {/* Global Search Bar */}
            <div className="relative hidden sm:block w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search projects, invoices, clients..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
              />
            </div>
          </div>

          {/* Top Right Controls */}
          <div className="flex items-center gap-3">
            <button className="p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 relative">
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-[#0047AB] absolute top-1.5 right-1.5" />
            </button>

            <Link
              href="/dashboard/freelancer/invoices/new"
              className="bg-[#0047AB] hover:bg-[#003680] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm flex items-center gap-1.5"
            >
              <span>+ Create Invoice</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 sm:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
