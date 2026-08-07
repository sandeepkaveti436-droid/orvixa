"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  CheckCircle2,
  Calendar,
  Clock,
  FileText,
  Sparkles,
  FileCode,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  Sun,
  Moon,
  ChevronRight,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function FreelancerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Persistent Real User Profile State
  const [userName, setUserName] = useState("Freelancer");
  const [userProfession, setUserProfession] = useState("Pro Freelancer");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [userInitials, setUserInitials] = useState("FL");

  // Fetch Real Profile & Check Local Storage so Avatar Never Resets on Refresh
  useEffect(() => {
    async function loadRealUserProfile() {
      // 1. Check Local Persistent Storage first
      const cachedAvatar = localStorage.getItem("orvixa_avatar_photo");
      const cachedName = localStorage.getItem("orvixa_user_name");
      const cachedProf = localStorage.getItem("orvixa_user_prof");

      if (cachedAvatar) setAvatarUrl(cachedAvatar);
      if (cachedName) {
        setUserName(cachedName);
        setUserInitials(cachedName.substring(0, 2).toUpperCase());
      }
      if (cachedProf) setUserProfession(cachedProf);

      // 2. Query Supabase Database for Updates
      try {
        const { data: authData } = await supabase.auth.getUser();
        const user = authData?.user;

        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, profession, avatar_url")
            .or(`user_id.eq.${user.id},id.eq.${user.id}`)
            .single();

          if (profile) {
            if (profile.full_name) {
              setUserName(profile.full_name);
              localStorage.setItem("orvixa_user_name", profile.full_name);
              setUserInitials(profile.full_name.substring(0, 2).toUpperCase());
            }
            if (profile.profession) {
              setUserProfession(profile.profession);
              localStorage.setItem("orvixa_user_prof", profile.profession);
            }
            if (profile.avatar_url) {
              setAvatarUrl(profile.avatar_url);
              localStorage.setItem("orvixa_avatar_photo", profile.avatar_url);
            }
          }
        }
      } catch (err) {
        console.log("Loading profile...");
      }
    }

    loadRealUserProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("orvixa_avatar_photo");
    localStorage.removeItem("orvixa_user_name");
    document.cookie =
      "orvixa_demo_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
    window.location.href = "/auth?mode=login";
  };

  const sidebarLinks = [
    { name: "Dashboard", href: "/dashboard/freelancer", icon: LayoutDashboard },
    {
      name: "Projects",
      href: "/dashboard/freelancer/projects",
      icon: Briefcase,
    },
    { name: "Clients", href: "/dashboard/freelancer/clients", icon: Users },
    { name: "Tasks", href: "/dashboard/freelancer/tasks", icon: CheckCircle2 },
    {
      name: "Calendar",
      href: "/dashboard/freelancer/calendar",
      icon: Calendar,
    },
    {
      name: "Time Tracker",
      href: "/dashboard/freelancer/time-tracker",
      icon: Clock,
    },
    {
      name: "Invoices",
      href: "/dashboard/freelancer/invoices",
      icon: FileText,
    },
    {
      name: "AI Proposals",
      href: "/dashboard/freelancer/ai-assistant",
      icon: Sparkles,
      isAi: true,
    },
    {
      name: "Contracts",
      href: "/dashboard/freelancer/documents",
      icon: FileCode,
    },
    { name: "Files", href: "/dashboard/freelancer/documents", icon: FileCode },
    {
      name: "Analytics",
      href: "/dashboard/freelancer/analytics",
      icon: BarChart3,
    },
    { name: "Settings", href: "/dashboard/freelancer/profile", icon: Settings },
  ];

  const pathSegments = pathname.split("/").filter(Boolean);

  return (
    <div
      className={`min-h-screen flex font-sans ${darkMode ? "dark bg-slate-900 text-white" : "bg-slate-50 text-slate-900"}`}
    >
      {/* SIDEBAR NAVIGATION */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="space-y-6">
          <Link href="/" className="flex items-center gap-3 px-2">
            <Image
              src="/orviax.jpg"
              alt="Orvixa"
              width={32}
              height={32}
              className="rounded-xl object-contain"
            />
            <div>
              <span className="font-heading text-lg font-bold text-slate-900 dark:text-white block leading-none">
                Orvixa
              </span>
              <span className="text-[10px] font-bold text-[#0047AB]">
                Freelancer OS
              </span>
            </div>
          </Link>

          <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-200px)] font-sans">
            {sidebarLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all font-sans ${
                    isActive
                      ? "bg-[#0047AB] text-white shadow-md shadow-[#0047AB]/25"
                      : item.isAi
                        ? "bg-blue-50 dark:bg-blue-950/40 text-[#0047AB] dark:text-blue-400 border border-blue-200/80 hover:bg-blue-100"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Real Persistent Profile Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between font-sans">
          <Link
            href="/dashboard/freelancer/profile"
            className="flex items-center gap-2.5 group font-sans"
          >
            <div className="w-8 h-8 rounded-full bg-[#0047AB] text-white flex items-center justify-center font-bold text-xs overflow-hidden shrink-0 font-sans shadow-sm">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={userName}
                  className="w-full h-full object-cover"
                />
              ) : (
                userInitials
              )}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#0047AB] font-sans line-clamp-1">
                {userName}
              </div>
              <div className="text-[10px] text-slate-400 font-semibold font-sans line-clamp-1">
                {userProfession}
              </div>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* MAIN APP BODY */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64 font-sans">
        <header className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-6 py-3.5 flex items-center justify-between sticky top-0 z-40 font-sans">
          <div className="flex items-center gap-3 font-sans">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 rounded-xl"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>

            <div className="relative hidden sm:block w-72 font-sans">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search projects, invoices, clients, tasks..."
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-[#0047AB] font-sans"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 font-sans">
            <button className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 rounded-xl hover:bg-slate-100 relative">
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-[#0047AB] absolute top-1.5 right-1.5" />
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 rounded-xl hover:bg-slate-100"
              title="Toggle Dark/Light Mode"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            <Link
              href="/dashboard/freelancer/profile"
              className="flex items-center gap-2 font-sans"
            >
              <div className="w-8 h-8 rounded-full bg-[#0047AB] text-white flex items-center justify-center font-bold text-xs ring-2 ring-blue-100 overflow-hidden shrink-0 font-sans shadow-sm">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={userName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  userInitials
                )}
              </div>
            </Link>
          </div>
        </header>

        <main className="p-6 sm:p-8 flex-1 font-sans">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-6 font-sans">
            <Link href="/" className="hover:text-slate-600">
              Home
            </Link>
            {pathSegments.map((segment, index) => (
              <React.Fragment key={index}>
                <ChevronRight className="w-3 h-3 text-slate-300" />
                <span
                  className={`capitalize ${index === pathSegments.length - 1 ? "text-slate-900 dark:text-white font-bold" : "hover:text-slate-600"}`}
                >
                  {segment.replace("-", " ")}
                </span>
              </React.Fragment>
            ))}
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}
