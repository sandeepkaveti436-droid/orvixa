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

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "✅ Login Successful",
      text: "You have securely logged into your workspace.",
      time: "Just now",
    },
  ]);

  // Live Profile State
  const [userName, setUserName] = useState("Freelancer");
  const [userProfession, setUserProfession] = useState("UI/UX Designer");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [userInitials, setUserInitials] = useState("SK");

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [pathname]);

  const loadRealUserProfile = async () => {
    const cachedAvatar = localStorage.getItem("orvixa_avatar_photo");
    const cachedName = localStorage.getItem("orvixa_user_name");
    const cachedProf = localStorage.getItem("orvixa_user_prof");

    if (cachedAvatar) setAvatarUrl(cachedAvatar);
    if (cachedName) {
      setUserName(cachedName);
      setUserInitials(getInitialsFromName(cachedName));
    }
    if (cachedProf && cachedProf !== "Pro Freelancer") {
      setUserProfession(cachedProf);
    }

    try {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;

      if (user) {
        let finalName =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split("@")[0] ||
          "Freelancer";

        let finalProfession =
          user.user_metadata?.profession || "UI/UX Designer";
        let finalAvatar = user.user_metadata?.avatar_url || null;

        try {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, profession, avatar_url")
            .eq("id", user.id)
            .maybeSingle();

          if (profile) {
            if (profile.full_name) finalName = profile.full_name;
            if (profile.profession && profile.profession !== "Pro Freelancer") {
              finalProfession = profile.profession;
            }
            if (profile.avatar_url) finalAvatar = profile.avatar_url;
          }
        } catch (dbErr) {
          console.log("DB check:", dbErr);
        }

        setUserName(finalName);
        setUserProfession(finalProfession);
        if (finalAvatar) setAvatarUrl(finalAvatar);
        setUserInitials(getInitialsFromName(finalName));

        localStorage.setItem("orvixa_user_name", finalName);
        localStorage.setItem("orvixa_user_prof", finalProfession);
        if (finalAvatar)
          localStorage.setItem("orvixa_avatar_photo", finalAvatar);
      }
    } catch (err) {
      console.log("Profile sync:", err);
    }
  };

  useEffect(() => {
    loadRealUserProfile();

    // Listen to custom photo updates
    const handleProfileUpdate = () => {
      loadRealUserProfile();
    };

    window.addEventListener("profilePhotoUpdated", handleProfileUpdate);
    window.addEventListener("storage", handleProfileUpdate);

    return () => {
      window.removeEventListener("profilePhotoUpdated", handleProfileUpdate);
      window.removeEventListener("storage", handleProfileUpdate);
    };
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
      {/* 1. SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 p-5 flex flex-col justify-between transition-all duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-6">
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

        {/* 🌟 BOTTOM-LEFT USER PROFILE (Live Photo Display) */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between font-sans">
          <Link
            href="/dashboard/freelancer/profile"
            className="flex items-center gap-2.5 group font-sans min-w-0"
          >
            <div className="w-9 h-9 rounded-full bg-[#0047AB] text-white flex items-center justify-center font-bold text-xs overflow-hidden shrink-0 font-sans shadow-sm ring-1 ring-slate-200">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={userName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{userInitials}</span>
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

      {/* 2. MAIN BODY */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64 font-sans">
        <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between sticky top-0 z-40 font-sans">
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

            {/* Top Navbar Avatar */}
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
                  <span>{userInitials}</span>
                )}
              </div>
            </Link>
          </div>
        </header>

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
                  className={`capitalize transition-colors ${index === pathSegments.length - 1 ? "font-bold text-[#0047AB]" : "hover:text-[#0047AB]"}`}
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
