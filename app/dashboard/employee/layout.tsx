"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CheckCircle2,
  FolderKanban,
  MessageSquare,
  Calendar,
  Clock,
  User,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  Users,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Real Database State
  const [userName, setUserName] = useState("Employee");
  const [userRole, setUserRole] = useState("Team Member");
  const [userInitials, setUserInitials] = useState("EM");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Correct Navigation Array (Only defined ONCE)
  const navigation = [
    { name: "Dashboard", href: "/dashboard/employee", icon: LayoutDashboard },
    {
      name: "My Assigned Tasks",
      href: "/dashboard/employee/tasks",
      icon: CheckCircle2,
    },
    {
      name: "Department Projects",
      href: "/dashboard/employee/projects",
      icon: FolderKanban,
    },
    {
      name: "Teams Chat",
      href: "/dashboard/employee/chat",
      icon: MessageSquare,
    },
    {
      name: "People & Directory",
      href: "/dashboard/employee/people",
      icon: Users,
    },
    {
      name: "Calendar & Schedule",
      href: "/dashboard/employee/calendar",
      icon: Calendar,
    },
    { name: "Timesheets", href: "/dashboard/employee/timesheets", icon: Clock },
    {
      name: "Profile & Account",
      href: "/dashboard/employee/profile",
      icon: User,
    },
  ];

  useEffect(() => {
    async function loadEmployeeData() {
      // 1. Instant cache load so UI doesn't flicker
      const cachedAvatar = localStorage.getItem("orvixa_emp_avatar");
      const cachedName = localStorage.getItem("orvixa_emp_name");
      const cachedRole = localStorage.getItem("orvixa_emp_role");

      if (cachedAvatar) setAvatarUrl(cachedAvatar);
      if (cachedName) {
        setUserName(cachedName);
        setUserInitials(cachedName.substring(0, 2).toUpperCase());
      }
      if (cachedRole) setUserRole(cachedRole);

      try {
        // 2. Fetch Real User from Supabase
        const { data: authData } = await supabase.auth.getUser();
        const user = authData?.user;

        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, role, profession, avatar_url")
            .eq("id", user.id)
            .single();

          if (profile) {
            const name =
              profile.full_name || user.email?.split("@")[0] || "Employee";
            const role = profile.profession || "Team Member";

            setUserName(name);
            setUserInitials(name.substring(0, 2).toUpperCase());
            setUserRole(role);

            localStorage.setItem("orvixa_emp_name", name);
            localStorage.setItem("orvixa_emp_role", role);

            if (profile.avatar_url) {
              setAvatarUrl(profile.avatar_url);
              localStorage.setItem("orvixa_emp_avatar", profile.avatar_url);
            }
          }
        }

        // 3. Fetch Real Notifications
        const { data: notifs } = await supabase
          .from("notifications")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5);

        if (notifs) setNotifications(notifs);
      } catch (err) {
        console.error("Error loading employee data");
      }
    }
    loadEmployeeData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("orvixa_emp_avatar");
    localStorage.removeItem("orvixa_emp_name");
    localStorage.removeItem("orvixa_emp_role");
    document.cookie =
      "orvixa_demo_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
    window.location.href = "/auth?mode=login";
  };

  const markAllRead = async () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* SIDEBAR (DESKTOP) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 p-5 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="space-y-6 font-sans">
          <Link href="/" className="flex items-center gap-3 px-2 font-sans">
            <Image
              src="/orviax.jpg"
              alt="Orvixa"
              width={32}
              height={32}
              className="rounded-xl object-contain"
            />
            <div>
              <span className="font-sans text-lg font-black text-slate-900 block leading-none">
                Team Member App
              </span>
              <span className="text-[10px] font-bold text-[#0047AB] font-sans">
                Orvixa Engineering
              </span>
            </div>
          </Link>

          <nav className="space-y-1 font-sans">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all font-sans ${
                    isActive
                      ? "bg-[#0047AB] text-white shadow-md shadow-[#0047AB]/25"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3 font-sans">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* BOTTOM LEFT PROFILE BLOCK */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between font-sans">
          <Link
            href="/dashboard/employee/profile"
            className="flex items-center gap-2.5 group font-sans hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-[#0047AB] text-white flex items-center justify-center font-bold text-xs font-sans overflow-hidden shrink-0 shadow-sm border border-slate-200">
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
              <div className="text-xs font-bold text-slate-900 group-hover:text-[#0047AB] font-sans line-clamp-1">
                {userName}
              </div>
              <div className="text-[10px] text-slate-400 font-semibold font-sans line-clamp-1 capitalize">
                {userRole}
              </div>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN APP BODY */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64 font-sans">
        <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between sticky top-0 z-40 font-sans">
          <div className="flex items-center gap-3 font-sans">
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

            <div className="relative hidden sm:block w-72 font-sans">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search tasks, channels, documents..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB] font-sans"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 font-sans relative">
            <span className="hidden sm:inline-flex text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-sans">
              ● Connected to Workspace
            </span>

            {/* NOTIFICATION BELL */}
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 relative transition-colors"
            >
              <Bell className="w-4 h-4" />
              {notifications.some((n) => !n.read) && (
                <span className="w-2 h-2 rounded-full bg-[#0047AB] absolute top-1.5 right-1.5" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 bg-white border border-slate-200 rounded-3xl shadow-xl p-4 z-50 font-sans space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <h4 className="font-bold text-xs text-slate-900">
                    Notifications
                  </h4>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={markAllRead}
                      className="text-[10px] text-[#0047AB] font-bold hover:underline"
                    >
                      Mark Read
                    </button>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-xs font-semibold max-h-60 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-xl border ${n.read ? "bg-slate-50 border-slate-100 opacity-60" : "bg-blue-50/60 border-blue-100"}`}
                      >
                        <div className="font-bold text-slate-900">
                          {n.title}
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5">
                          {n.message || "New activity recorded in workspace."}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-slate-400">
                      No new notifications.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="p-6 sm:p-8 flex-1 font-sans">{children}</main>
      </div>
    </div>
  );
}
