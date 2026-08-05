"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Building2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FolderKanban,
  FileText,
  Clock,
  Calendar,
  CreditCard,
  Notebook,
  Briefcase,
  Users,
  Activity,
  BarChart3,
  Megaphone,
  TrendingUp,
  ShieldCheck,
  MessageSquare,
  UserCheck,
  Zap,
} from "lucide-react";

export default function Products() {
  const [activeTab, setActiveTab] = useState<"freelancer" | "admin">(
    "freelancer",
  );

  const freelancerFeatures = [
    {
      name: "Project Tracking",
      desc: "Intuitive milestone & kanban boards",
      icon: FolderKanban,
    },
    {
      name: "Invoices",
      desc: "Automated client billing & status",
      icon: FileText,
    },
    {
      name: "Time Tracking",
      desc: "Built-in timer with auto logs",
      icon: Clock,
    },
    {
      name: "Tasks & Calendar",
      desc: "Smart scheduling & deadline sync",
      icon: Calendar,
    },
    {
      name: "Clients & Payments",
      desc: "CRM portal with online checkout",
      icon: CreditCard,
    },
    {
      name: "Notes & Portfolio",
      desc: "Work documentation & showcase",
      icon: Briefcase,
    },
    {
      name: "AI Assistant",
      desc: "Auto-generate task triage & briefs",
      icon: Sparkles,
      isAi: true,
    },
  ];

  const adminFeatures = [
    {
      name: "Employee Management",
      desc: "Complete staff directory & RBAC",
      icon: Users,
    },
    {
      name: "Task Assignment",
      desc: "Cross-department sprint allocation",
      icon: FolderKanban,
    },
    {
      name: "Activity Monitoring",
      desc: "Real-time team execution logs",
      icon: Activity,
    },
    {
      name: "Reports & Performance",
      desc: "Sprint velocity & output analytics",
      icon: BarChart3,
    },
    {
      name: "Announcements & Chat",
      desc: "Company-wide threads & messaging",
      icon: MessageSquare,
    },
    {
      name: "Attendance & Permissions",
      desc: "Security controls & clock-in logs",
      icon: ShieldCheck,
    },
    {
      name: "AI Analytics",
      desc: "Automated workload & output insights",
      icon: Sparkles,
      isAi: true,
    },
  ];

  return (
    <section
      id="products"
      className="relative py-12 sm:py-18 px-4 sm:px-6 lg:px-8 bg-slate-50 overflow-hidden font-sans border-b border-slate-200/80"
    >
      {/* Ambient Lighting Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-[600px] pointer-events-none z-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[750px] h-[400px] bg-gradient-to-tr from-[#0047AB]/10 via-indigo-300/15 to-purple-400/10 blur-[140px] rounded-full" />
      </div>

      <div className="max-w-8xl mx-auto relative z-10">
        {/* ================= 1. HEADER ================= */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-[#0047AB]/20 shadow-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-[#0047AB] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#0047AB] font-sans">
              Orvixa Flagship Suite
            </span>
          </div>

          <h2 className="text-[20px] sm:text-[24px] lg:text-[32px] font-black leading-[1.15] text-slate-900 mb-6 font-sans">
            <span>Two specialized flagships <br/> </span>
            <span className="inline-block font-heading italic pr-2 pb-1 bg-clip-text text-transparent bg-gradient-to-r from-[#0047AB] via-indigo-600 to-purple-600">
              built for scale.
            </span>
          </h2>

          <p className="text-base sm:text-lg font-medium text-slate-600 leading-relaxed text-balance font-sans">
            Select a product below to inspect features and live workspace
            previews.
          </p>
        </div>

        {/* ================= 2. PRODUCT SELECTOR SWITCHER ================= */}
        <div className="flex justify-center mb-12 font-sans">
          <div className="bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-2xl p-2 shadow-md shadow-slate-900/5 inline-flex gap-2">
            <button
              onClick={() => setActiveTab("freelancer")}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-[14px] transition-all duration-300 ${
                activeTab === "freelancer"
                  ? "bg-[#0047AB] text-white shadow-md shadow-[#0047AB]/25"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
              }`}
            >
              <User className="w-6 h-6" />
              <span>Freelancer App</span>
            </button>

            <button
              onClick={() => setActiveTab("admin")}
              className={`flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                activeTab === "admin"
                  ? "bg-[#0047AB] text-white shadow-md shadow-[#0047AB]/25"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
              }`}
            >
              <Building2 className="w-6 h-6" />
              <span>Admin Dashboard</span>
            </button>
          </div>
        </div>

        {/* ================= 3. MAIN PRODUCT SHOWCASE STAGE ================= */}
        <div className="bg-white/90 backdrop-blur-2xl border border-slate-200/90 rounded-3xl p-4 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.06)] relative overflow-hidden font-sans">
          <AnimatePresence mode="wait">
            {/* FREELANCER APP STAGE */}
            {activeTab === "freelancer" ? (
              <motion.div
                key="freelancer-stage"
                initial={{ opacity: 0, y: 15, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -15, filter: "blur(10px)" }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
              >
                {/* Left Side Details */}
                <div className="lg:col-span-6 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0047AB]/10 text-[#0047AB] text-xs font-bold font-sans">
                    <User className="w-3.5 h-3.5" />
                    <span>For Independent Professionals</span>
                  </div>

                  <div>
                    <h3 className="text-[20px] sm:text-[24px] font-black text-slate-900 mb-2 font-sans">
                      Freelancer App
                    </h3>
                    <p className="text-base font-semibold text-[#0047AB] font-sans">
                      Built for independent professionals.
                    </p>
                  </div>

                  <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed font-sans">
                    All-in-one workspace to manage client projects, track hours,
                    issue invoices, collect payments, and automate daily admin
                    tasks.
                  </p>

                  {/* Capabilities List */}
                  <div className="space-y-3 pt-2 font-sans">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Core Capabilities
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {freelancerFeatures.map((feat) => {
                        const IconComp = feat.icon;
                        return (
                          <div
                            key={feat.name}
                            className={`p-3 rounded-xl border flex items-center gap-3 transition-colors ${
                              feat.isAi
                                ? "bg-[#0047AB]/5 border-[#0047AB]/30"
                                : "bg-slate-50/80 border-slate-200/80"
                            }`}
                          >
                            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#0047AB] shrink-0 shadow-sm">
                              <IconComp className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-900">
                                {feat.name}
                              </div>
                              <div className="text-[12px] text-slate-500 font-medium line-clamp-1">
                                {feat.desc}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-4">
                    <a
                      href="/get-started?app=freelancer"
                      className="inline-flex items-center gap-2.5 px-8 py-2.5 rounded-xl bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-sm shadow-lg shadow-[#0047AB]/25 transition-all duration-200 active:scale-95 font-sans"
                    >
                      <span>Explore Freelancer App</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Right Side UI Preview */}
                <div className="lg:col-span-6 bg-slate-50/90 rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4 font-sans">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-400" />
                      <div className="w-3 h-3 rounded-full bg-amber-400" />
                      <div className="w-3 h-3 rounded-full bg-emerald-400" />
                      <span className="ml-2 text-xs font-bold text-slate-400">
                        app.orvixa.com / freelancer
                      </span>
                    </div>
                    <span className="text-[12px] font-bold bg-[#0047AB]/10 text-[#0047AB] px-3 py-1 rounded-full">
                      Solo Cockpit
                    </span>
                  </div>

                  {/* Active Invoice Card */}
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-500">Invoice #1042</span>
                      <span className="text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        Paid • $4,850.00
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-900">
                      Acme Rebrand Sprint #2
                    </div>
                  </div>

                  {/* Active Timer Card */}
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800">
                      <Clock className="w-4 h-4 text-[#0047AB]" />
                      <span>Time Tracked Today: 06h 45m</span>
                    </div>
                    <span className="text-[12px] bg-[#0047AB]/10 text-[#0047AB] px-2.5 py-1 rounded font-bold">
                      Active Logger
                    </span>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200 flex items-center gap-2.5 text-xs font-bold text-[#0047AB]">
                    <Sparkles className="w-4 h-4 text-[#0047AB]" />
                    <span>
                      AI Assistant: Client timesheet and invoice auto-synced
                    </span>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* ADMIN DASHBOARD STAGE */
              <motion.div
                key="admin-stage"
                initial={{ opacity: 0, y: 15, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -15, filter: "blur(10px)" }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
              >
                {/* Left Side Details */}
                <div className="lg:col-span-6 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200 text-xs font-bold font-sans">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>For Teams & Enterprise Organizations</span>
                  </div>

                  <div>
                    <h3 className="text-[20px] sm:text-[24px] font-black text-slate-900 mb-2 font-sans">
                      Admin Dashboard
                    </h3>
                    <p className="text-base font-semibold text-indigo-600 font-sans">
                      Everything organizations need.
                    </p>
                  </div>

                  <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed font-sans">
                    Complete administrative command. Manage staff directories,
                    assign tasks, monitor team activity, oversee attendance, and
                    extract real-time AI performance reports.
                  </p>

                  {/* Capabilities List */}
                  <div className="space-y-3 pt-2 font-sans">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Core Capabilities
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {adminFeatures.map((feat) => {
                        const IconComp = feat.icon;
                        return (
                          <div
                            key={feat.name}
                            className={`p-3 rounded-xl border flex items-center gap-3 transition-colors ${
                              feat.isAi
                                ? "bg-[#0047AB]/5 border-[#0047AB]/30"
                                : "bg-slate-50/80 border-slate-200/80"
                            }`}
                          >
                            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#0047AB] shrink-0 shadow-sm">
                              <IconComp className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-900">
                                {feat.name}
                              </div>
                              <div className="text-[12px] text-slate-500 font-medium line-clamp-1">
                                {feat.desc}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-4">
                    <a
                      href="/get-started?app=admin"
                      className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-sm shadow-lg shadow-[#0047AB]/25 transition-all duration-200 active:scale-95 font-sans"
                    >
                      <span>Explore Admin Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Right Side UI Preview */}
                <div className="lg:col-span-6 bg-slate-50/90 rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4 font-sans">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-400" />
                      <div className="w-3 h-3 rounded-full bg-amber-400" />
                      <div className="w-3 h-3 rounded-full bg-emerald-400" />
                      <span className="ml-2 text-xs font-bold text-slate-400">
                        app.orvixa.com / admin
                      </span>
                    </div>
                    <span className="text-[12px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-200 px-3 py-1 rounded-full">
                      Enterprise Suite
                    </span>
                  </div>

                  {/* Team Active Velocity Widget */}
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-500">
                        Organization Status
                      </span>
                      <span className="text-[#0047AB] bg-[#0047AB]/10 px-2.5 py-0.5 rounded-full">
                        32 Active Members
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-900">
                      Sprint Execution Velocity: 94.8%
                    </div>
                  </div>

                  {/* Live Activity Monitoring Feed */}
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800">
                      <Activity className="w-4 h-4 text-emerald-600" />
                      <span>Live Activity Monitoring</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-600">
                      ✓ Attendance Synced
                    </span>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200 flex items-center gap-2.5 text-xs font-bold text-[#0047AB]">
                    <Sparkles className="w-4 h-4 text-[#0047AB]" />
                    <span>
                      AI Analytics: Team efficiency report auto-generated (+38%
                      output)
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
