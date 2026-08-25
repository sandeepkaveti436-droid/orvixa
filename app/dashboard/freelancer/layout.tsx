"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  ChevronRight,
  Check,
  CheckCheck,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function FreelancerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // --- 🔒 BROWSER BACK BUTTON LOCK (Prevents exiting workspace to landing website) ---
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [pathname]);

  // Notifications State
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "✅ Login Successful",
      text: "You have securely logged into your Orvixa workspace.",
      time: "Just now",
    },
    {
      id: 2,
      title: "💰 Currency Synced",
      text: "Workspace financial metrics are synced in ₹ INR.",
      time: "5m ago",
    },
  ]);

  // Persistent Real User Profile State
  const [userName, setUserName] = useState("Freelancer");
  const [userProfession, setUserProfession] = useState("Pro Freelancer");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [userInitials, setUserInitials] = useState("SK");

  useEffect(() => {
    async function loadRealUserProfile() {
      const cachedAvatar = localStorage.getItem("orvixa_avatar_photo");
      const cachedName = localStorage.getItem("orvixa_user_name");
      const cachedProf = localStorage.getItem("orvixa_user_prof");

      if (cachedAvatar) setAvatarUrl(cachedAvatar);
      if (cachedName) {
        setUserName(cachedName);
        setUserInitials(getInitialsFromName(cachedName));
      }
      if (cachedProf) setUserProfession(cachedProf);

      try {
        const { data: authData } = await supabase.auth.getUser();
        const user = authData?.user;

        if (user) {
          const metaName =
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email?.split("@")[0] ||
            "";

          if (metaName) {
            setUserName(metaName);
            localStorage.setItem("orvixa_user_name", metaName);
            setUserInitials(getInitialsFromName(metaName));
          }

          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, profession, avatar_url")
            .or(`user_id.eq.${user.id},id.eq.${user.id}`)
            .maybeSingle();

          if (profile) {
            const finalName =
              profile.full_name || metaName || user.email?.split("@")[0];
            if (finalName) {
              setUserName(finalName);
              localStorage.setItem("orvixa_user_name", finalName);
              setUserInitials(getInitialsFromName(finalName));
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
        console.log("Syncing profile...", err);
      }
    }

    loadRealUserProfile();
  }, []);

  const getInitialsFromName = (name: string) => {
    if (!name) return "SK";
    const parts = name.trim().split(/[\s._-]+/);
    return parts.length > 1
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : name.trim().slice(0, 2).toUpperCase();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("orvixa_avatar_photo");
    localStorage.removeItem("orvixa_user_name");
    localStorage.removeItem("orvixa_user_prof");
    document.cookie =
      "orvixa_demo_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
    window.location.replace("/login");
  };

  // Dismiss single notification
  const handleDismissNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Clear all notifications
  const handleClearAllNotifications = () => {
    setNotifications([]);
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
    <div className="min-h-screen flex font-sans bg-slate-50 text-slate-900 transition-colors duration-300">
      {/* ================= 1. SIDEBAR NAVIGATION ================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 p-5 flex flex-col justify-between transition-all duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-6">
          {/* Logo & Workspace Name */}
          <Link
            href="/dashboard/freelancer"
            className="flex items-center gap-3 px-2 hover:opacity-90 transition"
          >
            <Image
              src="/orviax.jpg"
              alt="Orvixa"
              width={32}
              height={32}
              className="rounded-xl object-contain"
              priority
            />
            <div>
              <span className="font-heading text-lg font-bold text-slate-900 block leading-none">
                Orvixa
              </span>
              <span className="text-[10px] font-bold text-[#0047AB] tracking-wider uppercase">
                Freelancer
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-200px)] font-sans">
            {sidebarLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all font-sans ${
                    isActive
                      ? "bg-[#0047AB] text-white shadow-md shadow-[#0047AB]/25"
                      : item.isAi
                        ? "bg-blue-50 text-[#0047AB] border border-blue-200/80 hover:bg-blue-100"
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

        {/* Real User Profile Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between font-sans">
          <Link
            href="/dashboard/freelancer/profile"
            className="flex items-center gap-2.5 group font-sans min-w-0"
          >
            <div className="w-8 h-8 rounded-full bg-[#0047AB] text-white flex items-center justify-center font-bold text-xs overflow-hidden shrink-0 font-sans shadow-sm ring-1 ring-white/20">
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
            <div className="min-w-0">
              <div className="text-xs font-bold font-sans truncate group-hover:text-[#0047AB] text-slate-900">
                {userName}
              </div>
              <div className="text-[10px] text-slate-400 font-semibold font-sans truncate">
                {userProfession}
              </div>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* ================= 2. MAIN APP BODY WITH TOP BAR ================= */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64 font-sans">
        {/* TOP BAR */}
        <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between sticky top-0 z-40 font-sans transition-colors duration-300">
          <div className="flex items-center gap-3 font-sans">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>

            {/* Global Search */}
            <div className="relative hidden sm:block w-72 font-sans">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search projects, invoices, clients, tasks..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-9 pr-4 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB] font-sans"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 font-sans relative">
            {/* NOTIFICATION BELL */}
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-full relative transition-colors text-slate-500 hover:bg-slate-100"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {notifications.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-[#0047AB] absolute top-1.5 right-1.5 animate-pulse" />
              )}
            </button>

            {/* NOTIFICATIONS POPUP */}
            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white border border-slate-200 rounded-3xl shadow-2xl p-4 z-50 font-sans space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <span>Notifications</span>
                    {notifications.length > 0 && (
                      <span className="text-[10px] bg-blue-50 text-[#0047AB] px-2 py-0.5 rounded-full font-bold">
                        {notifications.length}
                      </span>
                    )}
                  </h4>
                  <div className="flex items-center gap-2">
                    {notifications.length > 0 && (
                      <button
                        onClick={handleClearAllNotifications}
                        className="text-[10px] text-[#0047AB] font-bold hover:underline flex items-center gap-1"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span>Clear All</span>
                      </button>
                    )}
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-xs font-semibold max-h-64 overflow-y-auto pr-1">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className="p-3 rounded-2xl border bg-slate-50 hover:bg-blue-50/40 border-slate-100 flex items-start justify-between gap-2 transition group"
                      >
                        <div
                          onClick={() => handleDismissNotification(n.id)}
                          className="flex-1 cursor-pointer"
                        >
                          <div className="font-bold text-xs text-slate-900 group-hover:text-[#0047AB]">
                            {n.title}
                          </div>
                          <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                            {n.text}
                          </p>
                          <span className="text-[10px] text-slate-400 block mt-1">
                            {n.time}
                          </span>
                        </div>

                        <button
                          onClick={() => handleDismissNotification(n.id)}
                          title="Mark as read"
                          className="text-slate-400 hover:text-emerald-600 hover:bg-white p-1 rounded-lg transition shrink-0"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-xs text-slate-400 font-medium">
                      ✓ You are all caught up! No notifications.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Profile Avatar Header */}
            <Link
              href="/dashboard/freelancer/profile"
              className="flex items-center gap-2 font-sans"
              title={`Profile: ${userName}`}
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

        {/* BREADCRUMBS & MAIN PAGE CONTENT */}
        <main className="p-6 sm:p-8 flex-1 font-sans">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-6 font-sans">
            <Link
              href="/dashboard/freelancer"
              className="hover:text-[#0047AB] transition-colors"
            >
              Home
            </Link>
            {pathSegments.map((segment, index) => (
              <React.Fragment key={index}>
                <ChevronRight className="w-3 h-3 text-slate-300" />
                <span
                  className={`capitalize transition-colors ${
                    index === pathSegments.length - 1
                      ? "font-bold text-[#0047AB]"
                      : "hover:text-[#0047AB]"
                  }`}
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
